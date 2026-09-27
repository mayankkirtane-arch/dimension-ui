"use client";

/**
 * Recently Viewed Templates
 * Tracks template views in localStorage and shows the last 4 at the bottom of the gallery.
 */
import { useEffect, useState } from "react";
import { TEMPLATES } from "@/lib/site";
import type { TemplateItem } from "@/lib/site";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

const STORAGE_KEY = "dimensionui_recently_viewed";
const MAX_ITEMS = 6;

export function trackView(id: string) {
  if (typeof window === "undefined") return;
  try {
    const existing: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    const updated = [id, ...existing.filter((i) => i !== id)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function RecentlyViewed({ onPreview }: { onPreview: (item: TemplateItem) => void }) {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      setRecentIds(stored);
    } catch {}
  }, []);

  const recentItems = recentIds
    .map((id) => TEMPLATES.find((t) => t.id === id))
    .filter(Boolean) as TemplateItem[];

  if (recentItems.length < 2) return null;

  return (
    <div className="mt-16 border-t border-white/10 pt-12">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="size-4 text-white/40" />
        <span className="text-sm font-semibold text-white/40 uppercase tracking-widest">
          Recently Viewed
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {recentItems.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onPreview(item)}
            className="group flex flex-col items-start rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left hover:border-white/20 hover:bg-white/[0.06] transition-all"
          >
            <div
              className="w-full h-10 rounded-lg mb-2 opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(135deg, ${item.accent === "cyan" ? "#0891b2" : "#7c3aed"}, #0f172a)` }}
            />
            <span className="text-[0.7rem] font-semibold text-white truncate w-full">{item.name}</span>
            <span className="text-[0.6rem] text-white/40 mt-0.5">{item.price === "$0" ? "Free" : item.price}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
