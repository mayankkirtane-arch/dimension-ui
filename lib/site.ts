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
  { label: "FAQ", href: "#faq" },
];

/** Primary conversion target used by the navbar + hero CTAs. */
export const CTA_HREF = "#gallery";
export const GALLERY_HREF = "#gallery";

/** Configurable checkout link (e.g., Lemon Squeezy, Gumroad, or Stripe Payment Link) */
export const CHECKOUT_URL = "https://dimensionui.lemonsqueezy.com/checkout";

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

export type GalleryTier = "3D" | "Motion" | "Static";

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
  { name: "Orbital Hero", blurb: "Particle-network hero with magnetic cursor physics.", market: "saas", tier: "3D", icon: "orbit" },
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
  { name: "Before and After", blurb: "Draggable comparison slider.", market: "local-business", tier: "3D", icon: "sliders-horizontal" },
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
  { name: "Product Spotlight", blurb: "Tilt card with layered shadow parallax.", market: "ecommerce", tier: "3D", icon: "box" },
  { name: "Drop Countdown", blurb: "Live timer with sold-out state transition.", market: "ecommerce", tier: "Motion", icon: "timer" },
  { name: "Quick Add Drawer", blurb: "Slide-in variant selector without a reload.", market: "ecommerce", tier: "Motion", icon: "shopping-bag" },
  { name: "Cart Summary", blurb: "Line-item editor with live totals.", market: "ecommerce", tier: "Motion", icon: "receipt" },
  { name: "Bundle Builder", blurb: "Mix-and-match picker with tiered discounts.", market: "ecommerce", tier: "Motion", icon: "package" },
  { name: "Size Guide", blurb: "Modal measurement table.", market: "ecommerce", tier: "Static", icon: "ruler" },
  { name: "Stock Scarcity", blurb: "Low-stock indicator with urgency copy.", market: "ecommerce", tier: "Motion", icon: "alert-triangle" },
  { name: "Wishlist Toggle", blurb: "Optimistic save action with persistence.", market: "ecommerce", tier: "Motion", icon: "heart" },
  { name: "Checkout Progress", blurb: "Three-step stepper with validation.", market: "ecommerce", tier: "Motion", icon: "credit-card" },
  { name: "Product Gallery", blurb: "Thumbnail rail with pinch-zoom.", market: "ecommerce", tier: "3D", icon: "images" },
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
    question: "How do the 3D and canvas templates stay at 60 FPS?",
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
    "Production-ready 3D and interactive templates for teams that would rather ship than rebuild from scratch.",
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
      title: "Support",
      links: [
        { label: "Licence terms", href: "#faq" },
        { label: "Refund policy", href: "#faq" },
        { label: "Contact", href: "#faq" },
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
  badge: "3D & Interactive Web Template Vault",
  /** Split so the gradient can wrap only the high-intent phrase. */
  headline: {
    lead: "Build ",
    gradient: "3D Websites That Convert",
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

export type TemplateTier = "all" | "free" | "15" | "20" | "30";

export type TemplateItem = {
  id: string;
  name: string;
  blurb: string;
  tier: "free" | "15" | "20" | "30";
  price: "$0" | "$15" | "$20" | "$30";
  category: string;
  accent: "green" | "cyan" | "purple" | "amber";
  previewGradient: string;
  features: string[];
  mockupType: "saas" | "fitness" | "clinic" | "realestate" | "portfolio" | "3d" | "b2b";
};

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
  },

  // 4. $30 HIGH-END 3D TIER (10 Templates — GPU-Powered 3D & Interactive)
  {
    id: "orbital-3d-universe",
    name: "Orbital 3D Universe",
    blurb: "Magnetic particle network canvas with cursor-reactive gravity and 60 FPS GPU physics.",
    tier: "30",
    price: "$30",
    category: "3D & Canvas",
    accent: "purple",
    previewGradient: "from-purple-950/90 via-slate-950 to-cyan-950/70",
    features: ["GPU canvas particle network", "Magnetic mouse repulsion", "Zero three.js dependency"],
    mockupType: "3d",
  },
  {
    id: "3d-product-tilt",
    name: "3D Kinetic Product Showcase",
    blurb: "Real-time 3D product tilt card with layered parallax depth, specular highlights, and zoom.",
    tier: "30",
    price: "$30",
    category: "3D & E-Commerce",
    accent: "purple",
    previewGradient: "from-fuchsia-950/80 via-slate-900 to-purple-950/80",
    features: ["CSS 3D gyroscope tracking", "Specular glare reflection", "Quick-add drawer modal"],
    mockupType: "3d",
  },
  {
    id: "hyperspace-cyber-studio",
    name: "HyperSpace Cyber Studio",
    blurb: "Futuristic dark agency with floating glass HUDs, neon laser lines, and kinetic typography.",
    tier: "30",
    price: "$30",
    category: "3D & Agency",
    accent: "purple",
    previewGradient: "from-violet-950/90 via-black to-cyan-950/80",
    features: ["Floating glass HUD layers", "Cursor laser trail", "Audio-reactive button sounds"],
    mockupType: "3d",
  },
  {
    id: "vortex-spatial-audio",
    name: "Vortex Spatial Sound Studio",
    blurb: "Interactive 3D waveform visualizer with frequency spectrum analyzer and sound toggles.",
    tier: "30",
    price: "$30",
    category: "3D & Audio",
    accent: "purple",
    previewGradient: "from-cyan-950/80 via-black to-purple-950/80",
    features: ["Live Canvas 2D waveform", "Volume frequency visualizer", "Surround demo toggle"],
    mockupType: "3d",
  },
  {
    id: "quantum-ai-mesh",
    name: "Quantum AI Computing Mesh",
    blurb: "Interactive neural mesh sphere with rotating synaptic nodes and glowing energy surges.",
    tier: "30",
    price: "$30",
    category: "3D & AI",
    accent: "purple",
    previewGradient: "from-indigo-950/90 via-slate-950 to-violet-950/80",
    features: ["Synaptic node physics", "Real-time vertex deformation", "Color palette switcher"],
    mockupType: "3d",
  },
  {
    id: "sphere-architecture",
    name: "Sphere 3D Architecture",
    blurb: "360-degree interactive architectural perspective viewer with dimensional wireframes.",
    tier: "30",
    price: "$30",
    category: "3D & Design",
    accent: "purple",
    previewGradient: "from-slate-950 via-zinc-950 to-purple-950/70",
    features: ["Isometric CAD wireframes", "Layered elevation toggle", "Material texture preview"],
    mockupType: "3d",
  },
  {
    id: "prism-hologram-studio",
    name: "Prism Hologram Studio",
    blurb: "Glassmorphism light refractions with chromatic rainbow dispersion and metallic sheen.",
    tier: "30",
    price: "$30",
    category: "3D & Luxury",
    accent: "purple",
    previewGradient: "from-purple-950/80 via-black to-pink-950/60",
    features: ["Chromatic aberration sheen", "Real-time pointer lighting", "Dark obsidian luxury"],
    mockupType: "3d",
  },
  {
    id: "astro-chrono-watch",
    name: "Astro Chrono Luxury Watch",
    blurb: "Luxury timepiece landing page with exploded view mechanical movements and dial customization.",
    tier: "30",
    price: "$30",
    category: "3D & D2C",
    accent: "purple",
    previewGradient: "from-amber-950/60 via-slate-950 to-purple-950/70",
    features: ["Dial component exploded view", "Strap material selector", "Luminescent night mode"],
    mockupType: "3d",
  },
  {
    id: "cybermatrix-gateway",
    name: "CyberMatrix Web3 Portal",
    blurb: "Interactive particle warp tunnel responding to mouse acceleration and scroll velocity.",
    tier: "30",
    price: "$30",
    category: "3D & Web3",
    accent: "purple",
    previewGradient: "from-cyan-950/90 via-black to-emerald-950/70",
    features: ["Infinite warp tunnel", "Scroll velocity acceleration", "HUD telemetry indicators"],
    mockupType: "3d",
  },
  {
    id: "flux-fluid-canvas",
    name: "Flux Fluid Dynamics Canvas",
    blurb: "High-performance liquid fluid canvas simulation with neon color swirl and ripple physics.",
    tier: "30",
    price: "$30",
    category: "3D & Creative",
    accent: "purple",
    previewGradient: "from-fuchsia-950/80 via-black to-cyan-950/80",
    features: ["Fluid viscosity controls", "Interactive pointer ripple", "60 FPS hardware accelerated"],
    mockupType: "3d",
  },
];

export const TIER_COUNTS = {
  all: TEMPLATES.length,
  free: TEMPLATES.filter((t) => t.tier === "free").length,
  "15": TEMPLATES.filter((t) => t.tier === "15").length,
  "20": TEMPLATES.filter((t) => t.tier === "20").length,
  "30": TEMPLATES.filter((t) => t.tier === "30").length,
};

