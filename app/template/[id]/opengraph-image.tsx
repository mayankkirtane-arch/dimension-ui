/**
 * Auto-generated Open Graph image for each template page.
 * Next.js will generate a unique OG image for /template/[id] at build time.
 */
import { ImageResponse } from "next/og";
import { TEMPLATES } from "@/lib/site";

export const alt = "DimensionUI Template";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TemplateOGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.id === id);

  const name = template?.name ?? "DimensionUI Template";
  const blurb = template?.blurb ?? "Production-ready Next.js templates";
  const price = template?.price === "$0" ? "Free" : template?.price ?? "";
  const category = template?.category ?? "Template";
  const tier = template?.tier ?? "free";

  const tierColor =
    tier === "30" ? "#a855f7" : tier === "20" ? "#c084fc" : tier === "15" ? "#22d3ee" : "#34d399";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #06060b 0%, #0f0a1e 50%, #06060b 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "50%",
            width: 700,
            height: 700,
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            transform: "translateX(-50%)",
          }}
        />

        {/* Logo + brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            ✦
          </div>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontWeight: 600 }}>
            DimensionUI
          </span>
        </div>

        {/* Category badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: `${tierColor}20`,
            border: `1px solid ${tierColor}40`,
            borderRadius: 999,
            padding: "6px 16px",
            marginBottom: 24,
            width: "fit-content",
          }}
        >
          <span style={{ color: tierColor, fontSize: 14, fontWeight: 700 }}>{category}</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 800,
          }}
        >
          {name}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.5,
            maxWidth: 700,
            marginBottom: "auto",
          }}
        >
          {blurb}
        </div>

        {/* Price badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                borderRadius: 16,
                padding: "12px 28px",
              }}
            >
              <span style={{ color: "white", fontSize: 24, fontWeight: 900 }}>
                {price || "Free"}
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>
              One-time payment · Commercial license
            </span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>dimensionui.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
