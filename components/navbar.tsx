"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Sparkles, X, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { AnimatedLogo } from "@/components/brand-mark";
import { cn } from "@/lib/cn";
import { useSmoothScroll } from "@/lib/hooks";
import { CTA_HREF, NAV_LINKS, PRICING_CTA } from "@/lib/site";
import { useCartStore } from "@/lib/store";

/* ------------------------------------------------------------------ */
/*  Active-section tracking                                           */
/* ------------------------------------------------------------------ */

/**
 * Returns the id of the section currently under the navbar.
 * Uses a narrow observation band just below the navbar so a section becomes
 * "active" exactly when it visually takes over.
 */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-96px 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                            */
/* ------------------------------------------------------------------ */

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const { scrollY } = useScroll();
  const smoothScroll = useSmoothScroll();
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const sectionIds = useRef(NAV_LINKS.map((l) => l.href.slice(1))).current;
  const active = useActiveSection(sectionIds);

  /* Condense the bar once the user leaves the very top. */
  useMotionValueEvent(scrollY, "change", (y) => {
    setCondensed(y > 16);
  });

  /* ---- Close the sheet on link click / escape / outside click ---- */
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const node = e.target as Node | null;
      if (!node) return;
      if (sheetRef.current?.contains(node)) return;
      if (triggerRef.current?.contains(node)) return;
      close();
    };

    // Lock body scroll behind the sheet.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    smoothScroll(e, href);
    close();
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* ---------- Scroll progress hairline ---------- */}
      <ScrollProgressBar />

      <div className="pointer-events-auto px-3 pt-3 sm:px-4 sm:pt-4">
        <motion.nav
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "relative mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-all duration-500 sm:px-4",
            condensed
              ? "glass shadow-[0_10px_40px_-12px_rgba(7,7,13,0.9)]"
              : "border border-transparent bg-transparent",
          )}
        >
          {/* Subtle top light edge when condensed */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent transition-opacity duration-500",
              condensed ? "opacity-100" : "opacity-0",
            )}
          />

          {/* ---------- Brand ---------- */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, "#top")}
            aria-label="DimensionUI — back to top"
            className="group flex items-center rounded-xl px-1.5 py-1 transition-transform duration-300 active:scale-[0.97]"
          >
            <AnimatedLogo markSize={32} />
          </a>

          {/* ---------- Desktop nav ---------- */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative z-10 block rounded-lg px-3.5 py-2 text-[0.8125rem] font-medium tracking-[-0.005em] transition-colors duration-300",
                      isActive ? "text-ink" : "text-ink-dim hover:text-ink",
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        className="absolute inset-0 -z-10 rounded-lg border border-white/10 bg-white/[0.055]"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* ---------- Actions ---------- */}
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <CartButton />

            <CtaButton
              href={CTA_HREF}
              onClick={(e) => handleNavClick(e, CTA_HREF)}
              className="hidden sm:inline-flex"
            />

            {/* Mobile trigger */}
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav-sheet"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              className="relative inline-flex size-10 items-center justify-center rounded-xl border border-hairline bg-white/[0.035] text-ink-dim transition-all duration-300 hover:border-hairline-strong hover:bg-white/[0.07] hover:text-ink active:scale-95 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -70, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 70, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <X className="size-[1.15rem]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 70, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -70, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <Menu className="size-[1.15rem]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.nav>

        {/* ---------- Mobile slide-down sheet ---------- */}
        <AnimatePresence>
          {open && (
            <MobileSheet
              ref={sheetRef}
              active={active}
              onNavigate={handleNavClick}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll progress hairline                                          */
/* ------------------------------------------------------------------ */

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-neon-purple via-neon-purple-bright to-electric-cyan"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Cart Button                                                        */
/* ------------------------------------------------------------------ */

function CartButton() {
  const { items, toggleCart } = useCartStore();
  const count = items.length;

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label="Open cart"
      className="relative inline-flex size-10 items-center justify-center rounded-xl border border-hairline bg-white/[0.035] text-ink-dim transition-all duration-300 hover:border-hairline-strong hover:bg-white/[0.07] hover:text-ink active:scale-95"
    >
      <ShoppingCart className="size-4" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-[0.6rem] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA button                                                        */
/* ------------------------------------------------------------------ */

type CtaButtonProps = {
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  fullWidth?: boolean;
  label?: string;
};

export function CtaButton({
  href,
  onClick,
  className,
  fullWidth,
  label = PRICING_CTA.full,
}: CtaButtonProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        // Display is supplied by the caller so responsive visibility classes
        // (`hidden sm:inline-flex`) are never fought by a base `inline-flex`.
        "group relative items-center justify-center overflow-hidden rounded-xl px-3.5 py-2 text-[0.8125rem] font-semibold tracking-[-0.005em] text-white transition-transform duration-300 active:scale-[0.975]",
        fullWidth && "flex w-full",
        className,
      )}
    >
      {/* Gradient base */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(100deg,#7c3aed_0%,#8b5cf6_45%,#06b6d4_100%)] transition-[filter] duration-500 group-hover:brightness-[1.14]"
      />
      {/* Inner top sheen */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/0 to-black/20 opacity-70"
      />
      {/* Shimmer sweep on hover */}
      <span
        aria-hidden="true"
        className="shimmer-sweep absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:animate-shimmer group-hover:opacity-100"
      />
      {/* Outer glow */}
      <span
        aria-hidden="true"
        className="absolute -inset-px rounded-xl opacity-0 shadow-[0_0_28px_2px_rgba(139,92,246,0.62),0_0_60px_6px_rgba(6,182,212,0.22)] transition-opacity duration-500 group-hover:opacity-100"
      />
      {/* Hairline ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25"
      />

      <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap">
        <Sparkles className="size-3.5 text-white/90 transition-transform duration-500 group-hover:rotate-[18deg]" />
        {label}
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile sheet                                                      */
/* ------------------------------------------------------------------ */

type MobileSheetProps = {
  active: string | null;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
};

function MobileSheet({
  ref,
  active,
  onNavigate,
}: MobileSheetProps & { ref: React.Ref<HTMLDivElement> }) {
  return (
    <motion.div
      ref={ref}
      id="mobile-nav-sheet"
      initial={{ opacity: 0, y: -14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.985 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      className="glass-solid mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl p-2 shadow-[0_24px_60px_-20px_rgba(7,7,13,0.95)] lg:hidden"
    >
      {/* Ambient glow inside the sheet */}
      <span
        aria-hidden="true"
        className="glow-purple pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 opacity-45 blur-2xl"
      />

      <ul className="relative flex flex-col">
        {NAV_LINKS.map((link, i) => {
          const isActive = active === link.href.slice(1);
          return (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.045 * i + 0.03,
                duration: 0.34,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <a
                href={link.href}
                onClick={(e) => onNavigate(e, link.href)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-3 text-[0.9375rem] font-medium transition-colors duration-250",
                  isActive
                    ? "bg-white/[0.06] text-ink"
                    : "text-ink-dim hover:bg-white/[0.035] hover:text-ink",
                )}
              >
                {link.label}
                {isActive && (
                  <span className="size-1.5 rounded-full bg-neon-purple-bright shadow-[0_0_10px_2px_rgba(167,139,250,0.75)]" />
                )}
              </a>
            </motion.li>
          );
        })}
      </ul>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, duration: 0.34 }}
        className="relative mt-2 border-t border-hairline px-1.5 pt-3 pb-1"
      >
        <CtaButton
          href={CTA_HREF}
          onClick={(e) => onNavigate(e, CTA_HREF)}
          fullWidth
        />        <p className="mt-2.5 text-center text-[0.6875rem] tracking-wide text-ink-faint">
          One-time payment · Lifetime updates
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Navbar;
