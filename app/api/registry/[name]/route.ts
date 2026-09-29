import { NextRequest, NextResponse } from "next/server";
import {
  getRegistryManifestByName,
  validateRegistryManifest,
  isRegistryRequestAuthorized,
} from "@/lib/registry";

export const dynamic = "force-dynamic";

/**
 * GET /api/registry/[name]
 * 
 * Machine-readable manifest endpoint for an individual DimensionUI registry item.
 * Adheres to the DimensionUI Registry specification.
 * 
 * Access Control:
 * - Public / Free resources include source code openly without credentials.
 * - Commercial / Paid resources provide complete structural metadata & dependencies publicly,
 *   but omit/lock source code files unless an authorized Bearer license token or session is provided.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const requireDownload = searchParams.get("download") === "true";

    // 1. Resolve manifest from canonical data sources
    const manifest = getRegistryManifestByName(name, authHeader);

    if (!manifest) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: `Registry item '${name}' does not exist in the DimensionUI registry.`,
          availableEndpoints: "/api/registry",
        },
        { status: 404 }
      );
    }

    // 2. Validate manifest schema
    const validation = validateRegistryManifest(manifest);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Internal Manifest Validation Error",
          issues: validation.errors,
        },
        { status: 500 }
      );
    }

    // 3. Strict Download Authorization Check
    const isCommercial = manifest.access === "commercial" || manifest.license.tier !== "free";
    const isAuthorized = isRegistryRequestAuthorized(authHeader, manifest);

    if (requireDownload && isCommercial && !isAuthorized) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: `Access to source code for commercial template '${name}' requires a valid license authorization.`,
          tier: manifest.license.tier,
          price: manifest.license.price,
          howToAuthorize: "Provide 'Authorization: Bearer <license_key>' header or sign in to DimensionUI.",
        },
        { status: 401 }
      );
    }

    // 4. Return manifest response
    return NextResponse.json(manifest, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": isCommercial ? "private, no-cache" : "public, max-age=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Failed to process registry request.",
      },
      { status: 500 }
    );
  }
}
