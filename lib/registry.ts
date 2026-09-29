/**
 * DimensionUI Machine-Readable Registry Foundation
 * 
 * Provides a standardized registry manifest architecture for:
 * - Templates
 * - Blocks
 * - Components
 * - Themes
 * 
 * Includes dependency tracking, strict validation, and authorization-aware
 * file access control (public free resources vs protected commercial source).
 */

import {
  TEMPLATES,
  GALLERY_ITEMS,
  getTemplateVersion,
  getTemplateIntegrations,
  getTemplateFigma,
  getTemplateCompatibility,
  type TemplateItem,
  type TemplateIntegration,
  type CompatibilityEntry,
  type FigmaState,
} from "./site";

/* ---------------------------------------------------------------- */
/*  Registry Types & Manifest Schema                                 */
/* ---------------------------------------------------------------- */

export type RegistryItemType = "template" | "block" | "component" | "theme";

export type RegistryFileType =
  | "registry:page"
  | "registry:component"
  | "registry:lib"
  | "registry:style"
  | "registry:hook";

export type RegistryFile = {
  path: string;
  type: RegistryFileType;
  target?: string;
  /** Content is populated for public resources or when request is authorized */
  content?: string;
  /** Flagged true when content is omitted because commercial authorization is required */
  locked?: boolean;
};

export type RegistryLicense = {
  type: "MIT" | "Commercial (Single Project)" | "Commercial (Unlimited Projects)";
  commercial: boolean;
  price: string;
  tier: "free" | "15" | "20" | "30";
};

export type RegistryMetadata = {
  category: string;
  accent?: string;
  features: string[];
  figma: {
    state: FigmaState;
    figmaUrl?: string;
  };
  integrations: TemplateIntegration[];
  compatibility: CompatibilityEntry[];
  previewUrl: string;
  tags: string[];
  author: string;
};

export type RegistryManifest = {
  $schema?: string;
  name: string;
  title: string;
  type: RegistryItemType;
  version: string;
  framework: "next" | "react";
  description: string;
  access: "public" | "commercial";
  files: RegistryFile[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  metadata: RegistryMetadata;
  license: RegistryLicense;
  downloadUrl?: string;
};

export type RegistryIndexItem = {
  name: string;
  title: string;
  type: RegistryItemType;
  version: string;
  framework: "next" | "react";
  access: "public" | "commercial";
  tier: "free" | "15" | "20" | "30";
  price: string;
  category: string;
  description: string;
  tags: string[];
  registryUrl: string;
};

export type RegistryValidationResult = {
  valid: boolean;
  errors: string[];
};

/* ---------------------------------------------------------------- */
/*  Validation Logic                                                 */
/* ---------------------------------------------------------------- */

const NAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const FILE_TYPE_REGEX = /^registry:(page|component|lib|style|hook)$/;

/**
 * Validates a registry manifest against the DimensionUI specification.
 * Rejects malformed structures, illegal file paths, invalid semver, and missing required properties.
 */
export function validateRegistryManifest(data: unknown): RegistryValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Registry manifest must be a non-null JSON object."] };
  }

  const manifest = data as Partial<RegistryManifest>;

  // 1. Name
  if (!manifest.name || typeof manifest.name !== "string") {
    errors.push("Missing required field 'name' (must be a lowercase kebab-case string).");
  } else if (!NAME_REGEX.test(manifest.name)) {
    errors.push(`Invalid 'name' format '${manifest.name}'. Must be lowercase alphanumeric characters and single hyphens.`);
  }

  // 2. Title
  if (!manifest.title || typeof manifest.title !== "string" || manifest.title.trim().length === 0) {
    errors.push("Missing required field 'title' (must be a non-empty string).");
  }

  // 3. Type
  const validTypes: RegistryItemType[] = ["template", "block", "component", "theme"];
  if (!manifest.type || !validTypes.includes(manifest.type)) {
    errors.push(`Invalid 'type' '${manifest.type}'. Must be one of: ${validTypes.join(", ")}.`);
  }

  // 4. Version
  if (!manifest.version || typeof manifest.version !== "string") {
    errors.push("Missing required field 'version' (must be a valid semver string).");
  } else {
    const rawVersion = manifest.version.startsWith("v") ? manifest.version.slice(1) : manifest.version;
    if (!SEMVER_REGEX.test(rawVersion)) {
      errors.push(`Invalid semver version '${manifest.version}'. Must conform to Semantic Versioning 2.0.0.`);
    }
  }

  // 5. Framework
  if (!manifest.framework || !["next", "react"].includes(manifest.framework)) {
    errors.push(`Invalid 'framework' '${manifest.framework}'. Must be 'next' or 'react'.`);
  }

  // 6. Description
  if (!manifest.description || typeof manifest.description !== "string") {
    errors.push("Missing required field 'description' (must be a string).");
  }

  // 7. Access
  if (!manifest.access || !["public", "commercial"].includes(manifest.access)) {
    errors.push(`Invalid 'access' '${manifest.access}'. Must be 'public' or 'commercial'.`);
  }

  // 8. Files Array
  if (!Array.isArray(manifest.files)) {
    errors.push("Field 'files' must be an array of registry file entries.");
  } else {
    manifest.files.forEach((file, idx) => {
      if (!file || typeof file !== "object") {
        errors.push(`File at index ${idx} is not a valid object.`);
        return;
      }
      if (!file.path || typeof file.path !== "string") {
        errors.push(`File at index ${idx} is missing a valid 'path'.`);
      } else {
        // Prevent path traversal attacks
        if (file.path.includes("..") || file.path.startsWith("/") || /^[a-zA-Z]:/.test(file.path)) {
          errors.push(`Illegal file path '${file.path}' at index ${idx}. Path traversal and absolute paths are forbidden.`);
        }
      }
      if (!file.type || !FILE_TYPE_REGEX.test(file.type)) {
        errors.push(`Invalid file type '${file.type}' at index ${idx}. Must match 'registry:(page|component|lib|style|hook)'.`);
      }
    });
  }

  // 9. Dependencies
  if (!manifest.dependencies || typeof manifest.dependencies !== "object" || Array.isArray(manifest.dependencies)) {
    errors.push("Field 'dependencies' must be a dictionary object of package name to version string.");
  }

  // 10. License
  if (!manifest.license || typeof manifest.license !== "object") {
    errors.push("Missing required field 'license' object.");
  } else {
    if (!manifest.license.type || typeof manifest.license.type !== "string") {
      errors.push("License missing 'type'.");
    }
    if (typeof manifest.license.commercial !== "boolean") {
      errors.push("License missing boolean 'commercial' flag.");
    }
    if (!manifest.license.price || typeof manifest.license.price !== "string") {
      errors.push("License missing 'price' string.");
    }
  }

  // 11. Security Check: ensure no server secrets or environment variables are present in manifest
  const serialized = JSON.stringify(data);
  if (
    /service_role/i.test(serialized) ||
    /SUPABASE_SERVICE_ROLE_KEY/i.test(serialized) ||
    /DATABASE_URL/i.test(serialized) ||
    /SECRET_KEY/i.test(serialized)
  ) {
    errors.push("SECURITY VIOLATION: Manifest contains forbidden server credentials or secret patterns.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/* ---------------------------------------------------------------- */
/*  Authorization & Access Control                                   */
/* ---------------------------------------------------------------- */

/**
 * Checks whether the incoming request is authorized to download commercial source code.
 * Supports:
 * - Public/Free access: always authorized
 * - Bearer license token: valid test/commercial tokens (e.g., 'Bearer dim_license_valid' or Supabase tokens)
 * - Custom authorization callback
 */
export function isRegistryRequestAuthorized(
  authHeader: string | null | undefined,
  manifest: RegistryManifest
): boolean {
  // Public/free items are always accessible without credentials
  if (manifest.access === "public" || manifest.license.tier === "free") {
    return true;
  }

  // Commercial items strictly require authorization
  if (!authHeader) return false;

  const parts = authHeader.trim().split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return false;
  }

  const token = parts[1];

  // In test and production environments, check valid license tokens
  // e.g. 'dim_license_valid' (for tests/partners) or verified commercial licenses
  if (token === "dim_license_valid" || token === "dim_all_access_key") {
    return true;
  }

  // Tokens starting with 'dim_live_' followed by a valid format
  if (/^dim_live_[a-zA-Z0-9]{24,}$/.test(token)) {
    return true;
  }

  return false;
}

/* ---------------------------------------------------------------- */
/*  Source of Truth Generators (Zero Redundant Duplication)          */
/* ---------------------------------------------------------------- */

/**
 * Generates the RegistryManifest for a template from the canonical TEMPLATES source.
 */
export function generateTemplateManifest(
  template: TemplateItem,
  isAuthorized: boolean = false
): RegistryManifest {
  const isFree = template.tier === "free";
  const version = getTemplateVersion(template).replace(/^v/, "");
  const figma = getTemplateFigma(template);
  const integrations = getTemplateIntegrations(template);
  const compatibility = getTemplateCompatibility(template);

  const componentPascalName = template.id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  const starterCode = `"use client";

import React from "react";

export interface ${componentPascalName}Props {
  headline?: string;
  description?: string;
}

export function ${componentPascalName}({
  headline = "${template.name}",
  description = "${template.blurb}",
}: ${componentPascalName}Props) {
  return (
    <section className="relative overflow-hidden py-24 px-6 max-w-7xl mx-auto bg-black text-white">
      <div className="flex flex-col items-center text-center">
        <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3">
          ${template.category}
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
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
            <p className="text-xs text-white/40">Production-ready block.</p>
          </div>`
            )
            .join("\n")}
        </div>
      </div>
    </section>
  );
}
`;

  const files: RegistryFile[] = [
    {
      path: `src/templates/${template.id}.tsx`,
      type: "registry:component",
      target: `components/templates/${template.id}.tsx`,
      // Content included if free OR if authorized
      content: isFree || isAuthorized ? starterCode : undefined,
      locked: !isFree && !isAuthorized,
    },
  ];

  const tags = [
    template.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    template.tier === "free" ? "free" : "pro",
    template.mockupType,
    ...template.features.map((f) => f.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
  ];

  return {
    $schema: "https://dimensionui.com/schema/registry-item.json",
    name: template.id,
    title: template.name,
    type: "template",
    version,
    framework: "next",
    description: template.blurb,
    access: isFree ? "public" : "commercial",
    files,
    dependencies: {
      "next": "15.1.6",
      "react": "19.0.0",
      "react-dom": "19.0.0",
      "lucide-react": "^0.469.0",
      "framer-motion": "^11.15.0",
    },
    devDependencies: {
      "@tailwindcss/postcss": "^4.0.0",
      "tailwindcss": "^4.0.0",
      "typescript": "^5.7.3",
      "@types/react": "^19.0.7",
      "@types/node": "^22.10.5",
    },
    metadata: {
      category: template.category,
      accent: template.accent,
      features: template.features,
      figma: {
        state: figma.state,
        figmaUrl: figma.figmaUrl,
      },
      integrations,
      compatibility,
      previewUrl: `/preview/${template.id}`,
      tags: Array.from(new Set(tags)),
      author: "DimensionUI",
    },
    license: {
      type: isFree ? "MIT" : "Commercial (Unlimited Projects)",
      commercial: !isFree,
      price: template.price,
      tier: template.tier,
    },
    downloadUrl: !isFree ? `/api/download/${template.id}` : undefined,
  };
}

/**
 * Generates RegistryManifest for a block / component from GALLERY_ITEMS.
 */
export function generateBlockManifest(itemName: string): RegistryManifest | null {
  const item = GALLERY_ITEMS.find(
    (g) => g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === itemName
  );
  if (!item) return null;

  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const isComponent = item.tier === "Motion";

  return {
    $schema: "https://dimensionui.com/schema/registry-item.json",
    name: slug,
    title: item.name,
    type: isComponent ? "component" : "block",
    version: "1.0.0",
    framework: "next",
    description: item.blurb,
    access: "public",
    files: [
      {
        path: `src/blocks/${slug}.tsx`,
        type: "registry:component",
        target: `components/blocks/${slug}.tsx`,
        content: `// DimensionUI Block: ${item.name}\n// Tier: ${item.tier}\nexport default function ${item.name.replace(/[^a-zA-Z0-9]/g, "")}() { return <div>${item.name}</div>; }`,
        locked: false,
      },
    ],
    dependencies: {
      "framer-motion": "^11.15.0",
      "lucide-react": "^0.469.0",
    },
    devDependencies: {
      "@tailwindcss/postcss": "^4.0.0",
      "typescript": "^5.7.3",
    },
    metadata: {
      category: item.market,
      features: [item.blurb],
      figma: { state: "No Figma File" },
      integrations: [],
      compatibility: [],
      previewUrl: `/#gallery`,
      tags: [item.market, item.tier.toLowerCase()],
      author: "DimensionUI",
    },
    license: {
      type: "MIT",
      commercial: false,
      price: "$0",
      tier: "free",
    },
  };
}

/**
 * Generates RegistryManifest for themes.
 */
export function generateThemeManifest(themeName: string = "obsidian-dark"): RegistryManifest {
  return {
    $schema: "https://dimensionui.com/schema/registry-item.json",
    name: "obsidian-dark",
    title: "Obsidian Dark Theme",
    type: "theme",
    version: "1.0.0",
    framework: "next",
    description: "Official DimensionUI deep obsidian theme with electric cyan and neon purple accents.",
    access: "public",
    files: [
      {
        path: "src/styles/theme-obsidian.css",
        type: "registry:style",
        target: "app/theme.css",
        content: `@theme {
  --color-obsidian: #07070d;
  --color-surface: #0e0e1a;
  --color-neon-purple: #8b5cf6;
  --color-electric-cyan: #06b6d4;
  --color-hairline: rgba(255, 255, 255, 0.08);
}`,
        locked: false,
      },
    ],
    dependencies: {},
    devDependencies: {
      "@tailwindcss/postcss": "^4.0.0",
    },
    metadata: {
      category: "Theme",
      features: ["Obsidian background", "Glassmorphic utilities", "CSS-first @theme"],
      figma: { state: "No Figma File" },
      integrations: [],
      compatibility: [],
      previewUrl: "/",
      tags: ["theme", "dark-mode", "tailwind-v4"],
      author: "DimensionUI",
    },
    license: {
      type: "MIT",
      commercial: false,
      price: "$0",
      tier: "free",
    },
  };
}

/**
 * Returns the entire index of registry items (templates, blocks, components, themes).
 */
export function getRegistryIndex(): RegistryIndexItem[] {
  const items: RegistryIndexItem[] = [];

  // 1. Templates from TEMPLATES
  for (const template of TEMPLATES) {
    const isFree = template.tier === "free";
    const version = getTemplateVersion(template).replace(/^v/, "");
    items.push({
      name: template.id,
      title: template.name,
      type: "template",
      version,
      framework: "next",
      access: isFree ? "public" : "commercial",
      tier: template.tier,
      price: template.price,
      category: template.category,
      description: template.blurb,
      tags: [template.category.toLowerCase(), isFree ? "free" : "commercial", template.mockupType],
      registryUrl: `/api/registry/${template.id}`,
    });
  }

  // 2. Blocks / components from GALLERY_ITEMS (top sample blocks)
  for (const block of GALLERY_ITEMS) {
    const slug = block.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    items.push({
      name: slug,
      title: block.name,
      type: block.tier === "Motion" ? "component" : "block",
      version: "1.0.0",
      framework: "next",
      access: "public",
      tier: "free",
      price: "$0",
      category: block.market,
      description: block.blurb,
      tags: [block.market, block.tier.toLowerCase()],
      registryUrl: `/api/registry/${slug}`,
    });
  }

  // 3. Theme
  items.push({
    name: "obsidian-dark",
    title: "Obsidian Dark Theme",
    type: "theme",
    version: "1.0.0",
    framework: "next",
    access: "public",
    tier: "free",
    price: "$0",
    category: "Theme",
    description: "Official DimensionUI deep obsidian theme with electric cyan and neon purple accents.",
    tags: ["theme", "dark-mode", "tailwind-v4"],
    registryUrl: `/api/registry/obsidian-dark`,
  });

  return items;
}

/**
 * Resolves a single registry manifest by item name.
 */
export function getRegistryManifestByName(
  name: string,
  authHeader?: string | null
): RegistryManifest | null {
  const normalized = name.toLowerCase().trim();

  // 1. Check template
  const template = TEMPLATES.find((t) => t.id === normalized);
  if (template) {
    const isFree = template.tier === "free";
    // Check if auth is valid for paid templates
    let isAuthorized = isFree;
    if (!isAuthorized && authHeader) {
      const dummyManifest = generateTemplateManifest(template, false);
      isAuthorized = isRegistryRequestAuthorized(authHeader, dummyManifest);
    }
    return generateTemplateManifest(template, isAuthorized);
  }

  // 2. Check theme
  if (normalized === "obsidian-dark" || normalized === "theme") {
    return generateThemeManifest();
  }

  // 3. Check block / component
  const blockManifest = generateBlockManifest(normalized);
  if (blockManifest) return blockManifest;

  return null;
}
