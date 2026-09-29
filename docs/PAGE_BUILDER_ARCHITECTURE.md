# DimensionUI Page Builder — Architecture & Specification Manual

This document defines the technical design, data schemas, code generation pipeline, and execution roadmap for the **DimensionUI Page Builder**.

---

## 1. Goal & Product Vision

The DimensionUI Page Builder enables developers, founders, and designers to compose production-ready landing pages and web applications by assembling modular DimensionUI blocks on an interactive visual canvas, customizing design tokens and block content in real time, and exporting clean, accessible Next.js 15 / React 19 code.

### Core Workflow
```
Choose Block (Vault Catalog)
        │
        ▼
Add to Canvas (Sequential Block Tree)
        │
        ▼
Reorder & Structure (Clean Reordering Controls)
        │
        ▼
Customize Content & Design Tokens (Live Visual Inspector)
        │
        ▼
Multi-Device Preview (Desktop 1440px / Tablet 768px / Mobile 375px)
        │
        ▼
Export Clean Code (TSX Component with Tailwind v4 & Framer Motion)
```

---

## 2. Component & Template Architecture Audit

### Audit Findings
DimensionUI currently contains **42 complete templates** and **modular gallery blocks** (Hero, Bento grids, pricing tables, testimonials, feature showcases). 

Existing components fall into three architectural categories:
1. **Monolithic Page Templates** (`app/template/[id]/page.tsx`, `components/preview-frame.tsx`):
   - Coupled to full-page layouts, mockups, and fixed SEO configurations.
   - *Status:* Cannot be imported directly into a builder without decomposition.
2. **Modular Section Components** (`components/sections/*.tsx`, `components/hero.tsx`):
   - Render sections such as FAQ, Pricing, Bundles, and Playbooks.
   - *Status:* Cleanly decomposable into parameterized builder blocks.
3. **Core Atoms & Primitives** (`components/ui/*`, `components/brand-mark.tsx`, `lib/cn.ts`):
   - Fully reusable across builder canvas instances.

### Block Suitability Matrix
| Block Type | Reusability Grade | Isolation Strategy | Safe For POC? |
|---|---|---|---|
| **Navbar** | High | Needs fixed vs relative positioning toggle | Phase 2 |
| **Hero** | High | Self-contained padding, parameterized copy & CTAs | **Yes (POC)** |
| **Features** | High | Configurable grid (2, 3, 4 cols) & item array | **Yes (POC)** |
| **Logo Cloud** | High | Simple SVG / text ticker | Phase 2 |
| **Testimonials** | Medium | Card grid or carousel | Phase 2 |
| **Pricing** | High | Tier cards, toggle for monthly/annual | Phase 2 |
| **FAQ** | High | Animated accordion | Phase 2 |
| **CTA** | High | Centered or split layout with action triggers | **Yes (POC)** |
| **Footer** | High | Column links, brand, and copyright bar | **Yes (POC)** |

---

## 3. Component & Block Schema

Every builder block conforms to a typed specification:

```typescript
export type BlockType =
  | "navbar"
  | "hero"
  | "features"
  | "logocloud"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta"
  | "footer";

export interface EditableField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "boolean" | "color" | "list";
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

export interface BlockDefinition<TProps = Record<string, any>> {
  type: BlockType;
  name: string;
  category: "Header" | "Content" | "Conversion" | "Navigation";
  description: string;
  defaultProps: TProps;
  fields: EditableField[];
}

export interface BlockInstance<TProps = Record<string, any>> {
  id: string; // Unique instance ID (e.g., 'hero-172948293')
  type: BlockType;
  variant?: string;
  props: TProps;
}
```

---

## 4. Page Schema & Tree Hierarchy

A page in the builder is represented as a serializable JSON document:

```typescript
export interface PageSchema {
  id: string;
  version: string; // e.g. "1.0.0"
  title: string;
  description?: string;
  tokens: DesignTokens;
  blocks: BlockInstance[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    generator: "DimensionUI Page Builder v1.0.0";
  };
}
```

---

## 5. Design-Token Schema

Design tokens align with DimensionUI's Tailwind CSS v4 `@theme` configuration:

```typescript
export interface DesignTokens {
  preset: "obsidian" | "midnight" | "slate" | "electric-cyan";
  primaryAccent: string;   // e.g. "#8b5cf6" (Neon Purple)
  secondaryAccent: string; // e.g. "#06b6d4" (Electric Cyan)
  bgCanvas: string;        // e.g. "#07070d" (Obsidian canvas)
  bgSurface: string;       // e.g. "#0e0e1a" (Card surface)
  textColor: string;       // e.g. "#f1f5f9" (Slate-100)
  textDimColor: string;    // e.g. "#94a3b8" (Slate-400)
  fontFamily: "Inter" | "Outfit" | "Plus Jakarta Sans" | "System";
  borderRadius: "none" | "sm" | "md" | "lg" | "xl" | "full";
}
```

---

## 6. Export Strategy & Generated Code Output

The code exporter converts the live `PageSchema` into:
1. **Production-Ready Next.js 15 / React 19 TSX File:**
   - Single standalone component (`export default function GeneratedLandingPage()`).
   - Uses Tailwind CSS v4 utility classes.
   - Includes Framer Motion animations with GPU acceleration.
   - Includes Lucide React icons.
   - Zero external builder runtime dependencies; pure copy-pasteable code.
2. **DimensionUI Machine-Readable Manifest (`schema.json`):**
   - Enables saving and loading builder templates without loss of token or block structures.

---

## 7. Block Conflict Analysis & Mitigations

| Conflict Area | Technical Risk | Mitigation Strategy |
|---|---|---|
| **Z-Index Collision** | Sticky Navbars overlapping dropdowns or modals | Enforce strict z-index scale: Nav (`z-40`), Modals (`z-50`), Content (`z-10`), Backgrounds (`z-0`). |
| **Overflow Leakage** | Motion animations causing horizontal scrollbars on mobile | Wrap all canvas sections in `relative overflow-hidden w-full`. |
| **Theme Bleed** | Hardcoded text colors clashing with token changes | Reference CSS custom properties (`var(--primary-accent)`, `var(--bg-canvas)`) or Tailwind classes using token values. |
| **Cascading Margins** | Collapsing vertical margins causing uneven spacing | Use explicit padding scales (`py-20`, `py-24`) on section wrappers instead of vertical margins. |

---

## 8. Responsive Behavior Specifications

- **Mobile Viewport (`375px`)**:
  - Full width padding (`px-4 sm:px-6`).
  - Hero headline scales to `text-3xl sm:text-4xl`.
  - Feature grids collapse to a single column (`grid-cols-1`).
  - Button actions stack vertically with full-width tap targets (`w-full sm:w-auto`).
- **Tablet Viewport (`768px`)**:
  - Feature grids adopt a 2-column layout (`md:grid-cols-2`).
  - Balanced typography with `max-w-2xl mx-auto`.
- **Desktop Viewport (`1440px+`)**:
  - Full grid distribution (`lg:grid-cols-3` or `lg:grid-cols-4`).
  - Max container width constrained to `max-w-6xl` or `max-w-7xl mx-auto`.

---

## 9. Security Considerations

1. **XSS Prevention in Code Generator**:
   All user-supplied strings (headlines, descriptions, URLs) are sanitized during TSX serialization. Escaping prevents `<script>` tags, attribute breakouts, or JSX interpolation injection.
2. **Schema Sanitization**:
   JSON import validates strictly against `PageSchema`. Forbidden JavaScript prototype properties (`__proto__`, `constructor`) are rejected.
3. **No Arbitrary Filesystem or Secret Access**:
   The page builder operates entirely in the browser client; it does not trigger file system mutations or expose Supabase environment variables.

---

## 10. Recommended Implementation Phases

- **Phase 1 (Current Task): Core Proof of Concept (POC)**
  - Schema definitions & data types.
  - 4 Essential Blocks: **Hero**, **Features**, **CTA**, **Footer**.
  - Interactive Canvas with real-time editing, Up/Down reordering, and block duplication.
  - Multi-device preview viewport (Desktop, Tablet, Mobile).
  - Code generator (TSX) and JSON export.
- **Phase 2: Complete Block Library**
  - Add Navbar, Logo Cloud, Testimonials, Pricing tables, and FAQ accordion.
- **Phase 3: Drag-and-Drop & Visual Tree**
  - Drag-and-drop reordering with Framer Motion layout reorder physics.
  - Undo / Redo history stack.
- **Phase 4: DimensionUI Registry & CLI Export**
  - Direct integration: `npx dimensionui export <page-id>`.
