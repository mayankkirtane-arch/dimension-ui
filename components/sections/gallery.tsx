"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Search, Sparkles, Download, Eye, ExternalLink, Check, ArrowRight, Scale, SlidersHorizontal, Filter, Heart, TrendingUp, Sparkles as SparklesSolid } from "lucide-react";
import { RecentlyViewed, trackView } from "@/components/recently-viewed";
import { TemplateRequestModal } from "@/components/template-request-modal";
import { useCompareStore } from "@/components/template-compare-drawer";
import { Mockup3D } from "@/components/mockup-3d";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { CodeModal, type CodeModalItem } from "@/components/code-modal";
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
  CHECKOUT_URL,
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
};

export function GallerySection() {
  const [filter, setFilter] = useState<TemplateTier>("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<CodeModalItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { items: cartItems, addItem } = useCartStore();
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlistStore();
  const { addTemplate: addToCompare, selectedIds: compareIds } = useCompareStore();

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
    { id: "30", label: "$30 3D Tier", count: TIER_COUNTS["30"] },
  ];

  const visible = useMemo(() => {
    return TEMPLATES.filter((item) => {
      const matchesTier = filter === "all" || item.tier === filter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.blurb.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesTier && matchesSearch;
    });
  }, [filter, search]);

  const handleOpenPreview = (item: TemplateItem) => {
    trackView(item.id);
    let customPreview = undefined;
    if (item.mockupType !== "3d" && PHOTOS[item.id]) {
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
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm cursor-pointer" onClick={() => window.open(CHECKOUT_URL, "_blank")}>
              <div className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-bold text-base shadow-2xl transition-transform transform hover:scale-105">
                <Eye className="size-5" />
                Live Demo
              </div>
            </div>
          </div>
          <button onClick={() => window.open(CHECKOUT_URL, "_blank")} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors px-10 py-3 font-semibold text-white">
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
      tier: item.tier === "30" ? "3D" : item.tier === "20" ? "Motion" : "Static",
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
      window.open(CHECKOUT_URL, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <SectionShell id="gallery">
      <SectionHeader
        eyebrow="Website Templates"
        title="42 Production-Ready Website Templates"
        description="Clean Next.js 15 & React codebases. Copy free starters or download complete masterclass & 3D templates for commercial launch."
        centered
      />

      {/* Control Bar: Categories on left, Search on right */}
      <Reveal delay={0.1} className="mt-9">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Tabs */}
          <div
            role="tablist"
            aria-label="Filter templates by tier"
            className="flex flex-wrap items-center gap-2"
          >
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
                    "relative inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-all duration-300",
                    active
                      ? tab.badgeStyle || "border-hairline-strong text-ink bg-white/[0.08]"
                      : "border-hairline text-ink-dim hover:border-hairline-strong hover:text-ink hover:bg-white/[0.04]",
                  )}
                >
                  <span className="relative z-10">{tab.label}</span>
                  <span
                    className={cn(
                      "relative z-10 rounded-full px-2 py-0.5 font-mono text-[0.6875rem]",
                      active ? "bg-white/15 text-ink" : "bg-white/[0.06] text-ink-faint",
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all templates..."
              className="w-full rounded-full border border-hairline bg-surface/80 py-2 pr-4 pl-10 text-[0.8125rem] text-ink placeholder:text-ink-faint backdrop-blur-xl transition-all duration-300 focus:border-neon-purple-bright/60 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-neon-purple-bright/40"
            />
          </div>
        </div>
      </Reveal>

      {/* Grid of Browser-Framed Cards */}
      <ul className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((item) => {
            const isFree = item.tier === "free";
            const isWishlisted = wishlistIds.includes(item.id);
            const itemIndex = TEMPLATES.indexOf(item);
            const purchaseCount = [47, 83, 124, 31, 67, 91, 158, 22, 44, 76, 112, 38, 55, 93, 141, 29, 68, 87, 103, 51, 72, 116, 34, 88, 145, 41, 63, 99, 127, 57, 84, 132, 26, 73, 108, 89, 147, 43, 61, 95, 119, 77][itemIndex % 42] || 47;
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
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(item.id); }}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        className="rounded-full p-1 transition-colors hover:bg-white/10"
                      >
                        <Heart className={cn("size-3.5 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-white/30")} />
                      </button>
                    </div>

                    {/* Window path URL */}
                    <span className="font-mono text-[0.625rem] text-ink-faint truncate max-w-[170px]">
                      dimensionui.com/t/{item.id}
                    </span>

                    <span className="size-2" />
                  </div>

                  {/* Thumbnail */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden transition-transform duration-700 group-hover:scale-[1.015]">
                    {item.mockupType !== "3d" && PHOTOS[item.id] && (
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

                    {item.mockupType === "3d" && <Mockup3D itemId={item.id} />}
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
                      ) : item.tier === "20" ? (
                        <span className="shrink-0 rounded-full border border-purple-400/35 bg-purple-400/15 px-2.5 py-0.5 font-mono text-[0.6875rem] font-semibold text-purple-300">
                          $20
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full border border-neon-purple/50 bg-gradient-to-r from-neon-purple/20 to-electric-cyan/20 px-2.5 py-0.5 font-mono text-[0.6875rem] font-semibold text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]">
                          $30 3D
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

      {/* Code Modal */}
      <CodeModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </SectionShell>
  );
}

export default GallerySection;
