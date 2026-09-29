"use client";

/**
 * Cart Drawer Component
 *
 * A sleek sliding panel showing cart items.
 * Features: bundle discount, coupon codes, totals.
 */
import { useState } from "react";
import { useCartStore, getCartTotals } from "@/lib/store";
import type { TemplateItem } from "@/lib/site";
import { CHECKOUT_URL, TEMPLATES } from "@/lib/site";
import { validateCoupon } from "@/lib/coupons";
import { X, ShoppingCart, Trash2, Tag, Zap, Ticket, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PayPalCheckoutModal } from "@/components/paypal-checkout-modal";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, clearCart } = useCartStore();
  const { subtotal, discount, total, bundleDiscount, paidItems } = getCartTotals(items);

  const [couponInput, setCouponInput] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLabel, setCouponLabel] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paypalTemplate, setPaypalTemplate] = useState<TemplateItem | null>(null);

  const couponSavings = (subtotal - discount) * (couponDiscount / 100);
  const finalTotal = Math.max(0, total - couponSavings);

  const handleApplyCoupon = () => {
    setCouponError("");
    const found = validateCoupon(couponInput);
    if (!found) {
      setCouponError("Invalid or expired coupon code.");
      return;
    }
    setCouponDiscount(found.discount);
    setCouponLabel(found.description);
    setCouponApplied(true);
    setCouponInput("");
  };

  const handleRemoveCoupon = () => {
    setCouponDiscount(0);
    setCouponLabel("");
    setCouponApplied(false);
    setCouponError("");
    setCouponInput("");
  };

  const handleCheckout = () => {
    const params = new URLSearchParams();
    items.forEach((item) => params.append("item", item.id));
    if (couponApplied && couponLabel) params.set("coupon", couponLabel);
    window.open(`${CHECKOUT_URL}?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0a0a0f] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-5 text-white" />
                <span className="text-lg font-bold text-white">Your Cart</span>
                {items.length > 0 && (
                  <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="rounded-lg border border-white/10 p-1.5 text-white/60 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingCart className="size-12 text-white/20" />
                  <p className="text-white/40 text-sm">Your cart is empty.<br />Browse templates and add some!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* Bundle discount nudge */}
                  {paidItems.length > 0 && paidItems.length < 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3"
                    >
                      <Zap className="size-4 text-purple-400 shrink-0" />
                      <p className="text-xs text-purple-300">
                        Add <strong>{3 - paidItems.length} more</strong> paid template{3 - paidItems.length > 1 ? "s" : ""} to unlock a <strong>20% bundle discount!</strong>
                      </p>
                    </motion.div>
                  )}

                  {/* Bundle discount active */}
                  {bundleDiscount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
                    >
                      <Tag className="size-4 text-emerald-400 shrink-0" />
                      <p className="text-xs text-emerald-300">
                        🎉 <strong>20% Bundle Discount Applied!</strong> You saved ${discount.toFixed(2)}
                      </p>
                    </motion.div>
                  )}

                  {/* Cart items */}
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-white">{item.name}</span>
                          <span className="text-xs text-white/40">
                            {item.tier === "free" ? "Free" : `$${item.tier} Tier`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-white">
                            {item.price === "$0" ? "FREE" : item.price}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-white/30 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer: Coupon + Totals + Checkout */}
            {items.length > 0 && (
              <div className="border-t border-white/10 px-6 py-5 flex flex-col gap-4">

                {/* Coupon Code Input */}
                <div className="flex flex-col gap-2">
                  {!couponApplied ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Ticket className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          placeholder="Promo code"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="size-4 text-emerald-400" />
                        <span className="text-xs text-emerald-300 font-medium">{couponDiscount}% off applied!</span>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-white/30 hover:text-red-400">
                        <XCircle className="size-4" />
                      </button>
                    </motion.div>
                  )}
                  {couponError && (
                    <p className="text-xs text-red-400 pl-1">{couponError}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-400">
                      <span>Bundle Discount (20%)</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  {couponSavings > 0 && (
                    <div className="flex justify-between text-sm text-cyan-400">
                      <span>Coupon ({couponDiscount}% off)</span>
                      <span>−${couponSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-white border-t border-white/10 pt-2 mt-1">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {paidItems.length > 0 && (
                  <button
                    onClick={() => {
                      const fullTemplate = TEMPLATES.find((t) => t.id === paidItems[0].id);
                      if (fullTemplate) setPaypalTemplate(fullTemplate);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ffc439] hover:bg-[#f4b628] py-3 text-sm font-bold text-[#003087] shadow-lg transition-all"
                  >
                    <span className="italic font-black text-sm">PayPal</span>
                    <span>Sandbox Checkout ({paidItems[0].name})</span>
                  </button>
                )}

                <button
                  onClick={handleCheckout}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg hover:brightness-110 transition-all"
                >
                  Checkout — ${finalTotal.toFixed(2)}
                </button>

                <button
                  onClick={clearCart}
                  className="text-center text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {paypalTemplate && (
        <PayPalCheckoutModal
          template={paypalTemplate}
          isOpen={!!paypalTemplate}
          onClose={() => setPaypalTemplate(null)}
          onSuccess={() => {
            removeItem(paypalTemplate.id);
            setPaypalTemplate(null);
          }}
        />
      )}
    </>
  );
}
