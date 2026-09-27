"use client";

/**
 * Bundles Section
 * Pre-packaged template deals shown on the homepage.
 */
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { TEMPLATES } from "@/lib/site";
import { Package, Zap, Star, ShoppingCart } from "lucide-react";

const BUNDLES = [
  {
    id: "saas-starter",
    name: "SaaS Starter Pack",
    description: "Everything you need to launch your next software product.",
    templateIds: ["aether-ai-saas", "nova-minimal-portfolio", "orbital-saas-hub"],
    originalPrice: 50,
    bundlePrice: 35,
    icon: Zap,
    gradient: "from-purple-600 to-cyan-500",
    badge: "Most Popular",
  },
  {
    id: "agency-pack",
    name: "Agency Power Pack",
    description: "Impress every client with this versatile agency-ready collection.",
    templateIds: ["serenity-wellness", "apex-b2b-platform", "nova-minimal-portfolio"],
    originalPrice: 50,
    bundlePrice: 35,
    icon: Star,
    gradient: "from-orange-500 to-pink-600",
    badge: "Best Value",
  },
  {
    id: "3d-universe",
    name: "3D Universe Bundle",
    description: "The full 3D experience — particle worlds, WebGL, and beyond.",
    templateIds: ["orbital-3d-universe", "helix-3d-agency", "nexus-3d-portfolio"],
    originalPrice: 90,
    bundlePrice: 59,
    icon: Package,
    gradient: "from-cyan-500 to-emerald-500",
    badge: "Premium",
  },
];

export function BundlesSection() {
  const { addItem } = useCartStore();

  const addBundle = (bundle: typeof BUNDLES[0]) => {
    bundle.templateIds.forEach((id) => {
      const template = TEMPLATES.find((t) => t.id === id);
      if (template) addItem(template);
    });
  };

  return (
    <section className="relative py-24 overflow-hidden" id="bundles">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-[600px] rounded-full bg-purple-600/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 mb-4">
            <Package className="size-3.5" />
            Bundle Deals
          </div>
          <h2 className="text-4xl font-black text-white mb-3">
            Save More with Bundles
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Curated template packs handpicked for specific industries. Save up to 35% vs. buying individually.
          </p>
        </div>

        {/* Bundle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BUNDLES.map((bundle, i) => {
            const Icon = bundle.icon;
            const saving = bundle.originalPrice - bundle.bundlePrice;
            const savingPct = Math.round((saving / bundle.originalPrice) * 100);

            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-all hover:bg-white/[0.04]"
              >
                {/* Badge */}
                <span className={`absolute -top-3 left-6 rounded-full bg-gradient-to-r ${bundle.gradient} px-3 py-1 text-[0.65rem] font-bold text-white shadow-lg`}>
                  {bundle.badge}
                </span>

                {/* Icon */}
                <div className={`mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${bundle.gradient} bg-opacity-20`}>
                  <Icon className="size-5 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{bundle.name}</h3>
                <p className="text-sm text-white/50 mb-5 flex-1">{bundle.description}</p>

                {/* Template list */}
                <div className="mb-5 flex flex-col gap-1.5">
                  {bundle.templateIds.map((id) => {
                    const t = TEMPLATES.find((t) => t.id === id);
                    return t ? (
                      <div key={id} className="flex items-center gap-2 text-xs text-white/60">
                        <span className="size-1.5 rounded-full bg-white/30" />
                        {t.name}
                      </div>
                    ) : null;
                  })}
                </div>

                {/* Pricing */}
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">${bundle.bundlePrice}</span>
                  <span className="text-sm text-white/40 line-through">${bundle.originalPrice}</span>
                  <span className="ml-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-400">
                    −{savingPct}%
                  </span>
                </div>

                <button
                  onClick={() => addBundle(bundle)}
                  className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${bundle.gradient} py-3 text-sm font-bold text-white hover:brightness-110 transition-all`}
                >
                  <ShoppingCart className="size-4" />
                  Add Bundle to Cart
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
