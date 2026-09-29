# DimensionUI — Agent Guidelines & Architecture Manual

This document provides system instructions, conventions, design rules, and technical guardrails for AI coding assistants (Claude, Cursor, Antigravity, Copilot) working within or integrating with the DimensionUI codebase.

---

## 1. Project Overview & Tech Stack

DimensionUI is a premium 3D and interactive component & template vault built on modern web standards:
- **Framework:** Next.js 15.1.6 (App Router with Server Actions & Static Site Generation)
- **UI Runtime:** React 19.0.0
- **Styling:** Tailwind CSS v4.0.0 with CSS-first `@theme` configuration
- **Animations:** Framer Motion 11.15.0 with GPU-accelerated spring & bezier physics
- **Icons:** Lucide React (standardized iconography)
- **State Management:** Zustand 5.0 (cart, wishlist, compare drawer persistence)
- **Type Safety:** TypeScript 5.7.3 strict mode

---

## 2. Directory Structure

```
├── app/
│   ├── globals.css                # Tailwind v4 @theme tokens & @utility definitions
│   ├── layout.tsx                 # Root HTML shell, ambient backdrop, navbar & footer
│   ├── page.tsx                   # Main landing page (hero, pills, gallery, FAQ, pricing)
│   ├── template/[id]/page.tsx     # Dynamic SEO template detail page (42 static pages)
│   ├── preview/[id]/page.tsx      # Multi-device responsive preview viewport
│   ├── dashboard/page.tsx         # User vault dashboard & download manager
│   ├── login/page.tsx             # Authentication entrypoint
│   └── api/
│       ├── registry/route.ts      # Machine-readable registry catalog index
│       ├── registry/[name]/route.ts # Individual template/block manifest endpoint
│       ├── registry/validate/route.ts # Registry manifest schema validator
│       └── download/[id]/route.ts # Secure ZIP generator for purchased templates
├── components/
│   ├── hero.tsx                   # Interactive hero section with particle effects
│   ├── preview-frame.tsx          # Multi-device iframe sandbox & live theme playground
│   ├── template-compatibility.tsx # Verified framework/platform compatibility matrix
│   ├── template-integrations.tsx  # Third-party integration cards (PayPal, Supabase, etc.)
│   ├── template-quality-badges.tsx# Real Lighthouse audit verification component
│   ├── template-figma.tsx         # Figma support status, external links, & code-first notices
│   ├── template-changelog.tsx     # Release notes and version history timeline
│   └── sections/
│       ├── gallery.tsx            # Filterable template grid with instant search
│       ├── playbooks.tsx          # Market category showcases
│       ├── pricing.tsx            # One-time access pricing cards
│       └── faq.tsx                # Accordion FAQ
├── lib/
│   ├── site.ts                    # CANONICAL SOURCE OF TRUTH (copy, TEMPLATES, GALLERY_ITEMS)
│   ├── registry.ts                # Machine-readable registry manifest generator & validator
│   ├── verified-quality-data.json # Real recorded Lighthouse performance scores
│   ├── store.ts                   # Zustand shopping cart store
│   └── cn.ts                      # Dependency-free class name utility
├── packages/
│   ├── cli/                       # Standalone npx dimensionui CLI tool
│   └── mcp/                       # Model Context Protocol discovery server
└── scripts/                       # Automated test suites & verification runners
```

---

## 3. Core Design Tokens & Palette

DimensionUI utilizes a sleek, dark obsidian aesthetic with curated neon accents. Tokens are declared in `app/globals.css` under `@theme`:

| Token | Hex / Value | Usage |
|---|---|---|
| `--color-obsidian` | `#07070d` | Deep background canvas |
| `--color-surface` | `#0e0e1a` | Card & modal background |
| `--color-hairline` | `rgba(255,255,255,0.08)` | Subtle border separators |
| `--color-neon-purple` | `#8b5cf6` | Primary brand accent & glowing highlights |
| `--color-electric-cyan` | `#06b6d4` | Secondary interactive accent & badges |
| `--color-ink` | `#f1f5f9` (Slate-100) | Primary readable typography |
| `--color-ink-dim` | `#94a3b8` (Slate-400) | Secondary supporting copy |

### Glassmorphism Utilities
- **`glass`**: Subtle frosted background (`backdrop-blur-md bg-white/[0.03] border-white/10`).
- **`glass-solid`**: Near-opaque frosted background (`backdrop-blur-xl bg-[#0e0e1a]/95 border-white/10`). Always use `glass-solid` over busy backgrounds to ensure WCAG AA contrast.

---

## 4. Animation Conventions

- **Framer Motion Easing:** Standard smooth deceleration curve:
  `const EASE = [0.16, 1, 0.3, 1];`
- **Micro-interactions:** Hover transitions use `transition-all duration-300 hover:-translate-y-0.5`.
- **AnimatePresence:** Modals, toast notifications, and drawers must be wrapped in `<AnimatePresence>` with clean exit transitions (`exit={{ opacity: 0, scale: 0.95 }}`).

---

## 5. Registry & CLI Integration

DimensionUI provides machine-readable metadata and a standalone CLI:

### CLI Commands:
```bash
# List available templates and blocks
npx dimensionui list --tier free

# Inspect technical details and dependencies
npx dimensionui info aether-ai-saas

# Install a template or component into the current project
npx dimensionui add aether-ai-saas
```

### Registry Endpoints:
- `GET /api/registry`: Catalog index with filtering by `?type=`, `?tier=`, `?access=`, and `?search=`.
- `GET /api/registry/[name]`: Comprehensive machine-readable manifest (`name`, `version`, `dependencies`, `files`, `license`, `metadata`).

---

## 6. Strict Do-Not-Change Rules

1. **All Copy & Data Lives in [`lib/site.ts`](file:///c:/Users/91810/WorkBuddy%20AI/2026-09-16-14-27-27/lib/site.ts)**:
   Never hardcode strings, template lists, or feature bullet points directly inside JSX components. The navbar, gallery, detail pages, and registry must share the identical source of truth.
2. **Never Hardcode `display` on Reusable Components**:
   Tailwind v4 outputs classes in cascade order. Hardcoding `inline-flex` overrides caller classes like `hidden` or `md:flex`. Allow the parent caller to pass responsive layout classes.
3. **Strict Truth-in-Advertising**:
   - **Figma:** Never claim "Figma Included" unless a verified, genuine Figma URL is present. Templates without Figma must display "No Figma File (Code-First)".
   - **Quality Indicators:** Never hardcode fabricated 100/100 marketing scores. Display real audit results from [`lib/verified-quality-data.json`](file:///c:/Users/91810/WorkBuddy%20AI/2026-09-16-14-27-27/lib/verified-quality-data.json).
   - **Integrations:** Never claim an integration exists unless substantiated in code. Payment checkout uses **PayPal** (never Stripe).
4. **Commercial Resource Gating**:
   Free templates (`tier: "free"`) are public and open. Paid templates (`tier: "15" | "20" | "30"`) require license authorization; source code files must remain locked to unauthorized requests.
5. **Zero Secret Exposure**:
   Never expose Supabase service role keys, database connection strings, or server environment variables in client components, registry manifests, or MCP responses.
