import {
  BlockDefinition,
  HeroBlockProps,
  FeaturesBlockProps,
  CtaBlockProps,
  FooterBlockProps,
  BlockType,
  BlockInstance,
  DesignTokens,
} from "./types";

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  preset: "obsidian",
  primaryAccent: "#8b5cf6", // Neon Purple
  secondaryAccent: "#06b6d4", // Electric Cyan
  bgCanvas: "#07070d", // Obsidian Canvas
  bgSurface: "#0e0e1a", // Deep Slate Surface
  textColor: "#f1f5f9",
  textDimColor: "#94a3b8",
  fontFamily: "Inter",
  borderRadius: "lg",
};

export const TOKEN_PRESETS: Record<string, Partial<DesignTokens>> = {
  obsidian: {
    preset: "obsidian",
    primaryAccent: "#8b5cf6",
    secondaryAccent: "#06b6d4",
    bgCanvas: "#07070d",
    bgSurface: "#0e0e1a",
  },
  midnight: {
    preset: "midnight",
    primaryAccent: "#3b82f6",
    secondaryAccent: "#10b981",
    bgCanvas: "#030712",
    bgSurface: "#111827",
  },
  slate: {
    preset: "slate",
    primaryAccent: "#ec4899",
    secondaryAccent: "#8b5cf6",
    bgCanvas: "#090d16",
    bgSurface: "#151c2e",
  },
  "electric-cyan": {
    preset: "electric-cyan",
    primaryAccent: "#06b6d4",
    secondaryAccent: "#10b981",
    bgCanvas: "#040b11",
    bgSurface: "#0b1924",
  },
};

export const HERO_BLOCK_DEF: BlockDefinition<HeroBlockProps> = {
  type: "hero",
  name: "Hero Section",
  category: "Header",
  description: "Impactful full-width hero header with badge, headline, dual action triggers, and subtle glowing backdrop.",
  defaultProps: {
    badge: "Next-Generation Vault",
    headline: "Build High-Converting Interfaces with",
    highlightText: "DimensionUI",
    description: "Discover production-ready 3D components, motion primitives, and verified SaaS templates designed for modern web engineering.",
    primaryCtaText: "Get Started Free",
    primaryCtaLink: "#get-started",
    secondaryCtaText: "View Documentation",
    secondaryCtaLink: "#docs",
    align: "center",
    showMockup: true,
  },
  fields: [
    { key: "badge", label: "Top Badge Text", type: "text" },
    { key: "headline", label: "Main Headline", type: "text" },
    { key: "highlightText", label: "Highlighted Word/Phrase", type: "text" },
    { key: "description", label: "Supporting Blurb", type: "textarea" },
    { key: "primaryCtaText", label: "Primary Button Text", type: "text" },
    { key: "primaryCtaLink", label: "Primary Button Link", type: "text" },
    { key: "secondaryCtaText", label: "Secondary Button Text", type: "text" },
    { key: "secondaryCtaLink", label: "Secondary Button Link", type: "text" },
    { key: "align", label: "Text Alignment", type: "select", options: ["center", "left"] },
    { key: "showMockup", label: "Show Preview Card / Mockup", type: "boolean" },
  ],
};

export const FEATURES_BLOCK_DEF: BlockDefinition<FeaturesBlockProps> = {
  type: "features",
  name: "Features Grid",
  category: "Content",
  description: "Multi-column feature cards highlighting architecture, speed, reliability, and modern capabilities.",
  defaultProps: {
    eyebrow: "Engineered For Speed",
    headline: "Everything you need to ship faster",
    description: "Carefully calibrated components crafted with strict TypeScript types, GPU-accelerated motion, and Tailwind v4.",
    columns: "3",
    features: [
      {
        icon: "Zap",
        title: "Sub-Millisecond Animations",
        description: "Hardware accelerated bezier springs built with Framer Motion 11.",
      },
      {
        icon: "Shield",
        title: "Enterprise Type Safety",
        description: "Strict TypeScript interfaces and verified zero-dependency class composition.",
      },
      {
        icon: "Layers",
        title: "Modular Block Architecture",
        description: "Compose entire multi-device landing pages in seconds without code bloat.",
      },
      {
        icon: "Cpu",
        title: "Next.js 15 Ready",
        description: "Fully compatible with React 19 Server Components and App Router caching.",
      },
      {
        icon: "Palette",
        title: "CSS-First Design Tokens",
        description: "Tailwind v4 @theme configurations that instantly adapt to your branding.",
      },
      {
        icon: "Terminal",
        title: "CLI & MCP Integration",
        description: "Direct installation via npx dimensionui and instant AI agent discovery.",
      },
    ],
  },
  fields: [
    { key: "eyebrow", label: "Eyebrow Label", type: "text" },
    { key: "headline", label: "Section Headline", type: "text" },
    { key: "description", label: "Section Subtitle", type: "textarea" },
    { key: "columns", label: "Grid Columns (Desktop)", type: "select", options: ["2", "3", "4"] },
  ],
};

export const CTA_BLOCK_DEF: BlockDefinition<CtaBlockProps> = {
  type: "cta",
  name: "Call to Action",
  category: "Conversion",
  description: "High-conversion banner with glowing border, prominent action button, and supporting confidence copy.",
  defaultProps: {
    eyebrow: "Ready to Transform Your Workflow?",
    headline: "Start building with DimensionUI today",
    description: "Join thousands of developers shipping high-impact products with our verified component ecosystem.",
    buttonText: "Claim Your Lifetime Access",
    buttonLink: "#pricing",
    secondaryText: "One-time purchase · 100% money-back guarantee · Instant delivery",
    layout: "centered",
  },
  fields: [
    { key: "eyebrow", label: "Eyebrow Text", type: "text" },
    { key: "headline", label: "CTA Headline", type: "text" },
    { key: "description", label: "Supporting Copy", type: "textarea" },
    { key: "buttonText", label: "Action Button Text", type: "text" },
    { key: "buttonLink", label: "Action Button Link", type: "text" },
    { key: "secondaryText", label: "Subtext / Guarantee", type: "text" },
    { key: "layout", label: "Layout Style", type: "select", options: ["centered", "split"] },
  ],
};

export const FOOTER_BLOCK_DEF: BlockDefinition<FooterBlockProps> = {
  type: "footer",
  name: "Footer",
  category: "Navigation",
  description: "Comprehensive site footer with brand details, multi-column navigation links, and copyright bar.",
  defaultProps: {
    brandName: "DimensionUI",
    tagline: "The premier 3D and interactive component vault for high-converting interfaces.",
    copyrightText: `© ${new Date().getFullYear()} DimensionUI. All rights reserved.`,
    columns: [
      {
        title: "Product",
        links: [
          { label: "Templates", href: "#templates" },
          { label: "Blocks", href: "#blocks" },
          { label: "Pricing", href: "#pricing" },
          { label: "Changelog", href: "#changelog" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Documentation", href: "#docs" },
          { label: "Registry API", href: "/api/registry" },
          { label: "CLI Guide", href: "#cli" },
          { label: "Community", href: "#community" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "#privacy" },
          { label: "Terms of Service", href: "#terms" },
          { label: "License Agreement", href: "#license" },
        ],
      },
    ],
  },
  fields: [
    { key: "brandName", label: "Brand Name", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "copyrightText", label: "Copyright Notice", type: "text" },
  ],
};

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition<any>> = {
  hero: HERO_BLOCK_DEF,
  features: FEATURES_BLOCK_DEF,
  cta: CTA_BLOCK_DEF,
  footer: FOOTER_BLOCK_DEF,
  // Placeholders for future phases
  navbar: {
    type: "navbar",
    name: "Navbar",
    category: "Navigation",
    description: "Header navigation with brand logo, links, and action button.",
    defaultProps: {},
    fields: [],
  },
  logocloud: {
    type: "logocloud",
    name: "Logo Cloud",
    category: "Content",
    description: "Social proof ticker of company logos.",
    defaultProps: {},
    fields: [],
  },
  testimonials: {
    type: "testimonials",
    name: "Testimonials",
    category: "Content",
    description: "Customer feedback and review cards.",
    defaultProps: {},
    fields: [],
  },
  pricing: {
    type: "pricing",
    name: "Pricing Cards",
    category: "Conversion",
    description: "Tier comparison cards with monthly and annual toggle.",
    defaultProps: {},
    fields: [],
  },
  faq: {
    type: "faq",
    name: "FAQ Accordion",
    category: "Content",
    description: "Frequently asked questions with animated expand/collapse.",
    defaultProps: {},
    fields: [],
  },
};

/**
 * Creates a unique new instance of a block definition.
 */
export function createBlockInstance(type: BlockType): BlockInstance {
  const def = BLOCK_DEFINITIONS[type];
  const uniqueId = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  return {
    id: uniqueId,
    type,
    props: JSON.parse(JSON.stringify(def.defaultProps)),
  };
}

/**
 * Factory for initial starter page.
 */
export function createStarterPage(): BlockInstance[] {
  return [
    createBlockInstance("hero"),
    createBlockInstance("features"),
    createBlockInstance("cta"),
    createBlockInstance("footer"),
  ];
}
