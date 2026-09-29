"use client";

import React from "react";
import { BlockInstance, DesignTokens } from "@/lib/builder/types";
import { cn } from "@/lib/cn";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Cpu,
  Palette,
  Terminal,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
} from "lucide-react";

interface BlockRendererProps {
  block: BlockInstance;
  tokens: DesignTokens;
  isSelected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function BlockRenderer({
  block,
  tokens,
  isSelected,
  canMoveUp,
  canMoveDown,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: BlockRendererProps) {
  const radiusMap: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-3xl",
  };
  const roundedClass = radiusMap[tokens.borderRadius] || "rounded-xl";

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative transition-all duration-200 cursor-pointer",
        isSelected
          ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#07070d] shadow-[0_0_25px_rgba(6,182,212,0.15)] z-20"
          : "hover:ring-1 hover:ring-white/20"
      )}
    >
      {/* Floating Action Controls on Selection */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 p-1 rounded-lg bg-[#0e0e1a]/95 border border-white/20 shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5">
            {block.type}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={!canMoveUp}
            title="Move Up"
            className={cn(
              "p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors",
              !canMoveUp && "opacity-30 cursor-not-allowed"
            )}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={!canMoveDown}
            title="Move Down"
            className={cn(
              "p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors",
              !canMoveDown && "opacity-30 cursor-not-allowed"
            )}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            title="Duplicate Block"
            className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete Block"
            className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Render Block Content */}
      {renderBlock(block, tokens, roundedClass)}
    </div>
  );
}

function renderBlock(block: BlockInstance, tokens: DesignTokens, roundedClass: string) {
  switch (block.type) {
    case "hero":
      return renderHero(block.props, tokens, roundedClass);
    case "features":
      return renderFeatures(block.props, tokens, roundedClass);
    case "cta":
      return renderCta(block.props, tokens, roundedClass);
    case "footer":
      return renderFooter(block.props, tokens, roundedClass);
    default:
      return (
        <div className="py-12 text-center text-slate-500">
          Unknown block type: {block.type}
        </div>
      );
  }
}

function renderHero(props: any, tokens: DesignTokens, roundedClass: string) {
  const isLeft = props.align === "left";

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] blur-[100px] rounded-full pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle, ${tokens.primaryAccent} 0%, transparent 70%)`,
        }}
      />

      <div
        className={cn(
          "relative max-w-5xl mx-auto flex flex-col",
          isLeft ? "items-start text-left" : "items-center text-center"
        )}
      >
        {/* Badge */}
        {props.badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" style={{ color: tokens.secondaryAccent }} />
            <span className="text-xs font-medium text-slate-300 tracking-wide">
              {props.badge}
            </span>
          </div>
        )}

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mb-6 text-white">
          {props.headline}{" "}
          {props.highlightText && (
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${tokens.primaryAccent}, ${tokens.secondaryAccent})`,
              }}
            >
              {props.highlightText}
            </span>
          )}
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          {props.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {props.primaryCtaText && (
            <div
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 font-semibold text-white shadow-lg transition-transform",
                roundedClass
              )}
              style={{
                backgroundColor: tokens.primaryAccent,
                boxShadow: `0 10px 25px -5px ${tokens.primaryAccent}66`,
              }}
            >
              {props.primaryCtaText}
              <ArrowRight className="w-4 h-4" />
            </div>
          )}

          {props.secondaryCtaText && (
            <div
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 font-semibold text-slate-300 border border-white/10 bg-white/[0.03]",
                roundedClass
              )}
            >
              {props.secondaryCtaText}
            </div>
          )}
        </div>

        {/* Mockup Card */}
        {props.showMockup && (
          <div
            className={cn(
              "mt-14 w-full border border-white/10 bg-white/[0.02] p-4 sm:p-6 backdrop-blur-xl shadow-2xl",
              roundedClass
            )}
          >
            <div
              className={cn(
                "h-56 sm:h-80 border border-white/[0.08] bg-[#0c0d18] flex items-center justify-center relative overflow-hidden",
                roundedClass
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10" />
              <div className="relative text-center p-6">
                <div className="inline-block p-4 rounded-2xl bg-white/[0.04] border border-white/10 mb-4">
                  <Cpu className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Interactive Component Preview
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time preview powered by DimensionUI design tokens.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function renderFeatures(props: any, tokens: DesignTokens, roundedClass: string) {
  const colClass =
    props.columns === "2"
      ? "sm:grid-cols-2"
      : props.columns === "4"
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-3";

  const items = Array.isArray(props.features) ? props.features : [];

  const iconMap: Record<string, React.ReactNode> = {
    Zap: <Zap className="w-5 h-5 text-purple-400" />,
    Shield: <Shield className="w-5 h-5 text-cyan-400" />,
    Layers: <Layers className="w-5 h-5 text-purple-400" />,
    Cpu: <Cpu className="w-5 h-5 text-cyan-400" />,
    Palette: <Palette className="w-5 h-5 text-purple-400" />,
    Terminal: <Terminal className="w-5 h-5 text-cyan-400" />,
  };

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/[0.06]">
      <div className="text-center max-w-3xl mx-auto mb-14">
        {props.eyebrow && (
          <span
            className="text-xs font-bold tracking-widest uppercase mb-2 block"
            style={{ color: tokens.secondaryAccent }}
          >
            {props.eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
          {props.headline}
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          {props.description}
        </p>
      </div>

      <div className={cn("grid grid-cols-1 gap-5", colClass)}>
        {items.map((item: any, idx: number) => (
          <div
            key={idx}
            className={cn(
              "border border-white/[0.08] p-6 backdrop-blur-sm transition-all duration-300",
              roundedClass
            )}
            style={{ backgroundColor: tokens.bgSurface }}
          >
            <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
              {iconMap[item.icon] || <Zap className="w-5 h-5 text-cyan-400" />}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderCta(props: any, tokens: DesignTokens, roundedClass: string) {
  const isSplit = props.layout === "split";

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div
        className={cn(
          "relative overflow-hidden border border-white/10 p-8 sm:p-12 text-center",
          isSplit && "lg:text-left lg:flex lg:items-center lg:justify-between",
          roundedClass
        )}
        style={{
          backgroundColor: tokens.bgSurface,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-80 h-80 blur-[90px] pointer-events-none rounded-full opacity-30"
          style={{ backgroundColor: tokens.primaryAccent }}
        />

        <div className={cn("relative z-10", isSplit ? "max-w-xl" : "max-w-2xl mx-auto")}>
          {props.eyebrow && (
            <span
              className="text-xs font-bold tracking-widest uppercase mb-2 block"
              style={{ color: tokens.secondaryAccent }}
            >
              {props.eyebrow}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            {props.headline}
          </h2>
          <p className="text-sm text-slate-400 mb-5 leading-relaxed">
            {props.description}
          </p>
          {props.secondaryText && (
            <p className="text-xs text-slate-500 font-medium">
              {props.secondaryText}
            </p>
          )}
        </div>

        <div className={cn("mt-6 relative z-10 flex-shrink-0", isSplit && "lg:mt-0")}>
          <div
            className={cn(
              "inline-flex items-center gap-2 px-7 py-3.5 font-bold text-white shadow-xl",
              roundedClass
            )}
            style={{
              backgroundColor: tokens.primaryAccent,
              boxShadow: `0 10px 25px -5px ${tokens.primaryAccent}66`,
            }}
          >
            {props.buttonText}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
}

function renderFooter(props: any, tokens: DesignTokens, roundedClass: string) {
  const columns = Array.isArray(props.columns) ? props.columns : [];

  return (
    <footer className="border-t border-white/[0.06] bg-[#07070d] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 font-bold text-lg text-white mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{props.brandName}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            {props.tagline}
          </p>
        </div>

        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {columns.map((col: any, idx: number) => (
            <div key={idx}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {(col.links || []).map((link: any, lIdx: number) => (
                  <li key={lIdx}>
                    <span className="hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>{props.copyrightText}</p>
        <p>Powered by DimensionUI</p>
      </div>
    </footer>
  );
}
