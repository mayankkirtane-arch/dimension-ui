"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";

import { ParticleCanvas } from "@/components/particle-canvas";
import { VIEWPORT_ONCE } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { useSmoothScroll } from "@/lib/hooks";
import { COMPONENT_COUNT, CTA_HREF, GALLERY_HREF, HERO } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Motion presets                                                    */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085, delayChildren: 0.06 } },
};

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */

export function Hero() {
  const smoothScroll = useSmoothScroll();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-28 pb-14 sm:pt-32 lg:pt-36 lg:pb-20"
    >
      {/* Local hero glow, layered above the global backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[6rem] left-1/2 -z-10 h-[34rem] w-[62rem] max-w-[130vw] -translate-x-1/2 opacity-70 blur-[130px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.34) 0%, rgba(6,182,212,0.16) 42%, transparent 72%)",
        }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10 lg:px-8">
        {/* ================= Left: copy ================= */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          {/* ---- Badge ---- */}
          <motion.div variants={rise}>
            <PulsingBadge>{HERO.badge}</PulsingBadge>
          </motion.div>

          {/* ---- Headline ---- */}
          {/* The gradient phrase is highlighted with an animated sweep that
              spans the whole line box, so the accent tracks the text no matter
              how the headline wraps. The underline is therefore drawn as a
              single block-level bar beneath the first line rather than as an
              inline decoration that would break across wrapped fragments. */}
          <motion.h1
            variants={rise}
            className="relative mt-6 text-[2.4rem] leading-[1.05] font-semibold text-balance sm:text-[3.15rem] lg:text-[3.5rem] xl:text-[3.9rem]"
          >
            {HERO.headline.lead}
            <span className="text-gradient-neon">
              {HERO.headline.gradient}
            </span>
            {HERO.headline.trail}
          </motion.h1>

          {/* Animated accent bar — sits under the headline block and sweeps
              left-to-right on mount. Block-level so wrapping can't break it. */}
          <motion.span
            aria-hidden="true"
            variants={rise}
            className="mt-5 hidden h-[3px] w-[min(19rem,70%)] overflow-hidden rounded-full bg-white/[0.07] lg:block"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 1.15, ease: EASE }}
              className="block h-full w-full origin-left rounded-full bg-gradient-to-r from-neon-purple-bright via-neon-purple to-electric-cyan shadow-[0_0_18px_2px_rgba(139,92,246,0.65)]"
            />
          </motion.span>

          {/* ---- Subheadline ---- */}
          <motion.p
            variants={rise}
            className="mt-5 max-w-[56ch] text-[0.9375rem] leading-relaxed text-pretty text-ink-dim sm:text-base"
          >
            {HERO.subheadline}
          </motion.p>

          {/* ---- Dual CTAs ---- */}
          <motion.div
            variants={rise}
            className="mt-7 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <PrimaryCta onClick={(e) => smoothScroll(e, GALLERY_HREF)} />
            <SecondaryCta onClick={(e) => smoothScroll(e, GALLERY_HREF)} />
          </motion.div>

          {/* ---- Trust stats ---- */}
          <motion.ul
            variants={rise}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 lg:justify-start"
          >
            {HERO.stats.map((stat) => (
              <li key={stat.label} className="flex items-baseline gap-2">
                <span className="text-gradient-brand text-lg font-semibold tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[0.75rem] tracking-wide text-ink-faint uppercase">
                  {stat.label}
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ================= Right: 3D canvas ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
          className="relative z-10 -mx-5 sm:mx-0"
        >
          <HeroCanvasStage />
        </motion.div>
      </div>

      {/* ================= Category quick-pills ================= */}
      <CategoryPills />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pulsing badge                                                     */
/* ------------------------------------------------------------------ */

function PulsingBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-neon-purple/30 bg-neon-purple/[0.07] py-1.5 pr-4 pl-2 backdrop-blur-xl transition-colors duration-500 hover:border-neon-purple/55 hover:bg-neon-purple/[0.11]">
      {/* Travelling shimmer */}
      <span
        aria-hidden="true"
        className="shimmer-sweep absolute inset-0 animate-shimmer opacity-60"
      />

      {/* Pulsing dot */}
      <span className="relative flex size-5 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute size-5 animate-glow-pulse rounded-full bg-neon-purple/35 blur-[5px]"
        />
        <span
          aria-hidden="true"
          className="absolute size-2.5 rounded-full bg-neon-purple-bright"
        />
        <span
          aria-hidden="true"
          className="absolute size-2.5 animate-ping rounded-full bg-neon-purple-bright/70"
        />
      </span>

      <span className="relative z-10 inline-flex items-center gap-1.5 text-[0.75rem] font-medium tracking-[0.005em] text-ink sm:text-[0.8125rem]">
        <Sparkles className="size-3.5 text-neon-purple-bright" />
        {children}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  CTAs                                                              */
/* ------------------------------------------------------------------ */

function PrimaryCta({ onClick }: { onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a
      href={GALLERY_HREF}
      onClick={onClick}
      className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(100deg,#7c3aed_0%,#8b5cf6_42%,#06b6d4_100%)] transition-[filter] duration-500 group-hover:brightness-[1.16]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-white/28 via-white/0 to-black/25"
      />
      <span
        aria-hidden="true"
        className="shimmer-sweep absolute inset-0 opacity-0 group-hover:animate-shimmer group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="absolute -inset-px rounded-xl opacity-70 shadow-[0_0_30px_1px_rgba(139,92,246,0.55),0_0_70px_8px_rgba(6,182,212,0.2)] transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/28"
      />

      <span className="relative z-10 inline-flex items-center gap-2.5">
        {HERO.primaryCta}
        <ArrowRight className="size-4 transition-transform duration-400 group-hover:translate-x-1" />
      </span>
    </a>
  );
}

function SecondaryCta({ onClick }: { onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a
      href={GALLERY_HREF}
      onClick={onClick}
      className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl border border-hairline bg-white/[0.035] px-6 py-3.5 text-[0.9375rem] font-medium text-ink backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-hairline-strong hover:bg-white/[0.075] active:translate-y-0 active:scale-[0.985]"
    >
      {/* Play icon in a mini glass chip */}
      <span className="relative inline-flex size-6 items-center justify-center rounded-full border border-white/15 bg-white/[0.08]">
        <Play className="size-2.5 translate-x-[0.5px] fill-current text-electric-cyan-bright" />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full opacity-0 shadow-[0_0_14px_2px_rgba(34,211,238,0.6)] transition-opacity duration-500 group-hover:opacity-100"
        />
      </span>
      {HERO.secondaryCta}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Canvas stage — the glass frame around the particle field          */
/* ------------------------------------------------------------------ */

function HeroCanvasStage() {
  return (
    <div className="relative aspect-square w-full max-w-[34rem] sm:aspect-[4/3] lg:aspect-square lg:max-w-none">
      {/* Outer ambient bloom */}
      <div
        aria-hidden="true"
        className="glow-purple absolute inset-[-8%] rounded-full opacity-60 blur-3xl"
      />

      {/* Glass frame */}
      <div className="glass relative size-full overflow-hidden rounded-[1.75rem] shadow-[0_30px_90px_-30px_rgba(7,7,13,1),0_0_0_1px_rgba(255,255,255,0.05)]">
        {/* Dot grid behind the particles */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-dot-grid-fine opacity-45"
        />

        {/* Corner accent glows */}
        <div
          aria-hidden="true"
          className="glow-cyan pointer-events-none absolute -top-16 -right-16 size-56 rounded-full blur-2xl"
        />
        <div
          aria-hidden="true"
          className="glow-purple pointer-events-none absolute -bottom-20 -left-16 size-64 rounded-full blur-2xl"
        />

        {/* The interactive field */}
        <ParticleCanvas className="absolute inset-0" />

        {/* Inner hairline ring */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/[0.09]"
        />

        {/* Top sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* HUD overlays */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-obsidian/85 via-obsidian/25 to-transparent p-4 pt-14">
          <div className="flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[0.6875rem] tracking-wide text-ink-dim">
              60 FPS · live
            </span>
          </div>
          <span className="font-mono text-[0.6875rem] tracking-wide text-ink-faint">
            move cursor to interact
          </span>
        </div>

        {/* Corner brackets */}
        <CornerBracket className="top-3 left-3 border-t border-l" />
        <CornerBracket className="top-3 right-3 border-t border-r" />
        <CornerBracket className="bottom-3 left-3 border-b border-l" />
        <CornerBracket className="right-3 bottom-3 border-b border-r" />
      </div>

      {/* Floating glass chips */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="glass absolute top-[12%] -left-3 hidden items-center gap-2 rounded-xl px-3 py-2 shadow-[0_12px_34px_-12px_rgba(7,7,13,0.95)] sm:flex lg:-left-6"
      >
        <span className="size-1.5 rounded-full bg-neon-purple-bright shadow-[0_0_8px_2px_rgba(167,139,250,0.7)]" />
        <span className="text-[0.6875rem] font-medium text-ink">
          <span className="font-mono">{COMPONENT_COUNT}</span> templates
        </span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="glass absolute -right-2 bottom-[20%] hidden items-center gap-2 rounded-xl px-3 py-2 shadow-[0_12px_34px_-12px_rgba(7,7,13,0.95)] sm:flex lg:-right-6"
      >
        <span className="size-1.5 rounded-full bg-electric-cyan-bright shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]" />
        <span className="text-[0.6875rem] font-medium text-ink">
          copy-paste ready
        </span>
      </motion.div>
    </div>
  );
}

function CornerBracket({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute size-4 border-white/18",
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Category quick-pills                                              */
/* ------------------------------------------------------------------ */

function CategoryPills() {
  const smoothScroll = useSmoothScroll();
  const items = CATEGORY_PILL_ITEMS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
      className="relative z-10 mx-auto mt-14 max-w-7xl px-5 sm:mt-16 sm:px-6 lg:px-8"
    >
      <p className="mb-5 text-center text-[0.6875rem] font-medium tracking-[0.2em] text-ink-faint uppercase">
        Built for your market
      </p>

      <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {items.map((pill, i) => (
          <motion.li
            key={pill.label}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ delay: 0.06 * i, duration: 0.5, ease: EASE }}
          >
            <CategoryPill
              {...pill}
              onClick={(e) => smoothScroll(e, pill.href)}
            />
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

type CategoryPillProps = {
  emoji: string;
  label: string;
  meta: string;
  href: string;
  accent: "purple" | "cyan";
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

function CategoryPill({
  emoji,
  label,
  meta,
  href,
  accent,
  onClick,
}: CategoryPillProps) {
  const isPurple = accent === "purple";

  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-hairline bg-surface/70 py-2 pr-4 pl-2 backdrop-blur-xl transition-all duration-400 hover:-translate-y-0.5 hover:border-hairline-strong",
        isPurple
          ? "hover:shadow-[0_0_26px_-4px_rgba(139,92,246,0.5)]"
          : "hover:shadow-[0_0_26px_-4px_rgba(6,182,212,0.5)]",
      )}
    >
      {/* Hover wash */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100",
          isPurple
            ? "bg-[radial-gradient(120%_100%_at_50%_120%,rgba(139,92,246,0.3),transparent_70%)]"
            : "bg-[radial-gradient(120%_100%_at_50%_120%,rgba(6,182,212,0.26),transparent_70%)]",
        )}
      />

      {/* Emoji chip */}
      <span
        className={cn(
          "relative z-10 inline-flex size-8 items-center justify-center rounded-full border text-[0.9375rem] transition-transform duration-400 group-hover:scale-110",
          isPurple
            ? "border-neon-purple/25 bg-neon-purple/[0.12]"
            : "border-electric-cyan/25 bg-electric-cyan/[0.12]",
        )}
      >
        {emoji}
      </span>

      <span className="relative z-10 flex flex-col items-start leading-tight">
        <span className="text-[0.8125rem] font-medium text-ink">{label}</span>
        <span className="text-[0.6875rem] tracking-wide text-ink-faint">
          {meta}
        </span>
      </span>
    </a>
  );
}

/* Pill items extended with anchors (kept local so lib/site stays copy-only). */
const CATEGORY_PILL_ITEMS = [
  { emoji: "🚀", label: "SaaS & AI", meta: "12 templates", accent: "purple" as const, href: "#saas" },
  { emoji: "🏪", label: "Local Business & Clinics", meta: "10 templates", accent: "cyan" as const, href: "#local-business" },
  { emoji: "🏢", label: "B2B & Enterprise", meta: "9 templates", accent: "purple" as const, href: "#b2b-agency" },
  { emoji: "🛒", label: "E-Commerce & Drops", meta: "11 templates", accent: "cyan" as const, href: "#ecommerce" },
];

export default Hero;
