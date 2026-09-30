"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TEMPLATES, type TemplateItem, getTemplateFigma } from "@/lib/site";
import { X, Scale, Check, Trash2, ArrowRight, ShoppingCart, Info, Layers, Figma } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";

interface CompareStore {
  selectedIds: string[];
  isOpen: boolean;
  addTemplate: (id: string) => boolean;
  removeTemplate: (id: string) => void;
  toggleTemplate: (id: string) => boolean;
  clearAll: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selectedIds: [],
      isOpen: false,
      addTemplate: (id) => {
        const { selectedIds } = get();
        if (selectedIds.includes(id)) return true;
        if (selectedIds.length >= 3) return false; // Strictly prevent selecting more than 3
        set({ selectedIds: [...selectedIds, id] });
        return true;
      },
      toggleTemplate: (id) => {
        const { selectedIds } = get();
        if (selectedIds.includes(id)) {
          set({ selectedIds: selectedIds.filter((i) => i !== id) });
          return false;
        }
        if (selectedIds.length >= 3) {
          // Strictly prevent selecting more than 3
          return false;
        }
        set({ selectedIds: [...selectedIds, id] });
        return true;
      },
      removeTemplate: (id) =>
        set((state) => ({ selectedIds: state.selectedIds.filter((i) => i !== id) })),
      clearAll: () => set({ selectedIds: [] }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "dimensionui_compare",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

function getIntegrations(t: TemplateItem): string | null {
  if (t.integrations && t.integrations.length > 0) {
    return t.integrations.map((i) => `${i.name} (${i.status})`).join(", ");
  }
  return "None (Self-contained)";
}

export function TemplateCompareDrawer() {
  const { selectedIds, isOpen, setOpen, removeTemplate, clearAll } = useCompareStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  const templates = mounted
    ? (selectedIds
        .map((id) => TEMPLATES.find((t) => t.id === id))
        .filter(Boolean) as TemplateItem[])
    : [];

  if (!mounted || (selectedIds.length === 0 && !isOpen)) return null;

  return (
    <>
      {/* Floating comparison badge if items selected */}
      {!isOpen && selectedIds.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2.5 rounded-full border border-cyan-500/40 bg-[#0c0f18]/95 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:scale-105 active:scale-95 transition-all"
            aria-label={`Open template comparison (${selectedIds.length} of 3 selected)`}
          >
            <Scale className="size-4 text-cyan-400" />
            <span>Compare Templates ({selectedIds.length}/3)</span>
            <span className="rounded-full bg-cyan-400/20 text-cyan-300 px-2 py-0.5 text-[0.65rem] font-mono">
              View
            </span>
          </button>
        </motion.div>
      )}

      {/* Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl my-auto max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c16] p-4 sm:p-7 shadow-2xl z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Scale className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Compare Templates</h3>
                    <p className="text-xs text-white/50">
                      {templates.length === 1
                        ? "1 template selected — select at least 1 more to compare (max 3)"
                        : `${templates.length} of 3 templates selected`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {templates.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-white/40 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-white/[0.04]"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Close comparison"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {templates.length === 0 ? (
                <div className="py-16 text-center text-white/40 text-sm">
                  <Scale className="size-8 mx-auto text-white/20 mb-3" />
                  <p className="text-white font-medium">No templates selected</p>
                  <p className="text-xs text-white/50 mt-1">
                    Click the <Scale className="inline size-3 text-cyan-400 mx-0.5" /> Compare button on any template card in the catalog!
                  </p>
                </div>
              ) : templates.length === 1 ? (
                <div className="py-8">
                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 mb-6 flex items-center gap-3 text-xs text-cyan-300">
                    <Info className="size-4 shrink-0" />
                    <span>You have selected <strong>{templates[0].name}</strong>. Please select at least 1 more template from the catalog to see a side-by-side comparison (up to 3).</span>
                  </div>
                  
                  {/* Single template card preview */}
                  <div className="max-w-sm mx-auto rounded-xl border border-white/10 bg-white/[0.02] p-5 relative">
                    <button
                      onClick={() => removeTemplate(templates[0].id)}
                      className="absolute right-3 top-3 rounded-full p-1.5 text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <span className="text-[0.65rem] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                      {templates[0].category}
                    </span>
                    <h4 className="text-base font-bold text-white">{templates[0].name}</h4>
                    <p className="text-xs text-white/50 mt-1">{templates[0].blurb}</p>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-white/40">Price</span>
                      <span className="text-sm font-bold text-white">{templates[0].tier === "free" ? "Free ($0)" : templates[0].price}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* 2 or 3 templates: Side-by-Side Comparison Table */
                <div className="overflow-x-auto pb-4">
                  <table className="w-full min-w-[620px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 px-3 w-40 text-xs font-semibold uppercase tracking-wider text-white/40">
                          Specification
                        </th>
                        {templates.map((t) => (
                          <th key={t.id} className="py-4 px-3 w-1/3 align-top">
                            <div className="flex flex-col gap-1.5 relative pr-8">
                              <button
                                onClick={() => removeTemplate(t.id)}
                                className="absolute right-0 top-0 rounded-full p-1.5 text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"
                                title={`Remove ${t.name} from comparison`}
                                aria-label={`Remove ${t.name}`}
                              >
                                <Trash2 className="size-4" />
                              </button>
                              <span className="text-[0.65rem] font-bold text-cyan-400 uppercase tracking-widest">
                                {t.category}
                              </span>
                              <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                                {t.name}
                              </h4>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-xs">
                      {/* 0. Name */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Name</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-3 px-3 font-bold text-white">
                            {t.name}
                          </td>
                        ))}
                      </tr>

                      {/* 1. Price */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Price</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-3 px-3 font-bold text-sm text-white">
                            {t.tier === "free" ? "Free ($0)" : t.price}
                          </td>
                        ))}
                      </tr>

                      {/* 2. Category */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Category</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-3 px-3 text-white/80 font-medium">
                            {t.category}
                          </td>
                        ))}
                      </tr>

                      {/* 3. Framework */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Framework</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-3 px-3 text-white/80">
                            Next.js 15 (App Router)
                          </td>
                        ))}
                      </tr>

                      {/* 4. Versions */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Versions</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-3 px-3 text-white/70 font-mono text-[0.6875rem]">
                            Next 15.1.6, React 19.0.0, Tailwind v4, TS 5.7.3
                          </td>
                        ))}
                      </tr>

                      {/* 5. Page count */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Page count</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-3 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-mono bg-white/[0.04] text-white/40 border border-white/10">
                              Unavailable
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* 6. Component count */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Component count</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-3 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-mono bg-white/[0.04] text-white/40 border border-white/10">
                              Unavailable
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* 7. Dark mode */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Dark mode</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-3 px-3 text-white/80">
                            {t.features.some((f) => /dark/i.test(f))
                              ? "Yes (Default)"
                              : "Yes (Dark Obsidian Theme)"}
                          </td>
                        ))}
                      </tr>

                      {/* 8. Responsive */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Responsive</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-3 px-3 text-emerald-400 font-medium">
                            Yes (Mobile, Tablet, Desktop)
                          </td>
                        ))}
                      </tr>

                      {/* 9. License */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">License</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-3 px-3 text-white/80">
                            Commercial (Unlimited Projects)
                          </td>
                        ))}
                      </tr>

                      {/* 10. Integrations */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Integrations</td>
                        {templates.map((t) => {
                          const integrations = getIntegrations(t);
                          return (
                            <td key={t.id} className="py-3 px-3 text-white/80">
                              {integrations ? (
                                <span className="text-cyan-300 font-medium">{integrations}</span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-mono bg-white/[0.04] text-white/40 border border-white/10">
                                  Unavailable
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* 11. Figma */}
                      <tr>
                        <td className="py-3 px-3 font-semibold text-white/60">Figma</td>
                        {templates.map((t) => {
                          const figma = getTemplateFigma(t);
                          return (
                            <td key={t.id} className="py-3 px-3 text-white/80">
                              {figma.state === "Figma Included" ? (
                                <span className="inline-flex items-center gap-1 text-violet-300 font-medium">
                                  <Figma className="size-3 text-violet-400" />
                                  Included
                                </span>
                              ) : figma.state === "Figma Available" ? (
                                <span className="inline-flex items-center gap-1 text-cyan-300 font-medium">
                                  <Figma className="size-3 text-cyan-400" />
                                  Available
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-mono bg-white/[0.04] text-white/40 border border-white/10">
                                  No Figma File
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* Actions */}
                      <tr className="border-t border-white/10 bg-white/[0.01]">
                        <td className="py-4 px-3 font-semibold text-white/60">Actions</td>
                        {templates.map((t) => (
                          <td key={t.id} className="py-4 px-3">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => addItem(t)}
                                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 py-2 text-xs font-bold text-white hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                              >
                                <ShoppingCart className="size-3.5" />
                                <span>{t.tier === "free" ? "Get Free" : `Buy ${t.price}`}</span>
                              </button>
                              <Link
                                href={`/template/${t.id}`}
                                onClick={() => setOpen(false)}
                                className="w-full text-center text-xs text-white/50 hover:text-white py-1 transition-colors flex items-center justify-center gap-1"
                              >
                                <span>View Page</span>
                                <ArrowRight className="size-3" />
                              </Link>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default TemplateCompareDrawer;
