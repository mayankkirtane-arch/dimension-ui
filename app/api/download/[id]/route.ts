import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TEMPLATES, getTemplateVersion } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Standard CRC32 calculation for ZIP local file and central directory headers.
 */
function crc32(buf: Buffer): number {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
    }
  }
  return ~crc >>> 0;
}

/**
 * Pure Node.js ZIP archive generator adhering to PKZIP standard without external dependencies.
 */
function createZip(files: { name: string; data: string | Buffer }[]): Buffer {
  const fileEntries: { nameBuf: Buffer; size: number; crc: number; offset: number }[] = [];
  let offset = 0;
  const parts: Buffer[] = [];

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, "utf8");
    const dataBuf = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data, "utf8");
    const crc = crc32(dataBuf);
    const size = dataBuf.length;

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4); // Version needed to extract
    localHeader.writeUInt16LE(0, 6); // General purpose bit flag
    localHeader.writeUInt16LE(0, 8); // Compression method (0 = stored / uncompressed)
    localHeader.writeUInt16LE(0, 10); // Last mod file time
    localHeader.writeUInt16LE(0, 12); // Last mod file date
    localHeader.writeUInt32LE(crc, 14); // CRC-32
    localHeader.writeUInt32LE(size, 18); // Compressed size
    localHeader.writeUInt32LE(size, 22); // Uncompressed size
    localHeader.writeUInt16LE(nameBuf.length, 26); // File name length
    localHeader.writeUInt16LE(0, 28); // Extra field length

    fileEntries.push({ nameBuf, size, crc, offset });
    parts.push(localHeader, nameBuf, dataBuf);
    offset += localHeader.length + nameBuf.length + dataBuf.length;
  }

  const cdStart = offset;
  for (const entry of fileEntries) {
    const cdHeader = Buffer.alloc(46);
    cdHeader.writeUInt32LE(0x02014b50, 0); // Central directory header signature
    cdHeader.writeUInt16LE(20, 4); // Version made by
    cdHeader.writeUInt16LE(20, 6); // Version needed to extract
    cdHeader.writeUInt16LE(0, 8); // General purpose bit flag
    cdHeader.writeUInt16LE(0, 10); // Compression method (0 = stored)
    cdHeader.writeUInt16LE(0, 12); // Last mod file time
    cdHeader.writeUInt16LE(0, 14); // Last mod file date
    cdHeader.writeUInt32LE(entry.crc, 16); // CRC-32
    cdHeader.writeUInt32LE(entry.size, 20); // Compressed size
    cdHeader.writeUInt32LE(entry.size, 24); // Uncompressed size
    cdHeader.writeUInt16LE(entry.nameBuf.length, 28); // File name length
    cdHeader.writeUInt16LE(0, 30); // Extra field length
    cdHeader.writeUInt16LE(0, 32); // File comment length
    cdHeader.writeUInt16LE(0, 34); // Disk number start
    cdHeader.writeUInt16LE(0, 36); // Internal file attributes
    cdHeader.writeUInt32LE(0, 38); // External file attributes
    cdHeader.writeUInt32LE(entry.offset, 42); // Relative offset of local header

    parts.push(cdHeader, entry.nameBuf);
    offset += cdHeader.length + entry.nameBuf.length;
  }

  const cdEnd = offset;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // End of central directory signature
  eocd.writeUInt16LE(0, 4); // Number of this disk
  eocd.writeUInt16LE(0, 6); // Number of the disk with start of central directory
  eocd.writeUInt16LE(fileEntries.length, 8); // Total entries in central directory on this disk
  eocd.writeUInt16LE(fileEntries.length, 10); // Total entries in central directory
  eocd.writeUInt32LE(cdEnd - cdStart, 12); // Size of the central directory
  eocd.writeUInt32LE(cdStart, 16); // Offset of start of central directory
  eocd.writeUInt16LE(0, 20); // ZIP file comment length
  parts.push(eocd);

  return Buffer.concat(parts);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Authenticate user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to download templates." },
      { status: 401 }
    );
  }

  // 2. Validate template
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) {
    return NextResponse.json(
      { error: `Template '${id}' not found.` },
      { status: 404 }
    );
  }

  // 3. Verify purchase authorization for non-free templates
  const isFree = template.tier === "free";
  if (!isFree) {
    let purchases: { template_id: string }[] = [];
    try {
      const { data } = await supabase
        .from("purchases")
        .select("template_id")
        .eq("user_id", user.id);
      purchases = data ?? [];
    } catch {
      purchases = [];
    }

    const hasPurchased = purchases.some((p) => p.template_id === template.id);
    if (!hasPurchased) {
      return NextResponse.json(
        {
          error: "Forbidden. You have not purchased this template.",
          template_id: template.id,
        },
        { status: 403 }
      );
    }
  }

  // 4. Generate source package files
  const readmeContent = `# ${template.name}

${template.blurb}

## Template Details
- **Version:** ${getTemplateVersion(template)}
- **Category:** ${template.category}
- **Tier:** ${template.tier}
- **Price:** ${template.price}
- **License:** Commercial (Unlimited Projects)
- **Framework:** Next.js 15.1.6 (App Router)
- **React Version:** 19.0.0
- **Tailwind Version:** 4.0.0
- **TypeScript:** Strict (v5.7.3)
- **Documentation:** https://dimensionui.com/template/${template.id}
- **Licensed To:** ${user.email ?? user.id}
- **Generated:** ${new Date().toISOString()}

## Quick Start
1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run local development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Features Included
${template.features.map((f) => `- ${f}`).join("\n")}
`;

  const packageJsonContent = JSON.stringify(
    {
      name: `@dimension-ui/${template.id}`,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      dependencies: {
        next: "15.1.6",
        react: "19.0.0",
        "react-dom": "19.0.0",
        "lucide-react": "^0.469.0",
        "framer-motion": "^11.15.0",
      },
      devDependencies: {
        "@tailwindcss/postcss": "^4.0.0",
        tailwindcss: "^4.0.0",
        typescript: "^5.7.3",
        "@types/node": "^22.10.5",
        "@types/react": "^19.0.7",
        "@types/react-dom": "^19.0.3",
      },
    },
    null,
    2
  );

  const configContent = JSON.stringify(
    {
      id: template.id,
      name: template.name,
      category: template.category,
      tier: template.tier,
      price: template.price,
      accent: template.accent,
      features: template.features,
      mockupType: template.mockupType,
      license: "Commercial (Unlimited Projects)",
      framework: "Next.js 15.1.6",
    },
    null,
    2
  );

  const componentContent = `"use client";

import React from "react";

export interface ${template.id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("")}Props {
  headline?: string;
  description?: string;
}

export function ${template.id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("")}({
  headline = "${template.name}",
  description = "${template.blurb}",
}: ${template.id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("")}Props) {
  return (
    <section className="relative overflow-hidden py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center">
        <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-3">
          ${template.category}
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          {headline}
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mb-8">
          {description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
          ${template.features
            .map(
              (feat) => `
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h4 className="font-semibold text-white text-sm mb-1">${feat}</h4>
            <p className="text-xs text-white/40">Ready-to-use production component block.</p>
          </div>`
            )
            .join("\n")}
        </div>
      </div>
    </section>
  );
}
`;

  const zip = createZip([
    { name: "README.md", data: readmeContent },
    { name: "package.json", data: packageJsonContent },
    { name: "template.config.json", data: configContent },
    { name: `src/${template.id}.tsx`, data: componentContent },
  ]);

  return new NextResponse(new Uint8Array(zip), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${template.id}-source.zip"`,
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
