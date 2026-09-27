"use client";

/**
 * Flash Sale Banner
 * Dismissable countdown banner shown at the top of the page.
 * Sale end time is configurable below.
 */
import { useEffect, useState } from "react";
import { X, Zap } from "lucide-react";

// ⚙️ Configure your sale here:
const SALE_DISCOUNT = "30%";
const SALE_LABEL = "Flash Sale";
// Sale ends 48 hours from first visit (stored in localStorage)
const SALE_DURATION_MS = 48 * 60 * 60 * 1000;
const STORAGE_KEY = "dimensionui_sale_end";
const DISMISSED_KEY = "dimensionui_sale_dismissed";

function getOrCreateSaleEnd(): number {
  if (typeof window === "undefined") return Date.now() + SALE_DURATION_MS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return parseInt(stored, 10);
  const end = Date.now() + SALE_DURATION_MS;
  localStorage.setItem(STORAGE_KEY, String(end));
  return end;
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export function FlashSaleBanner() {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;
    setVisible(true);

    const saleEnd = getOrCreateSaleEnd();

    const tick = () => {
      const diff = saleEnd - Date.now();
      if (diff <= 0) {
        setVisible(false);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h: pad(h), m: pad(m), s: pad(s) });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div className="relative z-50 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white">
      <Zap className="size-4 shrink-0" />
      <span>
        ⚡ <strong>{SALE_LABEL}:</strong> {SALE_DISCOUNT} off all templates — ends in{" "}
        <span className="font-mono tabular-nums">
          {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
        </span>
      </span>
      <a
        href="#gallery"
        className="ml-1 underline underline-offset-2 hover:no-underline"
      >
        Shop now →
      </a>
      <button
        onClick={dismiss}
        aria-label="Dismiss sale banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/20 transition-colors"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
