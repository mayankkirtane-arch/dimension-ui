"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { CtaButton } from "@/components/navbar";
import { scrollToHash, useSmoothScroll } from "@/lib/hooks";
import { CTA_HREF, FOOTER } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Final CTA band                                                    */
/*                                                                    */
/*  Sits directly above the footer as the last conversion opportunity  */
/*  for someone who scrolled the whole page without clicking.         */
/* ------------------------------------------------------------------ */

function FinalCta() {
  const smoothScroll = useSmoothScroll();

  return (
    <div className="relative mx-auto max-w-6xl px-5 pb-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface/60 px-6 py-12 text-center backdrop-blur-xl sm:px-12 sm:py-16">
        {/* Ambient glows */}
        <span
          aria-hidden="true"
          className="glow-purple pointer-events-none absolute -top-28 left-1/4 size-72 rounded-full opacity-70 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="glow-cyan pointer-events-none absolute -bottom-28 right-1/4 size-72 rounded-full opacity-60 blur-3xl"
        />
        {/* Dot grid */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-60"
        />

        <div className="relative">
          <h2 className="text-[1.6rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[2.1rem]">
            Stop rebuilding the same hero for every client.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-pretty text-ink-dim">
            Ship your next big launch in an afternoon with our premium templates.
            instead of a sprint.
          </p>

          <div className="mt-8 flex justify-center">
            <CtaButton
              href={CTA_HREF}
              onClick={(e) => smoothScroll(e, CTA_HREF)}
              label="Browse Templates"
              className="inline-flex px-7 py-3.5 text-[0.9375rem]"
            />
          </div>

          <p className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] text-ink-faint">
            <Sparkles className="size-3 text-neon-purple-bright" />
            Instant download · Lifetime updates · Flexible refund policy
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                            */
/* ------------------------------------------------------------------ */

export function SiteFooter() {
  const smoothScroll = useSmoothScroll();

  return (
    <footer className="relative mt-20 border-t border-hairline">
      {/* Subtle top sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />

      <FinalCta />

      <div className="mx-auto max-w-6xl px-5 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <a
              href="#top"
              onClick={(e) => smoothScroll(e, "#top")}
              className="inline-flex items-center gap-2.5 rounded-lg transition-transform duration-300 active:scale-[0.98]"
              aria-label="DimensionUI — back to top"
            >
              <BrandMark size={30} static />
              <span className="text-[1rem] leading-none font-semibold tracking-[-0.02em] text-ink">
                Dimension
                <span className="text-gradient-brand">UI</span>
              </span>
            </a>
            <p className="mt-4 max-w-[38ch] text-[0.8125rem] leading-relaxed text-ink-faint">
              {FOOTER.tagline}
            </p>
          </div>

          {/* Link columns */}
          {FOOTER.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-[0.6875rem] font-medium tracking-[0.18em] text-ink uppercase">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        onClick={(e) => smoothScroll(e, link.href)}
                        className="text-[0.8125rem] text-ink-dim transition-colors duration-300 hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[0.8125rem] text-ink-dim transition-colors duration-300 hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-6 sm:flex-row">
          <p className="text-[0.75rem] text-ink-faint">
            © {new Date().getFullYear()} Dimension
            <span className="text-gradient-brand">UI</span>. All rights reserved.
          </p>

          <button
            type="button"
            onClick={() => scrollToHash("#top")}
            className="group inline-flex items-center gap-2 rounded-lg border border-hairline bg-white/[0.03] px-3 py-1.5 text-[0.75rem] text-ink-dim transition-all duration-300 hover:border-hairline-strong hover:bg-white/[0.07] hover:text-ink"
          >
            Back to top
            <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
