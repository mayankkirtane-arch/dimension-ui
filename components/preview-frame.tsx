"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Paintbrush,
  RotateCcw,
  Copy,
  Check,
  Code,
  X,
  Sliders,
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

const FONT_OPTIONS = [
  { id: "inter", label: "Inter (Modern Sans)", value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  { id: "roboto", label: "Roboto (Clean Neo-Grotesque)", value: "'Roboto', sans-serif" },
  { id: "geist", label: "Geist (Technical Sans)", value: "'Geist', -apple-system, sans-serif" },
  { id: "outfit", label: "Outfit (Geometric Display)", value: "'Outfit', sans-serif" },
  { id: "playfair", label: "Playfair Display (Editorial Serif)", value: "'Playfair Display', Georgia, serif" },
  { id: "jetbrains", label: "JetBrains Mono (Developer Code)", value: "'JetBrains Mono', monospace" },
  { id: "system", label: "System UI (Native Apple / Windows)", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
];

const RADIUS_OPTIONS = [
  { id: "0px", label: "Sharp", value: "0px" },
  { id: "6px", label: "Small (6px)", value: "6px" },
  { id: "12px", label: "Medium (12px)", value: "12px" },
  { id: "24px", label: "Large (24px)", value: "24px" },
  { id: "9999px", label: "Pill / Full", value: "9999px" },
];

const PRIMARY_SWATCHES = [
  { label: "Neon Purple", value: "#8b5cf6" },
  { label: "Electric Cyan", value: "#06b6d4" },
  { label: "Emerald Green", value: "#10b981" },
  { label: "Vibrant Amber", value: "#f59e0b" },
  { label: "Rose Pink", value: "#f43f5e" },
  { label: "Royal Blue", value: "#3b82f6" },
  { label: "Sunset Orange", value: "#ea580c" },
];

const ACCENT_SWATCHES = [
  { label: "Cyan Glow", value: "#22d3ee" },
  { label: "Purple Beam", value: "#c084fc" },
  { label: "Mint Green", value: "#34d399" },
  { label: "Golden Sun", value: "#fde047" },
  { label: "Coral Red", value: "#fb7185" },
  { label: "Sky Blue", value: "#38bdf8" },
];

const BG_SWATCHES_DARK = [
  { label: "Deep Obsidian", value: "#07070d" },
  { label: "Midnight Slate", value: "#0f172a" },
  { label: "Deep Violet Space", value: "#0f0a1a" },
  { label: "Dark Forest", value: "#061a14" },
  { label: "Pure Pitch Black", value: "#000000" },
];

const BG_SWATCHES_LIGHT = [
  { label: "Pure Crisp White", value: "#ffffff" },
  { label: "Cool Off-White", value: "#f8fafc" },
  { label: "Soft Cream", value: "#fffbeb" },
  { label: "Lilac Whisper", value: "#f5f3ff" },
  { label: "Mint Breeze", value: "#f0fdf4" },
];

export function PreviewFrame({ template }: PreviewFrameProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"css" | "tailwind" | "json">("css");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compute default theme parameters for this template
  const getDefaultPrimary = useCallback(() => {
    return template.accent === "green"
      ? "#10b981"
      : template.accent === "cyan"
      ? "#06b6d4"
      : template.accent === "amber"
      ? "#f59e0b"
      : "#8b5cf6";
  }, [template.accent]);

  const getDefaultAccent = useCallback(() => {
    return template.accent === "cyan"
      ? "#8b5cf6"
      : template.accent === "green"
      ? "#06b6d4"
      : template.accent === "amber"
      ? "#ef4444"
      : "#22d3ee";
  }, [template.accent]);

  const getDefaultBg = useCallback((mode: ThemeMode) => {
    return mode === "dark" ? "#07070d" : "#f8fafc";
  }, []);

  const [primaryColor, setPrimaryColor] = useState<string>(getDefaultPrimary());
  const [accentColor, setAccentColor] = useState<string>(getDefaultAccent());
  const [bgColor, setBgColor] = useState<string>(getDefaultBg("dark"));
  const [fontFamily, setFontFamily] = useState<string>(FONT_OPTIONS[0].value);
  const [borderRadius, setBorderRadius] = useState<string>("24px");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Synchronize postMessage live update to iframe
  const sendThemeUpdate = useCallback((overrides?: Partial<{
    primary: string;
    bg: string;
    accent: string;
    font: string;
    radius: string;
    theme: ThemeMode;
  }>) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      {
        type: "THEME_UPDATE",
        primary: overrides?.primary ?? primaryColor,
        bg: overrides?.bg ?? bgColor,
        accent: overrides?.accent ?? accentColor,
        font: overrides?.font ?? fontFamily,
        radius: overrides?.radius ?? borderRadius,
        theme: overrides?.theme ?? theme,
      },
      "*"
    );
  }, [primaryColor, bgColor, accentColor, fontFamily, borderRadius, theme]);

  // When theme mode changes (dark/light), update background if on default
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    const nextBg = getDefaultBg(nextTheme);
    setBgColor(nextBg);
    sendThemeUpdate({ theme: nextTheme, bg: nextBg });
  };

  // Reset Theme action
  const handleResetTheme = () => {
    const defPrimary = getDefaultPrimary();
    const defAccent = getDefaultAccent();
    const defBg = getDefaultBg(theme);
    const defFont = FONT_OPTIONS[0].value;
    const defRadius = "24px";

    setPrimaryColor(defPrimary);
    setAccentColor(defAccent);
    setBgColor(defBg);
    setFontFamily(defFont);
    setBorderRadius(defRadius);

    sendThemeUpdate({
      primary: defPrimary,
      accent: defAccent,
      bg: defBg,
      font: defFont,
      radius: defRadius,
    });
  };

  // Fullscreen support
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
      console.warn("Fullscreen toggle failed:", err);
    }
  };

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Export formats
  const exportCSS = `:root {
  --primary: ${primaryColor};
  --accent: ${accentColor};
  --background: ${bgColor};
  --font-family: ${fontFamily};
  --border-radius: ${borderRadius};
  --color-scheme: ${theme};
}`;

  const exportTailwind = `@theme {
  --color-primary: ${primaryColor};
  --color-accent: ${accentColor};
  --color-background: ${bgColor};
  --font-custom: ${fontFamily};
  --radius-custom: ${borderRadius};
}`;

  const exportJSON = JSON.stringify(
    {
      templateId: template.id,
      theme,
      primaryColor,
      accentColor,
      backgroundColor: bgColor,
      fontFamily,
      borderRadius,
    },
    null,
    2
  );

  const iframeSrc = `/preview/${template.id}?raw=true&theme=${theme}&primary=${encodeURIComponent(primaryColor)}&accent=${encodeURIComponent(accentColor)}&bg=${encodeURIComponent(bgColor)}&font=${encodeURIComponent(fontFamily)}&radius=${encodeURIComponent(borderRadius)}`;
  const currentViewport = VIEWPORT_CONFIG[viewport];

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col transition-colors duration-300 relative ${
        theme === "dark" ? "bg-[#07070d] text-white" : "bg-[#f1f5f9] text-slate-900"
      }`}
    >
      {/* Top Controls Toolbar */}
      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-300 backdrop-blur-xl ${
          theme === "dark"
            ? "border-white/10 bg-[#07070d]/90"
            : "border-slate-200 bg-white/90"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
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
                <span className="font-semibold text-sm leading-tight truncate max-w-[140px] sm:max-w-[200px]">
                  {template.name}
                </span>
                <span
                  className={`hidden md:inline-flex items-center rounded-full px-2 py-0.5 text-[0.6875rem] font-medium ${
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

          {/* Center: Viewport Switcher */}
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
                  className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
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
                </button>
              );
            })}
          </div>

          {/* Right Toolbar Actions: Theme Playground Toggle, Mode, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Theme Playground Button */}
            <button
              type="button"
              onClick={() => setShowPlayground(!showPlayground)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                showPlayground
                  ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : theme === "dark"
                  ? "border-white/10 bg-white/[0.04] text-white/80 hover:border-white/20 hover:text-white"
                  : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:text-slate-900"
              }`}
              title="Toggle Theme Playground"
            >
              <Paintbrush className="size-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Theme Playground</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={handleToggleTheme}
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

            {/* Fullscreen Button */}
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
                <Minimize2 className="size-3.5" />
              ) : (
                <Maximize2 className="size-3.5" />
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
      <div className="flex-1 flex flex-row overflow-hidden relative">
        <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 overflow-x-auto overflow-y-auto">
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
                ref={iframeRef}
                key={`${template.id}-${theme}`}
                src={iframeSrc}
                className="w-full h-full border-0 block"
                title={`Live preview of ${template.name} in ${viewport} mode`}
                onLoad={() => sendThemeUpdate()}
              />
            </div>
          </div>
        </main>

        {/* Slide-out Theme Playground Sidebar */}
        {showPlayground && (
          <aside className="w-80 sm:w-96 border-l border-white/10 bg-[#0a0a14]/95 backdrop-blur-2xl p-5 overflow-y-auto flex flex-col gap-6 z-30 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Paintbrush className="size-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Theme Playground</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPlayground(false)}
                className="rounded-lg p-1 text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Controls List */}
            <div className="flex flex-col gap-5 text-xs">
              {/* 1. Primary Color */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white/80">Primary Color</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[0.6875rem] text-white/50">{primaryColor}</span>
                    <input
                      type="color"
                      value={primaryColor.startsWith("#") ? primaryColor : "#8b5cf6"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPrimaryColor(val);
                        sendThemeUpdate({ primary: val });
                      }}
                      className="size-5 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRIMARY_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.value}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(swatch.value);
                        sendThemeUpdate({ primary: swatch.value });
                      }}
                      className={`size-6 rounded-full border transition-all ${
                        primaryColor === swatch.value
                          ? "ring-2 ring-white scale-110 border-white"
                          : "border-white/20 hover:scale-105"
                      }`}
                      style={{ background: swatch.value }}
                      title={swatch.label}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Background Color */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white/80">Background Color</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[0.6875rem] text-white/50">{bgColor}</span>
                    <input
                      type="color"
                      value={bgColor.startsWith("#") ? bgColor : "#07070d"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBgColor(val);
                        sendThemeUpdate({ bg: val });
                      }}
                      className="size-5 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(theme === "dark" ? BG_SWATCHES_DARK : BG_SWATCHES_LIGHT).map((swatch) => (
                    <button
                      key={swatch.value}
                      type="button"
                      onClick={() => {
                        setBgColor(swatch.value);
                        sendThemeUpdate({ bg: swatch.value });
                      }}
                      className={`size-6 rounded-full border transition-all ${
                        bgColor === swatch.value
                          ? "ring-2 ring-white scale-110 border-white"
                          : "border-white/20 hover:scale-105"
                      }`}
                      style={{ background: swatch.value }}
                      title={swatch.label}
                    />
                  ))}
                </div>
              </div>

              {/* 3. Accent Color */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white/80">Accent Color</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[0.6875rem] text-white/50">{accentColor}</span>
                    <input
                      type="color"
                      value={accentColor.startsWith("#") ? accentColor : "#22d3ee"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAccentColor(val);
                        sendThemeUpdate({ accent: val });
                      }}
                      className="size-5 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ACCENT_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.value}
                      type="button"
                      onClick={() => {
                        setAccentColor(swatch.value);
                        sendThemeUpdate({ accent: swatch.value });
                      }}
                      className={`size-6 rounded-full border transition-all ${
                        accentColor === swatch.value
                          ? "ring-2 ring-white scale-110 border-white"
                          : "border-white/20 hover:scale-105"
                      }`}
                      style={{ background: swatch.value }}
                      title={swatch.label}
                    />
                  ))}
                </div>
              </div>

              {/* 4. Font Selector */}
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-white/80">Font Family</span>
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFontFamily(val);
                    sendThemeUpdate({ font: val });
                  }}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 px-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.value} className="bg-[#11111e] text-white">
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Border Radius Selector */}
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-white/80">Border Radius</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {RADIUS_OPTIONS.map((r) => {
                    const isActive = borderRadius === r.value;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setBorderRadius(r.value);
                          sendThemeUpdate({ radius: r.value });
                        }}
                        className={`rounded-lg border py-1.5 px-2 text-[0.6875rem] font-medium transition-all ${
                          isActive
                            ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold"
                            : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05]"
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Dark / Light Switch */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-semibold text-white/80">Color Mode</span>
                <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (theme !== "dark") handleToggleTheme();
                    }}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[0.6875rem] font-medium transition-all ${
                      theme === "dark" ? "bg-purple-600 text-white font-bold" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Moon className="size-3" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (theme !== "light") handleToggleTheme();
                    }}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[0.6875rem] font-medium transition-all ${
                      theme === "light" ? "bg-amber-500 text-white font-bold" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Sun className="size-3" />
                    <span>Light</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Reset, Copy, Export */}
            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetTheme}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-semibold text-white/70 hover:bg-white/[0.08] hover:text-white transition-all"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset Theme</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(exportJSON, "json-config")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all"
                >
                  {copiedKey === "json-config" ? (
                    <>
                      <Check className="size-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy Config</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 py-2.5 text-xs font-bold text-white hover:brightness-110 transition-all shadow-lg"
              >
                <Code className="size-3.5" />
                <span>Export CSS / Tokens</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Export CSS / Config Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0d0d18] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Code className="size-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Export Theme Configuration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Format Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExportFormat("css")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  exportFormat === "css"
                    ? "bg-purple-600 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                CSS Variables (:root)
              </button>
              <button
                type="button"
                onClick={() => setExportFormat("tailwind")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  exportFormat === "tailwind"
                    ? "bg-purple-600 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Tailwind CSS v4 (@theme)
              </button>
              <button
                type="button"
                onClick={() => setExportFormat("json")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  exportFormat === "json"
                    ? "bg-purple-600 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                JSON Config
              </button>
            </div>

            {/* Code Output Block */}
            <div className="relative rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-cyan-300 overflow-x-auto max-h-64">
              <pre>
                {exportFormat === "css"
                  ? exportCSS
                  : exportFormat === "tailwind"
                  ? exportTailwind
                  : exportJSON}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="rounded-lg px-4 py-2 text-xs font-medium text-white/60 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const text =
                    exportFormat === "css"
                      ? exportCSS
                      : exportFormat === "tailwind"
                      ? exportTailwind
                      : exportJSON;
                  copyToClipboard(text, "export-modal");
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2 text-xs font-bold text-white hover:brightness-110 transition-all shadow-md"
              >
                {copiedKey === "export-modal" ? (
                  <>
                    <Check className="size-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewFrame;
