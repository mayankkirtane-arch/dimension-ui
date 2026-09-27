"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import {
  AccentPill,
  EASE,
  Eyebrow,
  Reveal,
  SectionShell,
  StatRow,
  useReveal,
  useSectionArrived,
  VIEWPORT_ONCE,
} from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { PLAYBOOK_SECTIONS, type PlaybookSection } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Feature checklist row                                             */
/*                                                                    */
/*  Extracted so it can own a hook — `useReveal` cannot be called     */
/*  inside the parent's `.map()` without breaking the rules of hooks. */
/* ------------------------------------------------------------------ */

function FeatureRow({
  feature,
  index,
  isPurple,
}: {
  feature: string;
  index: number;
  isPurple: boolean;
}) {
  const reveal = useReveal({
    from: { opacity: 0, x: -10 },
    to: { opacity: 1, x: 0 },
    duration: 0.5,
    delay: index * 0.06,
  });

  return (
    <motion.li {...reveal} suppressHydrationWarning className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border",
          isPurple
            ? "border-neon-purple/35 bg-neon-purple/[0.14] text-neon-purple-bright"
            : "border-electric-cyan/35 bg-electric-cyan/[0.14] text-electric-cyan-bright",
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
      <span className="text-[0.875rem] leading-relaxed text-ink-dim">{feature}</span>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/*  Single playbook                                                   */
/* ------------------------------------------------------------------ */

function Playbook({ data, index }: { data: PlaybookSection; index: number }) {
  const isPurple = data.accent === "purple";
  // Alternate the visual side on desktop so the page does not read as a
  // monotonous left-aligned stack.
  const flip = index % 2 === 1;
  return (
    <SectionShell id={data.id} divider={false}>
      <div
        className={cn(
          "grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14",
        )}
      >
        {/* ---------- Copy column ---------- */}
        <Reveal className={cn(flip && "lg:order-2")}>
          <Eyebrow accent={data.accent}>{data.eyebrow}</Eyebrow>

          <h2 className="mt-4 flex items-center gap-3 text-[1.7rem] leading-[1.15] font-semibold tracking-[-0.03em] text-ink sm:text-[2.1rem]">
            <span
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-xl border text-xl",
                isPurple
                  ? "border-neon-purple/25 bg-neon-purple/[0.1]"
                  : "border-electric-cyan/25 bg-electric-cyan/[0.1]",
              )}
              aria-hidden="true"
            >
              {data.emoji}
            </span>
            {data.title}
          </h2>

          <p className="mt-4 max-w-[58ch] text-[0.9375rem] leading-relaxed text-pretty text-ink-dim">
            {data.description}
          </p>

          {/* Feature checklist */}
          <ul className="mt-6 flex flex-col gap-3">
            {data.features.map((feature, i) => (
              <FeatureRow
                key={feature}
                feature={feature}
                index={i}
                isPurple={isPurple}
              />
            ))}
          </ul>

          <StatRow stats={data.stats} accent={data.accent} className="mt-7 max-w-md" />
        </Reveal>

        {/* ---------- Visual column ---------- */}
        <Reveal
          delay={0.12}
          distance={26}
          className={cn("relative", flip && "lg:order-1")}
        >
          <PlaybookVisual accent={data.accent} emoji={data.emoji} />
        </Reveal>
      </div>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated parts of the decorative visual                           */
/*                                                                    */
/*  Each is its own component so it can own a `useReveal` hook — one  */
/*  hook call per component, never inside a `.map()`.                 */
/* ------------------------------------------------------------------ */

function WireframeRow({
  index,
  width,
  height,
  isPurple,
}: {
  index: number;
  width: string;
  height: string;
  isPurple: boolean;
}) {
  const reveal = useReveal({
    from: { scaleX: 0, opacity: 0 },
    to: { scaleX: 1, opacity: 1 },
    duration: 0.8,
    delay: 0.25 + index * 0.1,
  });

  return (
    <motion.div
      {...reveal}
      style={{ width }}
      className={cn(
        "origin-left rounded-full",
        height,
        index === 0
          ? isPurple
            ? "bg-gradient-to-r from-neon-purple/70 to-electric-cyan/40"
            : "bg-gradient-to-r from-electric-cyan/70 to-neon-purple/40"
          : "bg-white/[0.09]",
      )}
    />
  );
}

function SplitPanel({ index, isPurple }: { index: number; isPurple: boolean }) {
  const reveal = useReveal({
    from: { opacity: 0, y: 14 },
    to: { opacity: 1, y: 0 },
    duration: 0.7,
    delay: 0.5 + index * 0.12,
  });

  return (
    <motion.div
      {...reveal}
      className={cn(
        "relative overflow-hidden rounded-xl border p-3.5",
        index === 0
          ? isPurple
            ? "border-neon-purple/20 bg-neon-purple/[0.07]"
            : "border-electric-cyan/20 bg-electric-cyan/[0.07]"
          : "border-hairline bg-white/[0.03]",
      )}
    >
      <div className="flex flex-col gap-2">
        <span
          className={cn(
            "h-2 w-8 rounded-full",
            index === 0
              ? isPurple
                ? "bg-neon-purple/60"
                : "bg-electric-cyan/60"
              : "bg-white/15",
          )}
        />
        <span className="h-1.5 w-full rounded-full bg-white/[0.08]" />
        <span className="h-1.5 w-3/5 rounded-full bg-white/[0.06]" />
      </div>
    </motion.div>
  );
}

function ChartBar({
  index,
  height,
  isPurple,
}: {
  index: number;
  height: number;
  isPurple: boolean;
}) {
  const reveal = useReveal({
    from: { height: 0 },
    to: { height: `${height}%` },
    duration: 0.85,
    delay: 0.6 + index * 0.07,
  });

  return (
    <motion.span
      {...reveal}
      className={cn(
        "flex-1 rounded-t-md",
        // The tallest bar carries the accent — it reads as the headline
        // metric rather than one bar among seven.
        index === 5
          ? isPurple
            ? "bg-gradient-to-t from-neon-purple/30 to-neon-purple"
            : "bg-gradient-to-t from-electric-cyan/30 to-electric-cyan"
          : "bg-white/[0.09]",
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Decorative visual                                                 */
/*                                                                    */
/*  A glass panel with an animated wireframe "product surface" — pure  */
/*  CSS/SVG, so these sections cost nothing at runtime beyond layout.  */
/* ------------------------------------------------------------------ */

function PlaybookVisual({
  accent,
  emoji,
}: {
  accent: "purple" | "cyan";
  emoji: string;
}) {
  const isPurple = accent === "purple";

  return (
    <div className="relative">
      {/* Ambient bloom */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-[-6%] rounded-[2rem] opacity-55 blur-3xl",
          isPurple ? "glow-purple" : "glow-cyan",
        )}
      />

      <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-[0_30px_80px_-32px_rgba(7,7,13,1)]">
        {/* Dot grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-dot-grid-fine opacity-40"
        />

        {/* Emoji watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -bottom-6 text-[7rem] leading-none opacity-[0.06] select-none"
        >
          {emoji}
        </span>

        {/* Mock UI stack */}
        <div className="relative flex flex-col gap-3">
          {/* Fake toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-white/15" />
              <span className="size-2 rounded-full bg-white/10" />
              <span className="size-2 rounded-full bg-white/10" />
            </div>
            <AccentPill accent={accent}>live preview</AccentPill>
          </div>

          {/* Wireframe rows */}
          <div className="mt-1 flex flex-col gap-2.5">
            {[
              { w: "72%", h: "h-3" },
              { w: "94%", h: "h-2" },
              { w: "58%", h: "h-2" },
            ].map((row, i) => (
              <WireframeRow
                key={i}
                index={i}
                width={row.w}
                height={row.h}
                isPurple={isPurple}
              />
            ))}
          </div>

          {/* Split panels */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <SplitPanel key={i} index={i} isPurple={isPurple} />
            ))}
          </div>

          {/* Animated bar chart */}
          <div className="mt-2 flex h-20 items-end gap-2">
            {[38, 62, 46, 78, 55, 88, 70].map((h, i) => (
              <ChartBar key={i} index={i} height={h} isPurple={isPurple} />
            ))}
          </div>
        </div>

        {/* Inner ring + top sheen */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.08]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported section                                                  */
/* ------------------------------------------------------------------ */

export function PlaybookSections() {
  return (
    <>
      {PLAYBOOK_SECTIONS.map((data, i) => (
        <Playbook key={data.id} data={data} index={i} />
      ))}
    </>
  );
}

export default PlaybookSections;
