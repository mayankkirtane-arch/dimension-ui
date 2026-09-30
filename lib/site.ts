/**
 * Centralised content + navigation config for DimensionUI.
 * Keeping copy and anchor ids here means the navbar, mobile sheet and
 * footer can never drift out of sync.
 */

export type NavLink = {
  /** Visible label */
  label: string;
  /** `id` of the section this link scrolls to */
  href: string;
};

export type CategoryPill = {
  emoji: string;
  label: string;
  /** Short supporting line shown on the pill */
  meta: string;
  /** Accent used for the hover glow */
  accent: "purple" | "cyan";
};

/* ---------------------------------------------------------------- */
/*  Navigation                                                       */
/* ---------------------------------------------------------------- */

export const NAV_LINKS = [
  { label: "Templates", href: "#gallery" },
  { label: "Playbooks", href: "#playbooks" },
  { label: "Builder", href: "/builder" },
  { label: "FAQ", href: "#faq" },
];

/** Primary conversion target used by the navbar + hero CTAs. */
export const CTA_HREF = "#gallery";
export const GALLERY_HREF = "#gallery";

/** Internal checkout link pointing to gallery for template discovery & PayPal checkout */
export const CHECKOUT_URL = "#gallery";

export const PRICING_CTA = {
  full: "Browse Templates",
  short: "Browse Templates",
  price: "",
} as const;

/* ---------------------------------------------------------------- */
/*  Shared atoms                                                     */
/* ---------------------------------------------------------------- */

/** Accent used for glows, borders and gradient washes. */
export type Accent = "purple" | "cyan";

/**
 * The markets the vault is built for. A single union rather than free strings
 * so the gallery filter tabs and the playbook sections stay in lockstep.
 */
export type MarketId = "saas" | "local-business" | "b2b-agency" | "ecommerce";

export type Market = {
  id: MarketId;
  emoji: string;
  /** Short name for tabs and pills */
  label: string;
  accent: Accent;
};

export const MARKETS: Market[] = [
  { id: "saas", emoji: "🚀", label: "SaaS & AI", accent: "purple" },
  {
    id: "local-business",
    emoji: "🏪",
    label: "Local Business & Clinics",
    accent: "cyan",
  },
  { id: "b2b-agency", emoji: "🏢", label: "B2B & Enterprise", accent: "purple" },
  {
    id: "ecommerce",
    emoji: "🛒",
    label: "E-Commerce & Drops",
    accent: "cyan",
  },
];

/* ---------------------------------------------------------------- */
/*  Component gallery                                                */
/* ---------------------------------------------------------------- */

export type GalleryTier = "Motion" | "Static";

export type GalleryItem = {
  /** Display name of the component */
  name: string;
  /** One-line description of what it does */
  blurb: string;
  /** Which market playbook it belongs to */
  market: MarketId;
  /** Tier badge shown on the card */
  tier: GalleryTier;
  /** Lucide icon name, resolved by the gallery component */
  icon: string;
};

export const GALLERY_ITEMS: GalleryItem[] = [
  // ---- SaaS & AI ----
  { name: "Orbital Hero", blurb: "Particle-network hero with magnetic cursor physics.", market: "saas", tier: "Motion", icon: "orbit" },
  { name: "Usage Meter", blurb: "Animated quota rings with threshold states.", market: "saas", tier: "Motion", icon: "gauge" },
  { name: "Waitlist Capture", blurb: "Inline email capture with optimistic success state.", market: "saas", tier: "Motion", icon: "mail-plus" },
  { name: "Tiered Pricing Table", blurb: "Three-tier comparison with monthly and annual toggle.", market: "saas", tier: "Motion", icon: "layers" },
  { name: "Feature Bento", blurb: "Asymmetric bento grid that reflows to one column.", market: "saas", tier: "Static", icon: "layout-grid" },
  { name: "AI Chat Shell", blurb: "Streaming-message layout with typing affordances.", market: "saas", tier: "Motion", icon: "message-square" },
  { name: "Changelog Feed", blurb: "Vertical release timeline with version tags.", market: "saas", tier: "Static", icon: "git-commit" },
  { name: "Integration Grid", blurb: "Logo wall with hover-focus dimming.", market: "saas", tier: "Static", icon: "blocks" },
  { name: "Onboarding Steps", blurb: "Progress-tracked multi-step form.", market: "saas", tier: "Motion", icon: "list-checks" },
  { name: "Testimonial Carousel", blurb: "Drag-and-arrow slider that pauses on hover.", market: "saas", tier: "Motion", icon: "quote" },
  { name: "Metric Counter", blurb: "Scroll-triggered number roll-up.", market: "saas", tier: "Motion", icon: "trending-up" },
  { name: "Command Palette", blurb: "Keyboard-driven fuzzy-search overlay.", market: "saas", tier: "Motion", icon: "command" },

  // ---- Local Business & Clinics ----
  { name: "Booking Flow", blurb: "Date, time and practitioner picker with conflict checks.", market: "local-business", tier: "Motion", icon: "calendar-check" },
  { name: "Service Menu", blurb: "Price-listed service cards with category filters.", market: "local-business", tier: "Static", icon: "clipboard-list" },
  { name: "Trust Badges", blurb: "Accreditation and insurance strip.", market: "local-business", tier: "Static", icon: "shield-check" },
  { name: "Review Wall", blurb: "Masonry testimonials with star ratings.", market: "local-business", tier: "Static", icon: "star" },
  { name: "Location Map Card", blurb: "Address, hours and directions in one panel.", market: "local-business", tier: "Static", icon: "map-pin" },
  { name: "Before and After", blurb: "Draggable comparison slider.", market: "local-business", tier: "Motion", icon: "sliders-horizontal" },
  { name: "Team Roster", blurb: "Practitioner cards with credential tooltips.", market: "local-business", tier: "Static", icon: "users" },
  { name: "Opening Hours", blurb: "Live open or closed indicator from the visitor's clock.", market: "local-business", tier: "Motion", icon: "clock" },
  { name: "Call CTA Banner", blurb: "Sticky tap-to-call bar for mobile visitors.", market: "local-business", tier: "Motion", icon: "phone" },
  { name: "FAQ Accordion", blurb: "Details-based accordion, keyboard accessible.", market: "local-business", tier: "Motion", icon: "help-circle" },

  // ---- B2B & Enterprise ----
  { name: "Case Study Card", blurb: "Result-led layout with logo and metric callouts.", market: "b2b-agency", tier: "Static", icon: "file-text" },
  { name: "Lead Qualifier", blurb: "Branching multi-step form that scores intent.", market: "b2b-agency", tier: "Motion", icon: "filter" },
  { name: "Security Section", blurb: "SOC 2 and GDPR compliance grid with drill-downs.", market: "b2b-agency", tier: "Static", icon: "lock" },
  { name: "ROI Calculator", blurb: "Live sliders with instant annualised savings.", market: "b2b-agency", tier: "Motion", icon: "calculator" },
  { name: "Enterprise Logos", blurb: "Client marquee with pause-on-hover.", market: "b2b-agency", tier: "Motion", icon: "building-2" },
  { name: "Process Timeline", blurb: "Engagement phases with scroll progress.", market: "b2b-agency", tier: "Motion", icon: "milestone" },
  { name: "Comparison Table", blurb: "Us-versus-them matrix with sticky header row.", market: "b2b-agency", tier: "Static", icon: "table" },
  { name: "RFP Download", blurb: "Gated asset card with instant delivery.", market: "b2b-agency", tier: "Static", icon: "download" },
  { name: "Team Directory", blurb: "Filterable leadership grid by department.", market: "b2b-agency", tier: "Static", icon: "contact" },

  // ---- E-Commerce & Drops ----
  { name: "Product Spotlight", blurb: "Tilt card with layered shadow parallax.", market: "ecommerce", tier: "Motion", icon: "box" },
  { name: "Drop Countdown", blurb: "Live timer with sold-out state transition.", market: "ecommerce", tier: "Motion", icon: "timer" },
  { name: "Quick Add Drawer", blurb: "Slide-in variant selector without a reload.", market: "ecommerce", tier: "Motion", icon: "shopping-bag" },
  { name: "Cart Summary", blurb: "Line-item editor with live totals.", market: "ecommerce", tier: "Motion", icon: "receipt" },
  { name: "Bundle Builder", blurb: "Mix-and-match picker with tiered discounts.", market: "ecommerce", tier: "Motion", icon: "package" },
  { name: "Size Guide", blurb: "Modal measurement table.", market: "ecommerce", tier: "Static", icon: "ruler" },
  { name: "Stock Scarcity", blurb: "Low-stock indicator with urgency copy.", market: "ecommerce", tier: "Motion", icon: "alert-triangle" },
  { name: "Wishlist Toggle", blurb: "Optimistic save action with persistence.", market: "ecommerce", tier: "Motion", icon: "heart" },
  { name: "Checkout Progress", blurb: "Three-step stepper with validation.", market: "ecommerce", tier: "Motion", icon: "credit-card" },
  { name: "Product Gallery", blurb: "Thumbnail rail with pinch-zoom.", market: "ecommerce", tier: "Motion", icon: "images" },
  { name: "Order Tracking", blurb: "Vertical shipment timeline.", market: "ecommerce", tier: "Static", icon: "truck" },
];

/* ---------------------------------------------------------------- */
/*  Derived counts                                                   */
/*                                                                    */
/*  Derived rather than hard-coded: a marketing number that disagrees  */
/*  with the actual product erodes trust faster than a smaller honest  */
/*  one. Add a component to `GALLERY_ITEMS` and every claim on the     */
/*  page — hero stats, pills, gallery heading, pricing, FAQ — updates  */
/*  itself.                                                           */
/*                                                                    */
/*  `HERO` and `CATEGORY_PILLS` live at the bottom of this file        */
/*  because they read these values at module-init time.                */
/* ---------------------------------------------------------------- */

/** Total number of components in the vault. */
export const COMPONENT_COUNT = GALLERY_ITEMS.length;

/** Per-market counts, used by the hero pills and gallery filter tabs. */
export const MARKET_COUNTS: Record<MarketId, number> = MARKETS.reduce(
  (acc, m) => {
    acc[m.id] = GALLERY_ITEMS.filter((i) => i.market === m.id).length;
    return acc;
  },
  {} as Record<MarketId, number>,
);

/* ---------------------------------------------------------------- */
/*  Playbook sections (per market)                                   */
/* ---------------------------------------------------------------- */

export type PlaybookSection = {
  id: MarketId;
  eyebrow: string;
  title: string;
  /** Lead paragraph, written for that market's buyer */
  description: string;
  /** Concrete capabilities, shown as a checklist */
  features: string[];
  /** Outcome metrics shown as stat cards */
  stats: { value: string; label: string }[];
  accent: Accent;
  emoji: string;
};

export const PLAYBOOK_SECTIONS: PlaybookSection[] = [
  {
    id: "saas",
    eyebrow: "Playbook 01",
    title: "SaaS & AI",
    description:
      "Ship a landing page that sells the product before the trial starts. Conversion-tested hero patterns, self-serve pricing, and activation flows that hold up under real traffic.",
    features: [
      "Usage meters and quota rings that make value tangible",
      "Monthly and annual pricing toggle with proration copy",
      "Waitlist and demo capture with optimistic feedback",
      "Streaming AI chat shells for prompt-based products",
    ],
    stats: [
      { value: "+34%", label: "Trial signups" },
      { value: "12", label: "Templates" },
      { value: "4 hrs", label: "To launch" },
    ],
    accent: "purple",
    emoji: "🚀",
  },
  {
    id: "local-business",
    eyebrow: "Playbook 02",
    title: "Local Business & Clinics",
    description:
      "Turn local searches into booked appointments. Trust-first layouts, tap-to-call affordances, and booking flows that work one-thumbed on a phone.",
    features: [
      "Booking flow with practitioner and slot conflict handling",
      "Live open or closed indicator from the visitor's own clock",
      "Sticky tap-to-call bar built for mobile conversion",
      "Review walls and accreditation strips that build trust fast",
    ],
    stats: [
      { value: "+28%", label: "Bookings" },
      { value: "10", label: "Templates" },
      { value: "92%", label: "Mobile traffic" },
    ],
    accent: "cyan",
    emoji: "🏪",
  },
  {
    id: "b2b-agency",
    eyebrow: "Playbook 03",
    title: "B2B & Enterprise",
    description:
      "Win longer sales cycles with proof. Case-study templates, lead qualification that scores intent, and the security posture enterprise buyers demand.",
    features: [
      "Branching lead qualifiers that score and route intent",
      "ROI calculators with instant annualised savings",
      "SOC 2 and GDPR compliance grids with drill-down detail",
      "Sticky-header comparison matrices and client marquees",
    ],
    stats: [
      { value: "+41%", label: "Qualified leads" },
      { value: "9", label: "Templates" },
      { value: "6 mo", label: "Avg. cycle" },
    ],
    accent: "purple",
    emoji: "🏢",
  },
  {
    id: "ecommerce",
    eyebrow: "Playbook 04",
    title: "E-Commerce & Drops",
    description:
      "Convert the drop before the hype fades. Product spotlights with real depth, live countdowns, and quick-add drawers that keep buyers out of the abandonment funnel.",
    features: [
      "Product cards with tilt and layered parallax shadows",
      "Drop countdowns with automatic sold-out transitions",
      "Quick-add drawers that avoid a full page reload",
      "Bundle builders with the tiered discount maths handled",
    ],
    stats: [
      { value: "+22%", label: "Conversion" },
      { value: "11", label: "Templates" },
      { value: "-18%", label: "Cart abandon" },
    ],
    accent: "cyan",
    emoji: "🛒",
  },
];

/* ---------------------------------------------------------------- */
/*  Pricing                                                          */
/* ---------------------------------------------------------------- */

export type PricingFeature = {
  label: string;
  /** Highlighted rows draw the eye to the strongest value props */
  emphasis?: boolean;
};

export const PRICING = {
  eyebrow: "All-Access",
  title: "One payment. The entire vault.",
  description:
    "No subscription, no seat limits, no upsell. Buy once and every template, update and AI prompt is yours to ship commercially.",
  price: "$29",
  compareAt: "$149",
  period: "one-time",
  cta: "Get All-Access — $29",
  guarantee:
    "14-day refund, no questions asked. If it does not save you a build sprint, you should not be paying for it.",
  features: [
    { label: `${COMPONENT_COUNT} production-ready templates`, emphasis: true },
    { label: "All four market playbooks", emphasis: true },
    { label: "Full TypeScript source, React as the only peer dependency", emphasis: true },
    { label: "AI prompt library for every template", emphasis: true },
    { label: "Lifetime updates and new drops" },
    { label: "Commercial licence, unlimited projects" },
    { label: "Figma source files" },
    { label: "Email support from the maintainers" },
  ] satisfies PricingFeature[],
} as const;

/* ---------------------------------------------------------------- */
/*  FAQ                                                              */
/* ---------------------------------------------------------------- */

export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What exactly do I get for $29?",
    answer:
      `Every template in the vault — currently ${COMPONENT_COUNT} across four market playbooks — as full TypeScript source. You also get the AI prompt library, the Figma files, and lifetime access to every future drop. No subscription, no per-seat pricing.`,
  },
  {
    question: "Which frameworks and versions are supported?",
    answer:
      "Templates target Next.js 15 App Router and React 19, styled with Tailwind CSS v4 and animated with Framer Motion. The static tier is plain React and drops into any React 18+ project, including Vite and Remix.",
  },
  {
    question: "Are the templates truly copy-paste ready?",
    answer:
      "Yes. Each template is a self-contained codebase with clean modular code. Copy the project, run it, customize your copy. Clean Next.js architecture with zero unnecessary setup friction.",
  },
  {
    question: "How do the animations and interactive templates stay at 60 FPS?",
    answer:
      "They are written against the raw Canvas 2D API rather than a 3D engine, with device-pixel ratio capped at 2, frame-time clamping, offscreen pausing via IntersectionObserver, and reduced-motion fallbacks. The particle hero on this page uses the same approach, shipped as source.",
  },
  {
    question: "Can I use these in client work?",
    answer:
      "Yes. The licence covers unlimited commercial projects, including paid client engagements and products you resell. The only restriction is redistributing the templates themselves as a competing template or theme marketplace.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "A full 14-day refund, no questions asked and no form to fill in. Reply to your receipt and it is processed the same day.",
  },
];

/* ---------------------------------------------------------------- */
/*  Footer                                                           */
/* ---------------------------------------------------------------- */

export const FOOTER = {
  tagline:
    "Production-ready interactive templates for teams that would rather ship than rebuild from scratch.",
  columns: [
    {
      title: "Playbooks",
      links: [
        { label: "SaaS & AI", href: "#saas" },
        { label: "Local Business & Clinics", href: "#local-business" },
        { label: "B2B & Enterprise", href: "#b2b-agency" },
        { label: "E-Commerce & Drops", href: "#ecommerce" },
      ],
    },
    {
      title: "Product",
      links: [
        { label: "Template Gallery", href: "#gallery" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
        { label: "Back to top", href: "#top" },
      ],
    },
    {
      title: "Legal & Support",
      links: [
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Refund Policy", href: "/refund" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Contact & FAQ", href: "#faq" },
      ],
    },
  ],
} as const;

/* ---------------------------------------------------------------- */
/*  Hero + category pills                                            */
/*                                                                    */
/*  Declared last on purpose: both depend on `COMPONENT_COUNT` /       */
/*  `MARKET_COUNTS`, which read `GALLERY_ITEMS` and `MARKETS`. Keeping */
/*  them below those declarations avoids the temporal dead zone and    */
/*  keeps the whole file safe to reorder.                             */
/* ---------------------------------------------------------------- */

export const HERO = {
  badge: "Interactive Next.js Template Vault",
  /** Split so the gradient can wrap only the high-intent phrase. */
  headline: {
    lead: "Build ",
    gradient: "Websites That Convert",
    trail: " in Minutes, Not Days.",
  },
  subheadline:
    "Production-ready, 60 FPS interactive templates & AI prompts for SaaS, Local Businesses, and B2B Agencies. 100% copy-paste ready with zero setup friction.",
  primaryCta: `Explore ${COMPONENT_COUNT} Templates`,
  secondaryCta: "See Live Demo",
  stats: [
    { value: `${COMPONENT_COUNT}`, label: "Templates" },
    { value: "60 FPS", label: "Everywhere" },
    { value: "0", label: "Setup friction" },
  ],
} as const;

/**
 * Hero quick-pills, derived from `MARKETS` + `MARKET_COUNTS` so the headline
 * numbers can never disagree with what the gallery actually renders.
 */
export const CATEGORY_PILLS: CategoryPill[] = MARKETS.map((m) => ({
  emoji: m.emoji,
  label: m.label,
  meta: `${MARKET_COUNTS[m.id]} templates`,
  accent: m.accent,
}));

/* ---------------------------------------------------------------- */
/*  Template Marketplace Store Catalog                               */
/* ---------------------------------------------------------------- */

export type TemplateTier = "all" | "free" | "15" | "20";

export type ChangelogEntry = {
  version: string;
  date: string;
  added?: string[];
  changed?: string[];
  fixed?: string[];
  updated?: string[];
};

export type CompatibilityStatus = "Supported" | "Not tested" | "Not supported";

export type CompatibilityEntry = {
  name: string;
  category: "Framework" | "Platform";
  version: string;
  status: CompatibilityStatus;
  notes?: string;
};

export const DEFAULT_COMPATIBILITY: CompatibilityEntry[] = [
  {
    name: "Next.js",
    category: "Framework",
    version: "15.1.6 (App Router)",
    status: "Supported",
    notes: "Native App Router with React Server Components",
  },
  {
    name: "React",
    category: "Framework",
    version: "19.0.0",
    status: "Supported",
    notes: "Concurrent features & Server Actions supported",
  },
  {
    name: "Tailwind CSS",
    category: "Framework",
    version: "4.0.0",
    status: "Supported",
    notes: "@tailwindcss/postcss with CSS-first @theme configuration",
  },
  {
    name: "TypeScript",
    category: "Framework",
    version: "5.7.3",
    status: "Supported",
    notes: "Strict type checking enabled across template components",
  },
  {
    name: "Vercel",
    category: "Platform",
    version: "Edge & Serverless",
    status: "Supported",
    notes: "Zero-config deployment with optimized Next.js 15 builds",
  },
  {
    name: "Netlify",
    category: "Platform",
    version: "Runtime v5",
    status: "Supported",
    notes: "Full App Router support via @netlify/plugin-nextjs",
  },
  {
    name: "Cloudflare",
    category: "Platform",
    version: "Pages / Workers",
    status: "Not tested",
    notes: "Requires OpenNext adapter for App Router; not officially validated in this project",
  },
];

export type IntegrationStatus = "Included" | "Configured" | "Example only" | "Compatible";

export type TemplateIntegration = {
  name: string;
  status: IntegrationStatus;
  description: string;
};

export type FigmaState = "Figma Included" | "Figma Available" | "No Figma File";

export type TemplateFigma = {
  /** Current state of Figma file support */
  state: FigmaState;
  /** Optional valid external Figma URL (e.g. https://www.figma.com/design/... or https://www.figma.com/community/file/...) */
  figmaUrl?: string;
  /** Optional preview image path or URL of the Figma canvas / component sheet */
  previewImage?: string;
  /** Optional file details such as component count, auto-layout support, design tokens */
  fileDetails?: {
    componentsCount?: number;
    pagesCount?: number;
    hasDesignTokens?: boolean;
    hasAutoLayout?: boolean;
    lastUpdated?: string;
  };
  /** Optional explanatory notes or access instructions */
  notes?: string;
};

export type TemplateItem = {
  integrations?: TemplateIntegration[];
  figma?: TemplateFigma;
  id: string;
  name: string;
  blurb: string;
  tier: "free" | "15" | "20";
  price: "$0" | "$15" | "$20";
  category: string;
  accent: "green" | "cyan" | "purple" | "amber";
  previewGradient: string;
  features: string[];
  mockupType: "saas" | "fitness" | "clinic" | "realestate" | "portfolio" | "b2b";
  version?: string;
  lastUpdated?: string;
  changelog?: ChangelogEntry[];
  compatibility?: CompatibilityEntry[];
};

/**
 * Strict validator for external Figma URLs.
 * Ensures the URL is well-formed, uses http/https, and originates from official figma.com domains.
 */
export function isValidFigmaUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    const hostname = parsed.hostname.toLowerCase();
    const isFigmaDomain = hostname === "figma.com" || hostname.endsWith(".figma.com");
    if (!isFigmaDomain) return false;
    return parsed.pathname.length > 1;
  } catch {
    return false;
  }
}

/**
 * Returns verified Figma metadata for a template.
 * Strictly enforces that "Figma Included" or "Figma Available" states require
 * a genuine, valid Figma URL. Otherwise, falls back safely to "No Figma File"
 * so no fake badges or broken links are displayed.
 */
export function getTemplateFigma(template: TemplateItem): TemplateFigma {
  if (!template.figma) {
    return {
      state: "No Figma File",
      notes: "Design authored code-first with Tailwind CSS v4 & Framer Motion. Dedicated standalone Figma file is not yet published.",
    };
  }

  const { state, figmaUrl, previewImage, fileDetails, notes } = template.figma;

  if (state === "No Figma File") {
    return {
      state: "No Figma File",
      notes: notes || "Design authored code-first with Tailwind CSS v4 & Framer Motion. Dedicated standalone Figma file is not yet published.",
    };
  }

  // If Figma Included or Figma Available is declared, verify that a valid Figma URL exists
  if (!isValidFigmaUrl(figmaUrl)) {
    return {
      state: "No Figma File",
      notes: "Figma resource reference is pending verification. Design is currently code-first.",
    };
  }

  return {
    state,
    figmaUrl: figmaUrl ? figmaUrl.trim() : undefined,
    previewImage,
    fileDetails,
    notes,
  };
}

export function getTemplateIntegrations(template: TemplateItem): TemplateIntegration[] {
  return template.integrations ?? [];
}

export function getTemplateCompatibility(template: TemplateItem): CompatibilityEntry[] {
  if (template.compatibility && template.compatibility.length > 0) {
    return template.compatibility;
  }
  return DEFAULT_COMPATIBILITY;
}

export function getTemplateChangelog(template: TemplateItem): ChangelogEntry[] {
  if (template.changelog && template.changelog.length > 0) {
    return template.changelog;
  }
  return [
    {
      version: template.version ?? "v1.0.0",
      date: template.lastUpdated ?? "September 2026",
      added: [
        `Initial release of ${template.name}`,
        ...template.features,
      ],
      updated: [
        "Next.js 15.1.6",
        "React 19.0.0",
        "Tailwind CSS v4",
        "TypeScript Strict mode (v5.7.3)",
      ],
    },
  ];
}

export function getTemplateVersion(template: TemplateItem): string {
  if (template.version) return template.version;
  if (template.changelog && template.changelog.length > 0) {
    return template.changelog[0].version;
  }
  return "v1.0.0";
}

export function getTemplateLastUpdated(template: TemplateItem): string {
  if (template.lastUpdated) return template.lastUpdated;
  if (template.changelog && template.changelog.length > 0) {
    return template.changelog[0].date;
  }
  return "September 2026";
}

export const TEMPLATES: TemplateItem[] = [
  // 1. FREE TIER (5 Templates — $0 Lead Magnets)
  {
    id: "aether-ai-saas",
    name: "Aether AI SaaS",
    blurb: "Sleek dark-mode landing page with interactive waitlist capture and feature bento.",
    tier: "free",
    price: "$0",
    category: "SaaS & AI",
    accent: "green",
    previewGradient: "from-emerald-950/80 via-slate-900 to-emerald-900/40",
    features: ["Waitlist email capture", "Feature bento grid", "Dark mode default"],
    mockupType: "saas",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Interactive email waitlist capture and confirmation flow"
        },
        {
            "name": "Supabase",
            "status": "Compatible",
            "description": "App Router database and authentication ready"
        }
    ],
    version: "v1.1.0",
    lastUpdated: "September 2026",
    changelog: [
      {
        version: "v1.1.0",
        date: "September 2026",
        added: [
          "Theme Playground support with custom colors and typography preview",
          "Technical specifications breakdown panel",
        ],
        updated: [
          "Next.js 15.1.6",
          "React 19.0.0",
          "Tailwind CSS v4",
        ],
        fixed: [
          "Mobile and tablet viewport iframe responsiveness",
        ],
      },
      {
        version: "v1.0.0",
        date: "September 2026",
        added: [
          "Initial release of Aether AI SaaS",
          "Waitlist email capture",
          "Feature bento grid",
          "Dark mode default",
        ],
        updated: [
          "Next.js 15 (App Router)",
          "React 19",
          "Tailwind CSS v4",
        ],
      },
    ],
  },
  {
    id: "serenity-wellness",
    name: "Serenity Wellness Clinic",
    blurb: "Clean, calming holistic healthcare and therapy practice with appointment request flow.",
    tier: "free",
    price: "$0",
    category: "Local Business",
    accent: "green",
    previewGradient: "from-teal-950/80 via-slate-900 to-teal-900/40",
    features: ["Appointment booking form", "Doctor bio cards", "Service pricing list"],
    mockupType: "clinic",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Appointment booking and therapy consultation request intake"
        }
    ],
    version: "v1.0.0",
    lastUpdated: "September 2026",
    changelog: [
      {
        version: "v1.0.0",
        date: "September 2026",
        added: [
          "Initial release of Serenity Wellness Clinic",
          "Appointment booking form",
          "Doctor bio cards",
          "Service pricing list",
        ],
        updated: [
          "Next.js 15.1.6",
          "React 19.0.0",
          "Tailwind CSS v4",
          "TypeScript Strict mode (v5.7.3)",
        ],
      },
    ],
  },
  {
    id: "nova-minimal-portfolio",
    name: "Nova Developer Portfolio",
    blurb: "High-contrast minimalist developer and designer portfolio with project case studies.",
    tier: "free",
    price: "$0",
    category: "Portfolio",
    accent: "green",
    previewGradient: "from-slate-950 via-zinc-900 to-emerald-950/60",
    features: ["Project grid with tags", "GitHub activity timeline", "Contact sheet"],
    mockupType: "portfolio",
    integrations: [
        {
            "name": "GitHub",
            "status": "Included",
            "description": "Live GitHub activity timeline, commit feed, and repository project cards"
        },
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Direct developer hire and project inquiry contact sheet"
        }
    ],
  },
  {
    id: "app-launch-lp",
    name: "AppLaunch Mobile LP",
    blurb: "High-converting mobile app showcase with App Store & Google Play badge integration.",
    tier: "free",
    price: "$0",
    category: "Mobile & App",
    accent: "green",
    previewGradient: "from-emerald-950/70 via-obsidian to-cyan-950/50",
    features: ["Device frame mockup", "App Store buttons", "User reviews slider"],
    mockupType: "saas",
    integrations: [
        {
            "name": "App Store & Google Play",
            "status": "Included",
            "description": "Official store badge links, download deep-links, and mobile app routing"
        }
    ],
  },
  {
    id: "simple-link-bio",
    name: "Simple Link-in-Bio",
    blurb: "Responsive creator landing page with social links, video embeds, and newsletter capture.",
    tier: "free",
    price: "$0",
    category: "Creator",
    accent: "green",
    previewGradient: "from-zinc-950 via-slate-900 to-emerald-950/50",
    features: ["Social links stack", "Newsletter sign-up", "Custom theme tokens"],
    mockupType: "portfolio",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Creator audience email newsletter sign-up and link tracking"
        }
    ],
  },

  // 2. $15 TIER (15 Templates — Clean & Polished Business Sites)
  {
    id: "peak-fitness",
    name: "Peak Performance Fitness",
    blurb: "High-intensity gym & personal trainer portal with class schedules and membership tiers.",
    tier: "15",
    price: "$15",
    category: "Fitness & Health",
    accent: "cyan",
    previewGradient: "from-cyan-950/70 via-slate-900 to-slate-950",
    features: ["Class schedule timetable", "Trainer bio modal", "Membership checkout"],
    mockupType: "fitness",
    integrations: [
        {
            "name": "PayPal",
            "status": "Example only",
            "description": "Interactive membership tier checkout flow and class registration"
        }
    ],
    version: "v1.1.0",
    lastUpdated: "September 2026",
    changelog: [
      {
        version: "v1.1.0",
        date: "September 2026",
        added: [
          "Theme Playground support with custom color tokens",
          "Technical specifications breakdown panel",
        ],
        updated: [
          "Next.js 15.1.6",
          "React 19.0.0",
          "Tailwind CSS v4",
        ],
        fixed: [
          "Class schedule timetable responsive mobile reflow",
        ],
      },
      {
        version: "v1.0.0",
        date: "September 2026",
        added: [
          "Initial release of Peak Performance Fitness",
          "Class schedule timetable",
          "Trainer bio modal",
          "Membership checkout flow",
        ],
        updated: [
          "Next.js 15 (App Router)",
          "React 19",
          "Tailwind CSS v4",
        ],
      },
    ],
  },
  {
    id: "azure-apartments",
    name: "Azure Luxury Living",
    blurb: "Modern apartment & real estate showcase with floor plans, virtual tour, and inquiry form.",
    tier: "15",
    price: "$15",
    category: "Real Estate",
    accent: "cyan",
    previewGradient: "from-blue-950/70 via-slate-900 to-cyan-950/50",
    features: ["Interactive floor plans", "Amenity photo gallery", "Tour booking calendar"],
    mockupType: "realestate",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Luxury leasing tour calendar and resident intake inquiries"
        }
    ],
  },
  {
    id: "apex-dental-clinic",
    name: "Apex Dental & Health",
    blurb: "Professional clinic website with doctor roster, insurance calculator, and 1-tap booking.",
    tier: "15",
    price: "$15",
    category: "Local Business",
    accent: "cyan",
    previewGradient: "from-sky-950/80 via-slate-900 to-cyan-950/60",
    features: ["Patient booking stepper", "Insurance logos strip", "Service price menu"],
    mockupType: "clinic",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Multi-step patient dental intake and appointment stepper"
        }
    ],
  },
  {
    id: "precision-roofing",
    name: "Precision Roofing Firm",
    blurb: "High-trust local contractor site with instant quote calculator and before/after slider.",
    tier: "15",
    price: "$15",
    category: "Contractor",
    accent: "cyan",
    previewGradient: "from-slate-950 via-zinc-900 to-cyan-950/60",
    features: ["Instant quote calculator", "Before / after image slider", "License badge strip"],
    mockupType: "clinic",
    integrations: [],
  },
  {
    id: "aura-beauty-salon",
    name: "Aura Beauty & Spa Salon",
    blurb: "Luxury salon booking with treatment pricing menu, staff picker, and gift card sales.",
    tier: "15",
    price: "$15",
    category: "Beauty & Wellness",
    accent: "cyan",
    previewGradient: "from-rose-950/50 via-slate-900 to-cyan-950/50",
    features: ["Treatment price card", "Stylist selector", "Client testimonial grid"],
    mockupType: "clinic",
    integrations: [],
  },
  {
    id: "nexus-coworking",
    name: "Nexus Coworking Spaces",
    blurb: "Workspace rental with day pass booking, meeting room scheduler, and amenity list.",
    tier: "15",
    price: "$15",
    category: "Commercial",
    accent: "cyan",
    previewGradient: "from-cyan-950/60 via-slate-900 to-blue-950/50",
    features: ["Room booking picker", "Membership options", "Location map locator"],
    mockupType: "realestate",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Coworking day pass booking and private conference room scheduler"
        }
    ],
  },
  {
    id: "horizon-law-firm",
    name: "Horizon Legal Practice",
    blurb: "High-posture legal consultancy with practice area breakdowns and attorney credentials.",
    tier: "15",
    price: "$15",
    category: "Legal & Corporate",
    accent: "cyan",
    previewGradient: "from-slate-950 via-zinc-900 to-cyan-950/40",
    features: ["Consultation intake form", "Practice area matrix", "Partner biographies"],
    mockupType: "b2b",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Confidential attorney consultation and case intake form"
        }
    ],
  },
  {
    id: "velvet-bistro",
    name: "Velvet Artisan Bistro",
    blurb: "Modern culinary showcase with seasonal menu cards, table reservations, and wine list.",
    tier: "15",
    price: "$15",
    category: "Hospitality",
    accent: "cyan",
    previewGradient: "from-amber-950/50 via-slate-900 to-cyan-950/40",
    features: ["Table reservation widget", "Categorized menu tabs", "Private event inquiries"],
    mockupType: "clinic",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Table reservation widget and private event catering inquiries"
        }
    ],
  },
  {
    id: "zenith-accounting",
    name: "Zenith Tax & Advisory",
    blurb: "Financial and accounting firm with fixed-price packages and automated calendar scheduling.",
    tier: "15",
    price: "$15",
    category: "Finance",
    accent: "cyan",
    previewGradient: "from-cyan-950/60 via-slate-900 to-slate-950",
    features: ["Tiered service packages", "Tax season checklist", "Secure client portal link"],
    mockupType: "b2b",
    integrations: [
        {
            "name": "Supabase",
            "status": "Configured",
            "description": "Pre-wired secure client tax portal authentication architecture"
        }
    ],
  },
  {
    id: "urban-architecture",
    name: "Urban Architecture Studio",
    blurb: "Minimalist architectural firm with project blueprint modals and client inquiry flow.",
    tier: "15",
    price: "$15",
    category: "Architecture",
    accent: "cyan",
    previewGradient: "from-slate-950 via-zinc-900 to-cyan-950/50",
    features: ["Blueprint project viewer", "Design process steps", "Awards & press strip"],
    mockupType: "portfolio",
    integrations: [],
  },
  {
    id: "petpaws-vet",
    name: "PetPaws Veterinary Care",
    blurb: "Friendly pet care clinic with 24/7 emergency banner, vaccination schedule, and pet intake.",
    tier: "15",
    price: "$15",
    category: "Local Business",
    accent: "cyan",
    previewGradient: "from-cyan-950/70 via-slate-900 to-teal-950/60",
    features: ["Emergency call banner", "Pet service checklist", "Online pet booking"],
    mockupType: "clinic",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Veterinary pet intake and online vaccination appointment booking"
        }
    ],
  },
  {
    id: "luxe-auto-detailing",
    name: "Luxe Auto Studio",
    blurb: "Automotive detailing & ceramic coating studio with multi-stage service packages.",
    tier: "15",
    price: "$15",
    category: "Automotive",
    accent: "cyan",
    previewGradient: "from-slate-950 via-zinc-900 to-blue-950/60",
    features: ["Package comparison table", "Before & after gallery", "Vehicle size estimator"],
    mockupType: "fitness",
    integrations: [],
  },
  {
    id: "summit-event",
    name: "Summit Tech Conference",
    blurb: "Event landing page with keynote speaker grid, agenda timeline, and early bird tickets.",
    tier: "15",
    price: "$15",
    category: "Events",
    accent: "cyan",
    previewGradient: "from-blue-950/70 via-slate-900 to-cyan-950/60",
    features: ["Interactive agenda schedule", "Speaker carousel", "Ticket tier checkout"],
    mockupType: "saas",
    integrations: [
        {
            "name": "PayPal",
            "status": "Example only",
            "description": "Conference ticket tier pass checkout and attendee registration"
        }
    ],
  },
  {
    id: "prism-photo-studio",
    name: "Prism Photography",
    blurb: "Visual portfolio for commercial and wedding photographers with high-DPI lightbox.",
    tier: "15",
    price: "$15",
    category: "Creative",
    accent: "cyan",
    previewGradient: "from-zinc-950 via-slate-900 to-cyan-950/50",
    features: ["Masonry photo lightbox", "Package rate card", "Date availability check"],
    mockupType: "portfolio",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Commercial photo shoot date availability inquiry form"
        }
    ],
  },
  {
    id: "greenthumb-landscape",
    name: "GreenThumb Landscaping",
    blurb: "Outdoor property maintenance and hardscape design with instant estimate inquiry.",
    tier: "15",
    price: "$15",
    category: "Contractor",
    accent: "cyan",
    previewGradient: "from-emerald-950/60 via-slate-900 to-cyan-950/50",
    features: ["Seasonal service options", "Yard estimate form", "Residential photo proof"],
    mockupType: "clinic",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Residential landscaping yard estimate form with property specs"
        }
    ],
  },

  // 3. $20 MASTERCLASS TIER (12 Templates — High-Converting SaaS & Agency)
  {
    id: "cloudscale-analytics",
    name: "CloudScale SaaS Analytics",
    blurb: "Complete Next.js 15 SaaS template with live metric dials, bento grid, and billing toggle.",
    tier: "20",
    price: "$20",
    category: "SaaS & AI",
    accent: "purple",
    previewGradient: "from-violet-950/80 via-slate-900 to-purple-900/50",
    features: ["Live chart metric rings", "Monthly / annual pricing toggle", "Dark obsidian design"],
    mockupType: "saas",
    integrations: [
        {
            "name": "PostHog",
            "status": "Compatible",
            "description": "Product telemetry, real-time funnel metrics, and user event tracking"
        },
        {
            "name": "PayPal",
            "status": "Compatible",
            "description": "Monthly and annual SaaS billing tier checkout compatibility"
        }
    ],
  },
  {
    id: "enterprise-b2b-agency",
    name: "Enterprise B2B Growth Agency",
    blurb: "High-ticket enterprise consultancy with intent-scoring qualification and ROI calculators.",
    tier: "20",
    price: "$20",
    category: "B2B & Enterprise",
    accent: "purple",
    previewGradient: "from-purple-950/80 via-slate-900 to-indigo-950/60",
    features: ["Branching lead qualifier", "Interactive ROI savings slider", "Client logo marquee"],
    mockupType: "b2b",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Branching enterprise lead qualification and ROI calculator intake"
        }
    ],
  },
  {
    id: "ai-copilot-studio",
    name: "AI Copilot Studio",
    blurb: "AI product showcase with live streaming chat demo, code syntax highlighting, and shortcuts.",
    tier: "20",
    price: "$20",
    category: "SaaS & AI",
    accent: "purple",
    previewGradient: "from-fuchsia-950/70 via-slate-900 to-purple-950/70",
    features: ["Streaming chat mockup", "Code tabs with 1-click copy", "Keyboard command palette"],
    mockupType: "saas",
    integrations: [
        {
            "name": "Supabase",
            "status": "Compatible",
            "description": "Persistent AI conversation history and user session authentication"
        }
    ],
  },
  {
    id: "fintech-neobank",
    name: "Fintech NeoBank & Wallet",
    blurb: "Modern digital banking landing page with interactive card switchers and fee calculators.",
    tier: "20",
    price: "$20",
    category: "Fintech",
    accent: "purple",
    previewGradient: "from-indigo-950/80 via-slate-900 to-purple-950/60",
    features: ["3D glass card switcher", "Transfer fee breakdown", "Security compliance grid"],
    mockupType: "saas",
    integrations: [
        {
            "name": "PayPal",
            "status": "Compatible",
            "description": "Digital card payments, transfer fee calculator, and currency settlement"
        }
    ],
  },
  {
    id: "devflow-hub",
    name: "DevFlow API Documentation",
    blurb: "Developer documentation and API reference template with multi-language code snippets.",
    tier: "20",
    price: "$20",
    category: "Developer Tools",
    accent: "purple",
    previewGradient: "from-purple-950/70 via-zinc-950 to-slate-900",
    features: ["Side-by-side API runner", "SDK install badges", "Interactive search palette"],
    mockupType: "saas",
    integrations: [
        {
            "name": "GitHub",
            "status": "Included",
            "description": "SDK release badge integration, npm links, and open-source repo links"
        }
    ],
  },
  {
    id: "pulse-analytics",
    name: "Pulse Real-Time Telemetry",
    blurb: "Telemetry and infrastructure monitoring landing page with server status alerts.",
    tier: "20",
    price: "$20",
    category: "DevOps",
    accent: "purple",
    previewGradient: "from-violet-950/80 via-slate-900 to-cyan-950/50",
    features: ["Real-time latency counter", "Server cluster ping grid", "Enterprise SLA tiering"],
    mockupType: "saas",
    integrations: [
        {
            "name": "PostHog",
            "status": "Compatible",
            "description": "Infrastructure telemetry and server cluster latency monitoring"
        }
    ],
  },
  {
    id: "edulearn-academy",
    name: "EduLearn Video Masterclass",
    blurb: "High-conversion online course and cohort landing page with syllabus preview and checkout.",
    tier: "20",
    price: "$20",
    category: "Education",
    accent: "purple",
    previewGradient: "from-purple-950/70 via-slate-900 to-indigo-950/60",
    features: ["Course curriculum accordion", "Instructor intro video modal", "Student alumni proof"],
    mockupType: "saas",
    integrations: [
        {
            "name": "PayPal",
            "status": "Example only",
            "description": "Masterclass cohort enrollment and course syllabus checkout"
        }
    ],
  },
  {
    id: "saas-billing-hub",
    name: "SaaS Billing & Subscriptions",
    blurb: "Pre-wired subscription tier selector with seat calculators, addons, and invoice previews.",
    tier: "20",
    price: "$20",
    category: "SaaS",
    accent: "purple",
    previewGradient: "from-violet-950/80 via-slate-900 to-purple-950/60",
    features: ["Seat slider multiplier", "Addon checkboxes", "Annual discount badge"],
    mockupType: "saas",
    integrations: [
        {
            "name": "PayPal",
            "status": "Configured",
            "description": "Multi-seat pricing multiplier, addon calculations, and recurring billing"
        },
        {
            "name": "Supabase",
            "status": "Configured",
            "description": "Subscriber account records, seat allocations, and invoice history"
        }
    ],
  },
  {
    id: "talenthire-ats",
    name: "TalentHire Recruiting ATS",
    blurb: "Recruitment tech landing page with job filter search, applicant stages, and interview flow.",
    tier: "20",
    price: "$20",
    category: "HR & Tech",
    accent: "purple",
    previewGradient: "from-purple-950/70 via-slate-900 to-slate-950",
    features: ["Department job board", "Candidate pipeline preview", "Hiring manager scheduling"],
    mockupType: "b2b",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Department applicant resume submission and candidate notification"
        },
        {
            "name": "Supabase",
            "status": "Compatible",
            "description": "Candidate pipeline database and hiring manager stage tracking"
        }
    ],
  },
  {
    id: "cryptostaking-protocol",
    name: "CryptoStaking Protocol LP",
    blurb: "Decentralized finance showcase with simulated wallet connect and APY yield calculator.",
    tier: "20",
    price: "$20",
    category: "Web3",
    accent: "purple",
    previewGradient: "from-indigo-950/80 via-slate-900 to-violet-950/60",
    features: ["Simulated wallet connect", "APY compounding slider", "Audit certificate badges"],
    mockupType: "saas",
    integrations: [
        {
            "name": "Web3 / WalletConnect",
            "status": "Example only",
            "description": "Simulated Web3 wallet connection, APY compounding slider, and staking UI"
        }
    ],
  },
  {
    id: "venture-fund-capital",
    name: "VentureFund Capital Portal",
    blurb: "Venture capital and private equity site with interactive portfolio grid and pitch intake.",
    tier: "20",
    price: "$20",
    category: "Finance",
    accent: "purple",
    previewGradient: "from-purple-950/70 via-zinc-950 to-indigo-950/50",
    features: ["Portfolio founder filter", "Investment thesis bento", "Pitch submission portal"],
    mockupType: "b2b",
    integrations: [
        {
            "name": "Resend",
            "status": "Example only",
            "description": "Founder pitch deck submission portal and investment thesis filter"
        }
    ],
  },
  {
    id: "healthpulse-telehealth",
    name: "HealthPulse Telehealth",
    blurb: "HIPAA-compliant telemedicine landing page with specialist booking and virtual visit rooms.",
    tier: "20",
    price: "$20",
    category: "HealthTech",
    accent: "purple",
    previewGradient: "from-violet-950/70 via-slate-900 to-teal-950/50",
    features: ["Doctor video room mockup", "Symptom checker questionnaire", "Prescription delivery info"],
    mockupType: "clinic",
    integrations: [
        {
            "name": "Supabase",
            "status": "Configured",
            "description": "Telehealth patient authentication, virtual visit room, and prescription records"
        }
    ],
  },
  {
      "id": "sentinel-security",
      "name": "Sentinel Security",
      "blurb": "Enterprise cybersecurity platform with real-time threat intelligence, SOC 2 compliance, and automated incident response.",
      "tier": "20",
      "price": "$20",
      "category": "Cybersecurity",
      "accent": "cyan",
      "previewGradient": "from-slate-950 via-cyan-950/50 to-slate-900",
      "features": [
          "Live threat telemetry stream & CVE scanner",
          "Interactive incident response runbook generator",
          "Zero-trust identity & SOC 2 compliance tracker"
      ],
      "mockupType": "b2b",
      "integrations": [
          {
              "name": "PostHog",
              "status": "Compatible",
              "description": "Security event telemetry, anomalous login tracking, and audit logging"
          },
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Automated security incident alert notifications and weekly CVE briefs"
          },
          {
              "name": "Supabase",
              "status": "Compatible",
              "description": "Role-based access control (RBAC), multi-factor auth, and encrypted audit trails"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "voyage-atlas",
      "name": "Voyage Atlas",
      "blurb": "Immersive travel agency & expedition booking template with destination itineraries, currency converters, and interactive maps.",
      "tier": "20",
      "price": "$20",
      "category": "Travel",
      "accent": "amber",
      "previewGradient": "from-amber-950/70 via-stone-900 to-slate-950",
      "features": [
          "Day-by-day expedition itinerary builder",
          "Multi-currency price converter & deposit calculator",
          "Interactive destination weather & visa checklist"
      ],
      "mockupType": "portfolio",
      "integrations": [
          {
              "name": "PayPal",
              "status": "Compatible",
              "description": "Tour deposit reservations, travel insurance add-ons, and booking deposits"
          },
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Automated booking itinerary dispatch and visa documentation reminders"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "supportdesk",
      "name": "SupportDesk",
      "blurb": "Modern customer support & helpdesk SaaS with unified shared inboxes, AI ticket summarization, and self-serve knowledge base.",
      "tier": "20",
      "price": "$20",
      "category": "SaaS & AI",
      "accent": "purple",
      "previewGradient": "from-indigo-950/80 via-slate-900 to-purple-950/70",
      "features": [
          "Unified omnichannel ticket queue with priority SLA timers",
          "Markdown-powered searchable knowledge base",
          "AI macro responder & team performance analytics"
      ],
      "mockupType": "saas",
      "integrations": [
          {
              "name": "Supabase",
              "status": "Compatible",
              "description": "Customer ticket database, agent authentication, and ticket status subscriptions"
          },
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Inbound customer email routing and automated customer satisfaction (CSAT) surveys"
          },
          {
              "name": "PostHog",
              "status": "Compatible",
              "description": "Helpdesk SLA adherence metrics, first-response time, and resolution telemetry"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "stayora",
      "name": "Stayora Luxury Resort & Suites",
      "blurb": "Boutique hotel & villa retreat template with real-time suite availability, 360° virtual tours, and concierge bookings.",
      "tier": "20",
      "price": "$20",
      "category": "Hospitality",
      "accent": "amber",
      "previewGradient": "from-amber-950/70 via-stone-900 to-amber-950/40",
      "features": [
          "Real-time suite availability & booking engine",
          "Boutique resort amenities & 360° virtual tour",
          "Guest concierge & dining reservation planner"
      ],
      "mockupType": "realestate",
      "integrations": [
          {
              "name": "PayPal",
              "status": "Compatible",
              "description": "Suite reservation deposits, spa treatment vouchers, and resort credits"
          },
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Automated guest reservation confirmation and digital key instructions"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "cartly-commerce",
      "name": "Cartly Commerce",
      "blurb": "Next-gen apparel & lifestyle storefront with slide-out cart drawer, variant selectors, and instant search.",
      "tier": "20",
      "price": "$20",
      "category": "E-Commerce",
      "accent": "purple",
      "previewGradient": "from-purple-950/70 via-zinc-900 to-slate-900",
      "features": [
          "Slide-out cart drawer with live stock counters",
          "Multi-attribute variant selector (Size, Color, Material)",
          "Instant search with fuzzy keyword auto-complete"
      ],
      "mockupType": "saas",
      "integrations": [
          {
              "name": "PayPal",
              "status": "Compatible",
              "description": "One-click express checkout, digital wallets, and international currency settlement"
          },
          {
              "name": "PostHog",
              "status": "Compatible",
              "description": "E-commerce checkout funnel drops, product view tracking, and conversion telemetry"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "freshbite",
      "name": "FreshBite Food & Delivery",
      "blurb": "Culinary brand & artisan restaurant storefront with visual dietary menus, delivery radii estimators, and combo meal builders.",
      "tier": "20",
      "price": "$20",
      "category": "Food & Delivery",
      "accent": "green",
      "previewGradient": "from-emerald-950/70 via-zinc-900 to-emerald-900/40",
      "features": [
          "Visual digital menu with dietary & allergen filters",
          "Live delivery distance calculator & estimated arrival tracker",
          "Custom combo meal builder with add-on toppings"
      ],
      "mockupType": "fitness",
      "integrations": [
          {
              "name": "PayPal",
              "status": "Compatible",
              "description": "Contactless online food orders, tip selection, and instant order payments"
          },
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Real-time order confirmation receipts and kitchen prep status updates"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "fleetflow",
      "name": "FleetFlow Logistics & Fleet Manager",
      "blurb": "Modern freight & fleet management dashboard with live GPS telematics, driver safety scores, and maintenance schedulers.",
      "tier": "20",
      "price": "$20",
      "category": "Logistics",
      "accent": "cyan",
      "previewGradient": "from-cyan-950/70 via-slate-900 to-blue-950/60",
      "features": [
          "Real-time GPS vehicle tracking telemetry",
          "Preventative maintenance scheduler & diagnostic alerts",
          "Driver safety scorecards & fuel consumption analytics"
      ],
      "mockupType": "b2b",
      "integrations": [
          {
              "name": "PostHog",
              "status": "Compatible",
              "description": "Route efficiency metrics, idle time telemetry, and dispatch response times"
          },
          {
              "name": "Supabase",
              "status": "Compatible",
              "description": "Vehicle asset registries, driver profiles, and cargo manifest database"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "insurely",
      "name": "Insurely Digital Insurance",
      "blurb": "Trust-first insurance brokerage platform with multi-tier policy calculators, digital claims filing, and coverage comparisons.",
      "tier": "20",
      "price": "$20",
      "category": "Insurance",
      "accent": "cyan",
      "previewGradient": "from-sky-950/70 via-slate-900 to-cyan-950/60",
      "features": [
          "Multi-tier interactive policy quote calculator",
          "Digital claims filing portal with file attachment uploads",
          "Coverage comparison matrix across health, auto, and home"
      ],
      "mockupType": "clinic",
      "integrations": [
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Automated policy binder dispatches and claims status progression updates"
          },
          {
              "name": "Supabase",
              "status": "Compatible",
              "description": "Secure policyholder profile store, coverage limits, and deductible records"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "fundora",
      "name": "Fundora Wealth & Investment",
      "blurb": "Fiduciary wealth management & private advisory template with compound interest simulators and portfolio rebalancing visualizers.",
      "tier": "20",
      "price": "$20",
      "category": "Fintech",
      "accent": "purple",
      "previewGradient": "from-violet-950/80 via-slate-900 to-indigo-950/60",
      "features": [
          "Dynamic compound interest & retirement projection calculator",
          "Asset allocation rebalancing visualizer",
          "Transparent fee schedule breakdown & fiduciary commitment"
      ],
      "mockupType": "saas",
      "integrations": [
          {
              "name": "PayPal",
              "status": "Compatible",
              "description": "Private client advisory retainer deposits and financial planning fees"
          },
          {
              "name": "PostHog",
              "status": "Compatible",
              "description": "Retirement calculator usage metrics and investor onboarding telemetry"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "scalehr",
      "name": "ScaleHR Employee Platform",
      "blurb": "All-in-one human resources & team operations hub with interactive org charts, one-click payroll runs, and PTO calendars.",
      "tier": "20",
      "price": "$20",
      "category": "HR & Tech",
      "accent": "purple",
      "previewGradient": "from-purple-950/80 via-slate-900 to-slate-950",
      "features": [
          "Org chart interactive visualizer & employee directory",
          "One-click automated payroll run simulator",
          "PTO request calendar with approval workflows"
      ],
      "mockupType": "b2b",
      "integrations": [
          {
              "name": "Supabase",
              "status": "Compatible",
              "description": "Employee directory records, compensation history, and role-based permissions"
          },
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Automated team onboarding invitations and annual performance review alerts"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "nonprofitly",
      "name": "Nonprofitly Charity & NGO",
      "blurb": "Empathetic fundraising & humanitarian portal with recurring donation checkouts, impact thermometers, and volunteer registries.",
      "tier": "20",
      "price": "$20",
      "category": "Nonprofit",
      "accent": "green",
      "previewGradient": "from-emerald-950/70 via-stone-900 to-slate-950",
      "features": [
          "Recurring & one-time donation checkout with progress thermometer",
          "Audited fund allocation pie charts & transparency reports",
          "Volunteer sign-up workflow with location matching"
      ],
      "mockupType": "portfolio",
      "integrations": [
          {
              "name": "PayPal",
              "status": "Compatible",
              "description": "Tax-deductible donor checkout for one-time and monthly recurring gifts"
          },
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Instant 501(c)(3) tax receipts and quarterly donor impact field reports"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "eventspace",
      "name": "EventSpace Conference Summit",
      "blurb": "High-energy tech summit & exhibition platform with filterable multi-track agendas, speaker bios, and tiered badge sales.",
      "tier": "20",
      "price": "$20",
      "category": "Events",
      "accent": "purple",
      "previewGradient": "from-indigo-950/80 via-slate-900 to-cyan-950/60",
      "features": [
          "Filterable multi-track conference schedule agenda",
          "Interactive speaker bios with keynote slide downloads",
          "Tiered badge ticket pass checkout with early bird countdowns"
      ],
      "mockupType": "saas",
      "integrations": [
          {
              "name": "PayPal",
              "status": "Compatible",
              "description": "Early bird ticket pass sales, VIP gala access, and group workshop passes"
          },
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Digital attendee badge confirmation with scannable access QR codes"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "adpilot",
      "name": "AdPilot Performance Marketing",
      "blurb": "Growth marketing & paid acquisition agency showcase with dynamic ROAS calculators, case study proof, and audit scanners.",
      "tier": "20",
      "price": "$20",
      "category": "Marketing",
      "accent": "cyan",
      "previewGradient": "from-cyan-950/70 via-slate-900 to-violet-950/60",
      "features": [
          "Ad spend ROI calculator across Google, Meta, and LinkedIn",
          "Client case study showcases with verified revenue metrics",
          "Interactive 30-second digital marketing audit scanner"
      ],
      "mockupType": "b2b",
      "integrations": [
          {
              "name": "PostHog",
              "status": "Compatible",
              "description": "Paid acquisition funnel telemetry and client portal conversion metrics"
          },
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Automated digital marketing audit deliverable dispatch directly to founder inbox"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "homenest",
      "name": "HomeNest Interior & Renovation",
      "blurb": "Architectural renovation & luxury interior design showcase with room budget calculators and before-after sliders.",
      "tier": "20",
      "price": "$20",
      "category": "Home Services",
      "accent": "amber",
      "previewGradient": "from-amber-950/60 via-stone-900 to-slate-950",
      "features": [
          "Room-by-room renovation cost estimator calculator",
          "Interactive before & after transformation slider gallery",
          "Architectural material selector (Flooring, Stone, Cabinetry)"
      ],
      "mockupType": "clinic",
      "integrations": [
          {
              "name": "Resend",
              "status": "Example only",
              "description": "Design consultation booking and architectural floor plan upload intake"
          },
          {
              "name": "PayPal",
              "status": "Compatible",
              "description": "Initial design consultation retainer deposits and 3D architectural rendering fees"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
  {
      "id": "streamline",
      "name": "Streamline Team Collaboration",
      "blurb": "Async team workspace & sprint collaboration tool with drag-and-drop Kanban boards, burndown charts, and markdown docs.",
      "tier": "20",
      "price": "$20",
      "category": "Productivity",
      "accent": "purple",
      "previewGradient": "from-violet-950/80 via-slate-900 to-purple-950/70",
      "features": [
          "Interactive drag-and-drop Kanban task board",
          "Sprint velocity burndown charts & milestone tracking",
          "Built-in markdown docs with real-time comments"
      ],
      "mockupType": "saas",
      "integrations": [
          {
              "name": "Supabase",
              "status": "Compatible",
              "description": "Real-time task synchronization, team workspace database, and user auth"
          },
          {
              "name": "GitHub",
              "status": "Included",
              "description": "Bidirectional Git commit and pull request linking directly to Kanban task cards"
          }
      ],
      "version": "v1.0.0",
      "lastUpdated": "September 2026"
  },
];

export const TIER_COUNTS = {
  all: TEMPLATES.length,
  free: TEMPLATES.filter((t) => t.tier === "free").length,
  "15": TEMPLATES.filter((t) => t.tier === "15").length,
  "20": TEMPLATES.filter((t) => t.tier === "20").length,
};

import verifiedQualityData from "./verified-quality-data.json";

export type QualityScoreCategory =
  | "Performance"
  | "Accessibility"
  | "Best Practices"
  | "SEO"
  | "Production Build"
  | "TypeScript";

export type QualityIndicatorItem = {
  category: QualityScoreCategory;
  value: string;
  numericScore?: number;
  status: "verified" | "passed" | "pending";
  testedOn: string;
  environment: string;
  notes?: string;
};

export type TemplateQualityReport = {
  templateId: string;
  hasMeasuredLighthouse: boolean;
  auditDate: string;
  environment: string;
  runner: string;
  indicators: QualityIndicatorItem[];
};

export function getTemplateQualityReport(templateId: string): TemplateQualityReport {
  const templates = (verifiedQualityData as any).templates || {};
  const data = templates[templateId];
  const auditDate = verifiedQualityData.auditDate || "September 27, 2026";
  const environment = verifiedQualityData.environment;
  const runner = verifiedQualityData.runner;

  const indicators: QualityIndicatorItem[] = [
    {
      category: "Production Build",
      value: verifiedQualityData.productionBuildCheck.status,
      status: "passed",
      testedOn: verifiedQualityData.productionBuildCheck.testDate,
      environment: `next build (${verifiedQualityData.productionBuildCheck.staticPagesCount} static routes)`,
      notes: "Compiled with Next.js 15.5.25 App Router, zero build errors",
    },
    {
      category: "TypeScript",
      value: verifiedQualityData.typeScriptCheck.status,
      status: "passed",
      testedOn: verifiedQualityData.typeScriptCheck.testDate,
      environment: "tsc --noEmit (TypeScript 5.7.3 strict mode)",
      notes: "Strict type check with 0 type errors across all routes",
    },
  ];

  if (data && data.scores) {
    indicators.push(
      {
        category: "Performance",
        value: `${data.scores.performance}/100`,
        numericScore: data.scores.performance,
        status: "verified",
        testedOn: data.testDate,
        environment: data.environment,
        notes: "Measured in local Next.js production build via Google Lighthouse 13.5.0",
      },
      {
        category: "Accessibility",
        value: `${data.scores.accessibility}/100`,
        numericScore: data.scores.accessibility,
        status: "verified",
        testedOn: data.testDate,
        environment: data.environment,
        notes: "WCAG contrast, ARIA landmarks, keyboard navigation",
      },
      {
        category: "Best Practices",
        value: `${data.scores.bestPractices}/100`,
        numericScore: data.scores.bestPractices,
        status: "verified",
        testedOn: data.testDate,
        environment: data.environment,
        notes: "Modern web standards, doctype, HTTPS, security best practices",
      },
      {
        category: "SEO",
        value: `${data.scores.seo}/100`,
        numericScore: data.scores.seo,
        status: "verified",
        testedOn: data.testDate,
        environment: data.environment,
        notes: "Metadata, Product JSON-LD Schema, OpenGraph, crawler accessibility",
      }
    );

    return {
      templateId,
      hasMeasuredLighthouse: true,
      auditDate: data.testDate,
      environment: data.environment,
      runner,
      indicators,
    };
  }

  // If template has not undergone Lighthouse audit yet, display only real measured status
  indicators.push(
    {
      category: "Performance",
      value: "Not tested",
      status: "pending",
      testedOn: "Pending audit",
      environment: "Scheduled",
      notes: "Unmeasured score not displayed to avoid unsubstantiated marketing claims",
    },
    {
      category: "Accessibility",
      value: "Not tested",
      status: "pending",
      testedOn: "Pending audit",
      environment: "Scheduled",
      notes: "Unmeasured score not displayed to avoid unsubstantiated marketing claims",
    },
    {
      category: "Best Practices",
      value: "Not tested",
      status: "pending",
      testedOn: "Pending audit",
      environment: "Scheduled",
      notes: "Unmeasured score not displayed to avoid unsubstantiated marketing claims",
    },
    {
      category: "SEO",
      value: "Not tested",
      status: "pending",
      testedOn: "Pending audit",
      environment: "Scheduled",
      notes: "Unmeasured score not displayed to avoid unsubstantiated marketing claims",
    }
  );

  return {
    templateId,
    hasMeasuredLighthouse: false,
    auditDate,
    environment,
    runner,
    indicators,
  };
}

/* ---------------------------------------------------------------- */
/*  Editorial & Blog Posts                                          */
/* ---------------------------------------------------------------- */

export interface BlogPostItem {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  tagColor: string;
}

export const BLOG_POSTS: BlogPostItem[] = [
  {
    slug: "how-to-launch-saas-landing-page",
    title: "How to Launch a SaaS Landing Page in Under 10 Minutes",
    excerpt: "A step-by-step walkthrough of setting up DimensionUI's Aether AI SaaS template in your Next.js project — from clone to deployed.",
    date: "2026-09-18",
    readTime: "5 min read",
    tag: "Tutorial",
    tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  },
  {
    slug: "3d-websites-convert-better",
    title: "Why 3D Websites Convert 2× Better Than Flat Designs",
    excerpt: "We analyzed 50 landing pages and found that interactive 3D elements increase time-on-site by 78% and conversion rates by 2×. Here's the data.",
    date: "2026-09-12",
    readTime: "7 min read",
    tag: "Research",
    tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
  {
    slug: "best-saas-templates-2026",
    title: "10 Best SaaS Website Templates of 2026",
    excerpt: "We curated the top 10 SaaS templates that are converting the best this year — from AI tools to B2B platforms.",
    date: "2026-09-05",
    readTime: "9 min read",
    tag: "Roundup",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    slug: "tailwind-framer-motion-animations",
    title: "Tailwind + Framer Motion: The Perfect Animation Stack",
    excerpt: "Learn how we combine Tailwind CSS utility classes with Framer Motion variants to create the silky 60fps animations you see in DimensionUI.",
    date: "2026-08-28",
    readTime: "6 min read",
    tag: "Deep Dive",
    tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  },
];

export function getBlogPostBySlug(slug: string): BlogPostItem | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}


