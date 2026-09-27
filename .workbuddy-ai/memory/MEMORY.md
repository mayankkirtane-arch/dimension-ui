# DimensionUI — project notes

## What it is
SaaS landing page for "DimensionUI", a 3D / interactive web-component vault.
Audience: SaaS & AI, Local Business & Clinics, B2B & Enterprise,
E-Commerce & Drops. One-time $29 all-access positioning.

## Stack & conventions
- Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS v4, Framer
  Motion, Lucide React.
- **Tailwind v4:** tokens live in `@theme` in `app/globals.css`; custom styling
  is authored with `@utility` (not `@layer utilities`). No `tailwind.config.js`.
- **All copy and anchor ids live in `lib/site.ts`** — components never hard-code
  user-facing strings. Keep new nav/section content there so the navbar, mobile
  sheet, and sections can't drift apart.
- Class composition uses `cn()` from `lib/cn.ts` (dependency-free; no clsx/tw-merge).
- Design tokens: obsidian `#07070d`, surface `#0e0e1a`, hairline
  `rgba(255,255,255,0.08)`, neon purple `#8b5cf6`, electric cyan `#06b6d4`,
  ink slate-200. Glassmorphism via the `glass` / `glass-solid` utilities.

## Rules learned the hard way
- **Never let a reusable component hard-code `display`** (e.g. `inline-flex` in a
  base class string) if callers need responsive visibility — Tailwind emits
  `inline-flex` after `hidden`, so it wins and `hidden`/`lg:hidden` silently stop
  working. Let the caller pass the display class.
- **`glass` must carry a near-opaque background colour.** `backdrop-filter` alone
  does not darken; a low-alpha gradient over bright content makes text
  unreadable. Use `glass-solid` for panels overlaying busy content.
- Anchor scrolling uses an **88px navbar offset** in `scrollToHash` plus
  `scroll-padding-top: 6.5rem` on `html`. Keep these in sync.

## Verification
- `scripts/verify-responsive.js` — multi-viewport computed-style assertions +
  screenshots + console-error capture (headless Chrome via CDP).
- `scripts/verify-menu.js` — mobile sheet open/close, Escape, scroll lock,
  anchor offset, using real dispatched mouse events.
- `scripts/inspect-element.js` — dump CSS rules matching a selector at a viewport.
- Requires `ws` (installed with `--no-save`) and a running `next start`.

## Status
Foundation + navbar + hero + category pills complete and verified. The sections
behind the nav anchors (`#gallery`, `#saas`, `#local-business`, `#b2b-agency`,
`#pricing`, `#faq`) are intentional stubs in `components/section-anchors.tsx`
driven by `PLACEHOLDER_SECTIONS` — they exist so anchors/active-section tracking
work, and are the next build pass.
