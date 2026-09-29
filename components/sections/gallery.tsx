"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Search, Sparkles, Download, Eye, ExternalLink, Check, ArrowRight, Scale, SlidersHorizontal, Filter, Heart, TrendingUp, Sparkles as SparklesSolid, X } from "lucide-react";
import { RecentlyViewed, trackView } from "@/components/recently-viewed";
import { TemplateRequestModal } from "@/components/template-request-modal";
import { useCompareStore } from "@/components/template-compare-drawer";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { CodeModal, type CodeModalItem } from "@/components/code-modal";
import { PayPalCheckoutModal } from "@/components/paypal-checkout-modal";
import {
  AccentPill,
  EASE,
  GlassCard,
  Reveal,
  SectionHeader,
  SectionShell,
} from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import {
    TEMPLATES,
  TIER_COUNTS,
  type TemplateItem,
  type TemplateTier,
} from "@/lib/site";

const PHOTOS: Record<string, {src:string;overlay:string;chip:string}> = {
  // FREE TIER
  "aether-ai-saas":        {src:"1498050108023-c5249f4df085",overlay:"from-emerald-900/80 via-black/50 to-black/80",chip:"Waitlist capture"},
  "serenity-wellness":     {src:"1544161515-4ab6ce6db874",overlay:"from-teal-900/70 via-black/40 to-black/80",chip:"Appointment form"},
  "nova-minimal-portfolio":{src:"1517694712202-14dd9538aa97",overlay:"from-slate-900/80 via-black/40 to-black/80",chip:"Case studies"},
  "app-launch-lp":         {src:"1512941937669-90a1b58e7e9c",overlay:"from-cyan-900/70 via-black/40 to-black/80",chip:"App Store badges"},
  "simple-link-bio":       {src:"1611162617474-5b21e879e113",overlay:"from-violet-900/70 via-black/40 to-black/80",chip:"Social links"},
  // $15 TIER
  "peak-fitness":          {src:"1534438327276-14e5300c3a48",overlay:"from-red-900/80 via-black/50 to-black/80",chip:"Class schedule"},
  "azure-apartments":      {src:"1512917774080-9991f1c4c750",overlay:"from-blue-900/60 via-black/40 to-black/80",chip:"Floor plans"},
  "apex-dental-clinic":    {src:"1609840114035-3c981b782dfe",overlay:"from-sky-900/70 via-black/40 to-black/80",chip:"1-tap booking"},
  "precision-roofing":     {src:"1558618666-fcd25c85cd64",overlay:"from-slate-800/80 via-black/50 to-black/80",chip:"Instant quote"},
  "aura-beauty-salon":     {src:"1457972729786-0411a3b2b626",overlay:"from-rose-900/70 via-black/40 to-black/80",chip:"Treatment menu"},
  "nexus-coworking":       {src:"1497366216548-37526070297c",overlay:"from-cyan-900/60 via-black/40 to-black/80",chip:"Room booking"},
  "horizon-law-firm":      {src:"1589829545856-d10d557cf95f",overlay:"from-zinc-800/80 via-black/50 to-black/80",chip:"Consultation form"},
  "velvet-bistro":         {src:"1414235077428-338989a2e8c0",overlay:"from-amber-900/70 via-black/40 to-black/80",chip:"Table reservation"},
  "zenith-accounting":     {src:"1454165804606-c3d57bc86b40",overlay:"from-slate-800/80 via-black/50 to-black/80",chip:"Tax packages"},
  "urban-architecture":    {src:"1503387762-592deb58ef4e",overlay:"from-stone-800/70 via-black/50 to-black/80",chip:"Blueprint viewer"},
  "petpaws-vet":           {src:"1587300003388-59208cc962cb",overlay:"from-teal-900/70 via-black/40 to-black/80",chip:"Pet booking"},
  "luxe-auto-detailing":   {src:"1492144534655-ae79c964c9d7",overlay:"from-slate-900/80 via-black/50 to-black/80",chip:"Package compare"},
  "summit-event":          {src:"1505373877841-8d25f7d46678",overlay:"from-indigo-900/70 via-black/40 to-black/80",chip:"Speaker grid"},
  "prism-photo-studio":    {src:"1452587925148-ce544e77e70d",overlay:"from-zinc-900/70 via-black/40 to-black/80",chip:"Masonry gallery"},
  "greenthumb-landscape":  {src:"1416879595882-3373a0480b5b",overlay:"from-emerald-900/70 via-black/40 to-black/80",chip:"Yard estimate"},
  // $20 TIER
  "cloudscale-analytics":  {src:"1460925895917-afdab827c52f",overlay:"from-violet-900/80 via-black/50 to-black/80",chip:"Live metric dials"},
  "enterprise-b2b-agency": {src:"1552664730-d307ca884978",overlay:"from-slate-800/80 via-black/50 to-black/80",chip:"ROI calculator"},
  "ai-copilot-studio":     {src:"1677442135703-1787eea5ce01",overlay:"from-fuchsia-900/80 via-black/50 to-black/80",chip:"Streaming AI chat"},
  "fintech-neobank":       {src:"1556742049-0cfed4f6a45d",overlay:"from-indigo-900/80 via-black/50 to-black/80",chip:"3D card switcher"},
  "devflow-hub":           {src:"1555066931-bf19f8fd1085",overlay:"from-slate-900/80 via-black/50 to-black/80",chip:"API runner"},
  "pulse-analytics":       {src:"1551288049-bebda4e38f71",overlay:"from-violet-900/80 via-black/50 to-black/80",chip:"Server ping grid"},
  "edulearn-academy":      {src:"1522202176988-66273c2fd55f",overlay:"from-purple-900/80 via-black/50 to-black/80",chip:"Course syllabus"},
  "saas-billing-hub":      {src:"1563013544-824ae1b704d3",overlay:"from-violet-900/80 via-black/50 to-black/80",chip:"Seat calculator"},
  "talenthire-ats":        {src:"1516321318423-f06f85e504b3",overlay:"from-slate-800/80 via-black/50 to-black/80",chip:"Candidate pipeline"},
  "cryptostaking-protocol":{src:"1639762681485-074b7f938ba0",overlay:"from-indigo-900/80 via-black/50 to-black/80",chip:"APY calculator"},
  "venture-fund-capital":  {src:"1611974789855-9c2a0a7236a3",overlay:"from-purple-900/80 via-black/50 to-black/80",chip:"Portfolio filter"},
  "healthpulse-telehealth":{src:"1576091160399-112ba8d25d1d",overlay:"from-teal-900/70 via-black/40 to-black/80",chip:"Video room"},
  // NEW $20 TEMPLATES
  "sentinel-security":     {src:"1563986768609-322da13575f3",overlay:"from-cyan-950/80 via-black/50 to-black/80",chip:"Threat Monitoring"},
  "voyage-atlas":          {src:"1488646953014-85cb44e25828",overlay:"from-amber-950/80 via-black/50 to-black/80",chip:"Expedition Tours"},
  "supportdesk":           {src:"1531403009284-440f080d1e12",overlay:"from-indigo-950/80 via-black/50 to-black/80",chip:"Shared Inbox"},
  "stayora":                {src:"1582719508461-905c673771fd",overlay:"from-amber-950/80 via-black/50 to-black/80",chip:"Boutique Resort"},
  "cartly-commerce":       {src:"1441986300917-64674bd600d8",overlay:"from-purple-950/80 via-black/50 to-black/80",chip:"Online Store"},
  "freshbite":             {src:"1504674900247-0877df9cc836",overlay:"from-emerald-950/80 via-black/50 to-black/80",chip:"Digital Menu"},
  "fleetflow":             {src:"1586528116311-ad8dd3c8310d",overlay:"from-cyan-950/80 via-black/50 to-black/80",chip:"Fleet Telematics"},
  "insurely":              {src:"1450133064473-71024230f91b",overlay:"from-sky-950/80 via-black/50 to-black/80",chip:"Policy Finder"},
  "fundora":               {src:"1590283603385-17ffb3a7f29f",overlay:"from-violet-950/80 via-black/50 to-black/80",chip:"Wealth Advisory"},
  "scalehr":               {src:"1522071820081-009f0129c71c",overlay:"from-purple-950/80 via-black/50 to-black/80",chip:"People Platform"},
  "nonprofitly":           {src:"1488521787991-ed7bbaae773c",overlay:"from-emerald-950/80 via-black/50 to-black/80",chip:"Impact Donor"},
  "eventspace":            {src:"1511578314322-379afb476865",overlay:"from-indigo-950/80 via-black/50 to-black/80",chip:"Summit Agenda"},
  "adpilot":               {src:"1460925895917-afdab827c52f",overlay:"from-cyan-950/80 via-black/50 to-black/80",chip:"ROAS Optimizer"},
  "homenest":              {src:"1618221195710-dd6b41faaea6",overlay:"from-amber-950/80 via-black/50 to-black/80",chip:"Interior Design"},
  "streamline":            {src:"1484480974693-6ca0a78fb36b",overlay:"from-violet-950/80 via-black/50 to-black/80",chip:"Kanban Workspace"},
};

export function GallerySection() {
  const [filter, setFilter] = useState<TemplateTier>("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<CodeModalItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFramework, setSelectedFramework] = useState<string>("all");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [paypalTemplate, setPaypalTemplate] = useState<TemplateItem | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categoryOptions = [
    { id: "all", label: "All Categories" },
    { id: "saas", label: "SaaS & AI" },
    { id: "b2b", label: "B2B & Enterprise" },
    { id: "cybersecurity", label: "Cybersecurity" },
    { id: "travel", label: "Travel & Tours" },
    { id: "local", label: "Local Business" },
    { id: "fintech", label: "Fintech" },
    { id: "portfolio", label: "Portfolio & Creator" },
  ];

  const frameworkOptions = [
    { id: "all", label: "All Frameworks" },
    { id: "nextjs", label: "Next.js 15" },
  ];

  const featureOptions = [
    { id: "darkMode", label: "Dark Mode", emoji: "🌙" },
    { id: "auth", label: "Auth", emoji: "🔐" },
    { id: "dashboard", label: "Dashboard", emoji: "📊" },
    { id: "cms", label: "CMS", emoji: "📝" },
    { id: "animation", label: "Animation", emoji: "✨" },
  ];

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((f) => f !== featureId) : [...prev, featureId]
    );
  };

  const clearAllFilters = () => {
    setFilter("all");
    setSearch("");
    setSelectedCategory("all");
    setSelectedFramework("all");
    setSelectedFeatures([]);
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters =
    filter !== "all" ||
    search.trim().length > 0 ||
    selectedCategory !== "all" ||
    selectedFramework !== "all" ||
    selectedFeatures.length > 0 ||
    showFavoritesOnly;

  const activeFilterCount =
    (filter !== "all" ? 1 : 0) +
    (search.trim() ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedFramework !== "all" ? 1 : 0) +
    selectedFeatures.length +
    (showFavoritesOnly ? 1 : 0);

  const hasFeature = (item: TemplateItem, feature: string) => {
    const text = (item.name + " " + item.blurb + " " + item.category + " " + item.features.join(" ")).toLowerCase();
    switch (feature) {
      case "darkMode":
        return item.features.some((f) => /dark/i.test(f)) || /dark/i.test(item.blurb);
      case "auth":
        return /auth|login|signup|waitlist|account|booking|appointment|form/i.test(text);
      case "dashboard":
        return /dashboard|analytics|metric|admin|runner|pipeline|console|billing|portal/i.test(text);
      case "cms":
        return /cms|blog|case stud|changelog|markdown|syllabus/i.test(text);
      case "animation":
        return item.tier === "20" || /motion|framer|animation|animated|parallax|canvas|hover|slider|carousel|countdown|interactive|real-time/i.test(text);
      default:
        return true;
    }
  };
  const { items: cartItems, addItem } = useCartStore();
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlistStore();
  const { toggleTemplate: toggleCompare, selectedIds: compareIds, setOpen: setCompareOpen } = useCompareStore();

  const tabs: { id: TemplateTier; label: string; count: number; badgeStyle?: string }[] = [
    { id: "all", label: "All Templates", count: TIER_COUNTS.all },
    {
      id: "free",
      label: "Free Templates",
      count: TIER_COUNTS.free,
      badgeStyle: "border-emerald-400/40 bg-emerald-400/20 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(52,211,153,0.35)]",
    },
    { id: "15", label: "$15 Templates", count: TIER_COUNTS["15"] },
    { id: "20", label: "$20 Masterclass", count: TIER_COUNTS["20"] },
  ];

  const visible = useMemo(() => {
    return TEMPLATES.filter((item) => {
      // 0. Favorites filter
      if (showFavoritesOnly && (!mounted || !wishlistIds.includes(item.id))) {
        return false;
      }
      // 1. Price / Tier
      const matchesTier = filter === "all" || item.tier === filter;

      // 2. Category
      const catQuery = selectedCategory.toLowerCase();
      const matchesCategory =
        selectedCategory === "all" ||
        item.category.toLowerCase().includes(catQuery) ||
        (catQuery === "saas" && (item.category.includes("SaaS") || item.category.includes("Dev") || item.category.includes("Tech"))) ||
        (catQuery === "local" && (item.category.includes("Local") || item.category.includes("Fitness") || item.category.includes("Clinic") || item.category.includes("Contractor") || item.category.includes("Beauty") || item.category.includes("Law") || item.category.includes("Bistro"))) ||
        (catQuery === "b2b" && (item.category.includes("B2B") || item.category.includes("Finance") || item.category.includes("Corporate") || item.category.includes("Accounting"))) ||
        (catQuery === "portfolio" && (item.category.includes("Portfolio") || item.category.includes("Creator"))) ||
        (catQuery === "fintech" && (item.category.includes("Fintech") || item.category.includes("Finance")));

      // 3. Search query
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.blurb.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.features.some((f) => f.toLowerCase().includes(query)) ||
        item.integrations?.some((i) => i.name.toLowerCase().includes(query) || i.description.toLowerCase().includes(query)) ||
        (item.figma && (item.figma.state.toLowerCase().includes(query) || (item.figma.notes && item.figma.notes.toLowerCase().includes(query))));

      // 4. Framework (all templates built on Next.js 15)
      const matchesFramework = selectedFramework === "all" || selectedFramework === "nextjs";

      // 5. Feature filters (all selected features must match)
      const matchesFeatures = selectedFeatures.every((f) => hasFeature(item, f));

      return matchesTier && matchesCategory && matchesSearch && matchesFramework && matchesFeatures;
    });
  }, [showFavoritesOnly, mounted, wishlistIds, filter, selectedCategory, search, selectedFramework, selectedFeatures]);

  const handleOpenPreview = (item: TemplateItem) => {
    trackView(item.id);
    let customPreview = undefined;
    if (PHOTOS[item.id]) {
      customPreview = (
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-black/30 overflow-hidden relative h-[400px] shadow-2xl">
            <img 
              src={`https://images.unsplash.com/photo-${PHOTOS[item.id].src}?w=1200&q=80&auto=format&fit=crop`}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${PHOTOS[item.id].overlay}`} />
            <div className="absolute bottom-0 left-0 p-8">
              <span className="inline-flex items-center rounded-full bg-white/15 border border-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white mb-3">
                {PHOTOS[item.id].chip}
              </span>
              <p className="text-3xl font-black text-white leading-tight drop-shadow-lg">{item.name}</p>
            </div>
            {/* Hover overlay inside the modal picture */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm cursor-pointer" onClick={() => window.open(`/preview/${item.id}`, "_blank")}>
              <div className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-bold text-base shadow-2xl transition-transform transform hover:scale-105">
                <Eye className="size-5" />
                Live Demo
              </div>
            </div>
          </div>
          <button onClick={() => window.open(`/preview/${item.id}`, "_blank")} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors px-10 py-3 font-semibold text-white">
            <ExternalLink className="size-4" />
            Open Live Demo
          </button>
        </div>
      );
    }

    setSelectedItem({
      id: item.id,
      name: item.name,
      blurb: item.blurb,
      market: "saas",
      tier: item.tier === "20" ? "Motion" : "Static",
      icon: "layout-grid",
      pro: item.tier !== "free",
      preview: customPreview,
    });
  };

  const handleDirectDownload = (e: React.MouseEvent, item: TemplateItem) => {
    e.stopPropagation();
    if (item.tier === "free") {
      const content = `// DimensionUI Template: ${item.name}\n// Tier: FREE ($0)\n// Category: ${item.category}\n\nexport default function ${item.name.replace(/[^a-zA-Z0-9]/g, "")}() {\n  return (\n    <main className="min-h-screen bg-black text-white p-8">\n      <h1 className="text-4xl font-bold">${item.name}</h1>\n      <p className="mt-4 text-gray-400">${item.blurb}</p>\n    </main>\n  );\n}\n`;
      const blob = new Blob([content], { type: "text/typescript" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.id}-starter.tsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      setPaypalTemplate(item);
    }
  };

  return (
    <SectionShell id="gallery">
      <SectionHeader
        eyebrow="Website Templates"
        title="47 Production-Ready Website Templates"
        description="Clean Next.js 15 & React codebases. Copy free starters or download complete masterclass templates for commercial launch."
        centered
      />

      {/* Control Bar: Category tabs, Price filter, Search, and Feature filters */}
      <Reveal delay={0.1} className="mt-9 flex flex-col gap-4">
        {/* Row 1: Category tabs and Search */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Tabs */}
          <div
            role="tablist"
            aria-label="Filter templates by category"
            className="flex flex-wrap items-center gap-1.5"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint mr-1 hidden sm:inline">Category:</span>
            {categoryOptions.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                    active
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                      : "border-hairline text-ink-dim hover:border-hairline-strong hover:text-ink hover:bg-white/[0.04]"
                  )}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Favorites View Toggle */}
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            aria-pressed={showFavoritesOnly}
            className={cn(
              "relative inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
              showFavoritesOnly
                ? "border-red-500/50 bg-red-500/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.35)]"
                : "border-hairline text-ink-dim hover:border-hairline-strong hover:text-ink hover:bg-white/[0.04]"
            )}
          >
            <Heart className={cn("size-3.5 transition-colors", showFavoritesOnly ? "fill-red-500 text-red-500" : "text-white/40")} />
            <span>Favorites</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.2 font-mono text-[0.6875rem]",
                showFavoritesOnly ? "bg-red-500/30 text-white font-bold" : "bg-white/[0.06] text-ink-faint"
              )}
            >
              {mounted ? wishlistIds.length : 0}
            </span>
          </button>

          {/* Search bar */}
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all templates..."
              className="w-full rounded-full border border-hairline bg-surface/80 py-2 pr-9 pl-10 text-[0.8125rem] text-ink placeholder:text-ink-faint backdrop-blur-xl transition-all duration-300 focus:border-neon-purple-bright/60 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-neon-purple-bright/40"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-ink-faint hover:text-ink hover:bg-white/10"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Price Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint mr-1 hidden sm:inline">Price:</span>
          {tabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
                  active
                    ? tab.badgeStyle || "border-hairline-strong text-ink bg-white/[0.08]"
                    : "border-hairline text-ink-dim hover:border-hairline-strong hover:text-ink hover:bg-white/[0.04]"
                )}
              >
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={cn(
                    "relative z-10 rounded-full px-1.5 py-0.5 font-mono text-[0.6875rem]",
                    active ? "bg-white/15 text-ink" : "bg-white/[0.06] text-ink-faint"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Feature Filters (Framework, Dark mode, Auth, Dashboard, 3D, CMS, Animation) & Clear Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint mr-1 hidden sm:inline">Features:</span>

            {/* Framework Filter */}
            <div className="inline-flex items-center rounded-full border border-hairline bg-white/[0.02] p-0.5">
              {frameworkOptions.map((fw) => {
                const active = selectedFramework === fw.id;
                return (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() => setSelectedFramework(fw.id)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[0.6875rem] font-medium transition-all",
                      active
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold"
                        : "text-ink-dim hover:text-ink"
                    )}
                  >
                    {fw.label}
                  </button>
                );
              })}
            </div>

            {/* Feature Toggles */}
            {featureOptions.map((feat) => {
              const active = selectedFeatures.includes(feat.id);
              return (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => toggleFeature(feat.id)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
                    active
                      ? "border-purple-400/50 bg-purple-500/15 text-purple-200 font-semibold shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                      : "border-hairline text-ink-dim hover:border-hairline-strong hover:text-ink hover:bg-white/[0.04]"
                  )}
                >
                  <span>{feat.emoji}</span>
                  <span>{feat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active summary & Clear Filters */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-ink-dim">
              Showing <strong className="text-ink">{visible.length}</strong> of {TEMPLATES.length}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
              >
                <X className="size-3" />
                <span>Clear Filters ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>
      </Reveal>

            {/* Grid of Browser-Framed Cards */}
      <ul className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((item) => {
            const isFree = item.tier === "free";
            const isWishlisted = mounted && wishlistIds.includes(item.id);
            const isCompared = mounted && compareIds.includes(item.id);
            const itemIndex = TEMPLATES.indexOf(item);
            const purchaseCount = [47, 83, 124, 31, 67, 91, 158, 22, 44, 76, 112, 38, 55, 93, 141, 29, 68, 87, 103, 51, 72, 116, 34, 88, 145, 41, 63, 99, 127, 57, 84, 132, 65, 89, 142, 54, 78, 115, 62, 98, 134, 71, 106, 85, 129, 93, 118][itemIndex % 47] || 47;
            const isNew = itemIndex < 5; // First 5 templates are "New"

            return (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                transition={{ duration: 0.35, ease: EASE }}
                className="group flex flex-col"
              >
                {/* Browser Frame Window */}
                <div
                  onClick={() => handleOpenPreview(item)}
                  className="relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface/70 shadow-lg backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-hairline-strong hover:shadow-[0_20px_50px_-20px_rgba(7,7,13,0.9)] cursor-pointer"
                >
                  {/* Browser Window Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5">
                    {/* 3 colored window dots */}
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#ff5f56]" />
                      <span className="size-2 rounded-full bg-[#ffbd2e]" />
                      <span className="size-2 rounded-full bg-[#27c93f]" />
                    </div>
                    {/* Header right: New badge + Wishlist heart */}
                    <div className="flex items-center gap-2">
                      {isNew && (
                        <span className="rounded-full bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-purple-400/30 px-2 py-0.5 text-[0.6rem] font-bold text-cyan-300 animate-pulse">
                          ✦ New
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        {/* Compare Action */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const added = toggleCompare(item.id);
                            if (!added && !compareIds.includes(item.id)) {
                              setCompareOpen(true);
                            }
                          }}
                          aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
                          title={
                            isCompared
                              ? "Remove from comparison"
                              : compareIds.length >= 3
                              ? "Max 3 templates in comparison — click to view"
                              : "Compare template (select 2 or 3)"
                          }
                          className={cn(
                            "rounded-full p-1.5 transition-all focus:outline-none",
                            isCompared
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                              : "text-white/40 hover:text-white hover:bg-white/10"
                          )}
                        >
                          <Scale className="size-3.5" />
                        </button>

                        {/* Favorite Action */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(item.id); }}
                          aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
                          title={isWishlisted ? "Remove from favorites" : "Add to favorites"}
                          className="rounded-full p-1.5 transition-transform hover:bg-white/10 active:scale-125 focus:outline-none"
                        >
                          <Heart className={cn("size-4 transition-all duration-200", isWishlisted ? "fill-red-500 text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-white/40 hover:text-white")} />
                        </button>
                      </div>
                    </div>

                    {/* Window path URL */}
                    <span className="font-mono text-[0.625rem] text-ink-faint truncate max-w-[170px]">
                      dimensionui.com/t/{item.id}
                    </span>

                    <span className="size-2" />
                  </div>

                  {/* Thumbnail */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden transition-transform duration-700 group-hover:scale-[1.015]">
                    {PHOTOS[item.id] && (
                      <div className="absolute inset-0">
                        <img
                          src={`https://images.unsplash.com/photo-${PHOTOS[item.id].src}?w=600&q=80&auto=format&fit=crop`}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${PHOTOS[item.id].overlay}`} />
                        <div className="absolute inset-0 flex flex-col justify-end p-4">
                          <span className="inline-flex items-center self-start rounded-full bg-white/15 border border-white/20 backdrop-blur-md px-2 py-0.5 text-[0.55rem] font-semibold text-white mb-2">
                            {PHOTOS[item.id].chip}
                          </span>
                          <p className="text-[0.95rem] font-black text-white leading-tight drop-shadow-lg">{item.name}</p>
                        </div>
                        
                        {/* Hover Overlay Button */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                          <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-[0.85rem] transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
                            <Eye className="size-4" />
                            View Template
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-hairline bg-surface/90 px-4 py-3.5">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-[0.875rem] font-semibold text-ink pr-2">
                        {item.name}
                      </span>

                      {/* Tier Price Badge */}
                      {isFree ? (
                        <span className="shrink-0 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2.5 py-0.5 font-mono text-[0.6875rem] font-semibold text-emerald-400">
                          FREE
                        </span>
                      ) : item.tier === "15" ? (
                        <span className="shrink-0 rounded-full border border-cyan-400/35 bg-cyan-400/15 px-2.5 py-0.5 font-mono text-[0.6875rem] font-semibold text-cyan-400">
                          $15
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full border border-purple-400/35 bg-purple-400/15 px-2.5 py-0.5 font-mono text-[0.6875rem] font-semibold text-purple-300">
                          $20
                        </span>
                      )}
                    </div>

                    {/* Always Visible Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(item)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-white/5 border border-white/10 py-1.5 text-[0.75rem] font-semibold text-white transition-colors hover:bg-white/10"
                      >
                        <Eye className="size-3.5" />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDirectDownload(e, item)}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[0.75rem] font-semibold text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]",
                          isFree
                            ? "bg-emerald-500 hover:bg-emerald-400"
                            : "bg-gradient-to-r from-neon-purple to-electric-cyan hover:brightness-110"
                        )}
                      >
                        <Download className="size-3.5" />
                        {isFree ? "Download" : `Buy ${item.price}`}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {/* Empty State */}
      {visible.length === 0 && (
        <div className="mt-9 rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          {showFavoritesOnly ? (
            <div className="flex flex-col items-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <Heart className="size-7 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">No favorites saved yet</h3>
              <p className="mt-2 text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
                Click the heart icon on any template card to bookmark your favorite designs here for quick access anytime without logging in.
              </p>
              <button
                type="button"
                onClick={() => setShowFavoritesOnly(false)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-2.5 text-xs font-bold text-white hover:brightness-110 transition-all shadow-lg"
              >
                <span>Browse All Templates</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Filter className="mx-auto size-8 text-white/30 mb-3" />
              <h3 className="text-lg font-bold text-white">No matching templates found</h3>
              <p className="mt-1 text-xs text-white/50 max-w-sm mx-auto">
                No templates match the current combination of search, price, category, and feature filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all"
              >
                <X className="size-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Code Modal */}
      <CodeModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {paypalTemplate && (
        <PayPalCheckoutModal
          template={paypalTemplate}
          isOpen={!!paypalTemplate}
          onClose={() => setPaypalTemplate(null)}
        />
      )}
    </SectionShell>
  );
}

export default GallerySection;
