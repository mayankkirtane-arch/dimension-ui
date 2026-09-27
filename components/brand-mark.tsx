"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

export type BrandMarkProps = {
  size?: number;
  className?: string;
  /** Disable the idle float/pulse (e.g. inside the mobile sheet) */
  static?: boolean;
};

/**
 * The DimensionUI logo mark — a layered isometric cube built from SVG paths,
 * with a neon core, an orbiting ring and a soft purple halo.
 *
 * Everything scales from `size`, so it stays crisp at any dimension.
 */
export function BrandMark({ size = 34, className, static: isStatic }: BrandMarkProps) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Halo */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-[-45%] rounded-full blur-md",
          !isStatic && "animate-glow-pulse",
        )}
        style={{
          background:
            "radial-gradient(circle at 40% 35%, rgba(139,92,246,0.85) 0%, rgba(139,92,246,0.22) 42%, transparent 72%)",
        }}
      />

      {/* Mark */}
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        fill="none"
        aria-hidden="true"
        className="relative z-[1]"
      >
        <defs>
          <linearGradient id="dim-top" x1="6" y1="4" x2="34" y2="20">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="dim-left" x1="6" y1="12" x2="20" y2="38">
            <stop offset="0%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="dim-right" x1="22" y1="12" x2="36" y2="38">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
          <linearGradient id="dim-core" x1="14" y1="14" x2="26" y2="28">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </linearGradient>
        </defs>

        {/* Top face */}
        <path
          d="M20 5.5 L33.5 13 L20 20.5 L6.5 13 Z"
          fill="url(#dim-top)"
          fillOpacity="0.95"
        />
        {/* Left face */}
        <path d="M6.5 13 L20 20.5 L20 34.5 L6.5 27 Z" fill="url(#dim-left)" />
        {/* Right face */}
        <path
          d="M33.5 13 L33.5 27 L20 34.5 L20 20.5 Z"
          fill="url(#dim-right)"
          fillOpacity="0.92"
        />

        {/* Edge highlights */}
        <path
          d="M20 5.5 L33.5 13 L33.5 27 L20 34.5 L6.5 27 L6.5 13 Z"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        <path
          d="M20 20.5 L20 34.5"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.9"
        />
        <path
          d="M6.5 13 L20 20.5 L33.5 13"
          stroke="rgba(255,255,255,0.42)"
          strokeWidth="0.9"
        />

        {/* Glowing core */}
        <circle cx="20" cy="20.5" r="3.1" fill="url(#dim-core)" />
      </svg>
    </span>
  );
}

export type BrandWordmarkProps = {
  className?: string;
  markSize?: number;
};

/** Mark + "Dimension" wordmark with "UI" in the brand gradient. */
export function BrandWordmark({ className, markSize = 34 }: BrandWordmarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark size={markSize} />
      <span className="text-[1.0625rem] leading-none font-semibold tracking-[-0.02em] text-ink">
        Dimension
        <span className="text-gradient-brand">UI</span>
      </span>
    </span>
  );
}

export type AnimatedLogoProps = BrandWordmarkProps;

/** Wordmark with a subtle idle float — used in the navbar. */
export function AnimatedLogo(props: AnimatedLogoProps) {
  return (
    <motion.span
      className="inline-flex"
      animate={{ y: [0, -1.5, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <BrandWordmark {...props} />
    </motion.span>
  );
}
