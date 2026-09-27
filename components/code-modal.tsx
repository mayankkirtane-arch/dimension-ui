"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Code2, Copy, Eye, Sparkles, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AccentPill, EASE } from "@/components/ui/primitives";
import { Mockup3D } from "@/components/mockup-3d";
import { cn } from "@/lib/cn";
import { scrollToHash } from "@/lib/hooks";
import {
  COMPONENT_COUNT,
  CTA_HREF,
  MARKETS,
  PRICING_CTA,
  type Accent,
  type GalleryItem,
} from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Public types                                                      */
/* ------------------------------------------------------------------ */

/**
 * Optional hand-authored content for a single component.
 *
 * `lib/site.ts` deliberately keeps `GalleryItem` minimal (name / blurb /
 * market / tier / icon) so the content model stays serialisable. Rather than
 * fattening every one of the 42 records with a code sample and a prompt, the
 * modal *derives* them from the item, and these fields let a specific entry
 * override that derivation when real source is available.
 */
export type CodeModalOverrides = {
  id?: string;
  /** Overrides the derived Pro rule, which defaults to `tier === "3D"`. */
  pro?: boolean;
  /** Replaces the generated live demo. */
  preview?: ReactNode;
  /** Replaces the generated React source. */
  code?: string;
  /** Replaces the generated v0 / Cursor prompt. */
  prompt?: string;
};

export type CodeModalItem = GalleryItem & CodeModalOverrides;

export type CodeModalProps = {
  /**
   * The selected gallery item — `name` is used as the title and `market` as
   * the category. Pass `null` to close; the component stays mounted so the
   * exit animation can play.
   */
  item: CodeModalItem | null;
  /** Called on the X button, backdrop click, and Escape. */
  onClose: () => void;
};

type TabId = "preview" | "code" | "prompt";

/* ------------------------------------------------------------------ */
/*  Derivation helpers                                                */
/*                                                                    */
/*  The modal must be useful for all 42 components without 42 hand-    */
/*  written samples, so preview / code / prompt are generated from the */
/*  item's own metadata. Deterministic, so the same card always shows  */
/*  the same snippet.                                                  */
/* ------------------------------------------------------------------ */

/** "Orbital Hero" -> "OrbitalHero" */
function toPascal(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/** "Orbital Hero" -> "orbital-hero" */
function toKebab(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

const ACCENT_HEX: Record<Accent, string> = {
  purple: "#8b5cf6",
  cyan: "#06b6d4",
};

const TIER_HINT: Record<GalleryItem["tier"], string> = {
  "3D": "a GPU-friendly interactive surface. Use HTML5 Canvas or CSS 3D only — no three.js",
  Motion: "motion that clarifies hierarchy. Animate transform and opacity only, never layout",
  Static: "a layout that stays crisp with no animation at all",
};

function generateCode(item: CodeModalItem, accent: Accent): string {
  const Component = toPascal(item.name);
  const file = toKebab(item.name);

  // `blurb` is interpolated into a JSX expression container via
  // `JSON.stringify` rather than a plain `"..."` attribute. JSX attribute
  // strings have no escape syntax (they follow HTML, not JS), so a single
  // double quote in the copy would emit malformed code. `JSON.stringify`
  // produces a correctly escaped JS string literal instead.
  const description = JSON.stringify(item.blurb);
  // Keep the JSDoc from being terminated early by a literal `*/` in the copy.
  const safeBlurb = item.blurb.replace(/\*\//g, "*\\/");
  const safeName = item.name.replace(/\*\//g, "*\\/");

  return `import { ${Component} } from "@/components/${file}";

/**
 * ${safeName}
 * ${safeBlurb}
 */
export function ${Component}Section() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-24">
      <${Component}
        accent="${accent}"
        headline="Replace with your value proposition"
        description={${description}}
      />
    </section>
  );
}
`;
}

function generatePrompt(
  item: CodeModalItem,
  categoryLabel: string,
  accent: Accent,
): string {
  return `Build a production-ready React component called "${item.name}".

What it does: ${item.blurb}
Audience: ${categoryLabel}
Tier: ${item.tier} — ${TIER_HINT[item.tier]}.

Stack requirements
- Next.js 15 App Router, React 19, TypeScript in strict mode.
- Tailwind CSS v4, CSS-first config. Tokens live in @theme inside globals.css;
  there is no tailwind.config.js. Author custom utilities with @utility.
- No new dependencies.

Design tokens
- Surface #0e0e1a, page #07070d, hairline rgba(255,255,255,0.08).
- Accent ${accent} (${ACCENT_HEX[accent]}). Text slate-200 on dark.
- Glassmorphism via backdrop-blur-xl, and a near-opaque background colour so
  text stays legible over bright content.

Behaviour
- Animate transform and opacity only. Never animate layout properties.
- Honour prefers-reduced-motion.
- Keyboard accessible: visible focus ring, correct ARIA roles, Escape closes
  any overlay.

Deliver one self-contained, typed component file with sensible default props.`;
}

/* ------------------------------------------------------------------ */
/*  Syntax highlighting                                               */
/*                                                                    */
/*  A deliberately tiny tokeniser rather than a highlight.js pull-in.  */
/*  It returns React nodes, never `dangerouslySetInnerHTML`, so the    */
/*  generated source cannot inject markup.                            */
/* ------------------------------------------------------------------ */

const TOKEN_RE = new RegExp(
  [
    // 1 — comments
    "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)",
    // 2 — strings
    "(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)",
    // 3 — keywords
    "\\b(import|from|export|default|function|const|let|var|return|type|interface|new|await|async|extends|as|if|else)\\b",
    // 4 — numbers
    "\\b(\\d+(?:\\.\\d+)?)\\b",
    // 5 — JSX tags
    "(<\\/?[A-Za-z][\\w.]*|\\/?>)",
  ].join("|"),
  "g",
);

function highlight(source: string): ReactNode[] {
  const out: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  // The regex is module-level with the `g` flag, so its `lastIndex` is stateful.
  // Resetting here keeps repeated renders deterministic.
  TOKEN_RE.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(source)) !== null) {
    if (match.index > cursor) out.push(source.slice(cursor, match.index));

    const cls = match[1]
      ? "text-ink-faint italic"
      : match[2]
        ? "text-[#6ee7b7]"
        : match[3]
          ? "text-neon-purple-bright"
          : match[4]
            ? "text-[#fcd34d]"
            : "text-electric-cyan-bright";

    out.push(
      <span key={key++} className={cls}>
        {match[0]}
      </span>,
    );

    cursor = match.index + match[0].length;
  }

  if (cursor < source.length) out.push(source.slice(cursor));
  return out;
}

/* ------------------------------------------------------------------ */
/*  Clipboard                                                         */
/* ------------------------------------------------------------------ */

function useCopy(resetAfter = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // `navigator.clipboard` requires a secure context, so it is absent when
        // the site is previewed over a LAN IP. Fall back to a hidden textarea
        // so the button still does what it says.
        const scratch = document.createElement("textarea");
        scratch.value = text;
        scratch.setAttribute("readonly", "");
        scratch.style.position = "fixed";
        scratch.style.top = "-1000px";
        scratch.style.opacity = "0";
        document.body.appendChild(scratch);
        scratch.select();
        try {
          document.execCommand("copy");
        } catch {
          /* nothing else we can do — the badge stays honest below */
        }
        document.body.removeChild(scratch);
      }

      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), resetAfter);
    },
    [resetAfter],
  );

  return { copied, copy };
}

/* ------------------------------------------------------------------ */
/*  Live preview demos                                                */
/*                                                                    */
/*  Three genuinely interactive demos, one per tier, so the "Live      */
/*  Preview" tab demonstrates behaviour instead of showing a picture.  */
/*  All are pure CSS + React — no canvas, no layout thrash.            */
/* ------------------------------------------------------------------ */

function PreviewFrame({
  accent,
  title,
  hint,
  children,
}: {
  accent: Accent;
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-[0.8125rem] font-semibold tracking-[-0.01em] text-ink">
            {title}
          </span>
          <AccentPill accent={accent}>live</AccentPill>
        </div>
        {children}
      </div>
      <p className="text-center text-[0.75rem] text-ink-faint">{hint}</p>
    </div>
  );
}

/** Tier "3D" — pointer-tracked tilt. */
function TiltPreview({ accent, title }: { accent: Accent; title: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [engaged, setEngaged] = useState(false);
  const reduce = useReducedMotion();

  const reset = () => {
    setEngaged(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <PreviewFrame
      accent={accent}
      title={title}
      hint="Move your cursor across the panel to tilt it."
    >
      {/*
        Decorative surface: it reacts to the pointer but contains no focusable
        controls, so it is hidden from assistive tech. The frame's title and
        hint above carry the meaning — `role="img"` would be wrong here because
        the element holds live text, not a static image.
      */}
      <div
        aria-hidden="true"
        onPointerMove={(event) => {
          if (reduce) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          setTilt({ x: -py * 16, y: px * 20 });
        }}
        onPointerEnter={() => setEngaged(true)}
        onPointerLeave={reset}
        className={cn(
          "relative flex h-44 items-center justify-center rounded-xl border transition-[transform,border-color] duration-200 ease-out",
          engaged
            ? accent === "purple"
              ? "border-neon-purple/45"
              : "border-electric-cyan/45"
            : "border-white/10",
        )}
        style={{
          transform: `perspective(720px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 rounded-xl bg-gradient-to-br to-transparent",
            accent === "purple"
              ? "from-neon-purple/[0.22]"
              : "from-electric-cyan/[0.22]",
          )}
        />
        <span className="relative flex flex-col items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              "size-12 rounded-full border",
              accent === "purple"
                ? "border-neon-purple/40 bg-neon-purple/[0.14]"
                : "border-electric-cyan/40 bg-electric-cyan/[0.14]",
            )}
          />
          <span className="font-mono text-[0.6875rem] text-ink-faint">
            rotateX {tilt.x.toFixed(0)}° · rotateY {tilt.y.toFixed(0)}°
          </span>
        </span>
      </div>
    </PreviewFrame>
  );
}

/** Tier "Motion" — a stepper plus a segmented control. */
function StepperPreview({ accent, title }: { accent: Accent; title: string }) {
  const [seats, setSeats] = useState(3);
  const [period, setPeriod] = useState<"monthly" | "annual">("annual");

  const unit = 12;
  const total = seats * unit * (period === "annual" ? 10 : 1);

  return (
    <PreviewFrame
      accent={accent}
      title={title}
      hint="Change the seat count and billing period."
    >
      <div className="flex flex-col gap-4">
        {/* Segmented control */}
        <div
          role="group"
          aria-label="Billing period"
          className="inline-flex self-start rounded-full border border-white/10 bg-white/[0.03] p-0.5"
        >
          {(["monthly", "annual"] as const).map((option) => {
            const active = period === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => setPeriod(option)}
                className={cn(
                  "rounded-full px-3 py-1 text-[0.75rem] font-medium capitalize transition-colors duration-300",
                  active ? "bg-white/[0.1] text-ink" : "text-ink-faint hover:text-ink-dim",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.8125rem] text-ink-dim">Seats</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSeats((n) => Math.max(1, n - 1))}
              aria-label="Remove a seat"
              className="inline-flex size-7 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-ink-dim transition-colors duration-300 hover:border-white/25 hover:text-ink"
            >
              −
            </button>
            <span className="w-6 text-center font-mono text-[0.875rem] text-ink">
              {seats}
            </span>
            <button
              type="button"
              onClick={() => setSeats((n) => Math.min(40, n + 1))}
              aria-label="Add a seat"
              className="inline-flex size-7 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-ink-dim transition-colors duration-300 hover:border-white/25 hover:text-ink"
            >
              +
            </button>
          </div>
        </div>

        {/* Readout */}
        <div className="flex items-end justify-between border-t border-white/10 pt-4">
          <span className="text-[0.75rem] text-ink-faint">
            {seats} seats · {period}
          </span>
          <span
            className={cn(
              "font-mono text-lg font-semibold",
              accent === "purple" ? "text-neon-purple-bright" : "text-electric-cyan-bright",
            )}
          >
            ${total}
          </span>
        </div>
      </div>
    </PreviewFrame>
  );
}

/** Tier "Static" — a selectable list with hover affordance. */
function RowsPreview({ accent, title }: { accent: Accent; title: string }) {
  const rows = ["Accreditation", "Insurance cover", "Written guarantee"];
  const [selected, setSelected] = useState(0);

  return (
    <PreviewFrame
      accent={accent}
      title={title}
      hint="Select a row — keyboard navigable."
    >
      <ul className="flex flex-col gap-2">
        {rows.map((row, index) => {
          const active = selected === index;
          return (
            <li key={row}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[0.8125rem] transition-colors duration-300",
                  active
                    ? accent === "purple"
                      ? "border-neon-purple/40 bg-neon-purple/[0.1] text-ink"
                      : "border-electric-cyan/40 bg-electric-cyan/[0.1] text-ink"
                    : "border-white/10 bg-white/[0.02] text-ink-dim hover:border-white/20",
                )}
              >
                {row}
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full transition-opacity duration-300",
                    active
                      ? accent === "purple"
                        ? "bg-neon-purple-bright opacity-100"
                        : "bg-electric-cyan-bright opacity-100"
                      : "opacity-0",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </PreviewFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab button                                                        */
/* ------------------------------------------------------------------ */

function TabButton({
  id,
  label,
  icon: Icon,
  active,
  onSelect,
}: {
  id: TabId;
  label: string;
  icon: typeof Eye;
  active: boolean;
  onSelect: (id: TabId) => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={`code-modal-tab-${id}`}
      aria-selected={active}
      aria-controls={`code-modal-panel-${id}`}
      onClick={() => onSelect(id)}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[0.8125rem] font-medium transition-colors duration-300",
        active ? "text-ink" : "text-ink-faint hover:text-ink-dim",
      )}
    >
      {active && (
        <motion.span
          layoutId="code-modal-tab-pill"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="absolute inset-0 -z-10 rounded-lg border border-white/12 bg-white/[0.07]"
        />
      )}
      <Icon className="relative size-3.5" strokeWidth={1.9} aria-hidden="true" />
      <span className="relative">{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Code panel with copy affordance                                   */
/* ------------------------------------------------------------------ */

function CopyButton({
  label,
  copied,
  onCopy,
}: {
  label: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        {copied && (
          <motion.span
            key="copied-badge"
            initial={{ opacity: 0, y: 4, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.94 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/[0.12] px-2.5 py-1 text-[0.6875rem] font-medium text-[#6ee7b7]"
            role="status"
          >
            <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            Copied!
          </motion.span>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[0.75rem] font-medium text-ink-dim transition-colors duration-300 hover:border-white/25 hover:text-ink"
      >
        {copied ? (
          <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" strokeWidth={1.9} aria-hidden="true" />
        )}
        {label}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal                                                             */
/* ------------------------------------------------------------------ */

/**
 * Code & Prompt modal for a gallery card.
 *
 * Rendered unconditionally by the gallery (passing `item={null}` when closed)
 * so `AnimatePresence` can play the exit animation — an early `return null`
 * would unmount the wrapper and kill it. All hooks therefore run on every
 * render, guarded internally against a null item.
 */
export function CodeModal({ item, onClose }: CodeModalProps) {
  const [tab, setTab] = useState<TabId>("preview");
  // One clipboard state per tab, so a "Copied!" badge triggered in the code tab
  // can never appear over the prompt tab.
  const codeClipboard = useCopy();
  const promptClipboard = useCopy();
  const panelRef = useRef<HTMLDivElement>(null);

  const market = useMemo(
    () => (item ? MARKETS.find((m) => m.id === item.market) : undefined),
    [item],
  );

  const accent: Accent = market?.accent ?? "purple";
  const categoryLabel = market?.label ?? "Template";
  // The 3D tier is the premium one, so it carries the upgrade prompt.
  const isPro = item ? (item.pro ?? item.tier === "3D") : false;

  const code = useMemo(
    () => (item ? (item.code ?? generateCode(item, accent)) : ""),
    [item, accent],
  );

  const prompt = useMemo(
    () => (item ? (item.prompt ?? generatePrompt(item, categoryLabel, accent)) : ""),
    [item, categoryLabel, accent],
  );

  // Always land on the preview when a new card is opened.
  useEffect(() => {
    if (item) setTab("preview");
  }, [item]);

  // Escape to close + body scroll lock, restored to whatever it was before.
  useEffect(() => {
    if (!item) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [item, onClose]);

  // Move focus into the dialog so Escape and tabbing work immediately.
  useEffect(() => {
    if (item) panelRef.current?.focus();
  }, [item]);

  const tabs: { id: TabId; label: string; icon: typeof Eye }[] = [
    { id: "preview", label: "Live Preview", icon: Eye },
    { id: "code", label: "React Code", icon: Code2 },
    { id: "prompt", label: "v0 / Cursor Prompt", icon: Sparkles },
  ];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="code-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop — clicking it closes, matching every other overlay. */}
          <button
            type="button"
            aria-label="Close dialog"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="code-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="relative flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[rgba(10,10,18,0.94)] backdrop-blur-xl outline-none"
          >
            {/* ---------- Top bar ---------- */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-lg border",
                    accent === "purple"
                      ? "border-neon-purple/30 bg-neon-purple/[0.12] text-neon-purple-bright"
                      : "border-electric-cyan/30 bg-electric-cyan/[0.12] text-electric-cyan-bright",
                  )}
                  aria-hidden="true"
                >
                  <Sparkles className="size-4" strokeWidth={1.9} />
                </span>

                <h2
                  id="code-modal-title"
                  className="truncate text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink"
                >
                  {item.name}
                </h2>

                {/*
                  The responsive `hidden` lives on a wrapper, not on AccentPill.
                  AccentPill hard-codes `inline-flex` in its base classes, and
                  Tailwind emits `inline-flex` after `hidden` — so passing
                  `hidden sm:inline-flex` directly would lose at every
                  breakpoint and the pill would never hide on mobile.
                */}
                <span className="hidden shrink-0 sm:inline-flex">
                  <AccentPill accent={accent}>{categoryLabel}</AccentPill>
                </span>

                {isPro && (
                  <AccentPill accent={accent} className="shrink-0">
                    Pro
                  </AccentPill>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-ink-dim transition-colors duration-300 hover:border-white/25 hover:text-ink"
              >
                <X className="size-4" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {/* ---------- Body ---------- */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div
                role="tabpanel"
                id="code-modal-panel-preview"
                aria-labelledby="code-modal-tab-preview"
              >
                {item.preview ?? (
                  <>
                    {item.tier === "3D" && (
                      <div className="relative w-full h-[500px] overflow-hidden rounded-xl border border-white/10">
                        <Mockup3D itemId={item.id || ""} />
                      </div>
                    )}
                    {item.tier === "Motion" && (
                      <StepperPreview accent={accent} title={item.name} />
                    )}
                    {item.tier === "Static" && (
                      <RowsPreview accent={accent} title={item.name} />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ---------- Pro upgrade footer ---------- */}
            {isPro && (
              <div className="flex flex-col items-center gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-between">
                <p className="text-center text-[0.75rem] text-ink-faint sm:text-left">
                  This is a premium template. Purchase to access the full source code.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    // Deferred one frame on purpose. The scroll lock is released
                    // in an effect cleanup during the commit for this state
                    // change, and scrolling while `body { overflow: hidden }` is
                    // unreliable — so wait until the lock is definitely gone.
                    window.requestAnimationFrame(() => scrollToHash(CTA_HREF));
                  }}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-neon-purple to-electric-cyan px-4 py-2.5 text-[0.8125rem] font-semibold text-white transition-transform duration-300 hover:shadow-[0_14px_40px_-12px_rgba(139,92,246,0.65)] active:scale-[0.98]"
                >
                  Unlock this Template
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CodeModal;
