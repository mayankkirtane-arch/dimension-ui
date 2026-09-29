/**
 * Live Preview Route for templates.
 * 
 * Supports:
 * - Interactive Viewport & Theme Switcher (default):
 *   Desktop (1440px), Tablet (768px), Mobile (375px), Dark/Light toggle, Fullscreen.
 * - Raw embed mode (?raw=true or ?embed=true):
 *   Renders the pure template canvas/preview with live theme playground support.
 */
import { TEMPLATES } from "@/lib/site";
import { notFound } from "next/navigation";
import { PreviewFrame } from "@/components/preview-frame";
import { TemplatePreviewCanvas } from "@/components/template-preview-canvas";

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    raw?: string;
    embed?: string;
    theme?: string;
    primary?: string;
    bg?: string;
    accent?: string;
    font?: string;
    radius?: string;
  }>;
}) {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) notFound();

  const search = await searchParams;
  const isRaw = search?.raw === "true" || search?.embed === "true";
  const theme = search?.theme === "light" ? "light" : "dark";

  // If viewed as the main page, render the interactive toolbar and responsive viewport frame
  if (!isRaw) {
    return <PreviewFrame template={template} />;
  }

  // Pure template preview content (rendered inside the responsive iframe or embed)
  const isLight = theme === "light";

  const darkGradients: Record<string, string> = {
    saas: "linear-gradient(135deg, #0f0a1a 0%, #1a0a2e 50%, #0a0f1a 100%)",
    clinic: "linear-gradient(135deg, #0a1a1a 0%, #0a2020 50%, #0a1520 100%)",
    b2b: "linear-gradient(135deg, #0a0a1e 0%, #0f0f2e 50%, #0a0a1a 100%)",
    ecommerce: "linear-gradient(135deg, #1a0a0f 0%, #2e0a1a 50%, #0a0a0f 100%)",
    restaurant: "linear-gradient(135deg, #1a0f0a 0%, #2e1a0a 50%, #1a0f00 100%)",
    fitness: "linear-gradient(135deg, #180808 0%, #260a0a 50%, #100505 100%)",
    realestate: "linear-gradient(135deg, #06101c 0%, #0c1d33 50%, #050a12 100%)",
    portfolio: "linear-gradient(135deg, #0a0f18 0%, #121824 50%, #080c14 100%)",
  };

  const lightGradients: Record<string, string> = {
    saas: "linear-gradient(135deg, #f8fafc 0%, #ede9fe 50%, #f1f5f9 100%)",
    clinic: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%)",
    b2b: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f1f5f9 100%)",
    ecommerce: "linear-gradient(135deg, #fff1f2 0%, #fdf2f8 50%, #f8fafc 100%)",
    restaurant: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #f8fafc 100%)",
    fitness: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #f8fafc 100%)",
    realestate: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)",
    portfolio: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
  };

  const defaultBg = isLight
    ? lightGradients[template.mockupType] || "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
    : darkGradients[template.mockupType] || "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%)";

  const defaultPrimary =
    template.accent === "green"
      ? "#10b981"
      : template.accent === "cyan"
      ? "#06b6d4"
      : template.accent === "amber"
      ? "#f59e0b"
      : "#8b5cf6";

  const defaultAccent =
    template.accent === "cyan"
      ? "#8b5cf6"
      : template.accent === "green"
      ? "#06b6d4"
      : template.accent === "amber"
      ? "#ef4444"
      : "#22d3ee";

  const primaryColor = search?.primary || defaultPrimary;
  const accentColor = search?.accent || defaultAccent;
  const bgColor = search?.bg || defaultBg;
  const fontFamily = search?.font || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  const borderRadius = search?.radius || "1.5rem";

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${template.name} — Live Preview`}</title>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          :root {
            --preview-primary: ${primaryColor};
            --preview-bg: ${bgColor};
            --preview-accent: ${accentColor};
            --preview-font: ${fontFamily};
            --preview-radius: ${borderRadius};
            --text-main: ${isLight ? "#0f172a" : "#ffffff"};
            --text-muted: ${isLight ? "#64748b" : "rgba(255, 255, 255, 0.6)"};
            --card-bg: ${isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.04)"};
            --card-border: ${isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)"};
          }
          body {
            margin: 0;
            padding: 0;
            font-family: var(--preview-font);
            background: var(--preview-bg);
            color: var(--text-main);
            min-height: 100vh;
            transition: background 0.3s ease, color 0.3s ease;
          }
          .preview-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            gap: 2rem;
            width: 100%;
          }
          .preview-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: var(--preview-radius);
            padding: 3rem;
            max-width: 600px;
            width: 100%;
            text-align: center;
            backdrop-filter: blur(24px);
            box-shadow: ${isLight ? "0 20px 40px -15px rgba(0, 0, 0, 0.08)" : "0 25px 50px -12px rgba(0, 0, 0, 0.6)"};
            transition: all 0.3s ease;
          }
          h1 {
            font-size: 2.5rem;
            font-weight: 900;
            margin: 0 0 1rem;
            line-height: 1.1;
            color: var(--text-main);
          }
          p {
            color: var(--text-muted);
            line-height: 1.6;
            margin: 0 0 2rem;
            font-size: 1rem;
          }
          .features {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            text-align: left;
          }
          .feature {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.9rem;
            color: var(--text-muted);
          }
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--preview-accent);
            box-shadow: 0 0 8px var(--preview-accent);
            flex-shrink: 0;
            transition: all 0.3s ease;
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: ${isLight ? "rgba(124, 58, 237, 0.08)" : "rgba(139, 92, 246, 0.15)"};
            border: 1px solid var(--preview-primary);
            border-radius: 9999px;
            padding: 0.5rem 1.25rem;
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--preview-primary);
            margin-bottom: 1.5rem;
            transition: all 0.3s ease;
          }
          .cta-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1.75rem;
            font-size: 0.875rem;
            font-weight: 700;
            color: #ffffff;
            background: var(--preview-primary);
            border-radius: var(--preview-radius);
            border: none;
            cursor: pointer;
            margin-top: 1.75rem;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
            transition: all 0.2s ease;
          }
          .cta-btn:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
          }
          @media (max-width: 640px) {
            .preview-card {
              padding: 1.75rem;
            }
            h1 {
              font-size: 1.75rem;
            }
          }
        `}</style>
      </head>
      <body>
        <TemplatePreviewCanvas
          template={template}
          primaryColor={primaryColor}
          accentColor={accentColor}
          isLight={isLight}
          fontFamily={fontFamily}
          borderRadius={borderRadius}
        />

        {/* Live Message Listener for Instant 0ms Theme Updates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener("message", function(e) {
                if (e.data && e.data.type === "THEME_UPDATE") {
                  var d = e.data;
                  var r = document.documentElement;
                  if (d.primary) r.style.setProperty("--preview-primary", d.primary);
                  if (d.bg) r.style.setProperty("--preview-bg", d.bg);
                  if (d.accent) r.style.setProperty("--preview-accent", d.accent);
                  if (d.font) r.style.setProperty("--preview-font", d.font);
                  if (d.radius) r.style.setProperty("--preview-radius", d.radius);
                  if (d.theme) {
                    var light = d.theme === "light";
                    r.style.setProperty("--text-main", light ? "#0f172a" : "#ffffff");
                    r.style.setProperty("--text-muted", light ? "#64748b" : "rgba(255, 255, 255, 0.6)");
                    r.style.setProperty("--card-bg", light ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.04)");
                    r.style.setProperty("--card-border", light ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)");
                  }
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
