"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, RefreshCw, ShieldCheck, Sparkles, Zap } from "lucide-react";

import {
  EASE,
  Eyebrow,
  Reveal,
  SectionShell,
  SectionHeader,
  useReveal,
} from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { useSmoothScroll } from "@/lib/hooks";
import { PRICING } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Assurance strip                                                   */
/* ------------------------------------------------------------------ */

const ASSURANCES = [
  { icon: ShieldCheck, label: "Commercial licence" },
  { icon: RefreshCw, label: "Lifetime updates" },
  { icon: Zap, label: "Instant download" },
] as const;

/* ------------------------------------------------------------------ */
/*  Feature row                                                       */
/*                                                                    */
/*  Extracted so it can own a hook — `useReveal` cannot be called     */
/*  inside the parent's `.map()` without breaking the rules of hooks. */
/* ------------------------------------------------------------------ */

function PriceFeatureRow({
  label,
  emphasis,
  index,
}: {
  label: string;
  emphasis: boolean;
  index: number;
}) {
  const reveal = useReveal({
    from: { opacity: 0, x: -8 },
    to: { opacity: 1, x: 0 },
    duration: 0.45,
    delay: index * 0.05,
  });

  return (
    <motion.li {...reveal} className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border",
          emphasis
            ? "border-neon-purple/40 bg-neon-purple/[0.16] text-neon-purple-bright"
            : "border-white/12 bg-white/[0.04] text-ink-faint",
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
      <span
        className={cn(
          "text-[0.875rem] leading-relaxed",
          emphasis ? "text-ink" : "text-ink-dim",
        )}
      >
        {label}
      </span>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing                                                           */
/* ------------------------------------------------------------------ */

export function PricingSection() {
  const smoothScroll = useSmoothScroll();

  return (
    <SectionShell id="pricing">
      {/* Section-level ambient bloom behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[30rem] w-[46rem] max-w-[120vw] -translate-x-1/2 opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.3) 0%, rgba(6,182,212,0.14) 45%, transparent 72%)",
        }}
      />

      <SectionHeader
        eyebrow={PRICING.eyebrow}
        title={PRICING.title}
        description={PRICING.description}
        centered
      />

      <Reveal delay={0.12} distance={28} className="mt-10">
        <div className="group relative mx-auto max-w-xl">
          {/* Glow behind the card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-[1.75rem] bg-gradient-to-b from-neon-purple/45 via-neon-purple/10 to-electric-cyan/35 opacity-60 blur-[2px] transition-opacity duration-700 group-hover:opacity-90"
          />

          <div className="relative overflow-hidden rounded-[1.75rem] border border-hairline bg-surface/85 backdrop-blur-xl">
            {/* Top gradient hairline */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-neon-purple-bright to-transparent"
            />
            {/* Corner glow */}
            <span
              aria-hidden="true"
              className="glow-purple pointer-events-none absolute -top-24 -right-16 size-64 rounded-full opacity-70 blur-3xl"
            />

            <div className="relative p-7 sm:p-9">
              {/* Badge */}
              <div className="flex items-center justify-between gap-4">
                <Eyebrow>All-Access Pass</Eyebrow>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-electric-cyan/30 bg-electric-cyan/[0.1] px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.1em] text-electric-cyan-bright uppercase">
                  <Sparkles className="size-3" />
                  Save $120
                </span>
              </div>

              {/* Price */}
              <div className="mt-6 flex items-end gap-3">
                <span className="text-gradient-neon text-[3.25rem] leading-none font-semibold tracking-[-0.04em] sm:text-[3.75rem]">
                  {PRICING.price}
                </span>
                <span className="flex flex-col pb-1.5">
                  <span className="text-[0.8125rem] text-ink-faint line-through decoration-ink-faint/60">
                    {PRICING.compareAt}
                  </span>
                  <span className="text-[0.75rem] tracking-wide text-ink-dim">
                    {PRICING.period}
                  </span>
                </span>
              </div>

              {/* CTA */}
              <a
                href="#gallery"
                onClick={(e) => smoothScroll(e, "#gallery")}
                className="group/cta relative mt-7 inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(100deg,#7c3aed_0%,#8b5cf6_42%,#06b6d4_100%)] transition-[filter] duration-500 group-hover/cta:brightness-[1.16]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-white/28 via-white/0 to-black/25"
                />
                <span
                  aria-hidden="true"
                  className="shimmer-sweep absolute inset-0 opacity-0 group-hover/cta:animate-shimmer group-hover/cta:opacity-100"
                />
                <span
                  aria-hidden="true"
                  className="absolute -inset-px rounded-xl opacity-70 shadow-[0_0_30px_1px_rgba(139,92,246,0.55),0_0_70px_8px_rgba(6,182,212,0.2)] transition-opacity duration-500 group-hover/cta:opacity-100"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/28"
                />
                <span className="relative z-10 inline-flex items-center gap-2.5">
                  {PRICING.cta}
                  <ArrowRight className="size-4 transition-transform duration-400 group-hover/cta:translate-x-1" />
                </span>
              </a>

              <p className="mt-3 text-center text-[0.75rem] leading-relaxed text-ink-faint">
                {PRICING.guarantee}
              </p>

              {/* Divider */}
              <div className="my-7 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-hairline-strong" />
                <span className="text-[0.625rem] tracking-[0.18em] text-ink-faint uppercase">
                  Included
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-hairline-strong" />
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3.5">
                {PRICING.features.map((feature, i) => (
                  <PriceFeatureRow
                    key={feature.label}
                    label={feature.label}
                    emphasis={!!feature.emphasis}
                    index={i}
                  />
                ))}
              </ul>
            </div>
          </div>

          {/* Assurance strip */}
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {ASSURANCES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 text-[0.75rem] text-ink-faint"
              >
                <Icon className="size-3.5 text-ink-dim" strokeWidth={1.75} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </SectionShell>
  );
}

export default PricingSection;
