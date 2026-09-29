import { NextRequest, NextResponse } from "next/server";
import { validateRegistryManifest } from "@/lib/registry";

export const dynamic = "force-dynamic";

/**
 * POST /api/registry/validate
 * 
 * Validates a registry manifest against the DimensionUI registry specification.
 * Checks for missing required fields, illegal path traversal patterns,
 * invalid semver versions, and server secret leakage.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        {
          valid: false,
          errors: ["Request body must be a valid JSON object."],
        },
        { status: 400 }
      );
    }

    const result = validateRegistryManifest(body);

    return NextResponse.json(
      {
        valid: result.valid,
        errors: result.errors,
        summary: result.valid
          ? "Manifest passed all DimensionUI registry schema and security checks."
          : `Manifest failed with ${result.errors.length} validation issue(s).`,
      },
      { status: result.valid ? 200 : 422 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        errors: [error instanceof Error ? error.message : "Validation processing failed."],
      },
      { status: 500 }
    );
  }
}
