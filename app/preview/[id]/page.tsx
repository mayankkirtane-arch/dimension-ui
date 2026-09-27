/**
 * Live Preview Route for templates.
 * 
 * Supports:
 * - Interactive Viewport & Theme Switcher (default):
 *   Desktop (1440px), Tablet (768px), Mobile (375px), Dark/Light toggle, Fullscreen.
 * - Raw embed mode (?raw=true or ?embed=true):
 *   Renders the pure template canvas/preview with theme support for iframes.
 */
import { TEMPLATES } from "@/lib/site";
import { notFound } from "next/navigation";
import { PreviewFrame } from "@/components/preview-frame";

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ raw?: string; embed?: string; theme?: string }>;
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
  };

  const lightGradients: Record<string, string> = {
    saas: "linear-gradient(135deg, #f8fafc 0%, #ede9fe 50%, #f1f5f9 100%)",
    clinic: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%)",
    b2b: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f1f5f9 100%)",
    ecommerce: "linear-gradient(135deg, #fff1f2 0%, #fdf2f8 50%, #f8fafc 100%)",
    restaurant: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #f8fafc 100%)",
  };

  const bg = isLight
    ? lightGradients[template.mockupType] || "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
    : darkGradients[template.mockupType] || "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%)";

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${template.name} — Live Preview`}</title>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: ${bg};
            color: ${isLight ? "#0f172a" : "#ffffff"};
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
            background: ${isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.04)"};
            border: 1px solid ${isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)"};
            border-radius: 1.5rem;
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
            color: ${isLight ? "#0f172a" : "#ffffff"};
          }
          p {
            color: ${isLight ? "#64748b" : "rgba(255, 255, 255, 0.6)"};
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
            color: ${isLight ? "#334155" : "rgba(255, 255, 255, 0.8)"};
          }
          .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: ${isLight ? "#0284c7" : "#22d3ee"};
            flex-shrink: 0;
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: ${isLight ? "rgba(124, 58, 237, 0.08)" : "rgba(139, 92, 246, 0.15)"};
            border: 1px solid ${isLight ? "rgba(124, 58, 237, 0.25)" : "rgba(139, 92, 246, 0.3)"};
            border-radius: 9999px;
            padding: 0.5rem 1.25rem;
            font-size: 0.8rem;
            font-weight: 600;
            color: ${isLight ? "#7c3aed" : "#c4b5fd"};
            margin-bottom: 1.5rem;
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
        <div className="preview-container">
          <div className="preview-card">
            <div className="badge">
              ✦ {template.category}
            </div>
            <h1>{template.name}</h1>
            <p>{template.blurb}</p>
            <div className="features">
              {template.features.map((f: string) => (
                <div key={f} className="feature">
                  <div className="dot" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
