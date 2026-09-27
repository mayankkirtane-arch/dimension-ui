"use client";

/**
 * Affiliate / Referral Tracker
 * Reads the ?ref= URL param on first visit and stores it in localStorage.
 * This ref code will be passed to the checkout URL so you can track commissions.
 * Mount this once in layout.tsx.
 */
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const REF_KEY = "dimensionui_ref";

export function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && !localStorage.getItem(REF_KEY)) {
      localStorage.setItem(REF_KEY, ref);
    }
  }, [searchParams]);

  return null;
}

/** Call this to get the stored referral code when building the checkout URL */
export function getStoredRef(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REF_KEY);
}
