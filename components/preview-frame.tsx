"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  ExternalLink,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import type { TemplateItem } from "@/lib/site";

interface PreviewFrameProps {
  template: TemplateItem;
}

type ViewportMode = "desktop" | "tablet" | "mobile";
type ThemeMode = "dark" | "light";

const VIEWPORT_CONFIG: Record<
  ViewportMode,
  { width: string; label: string; icon: typeof Monitor; note: string }
> = {
  desktop: {
    width: "1440px",
    label: "Desktop",
    icon: Monitor,
    note: "1440px",
  },
  tablet: {
    width: "768px",
    label: "Tablet",
    icon: Tablet,
    note: "768px",
  },
  mobile: {
    width: "375px",
    label: "Mobile",
    icon: Smartphone,
    note: "375px",
  },
};

export function PreviewFrame({ template }: PreviewFrameProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync fullscreen state with browser exit (e.g. Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed or not supported by browser:", err);
    }
  };

  const iframeSrc = `/preview/${template.id}?raw=true&theme=${theme}`;
  const currentViewport = VIEWPORT_CONFIG[viewport];

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === "dark" ? "bg-[#07070d] text-white" : "bg-[#f1f5f9] text-slate-900"
      }`}
    >
      {/* Top Controls Toolbar */}
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 backdrop-blur-xl ${
          theme === "dark"
            ? "border-white/10 bg-[#07070d]/85"
            : "border-slate-200 bg-white/85"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Back & Template Info */}
          <div className="flex items-center gap-3">
            <Link
              href={`/template/${template.id}`}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                theme === "dark"
                  ? "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:text-white"
                  : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:text-slate-900"
              }`}
              title="Return to template details"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Details</span>
            </Link>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm leading-tight truncate max-w-[160px] sm:max-w-[240px]">
                  {template.name}
                </span>
                <span
                  className={`hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[0.6875rem] font-medium ${
                    theme === "dark"
                      ? "border border-purple-500/30 bg-purple-500/10 text-purple-300"
                      : "border border-purple-300 bg-purple-50 text-purple-700"
                  }`}
                >
                  {template.category}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Viewport Switcher (Desktop 1440px, Tablet 768px, Mobile 375px) */}
          <div
            role="group"
            aria-label="Viewport size switcher"
            className={`flex items-center gap-1 rounded-xl border p-1 ${
              theme === "dark"
                ? "border-white/10 bg-white/[0.03]"
                : "border-slate-200 bg-slate-100"
            }`}
          >
            {(["desktop", "tablet", "mobile"] as const).map((mode) => {
              const config = VIEWPORT_CONFIG[mode];
              const Icon = config.icon;
              const isActive = viewport === mode;

              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewport(mode)}
                  aria-pressed={isActive}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : theme === "dark"
                      ? "text-white/60 hover:text-white hover:bg-white/[0.05]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  }`}
                  title={`${config.label} View (${config.note})`}
                >
                  <Icon className="size-3.5" />
                  <span className="hidden md:inline">{config.label}</span>
                  <span className="text-[0.625rem] opacity-75 hidden lg:inline font-mono">
                    {config.note}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Theme Toggle & Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                theme === "dark"
                  ? "border-white/10 bg-white/[0.04] text-white/80 hover:border-white/20 hover:text-white"
                  : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:text-slate-900"
              }`}
              title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
              aria-label={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="size-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="size-3.5 text-purple-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Open Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                theme === "dark"
                  ? "border-white/10 bg-white/[0.04] text-white/80 hover:border-white/20 hover:text-white"
                  : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:text-slate-900"
              }`}
              title={isFullscreen ? "Exit Fullscreen" : "Open Fullscreen"}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Open Fullscreen"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="size-3.5" />
                  <span className="hidden sm:inline">Exit</span>
                </>
              ) : (
                <>
                  <Maximize2 className="size-3.5" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </button>

            {/* Direct Link */}
            <a
              href={iframeSrc}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-1.5 rounded-lg border transition-all ${
                theme === "dark"
                  ? "border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:border-white/20"
                  : "border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
              title="Open raw preview in new tab"
            >
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Preview Stage Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 overflow-x-auto">
        {/* Device Wrapper Container */}
        <div
          className="flex flex-col transition-all duration-300 ease-out w-full"
          style={{
            maxWidth: currentViewport.width,
            width: viewport === "desktop" ? "100%" : currentViewport.width,
          }}
        >
          {/* Simulated Browser Chrome Header */}
          <div
            className={`flex items-center justify-between border-t border-x rounded-t-2xl px-4 py-2.5 transition-colors duration-300 ${
              theme === "dark"
                ? "border-white/10 bg-[#0d0d18]"
                : "border-slate-200 bg-slate-100"
            }`}
          >
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
            </div>

            {/* Address bar simulation */}
            <div
              className={`mx-4 flex-1 max-w-sm rounded-md px-3 py-1 text-center text-[0.6875rem] font-mono truncate border ${
                theme === "dark"
                  ? "border-white/10 bg-black/40 text-white/40"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              dimensionui.com/preview/{template.id} · {currentViewport.note}
            </div>

            {/* Active Mode pill */}
            <div className="flex items-center gap-1.5 text-[0.6875rem] font-mono text-white/40">
              <span
                className={`size-1.5 rounded-full ${
                  theme === "dark" ? "bg-purple-400" : "bg-amber-500"
                }`}
              />
              <span className={theme === "dark" ? "text-white/40" : "text-slate-500"}>
                {theme}
              </span>
            </div>
          </div>

          {/* Device Screen Frame & Iframe */}
          <div
            className={`relative w-full rounded-b-2xl border-b border-x overflow-hidden shadow-2xl transition-all duration-300 ${
              theme === "dark"
                ? "border-white/10 bg-black shadow-black/80"
                : "border-slate-200 bg-white shadow-slate-300/60"
            }`}
            style={{
              height: isFullscreen ? "calc(100vh - 120px)" : "780px",
              minHeight: "500px",
            }}
          >
            <iframe
              key={`${template.id}-${theme}`}
              src={iframeSrc}
              className="w-full h-full border-0 block"
              title={`Live preview of ${template.name} in ${viewport} mode`}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
