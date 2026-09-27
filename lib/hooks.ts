"use client";

import { useCallback, useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  useScrollProgress                                                 */
/* ------------------------------------------------------------------ */

/**
 * Tracks how far the page has scrolled, as a 0..1 ratio.
 * Uses rAF-coalesced reads so we never thrash layout on the scroll thread.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let queued = false;

    const measure = () => {
      queued = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(doc.scrollTop / max, 1) : 0);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return progress;
}

/* ------------------------------------------------------------------ */
/*  useScrolled                                                       */
/* ------------------------------------------------------------------ */

/**
 * True once the page has scrolled past `threshold` px.
 * Drives the navbar's "condensed glass" state.
 */
export function useScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    let queued = false;

    const measure = () => {
      queued = false;
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return scrolled;
}

/* ------------------------------------------------------------------ */
/*  scrollToHash                                                      */
/* ------------------------------------------------------------------ */

/**
 * Smooth-scrolls to a `#hash` target, accounting for the sticky navbar.
 *
 * Falls back gracefully: if the target does not exist we still update the
 * URL hash so the link is never a dead click, and we honour the user's
 * reduced-motion preference.
 */
export function scrollToHash(hash: string): void {
  if (typeof document === "undefined") return;

  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const target = document.getElementById(id);

  if (!target) {
    window.location.hash = hash;
    return;
  }

  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Navbar height (~68px) plus breathing room.
  const offset = 88;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: reduce ? "auto" : "smooth",
  });

  // Keep the URL in sync without triggering a second native jump.
  if (window.history?.replaceState) {
    window.history.replaceState(null, "", hash);
  }
}

/* ------------------------------------------------------------------ */
/*  useSmoothScroll                                                   */
/* ------------------------------------------------------------------ */

/** Returns a click handler that smooth-scrolls to a hash. */
export function useSmoothScroll() {
  return useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, hash?: string) => {
      const target = hash ?? event.currentTarget.getAttribute("href");
      if (!target || !target.startsWith("#")) return;
      event.preventDefault();
      scrollToHash(target);
    },
    [],
  );
}
