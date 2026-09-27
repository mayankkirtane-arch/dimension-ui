"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TEMPLATES, type TemplateItem } from "@/lib/site";
import { X, Scale, Check, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/lib/store";

interface CompareStore {
  selectedIds: string[];
  isOpen: boolean;
  addTemplate: (id: string) => void;
  removeTemplate: (id: string) => void;
  clearAll: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      selectedIds: [],
      isOpen: false,
      addTemplate: (id) =>
        set((state) => {
          if (state.selectedIds.includes(id)) return state;
          if (state.selectedIds.length >= 3) {
            // Keep max 3, drop oldest
            return { selectedIds: [...state.selectedIds.slice(1), id], isOpen: true };
          }
          return { selectedIds: [...state.selectedIds, id], isOpen: true };
        }),
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

export function TemplateCompareDrawer() {
  const { selectedIds, isOpen, setOpen, removeTemplate, clearAll } = useCompareStore();
  const { addItem } = useCartStore();

  const templates = selectedIds
    .map((id) => TEMPLATES.find((t) => t.id === id))
    .filter(Boolean) as TemplateItem[];

  if (selectedIds.length === 0 && !isOpen) return null;

  return (
    <>
      {/* Floating comparison badge if items selected but drawer closed */}
      {!isOpen && selectedIds.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2.5 rounded-full border border-cyan-500/40 bg-[#0c0f18]/90 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
          >
            <Scale className="size-4 text-cyan-400" />
            <span>Compare Templates ({selectedIds.length}/3)</span>
          </button>
        </motion.div>
      )}

      {/* Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d16] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Scale className="size-5 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Compare Templates</h3>
                  <span className="text-xs text-white/50">({templates.length} of 3 selected)</span>
                </div>
                <div className="flex items-center gap-3">
                  {templates.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-white/40 hover:text-red-400 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {templates.length === 0 ? (
                <div className="py-12 text-center text-white/40 text-sm">
                  No templates selected yet. Click the compare button on any card in the gallery!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {templates.map((t) => (
                    <div
                      key={t.id}
                      className="flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-5 relative"
                    >
                      <button
                        onClick={() => removeTemplate(t.id)}
                        className="absolute right-3 top-3 rounded-full p-1 text-white/30 hover:text-red-400 hover:bg-white/10"
                      >
                        <Trash2 className="size-3.5" />
                      </button>

                      <span className="text-[0.65rem] font-bold text-cyan-400 uppercase tracking-widest mb-1">
                        {t.category}
                      </span>
                      <h4 className="text-base font-bold text-white">{t.name}</h4>
                      <p className="text-xs text-white/50 mt-1 min-h-[36px] line-clamp-2">{t.blurb}</p>

                      <div className="my-4 border-y border-white/10 py-3 flex items-baseline justify-between">
                        <span className="text-xs text-white/40 font-medium">Price</span>
                        <span className="text-lg font-black text-white">{t.price === "$0" ? "FREE" : t.price}</span>
                      </div>

                      <div className="space-y-2 mb-6 flex-1">
                        <span className="text-[0.7rem] font-semibold text-white/60 uppercase tracking-wider block">Features:</span>
                        {t.features.map((f) => (
                          <div key={f} className="flex items-start gap-2 text-xs text-white/70">
                            <Check className="size-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2 mt-auto">
                        <button
                          onClick={() => addItem(t)}
                          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-2.5 text-xs font-bold text-white hover:brightness-110"
                        >
                          Add to Cart ({t.price === "$0" ? "FREE" : t.price})
                        </button>
                        <Link
                          href={`/template/${t.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-center gap-1 text-xs text-white/50 hover:text-white py-1"
                        >
                          View Full Page <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
