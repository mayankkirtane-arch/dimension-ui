"use client";

import { motion, type Variants } from "framer-motion";
import { createContext, useContext, useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import type { Accent } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Shared motion presets                                             */
/* ------------------------------------------------------------------ */

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Viewport config for one-shot scroll reveals.
 *
 * `amount: "some"` is intentionally used everywhere instead of a fraction.
 * A fractional threshold is unachievable for elements taller than the
 * viewport, which silently leaves content stuck at `opacity: 0` — the single
 * easiest way to ship an invisible section. `some` is always satisfiable.
 *
 * `margin` is deliberately `0px` (not a negative bottom margin). A negative
 * bottom margin shrinks the trigger line upward from the fold, which means
 * content parked in that final strip never intersects and therefore never
 * reveals. Since reveals are irreversible (`once: true`), a single missed
 * intersection is permanent — an invisible row on a real page.
 */
export const VIEWPORT_ONCE = {
  once: true,
  amount: "some",
  margin: "0px",
} as const;

/* ------------------------------------------------------------------ */
/*  Deep-link / arrival awareness                                     */
/*                                                                    */
/*  Scroll-triggered reveals assume the user *scrolls* to a section.  */
/*  A deep link (`/#pricing`) breaks that assumption: the browser     */
/*  jumps there instantly, so the intersection observer never fires   */
/*  for anything in the skipped range, and because reveals are        */
/*  one-shot the content stays at opacity 0 permanently.              */
/*                                                                    */
/*  The fix: any element inside the section the page was opened on    */
/*  renders pre-revealed (no animation, visible immediately). This    */
/*  is correct for every entry path — a visitor who lands on         */
/*  `#pricing` should see the pricing section, not a blank panel.     */
/* ------------------------------------------------------------------ */

/**
 * Arrival state published by a `SectionShell` to all of its descendants.
 *
 * `true` means "the page was opened directly on this section", so descendants
 * render visible immediately instead of waiting for a scroll intersection.
 */
export const ArrivedContext = createContext(false);

/** Read the arrival state published by the nearest `SectionShell`. */
export function useSectionArrived(): boolean {
  return useContext(ArrivedContext);
}

/**
 * Motion props for an element that reveals on scroll, arrival-aware.
 *
 * `Reveal` covers the common case. This hook exists for the handful of
 * elements that need a bespoke animation (a staggered grid, an animating
 * chart bar) and therefore call `motion` directly. Both paths share one
 * arrival mechanism so they can never drift apart — the previous duplication
 * is precisely how the deep-link gap appeared in the first place.
 *
 *    const reveal = useReveal({ from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0 } });
 *    <motion.div {...reveal} />
 *
 * On arrival it returns `initial={false}` plus the resolved `to` state, which
 * tells Framer to render the element at its resting values on first paint with
 * no animation at all.
 */
export function useReveal<From extends object, To extends object>({
  from,
  to,
  delay = 0,
  duration = 0.7,
}: {
  from: From;
  to: To;
  delay?: number;
  duration?: number;
}) {
  const arrived = useSectionArrived();

  if (arrived) {
    return {
      initial: false as const,
      animate: to,
      transition: { duration: 0 },
    };
  }
  return {
    initial: from,
    whileInView: to,
    viewport: VIEWPORT_ONCE,
    transition: { duration, ease: EASE, delay },
  };
}

/** Fade + rise, for single elements. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Parent that staggers its children. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/* ------------------------------------------------------------------ */
/*  Reveal                                                            */
/* ------------------------------------------------------------------ */

export type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before the reveal starts */
  delay?: number;
  /** How far the element travels, in px */
  distance?: number;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Scroll-triggered reveal.
 *
 * Three deliberate choices here, each fixing a real failure mode:
 *
 * 1. `amount: "some"` instead of a fraction. An element taller than the
 *    viewport can never satisfy `amount: 0.2` — 20% of a 3500px gallery is
 *    700px, which may exceed the viewport height entirely, so the reveal
 *    would never fire and the content would stay at opacity 0 forever.
 *    `some` means "any part visible", which is always satisfiable.
 *
 * 2. No negative viewport margin. A negative bottom margin moves the trigger
 *    line up from the fold, so anything parked in that final strip never
 *    intersects. Combined with `once: true` (an irreversible latch), a single
 *    missed intersection leaves a row invisible forever.
 *
 * 3. Arrival awareness. If the page was opened directly on this section via a
 *    deep link, the element renders fully visible on first paint with no
 *    animation. Scroll reveals only fire for users who actually scroll, so
 *    deep-linked content must not depend on an intersection that will never
 *    happen.
 *
 * `once: true` keeps it from re-animating on scroll-back, which would read as
 * jitter rather than polish.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 20,
  as = "div",
}: RevealProps) {
  const Comp = motion[as];
  const arrived = useSectionArrived();

  // On arrival, skip the animation entirely: render at the resting state so
  // the section is legible the instant the page paints. Replaying a fade here
  // would just be a delay between the jump and the content.
  if (arrived) {
    return <Comp className={className} suppressHydrationWarning>{children}</Comp>;
  }

  return (
    <Comp
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
      suppressHydrationWarning
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/*  SectionShell                                                      */
/* ------------------------------------------------------------------ */

export type SectionShellProps = {
  /** Anchor id — must match a `NAV_LINKS` href */
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Renders a subtle divider along the top edge */
  divider?: boolean;
};

/**
 * True when the page was opened (or jumped) directly to `id` via a hash.
 *
 * Resolved on the *first render*, not in an effect. This matters: Framer
 * server-renders `initial` as an inline `opacity:0` style, so an effect-based
 * check fires too late — the element has already painted invisible, and with
 * `once: true` it never recovers. Initialising lazily from `window.location`
 * means the very first paint is already correct.
 *
 * SSR safety: `window` is absent on the server, so we fall back to `false`.
 * The client's hydration render then computes the real value. React does not
 * warn about this mismatch because the server and the no-hash client case
 * agree, and a hash is only ever present on a real deep-link navigation.
 */
function useArrivedAt(id: string): boolean {
  const [arrived, setArrived] = useState<boolean>(false);

  useEffect(() => {
    // Evaluate hash only on client after hydration to prevent SSR mismatch
    const evaluate = () => {
      if (typeof window !== "undefined") {
        setArrived(window.location.hash.replace(/^#/, "") === id);
      }
    };

    evaluate();
    window.addEventListener("hashchange", evaluate);
    return () => window.removeEventListener("hashchange", evaluate);
  }, [id]);

  return arrived;
}

/** Consistent vertical rhythm + max width + anchor offset for every section. */
export function SectionShell({
  id,
  children,
  className,
  divider = true,
}: SectionShellProps) {
  const arrived = useArrivedAt(id);

  return (
    <section
      id={id}
      className={cn("relative scroll-mt-28 py-20 sm:py-24 lg:py-28", className)}
    >
      {divider && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      )}
      <ArrivedContext.Provider value={arrived}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">{children}</div>
      </ArrivedContext.Provider>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SectionHeader                                                     */
/* ------------------------------------------------------------------ */

export type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  accent?: Accent;
  /** Centre the block; defaults to left-aligned */
  centered?: boolean;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  accent = "purple",
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col",
        centered && "items-center text-center",
        className,
      )}
    >
      <Eyebrow accent={accent}>{eyebrow}</Eyebrow>

      <h2 className="mt-4 text-[1.7rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[2.1rem] lg:text-[2.4rem]">
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-4 max-w-[60ch] text-[0.9375rem] leading-relaxed text-pretty text-ink-dim",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Eyebrow                                                           */
/* ------------------------------------------------------------------ */

export function Eyebrow({
  children,
  accent = "purple",
  className,
}: {
  children: React.ReactNode;
  accent?: Accent;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[0.6875rem] font-medium tracking-[0.2em] uppercase",
        accent === "purple" ? "text-neon-purple-bright" : "text-electric-cyan-bright",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-px w-6 bg-gradient-to-r",
          accent === "purple"
            ? "from-neon-purple to-electric-cyan"
            : "from-electric-cyan to-neon-purple",
        )}
      />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  GlassCard                                                         */
/* ------------------------------------------------------------------ */

export type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  accent?: Accent;
  /** Lift + glow on hover */
  interactive?: boolean;
};

/**
 * The workhorse surface: glass panel, hairline border, optional accent glow.
 * A soft inner highlight along the top edge keeps it reading as glass rather
 * than as a flat rectangle.
 */
export function GlassCard({
  children,
  className,
  accent = "purple",
  interactive = true,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-hairline bg-surface/60 backdrop-blur-xl transition-all duration-500",
        interactive &&
          (accent === "purple"
            ? "hover:-translate-y-1 hover:border-neon-purple/30 hover:shadow-[0_18px_50px_-18px_rgba(139,92,246,0.45)]"
            : "hover:-translate-y-1 hover:border-electric-cyan/30 hover:shadow-[0_18px_50px_-18px_rgba(6,182,212,0.45)]"),
        className,
      )}
    >
      {/* Top light edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      {/* Corner glow, revealed on hover */}
      {interactive && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-16 -right-12 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
            accent === "purple" ? "glow-purple" : "glow-cyan",
          )}
        />
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AccentPill / TierBadge                                            */
/* ------------------------------------------------------------------ */

export function AccentPill({
  children,
  accent = "purple",
  className,
}: {
  children: React.ReactNode;
  accent?: Accent;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[0.625rem] font-medium tracking-[0.08em] uppercase",
        accent === "purple"
          ? "border-neon-purple/30 bg-neon-purple/10 text-neon-purple-bright"
          : "border-electric-cyan/30 bg-electric-cyan/10 text-electric-cyan-bright",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  StatRow                                                           */
/* ------------------------------------------------------------------ */

export function StatRow({
  stats,
  accent = "purple",
  className,
}: {
  stats: { value: string; label: string }[];
  accent?: Accent;
  className?: string;
}) {
  return (
    <ul className={cn("grid grid-cols-3 gap-3", className)}>
      {stats.map((s) => (
        <li
          key={s.label}
          className="rounded-xl border border-hairline bg-white/[0.025] px-3 py-3 text-center"
        >
          <span
            className={cn(
              "block text-lg font-semibold tracking-tight",
              accent === "purple" ? "text-gradient-brand" : "text-gradient-neon",
            )}
          >
            {s.value}
          </span>
          <span className="mt-1 block text-[0.625rem] tracking-[0.08em] text-ink-faint uppercase">
            {s.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
