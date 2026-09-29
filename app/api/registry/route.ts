import { NextRequest, NextResponse } from "next/server";
import { getRegistryIndex } from "@/lib/registry";

export const dynamic = "force-dynamic";

/**
 * GET /api/registry
 * 
 * Machine-readable index of all DimensionUI registry resources (templates, blocks, components, themes).
 * Supports filtering by type, tier, access level, category, and keyword search.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get("type");
    const tierFilter = searchParams.get("tier");
    const accessFilter = searchParams.get("access");
    const categoryFilter = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase().trim();

    let items = getRegistryIndex();

    // 1. Filter by type
    if (typeFilter) {
      items = items.filter((i) => i.type.toLowerCase() === typeFilter.toLowerCase());
    }

    // 2. Filter by tier
    if (tierFilter) {
      items = items.filter((i) => i.tier.toLowerCase() === tierFilter.toLowerCase());
    }

    // 3. Filter by access
    if (accessFilter) {
      items = items.filter((i) => i.access.toLowerCase() === accessFilter.toLowerCase());
    }

    // 4. Filter by category
    if (categoryFilter) {
      items = items.filter((i) => i.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    }

    // 5. Keyword search
    if (search) {
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(search) ||
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search) ||
          i.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    return NextResponse.json(
      {
        registryVersion: "1.0.0",
        endpoint: "/api/registry",
        timestamp: new Date().toISOString(),
        total: items.length,
        items,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60, s-maxage=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Failed to generate registry index.",
      },
      { status: 500 }
    );
  }
}
