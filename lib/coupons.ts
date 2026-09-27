/**
 * Coupon code definitions.
 * Add/remove codes here — no backend needed.
 */
export interface Coupon {
  code: string;
  discount: number; // percentage off, e.g. 30 = 30%
  description: string;
  expiresAt?: string; // ISO date string, optional
}

export const COUPONS: Coupon[] = [
  { code: "LAUNCH30", discount: 30, description: "Launch special — 30% off everything!" },
  { code: "WELCOME15", discount: 15, description: "Welcome discount — 15% off your first order." },
  { code: "BUNDLE20", discount: 20, description: "Bundle deal — 20% off 2+ templates." },
  { code: "SAVE50", discount: 50, description: "VIP code — 50% off!" },
];

export function validateCoupon(code: string): Coupon | null {
  const found = COUPONS.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase()
  );
  if (!found) return null;
  if (found.expiresAt && new Date(found.expiresAt) < new Date()) return null;
  return found;
}
