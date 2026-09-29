"use client";

import React, { useState } from "react";
import type { TemplateItem } from "@/lib/site";
import {
  Shield,
  ShieldCheck,
  Lock,
  Terminal,
  Activity,
  Compass,
  MapPin,
  Calendar,
  Users,
  Star,
  MessageSquare,
  CheckCircle,
  Zap,
  ArrowRight,
  Search,
  ExternalLink,
  ChevronRight,
  Globe,
  Sliders,
  DollarSign,
  AlertTriangle,
  FileText,
  Mail,
  HelpCircle,
  Inbox,
  Filter,
  ShoppingBag,
  Utensils,
  Truck,
  TrendingUp,
  Heart,
  Briefcase,
  Home,
  CheckSquare,
  Sparkles,
  CreditCard,
  PhoneCall,
  Clock,
  Layers,
} from "lucide-react";

interface TemplatePreviewCanvasProps {
  template: TemplateItem;
  primaryColor: string;
  accentColor: string;
  isLight: boolean;
  fontFamily: string;
  borderRadius: string;
}

export function TemplatePreviewCanvas({
  template,
  primaryColor,
  accentColor,
  isLight,
  fontFamily,
  borderRadius,
}: TemplatePreviewCanvasProps) {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedTour, setSelectedTour] = useState<number>(0);
  const [ticketFilter, setTicketFilter] = useState<string>("all");
  const [cartCount, setCartCount] = useState<number>(1);
  const [foodCategory, setFoodCategory] = useState<string>("signature");
  const [roasSpend, setRoasSpend] = useState<number>(15000);
  const [donationAmount, setDonationAmount] = useState<number>(100);
  const [donationFreq, setDonationFreq] = useState<"once" | "monthly">("monthly");
  const [roomType, setRoomType] = useState<number>(0);

  const bgStyle = {
    fontFamily,
    "--preview-primary": primaryColor,
    "--preview-accent": accentColor,
    "--preview-radius": borderRadius,
  } as React.CSSProperties;

  // 1. SENTINEL SECURITY
  if (template.id === "sentinel-security") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#060810] text-slate-100"}`} style={bgStyle}>
        <header className={`sticky top-0 z-30 border-b px-6 py-4 backdrop-blur-md ${isLight ? "border-slate-200/80 bg-white/80" : "border-cyan-500/10 bg-[#060810]/80"}`}>
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Shield className="size-5" />
              </div>
              <span className="text-lg font-black tracking-tight">Sentinel<span className="text-cyan-400">Sec</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="text-cyan-400 font-bold cursor-pointer">Platform</span>
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">Threat Monitor</span>
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">Solutions</span>
              <span className="hover:text-cyan-400 transition-colors cursor-pointer">Pricing</span>
            </nav>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SOC 2 Ready
              </span>
              <button className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:brightness-110 transition-all">
                Request Audit
              </button>
            </div>
          </div>
        </header>

        <section className="relative px-6 py-20 text-center">
          <div className="mx-auto max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-6">
              <Activity className="size-3.5 animate-pulse" />
              Autonomous Threat Prevention & EDR
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Stop Breaches Before They <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Surface</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Real-time threat intelligence, sub-second CVE telemetry, and automated zero-trust containment built for high-compliance enterprise infrastructure.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:scale-105 transition-all">
                Deploy Sentinel Agent <ArrowRight className="size-4" />
              </button>
              <button className={`flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors ${isLight ? "border-slate-300 bg-white" : "border-slate-700 bg-slate-900/60"}`}>
                <Terminal className="size-4 text-cyan-400" /> View CLI Docs
              </button>
            </div>
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="mx-auto max-w-5xl rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Live Telemetry Stream</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-cyan-400 font-bold">4,812</span> events/sec • <span className="text-emerald-400 font-bold">0</span> Active Breaches
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>DDoS Mitigation</span>
                  <ShieldCheck className="size-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">41.8 Gbps</div>
                <div className="text-[0.7rem] text-emerald-400 mt-1">100% Deflected at edge</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>CVE Exploits Scanned</span>
                  <Activity className="size-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">12,840</div>
                <div className="text-[0.7rem] text-slate-400 mt-1">Last scan: 3s ago</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Zero-Trust Auth Policy</span>
                  <Lock className="size-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">Enforced</div>
                <div className="text-[0.7rem] text-purple-400 mt-1">MFA & Hardware Key mandatory</div>
              </div>
            </div>
          </div>
        </section>

        <footer className={`border-t px-6 py-8 text-center text-xs text-slate-500 ${isLight ? "border-slate-200 bg-slate-100" : "border-slate-800 bg-black/40"}`}>
          <p>© 2026 Sentinel Security Inc. All enterprise defense protocols certified.</p>
        </footer>
      </div>
    );
  }

  // 2. VOYAGE ATLAS
  if (template.id === "voyage-atlas") {
    const tours = [
      { title: "Norwegian Fjords & Aurora", duration: "9 Days", price: "$3,850", rating: 4.98, image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&q=80", route: "Tromsø → Lofoten" },
      { title: "Patagonia Glacier Traverse", duration: "12 Days", price: "$4,200", rating: 4.96, image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800&q=80", route: "Torres del Paine → Fitz Roy" },
      { title: "Kyoto Bamboo Sanctuary", duration: "7 Days", price: "$2,950", rating: 4.99, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", route: "Kyoto → Arashiyama Valley" },
    ];
    return (
      <div className={`min-h-screen ${isLight ? "bg-[#faf9f5] text-stone-900" : "bg-[#0b0a08] text-stone-100"}`} style={bgStyle}>
        <header className={`sticky top-0 z-30 border-b px-6 py-4 backdrop-blur-md ${isLight ? "border-stone-200/80 bg-white/80" : "border-amber-500/10 bg-[#0b0a08]/80"}`}>
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-400"><Compass className="size-5" /></div>
              <span className="text-lg font-serif font-black tracking-tight">Voyage<span className="text-amber-500">Atlas</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <span className="text-amber-500 font-bold cursor-pointer">Destinations</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">Tours</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">Itineraries</span>
            </nav>
            <button className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 shadow-md hover:brightness-110">Book Expedition</button>
          </div>
        </header>

        <section className="px-6 py-20 text-center">
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 mb-6">
              <Compass className="size-3.5" /> Handcrafted Expeditions
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight">Curated Journeys Beyond The Horizon</h1>
            <p className="mt-4 text-base text-stone-400 max-w-2xl mx-auto">Bespoke travel itineraries crafted by native expedition leaders with private backcountry lodges.</p>
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {tours.map((t, idx) => (
              <div key={idx} className={`rounded-2xl border overflow-hidden ${isLight ? "border-stone-200 bg-white" : "border-stone-800 bg-stone-900/40"}`}>
                <div className="h-44 w-full relative"><img src={t.image} alt={t.title} className="h-full w-full object-cover" /><span className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-0.5 text-xs text-amber-400 font-bold">{t.duration}</span></div>
                <div className="p-4"><h3 className="font-serif font-bold text-base">{t.title}</h3><div className="mt-2 text-amber-400 font-bold">{t.price}</div></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // 3. SUPPORTDESK
  if (template.id === "supportdesk") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#080914] text-slate-100"}`} style={bgStyle}>
        <header className={`sticky top-0 z-30 border-b px-6 py-4 backdrop-blur-md ${isLight ? "border-slate-200/80 bg-white/80" : "border-purple-500/10 bg-[#080914]/80"}`}>
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-400/30 text-purple-400"><MessageSquare className="size-5" /></div>
              <span className="text-lg font-black tracking-tight">Support<span className="text-purple-400">Desk</span></span>
            </div>
            <button className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg">Start Free Trial</button>
          </div>
        </header>
        <section className="px-6 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-black">Resolve Customer Inquiries at <span className="text-purple-400">Light Speed</span></h1>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">Unify email, chat, WhatsApp, and social tickets into one lightning-fast shared inbox with AI macro replies.</p>
        </section>
      </div>
    );
  }

  // 4. STAYORA
  if (template.id === "stayora") {
    const suites = [
      { name: "Cliffside Infinity Villa", size: "1,450 sq ft", price: "$850/night", guests: "4 Guests", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80" },
      { name: "Oceanfront Garden Penthouse", size: "1,100 sq ft", price: "$620/night", guests: "2 Guests", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" },
      { name: "Boutique Lagoon Suite", size: "850 sq ft", price: "$440/night", guests: "2 Guests", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80" },
    ];
    return (
      <div className={`min-h-screen ${isLight ? "bg-[#fcfaf7] text-stone-900" : "bg-[#0c0a08] text-stone-100"}`} style={bgStyle}>
        <header className="border-b border-amber-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="text-xl font-serif font-black tracking-widest text-amber-400">STAYORA</div>
          <button className="bg-amber-500 text-stone-950 font-bold px-4 py-2 text-xs rounded-lg">Check Availability</button>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Boutique Luxury Villas</span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold mt-3">Sanctuary of Tranquility & Refined Luxury</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {suites.map((s, i) => (
              <div key={i} className="rounded-2xl border border-stone-800 bg-stone-900/40 overflow-hidden text-left">
                <img src={s.img} alt={s.name} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <div className="text-xs text-amber-400 font-bold">{s.price}</div>
                  <h3 className="font-serif font-bold text-base mt-1">{s.name}</h3>
                  <div className="text-xs text-stone-400 mt-1">{s.size} • {s.guests}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // 5. CARTLY COMMERCE
  if (template.id === "cartly-commerce") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#08080f] text-slate-100"}`} style={bgStyle}>
        <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="font-black text-xl tracking-tight">CARTLY<span className="text-purple-400">.</span></div>
          <div className="flex items-center gap-2 rounded-full border border-purple-500/30 px-3 py-1 text-xs">
            <ShoppingBag className="size-3.5 text-purple-400" />
            <span>Bag ({cartCount})</span>
          </div>
        </header>
        <section className="px-6 py-16 text-center max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black">Modern Essentials Engineered for Everyday Life</h1>
          <p className="text-slate-400 mt-3">Premium Japanese cotton, waterproof hardware, and lifetime warranty.</p>
        </section>
      </div>
    );
  }

  // 6. FRESHBITE
  if (template.id === "freshbite") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-emerald-50/30 text-stone-900" : "bg-[#070e0a] text-emerald-50"}`} style={bgStyle}>
        <header className="border-b border-emerald-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xl font-bold text-emerald-400"><Utensils className="size-5" /> FreshBite</div>
          <button className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 text-xs rounded-xl">Order Online</button>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black">Farm-to-Table Gourmet Plated In Minutes</h1>
          <p className="text-emerald-300/60 mt-4">100% organic regional produce prepared fresh to order. Delivery in 25–35 mins.</p>
        </section>
      </div>
    );
  }

  // 7. FLEETFLOW
  if (template.id === "fleetflow") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#060a12] text-slate-100"}`} style={bgStyle}>
        <header className="border-b border-cyan-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 font-black text-cyan-400"><Truck className="size-5" /> FleetFlow Telematics</div>
          <span className="text-xs font-mono text-emerald-400">● 148 Units En Route</span>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black">Complete Logistics & Freight Telematics Command</h1>
          <p className="text-slate-400 mt-4">Real-time GPS routing, automated fuel audits, and driver safety intelligence.</p>
        </section>
      </div>
    );
  }

  // 8. INSURELY
  if (template.id === "insurely") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#060b14] text-slate-100"}`} style={bgStyle}>
        <header className="border-b border-sky-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-sky-400"><ShieldCheck className="size-5" /> Insurely</div>
          <button className="bg-sky-500 text-slate-950 font-bold px-4 py-2 text-xs rounded-xl">Get Instant Quote</button>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black">Clear, Fiduciary Insurance Without Fine Print</h1>
          <p className="text-slate-400 mt-4">Direct digital claims, comprehensive family coverage, and 24-hour payout commitment.</p>
        </section>
      </div>
    );
  }

  // 9. FUNDORA
  if (template.id === "fundora") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#090714] text-slate-100"}`} style={bgStyle}>
        <header className="border-b border-violet-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-violet-400"><TrendingUp className="size-5" /> Fundora Wealth</div>
          <button className="bg-violet-600 text-white font-bold px-4 py-2 text-xs rounded-xl">Schedule Advisory</button>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black">Strategic Fiduciary Wealth Management</h1>
          <p className="text-slate-400 mt-4">Compound asset allocation designed for multi-generational capital preservation.</p>
        </section>
      </div>
    );
  }

  // 10. SCALEHR
  if (template.id === "scalehr") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#090812] text-slate-100"}`} style={bgStyle}>
        <header className="border-b border-purple-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-purple-400"><Users className="size-5" /> ScaleHR</div>
          <button className="bg-purple-600 text-white font-bold px-4 py-2 text-xs rounded-xl">Run Payroll Demo</button>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black">People Operations Built for High-Growth Teams</h1>
          <p className="text-slate-400 mt-4">Org charts, one-click global payroll runs, and transparent PTO approval workflows.</p>
        </section>
      </div>
    );
  }

  // 11. NONPROFITLY
  if (template.id === "nonprofitly") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-emerald-50/20 text-stone-900" : "bg-[#070f0a] text-emerald-50"}`} style={bgStyle}>
        <header className="border-b border-emerald-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-emerald-400"><Heart className="size-5" /> Nonprofitly</div>
          <button className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 text-xs rounded-xl">Donate Now</button>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black">Empowering Communities Through Direct Impact</h1>
          <p className="text-emerald-300/60 mt-4">91% of every dollar goes directly into field programs. Audited financial transparency.</p>
        </section>
      </div>
    );
  }

  // 12. EVENTSPACE
  if (template.id === "eventspace") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#080714] text-slate-100"}`} style={bgStyle}>
        <header className="border-b border-indigo-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 font-black text-indigo-400"><Calendar className="size-5" /> EVENTSPACE &apos;26</div>
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-4 py-2 text-xs rounded-xl">Get Passes</button>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black">The Premier Global Technology & AI Summit</h1>
          <p className="text-slate-400 mt-4">3 Days • 40+ Keynotes • 2,500 Developers & Founders in San Francisco.</p>
        </section>
      </div>
    );
  }

  // 13. ADPILOT
  if (template.id === "adpilot") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#060a12] text-slate-100"}`} style={bgStyle}>
        <header className="border-b border-cyan-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 font-black text-cyan-400"><Zap className="size-5" /> AdPilot Agency</div>
          <button className="bg-cyan-500 text-slate-950 font-bold px-4 py-2 text-xs rounded-xl">Get Free Audit</button>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black">Turn Paid Traffic Into Predictable Pipeline</h1>
          <p className="text-slate-400 mt-4">Full-funnel Google, Meta & LinkedIn acquisition driving $18.4M+ in verified partner revenue.</p>
        </section>
      </div>
    );
  }

  // 14. HOMENEST
  if (template.id === "homenest") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-[#fbf9f6] text-stone-900" : "bg-[#0d0b09] text-stone-100"}`} style={bgStyle}>
        <header className="border-b border-amber-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 font-serif font-black text-amber-400"><Home className="size-5" /> HomeNest Studio</div>
          <button className="bg-amber-500 text-stone-950 font-bold px-4 py-2 text-xs rounded-xl">Book Consultation</button>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold">Timeless Architectural Interiors & Luxury Renovations</h1>
          <p className="text-stone-400 mt-4">Bespoke residential spaces designed with natural materials, light, and architectural rigor.</p>
        </section>
      </div>
    );
  }

  // 15. STREAMLINE
  if (template.id === "streamline") {
    return (
      <div className={`min-h-screen ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#080814] text-slate-100"}`} style={bgStyle}>
        <header className="border-b border-purple-500/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 font-black text-purple-400"><CheckSquare className="size-5" /> Streamline</div>
          <button className="bg-purple-600 text-white font-bold px-4 py-2 text-xs rounded-xl">Open Workspace</button>
        </header>
        <section className="px-6 py-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black">Ship Faster with Async Sprint Collaboration</h1>
          <p className="text-slate-400 mt-4">Kanban boards, milestone velocity trackers, and shared markdown docs without context switching.</p>
        </section>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="preview-container">
      <div className="preview-card">
        <div className="badge">✦ {template.category}</div>
        <h1>{template.name}</h1>
        <p>{template.blurb}</p>
        <div className="features">
          {template.features.map((f: string) => (
            <div key={f} className="feature">
              <div className="dot" />
              <span>{f}</span>
            </div>
          ))}
        </div>
        <button className="cta-btn" type="button">
          Explore {template.name}
        </button>
      </div>
    </div>
  );
}
