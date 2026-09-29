"use client";

import React, { useState } from "react";
import {
  Figma,
  ExternalLink,
  CheckCircle2,
  Code2,
  Layers,
  Sparkles,
  ShieldCheck,
  Palette,
  FileCode,
  Layout,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import type { TemplateFigma, FigmaState } from "@/lib/site";
import { isValidFigmaUrl } from "@/lib/site";

interface TemplateFigmaProps {
  figma: TemplateFigma;
  templateName: string;
  category?: string;
}

export function TemplateFigmaSection({
  figma,
  templateName,
  category,
}: TemplateFigmaProps) {
  const [copied, setCopied] = useState(false);
  const state: FigmaState = figma.state;
  const isIncluded = state === "Figma Included";
  const isAvailable = state === "Figma Available";
  const isNone = state === "No Figma File";

  const hasValidUrl = isValidFigmaUrl(figma.figmaUrl);

  const handleCopyUrl = () => {
    if (!figma.figmaUrl) return;
    navigator.clipboard.writeText(figma.figmaUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="figma" className="mt-16 scroll-mt-24">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-xl border ${
                isIncluded
                  ? "bg-violet-500/15 border-violet-500/30 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                  : isAvailable
                  ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                  : "bg-white/[0.04] border-white/10 text-white/50"
              }`}
            >
              <Figma className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Figma Design Resources</h2>
                {isIncluded && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/40 bg-violet-500/15 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-violet-300">
                    <Sparkles className="size-3 text-violet-400" />
                    Verified Included
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50">
                Design system, component artboards, and vector assets status
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isIncluded ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/20 px-3.5 py-1 text-xs font-semibold text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                <CheckCircle2 className="size-3.5 text-violet-400" />
                Figma Included
              </span>
            ) : isAvailable ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/20 px-3.5 py-1 text-xs font-semibold text-cyan-300">
                <Layers className="size-3.5 text-cyan-400" />
                Figma Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono font-medium text-white/50">
                <Code2 className="size-3.5 text-white/40" />
                No Figma File (Code-First)
              </span>
            )}
          </div>
        </div>

        {/* Content Body Based on State */}
        {isIncluded && (
          <div className="space-y-6">
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Full Figma Source Included with {templateName}</span>
                    <span className="rounded bg-violet-400/20 text-violet-300 px-1.5 py-0.5 text-[0.625rem] font-mono uppercase tracking-wider">
                      Official
                    </span>
                  </h3>
                  <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                    This template includes a companion Figma file containing production-matched
                    artboards, auto-layout frames, color & typography tokens, and responsive mobile &
                    desktop viewpoints.
                  </p>
                </div>

                {hasValidUrl && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors"
                      title="Copy Figma URL"
                    >
                      {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                      <span>{copied ? "Copied" : "Copy URL"}</span>
                    </button>
                    <a
                      href={figma.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-violet-600/25 transition-all"
                    >
                      <span>Open in Figma</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Optional Preview Image */}
              {figma.previewImage && (
                <div className="mt-5 rounded-lg border border-white/10 overflow-hidden bg-black/40 relative aspect-video max-h-72">
                  <img
                    src={figma.previewImage}
                    alt={`${templateName} Figma Design Preview`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 rounded-md bg-black/70 backdrop-blur-md px-2 py-1 text-[0.6875rem] font-mono text-white/80 border border-white/10">
                    Figma Artboard Preview
                  </div>
                </div>
              )}

              {/* File details breakdown if provided */}
              {figma.fileDetails && (
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-violet-500/20">
                  {figma.fileDetails.componentsCount !== undefined && (
                    <div className="rounded-lg bg-black/20 p-2.5">
                      <span className="text-[0.65rem] text-white/40 uppercase tracking-wider block">Components</span>
                      <span className="text-sm font-bold font-mono text-violet-300">
                        {figma.fileDetails.componentsCount}+ Assets
                      </span>
                    </div>
                  )}
                  {figma.fileDetails.pagesCount !== undefined && (
                    <div className="rounded-lg bg-black/20 p-2.5">
                      <span className="text-[0.65rem] text-white/40 uppercase tracking-wider block">Artboards</span>
                      <span className="text-sm font-bold font-mono text-violet-300">
                        {figma.fileDetails.pagesCount} Viewports
                      </span>
                    </div>
                  )}
                  <div className="rounded-lg bg-black/20 p-2.5">
                    <span className="text-[0.65rem] text-white/40 uppercase tracking-wider block">Auto-Layout</span>
                    <span className="text-sm font-bold text-white">
                      {figma.fileDetails.hasAutoLayout ? "100% Configured" : "Available"}
                    </span>
                  </div>
                  <div className="rounded-lg bg-black/20 p-2.5">
                    <span className="text-[0.65rem] text-white/40 uppercase tracking-wider block">Design Tokens</span>
                    <span className="text-sm font-bold text-white">
                      {figma.fileDetails.hasDesignTokens ? "Tailwind v4 Synced" : "Standard"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[0.6875rem] text-white/40">
              <ShieldCheck className="size-3.5 text-violet-400" />
              <span>Verified direct Figma link. No third-party redirect or re-hosting.</span>
            </div>
          </div>
        )}

        {isAvailable && (
          <div className="space-y-6">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Figma Resource Available for {templateName}</span>
                    <span className="rounded bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 text-[0.625rem] font-mono uppercase tracking-wider">
                      Community
                    </span>
                  </h3>
                  <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                    A community or external companion design file is available for this template.
                    You can duplicate it into your own Figma workspace for presentation or wireframing.
                  </p>
                </div>

                {hasValidUrl && (
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={figma.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-cyan-600/25 transition-all"
                    >
                      <span>View in Figma</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {figma.previewImage && (
                <div className="mt-5 rounded-lg border border-white/10 overflow-hidden bg-black/40 relative aspect-video max-h-72">
                  <img
                    src={figma.previewImage}
                    alt={`${templateName} Figma Preview`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {isNone && (
          <div className="space-y-5">
            <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/50 border border-white/10 mt-0.5">
                  <Code2 className="size-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">
                    Code-First Architecture — No Figma File Bundled
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed max-w-3xl">
                    {figma.notes ||
                      `${templateName} was engineered directly in production code with Next.js 15, React 19, and Tailwind CSS v4. No standalone Figma design file is currently published for this template.`}
                  </p>
                </div>
              </div>

              {/* Technical rationale grid */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 border-t border-white/10">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3.5">
                  <div className="flex items-center gap-2 text-white/80 font-semibold text-xs mb-1.5">
                    <FileCode className="size-3.5 text-purple-400" />
                    <span>Zero Translation Lag</span>
                  </div>
                  <p className="text-[0.75rem] text-white/50 leading-relaxed">
                    Production code eliminates handoff drift. Every animation, layout breakpoint, and
                    component state is already tested and operational.
                  </p>
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3.5">
                  <div className="flex items-center gap-2 text-white/80 font-semibold text-xs mb-1.5">
                    <Palette className="size-3.5 text-cyan-400" />
                    <span>Native Tailwind v4 Tokens</span>
                  </div>
                  <p className="text-[0.75rem] text-white/50 leading-relaxed">
                    Colors, fonts, shadows, and spacing are defined cleanly via CSS-first{" "}
                    <code className="text-white/70 font-mono text-[0.6875rem]">@theme</code> in{" "}
                    <code className="text-white/70 font-mono text-[0.6875rem]">globals.css</code>.
                  </p>
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3.5">
                  <div className="flex items-center gap-2 text-white/80 font-semibold text-xs mb-1.5">
                    <Layout className="size-3.5 text-emerald-400" />
                    <span>Live Interactive Sandbox</span>
                  </div>
                  <p className="text-[0.75rem] text-white/50 leading-relaxed">
                    Test full responsiveness, theme colors, and multi-device viewports instantly in the
                    built-in browser preview frame.
                  </p>
                </div>
              </div>
            </div>

            {/* Honest verification guarantee */}
            <div className="flex items-center justify-between flex-wrap gap-3 rounded-lg border border-white/5 bg-white/[0.01] px-4 py-3 text-xs text-white/40">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-3.5 text-amber-400/70 shrink-0" />
                <span>
                  Strict Truth-in-Advertising: DimensionUI only displays &quot;Figma Included&quot; when a verified,
                  legitimate Figma source file is present.
                </span>
              </div>
              <span className="text-[0.6875rem] font-mono text-white/30">Standard v1.4</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TemplateFigmaSection;
