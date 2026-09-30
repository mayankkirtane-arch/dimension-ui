"use client";

import React, { useState, useEffect } from "react";
import { TemplateItem } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";
import {
  X,
  ShieldCheck,
  Lock,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  RefreshCw,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface PayPalCheckoutModalProps {
  template: TemplateItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type CheckoutStep =
  | "ready"
  | "creating_order"
  | "capturing"
  | "success"
  | "cancelled"
  | "error";

export function PayPalCheckoutModal({
  template,
  isOpen,
  onClose,
  onSuccess,
}: PayPalCheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("ready");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [licenseKey, setLicenseKey] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setStep("ready");
    setErrorMessage("");
    setCheckingAuth(true);

    const supabase = createClient();
    supabase.auth.getUser().then((res: any) => {
      setUser(res?.data?.user || null);
      setCheckingAuth(false);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "capturing") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, step, onClose]);

  const handleCreateAndPay = async () => {
    if (!user) return;
    setStep("creating_order");
    setErrorMessage("");

    try {
      // 1. Create order on server (Requirement 2 & 4: server trusted price)
      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.error || "Failed to create order.");
      }

      const orderId = createData.orderId;

      // 2. Capture order on server (Requirement 3 & 9)
      setStep("capturing");

      const captureRes = await fetch("/api/checkout/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          templateId: template.id,
        }),
      });

      const captureData = await captureRes.json();
      if (!captureRes.ok) {
        throw new Error(captureData.error || "Payment verification failed.");
      }

      setLicenseKey(captureData.licenseKey || "DIM-COMMERCIAL-UNLIMITED");
      setStep("success");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Checkout error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
      setStep("error");
    }
  };

  const handleCancel = () => {
    setStep("cancelled");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === "capturing" ? undefined : onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e0e1a] p-6 shadow-2xl z-10 text-white overflow-hidden"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 size-64 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>PayPal Sandbox Checkout</span>
                    <span className="rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 text-[10px] font-mono">
                      TEST MODE
                    </span>
                  </h3>
                  <p className="text-[11px] text-white/50">Verified secure order processing</p>
                </div>
              </div>

              {step !== "capturing" && (
                <button
                  onClick={onClose}
                  aria-label="Close checkout modal"
                  className="rounded-lg p-1 text-white/40 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Content Body */}
            <div className="py-4">
              {/* Template summary */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                      {template.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">{template.name}</h4>
                    <p className="text-xs text-white/60 mt-1 line-clamp-1">{template.blurb}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white">{template.price}</span>
                    <span className="block text-[10px] text-white/40">one-time</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                    Commercial License (Unlimited)
                  </span>
                  <span>Instant Source Download</span>
                </div>
              </div>

              {/* State: Checking Auth */}
              {checkingAuth && (
                <div className="flex flex-col items-center justify-center py-8 text-center text-white/50">
                  <RefreshCw className="size-6 animate-spin text-cyan-400 mb-2" />
                  <p className="text-xs">Checking session credentials...</p>
                </div>
              )}

              {/* State: User Logged Out (Requirement 6) */}
              {!checkingAuth && !user && step !== "success" && (
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 text-center">
                  <div className="inline-flex size-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 mb-2">
                    <Lock className="size-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Sign In / Sign Up Required</h4>
                  <p className="text-xs text-white/70 mb-4 max-w-xs mx-auto">
                    Please sign in or create an account so your purchase and license can be linked to your account vault.
                  </p>
                  <Link
                    href={`/login`}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition-all"
                  >
                    <LogIn className="size-3.5" />
                    Sign In / Sign Up with Magic Link
                  </Link>
                </div>
              )}

              {/* State: Ready / In Progress */}
              {!checkingAuth && user && (step === "ready" || step === "creating_order" || step === "capturing") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1 text-xs text-white/60">
                    <span>Logged in as:</span>
                    <span className="font-mono text-white/90">{user.email || user.id.slice(0, 14)}</span>
                  </div>

                  {/* PayPal Sandbox Action Button */}
                  <div className="space-y-2">
                    <button
                      onClick={handleCreateAndPay}
                      disabled={step === "creating_order" || step === "capturing"}
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#ffc439] hover:bg-[#f4b628] disabled:opacity-50 py-3.5 text-sm font-bold text-[#003087] shadow-lg transition-all"
                    >
                      {step === "creating_order" || step === "capturing" ? (
                        <>
                          <RefreshCw className="size-4 animate-spin text-[#003087]" />
                          <span>
                            {step === "creating_order"
                              ? "Creating PayPal Order..."
                              : "Verifying Capture..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="italic font-black text-base">PayPal</span>
                          <span className="text-xs uppercase font-extrabold tracking-wider bg-[#003087]/10 px-1.5 py-0.5 rounded">
                            Sandbox Pay Now
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleCancel}
                      disabled={step === "creating_order" || step === "capturing"}
                      className="w-full py-2 text-center text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      Cancel checkout
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-white/40 leading-relaxed">
                    By confirming this order, you agree to our{" "}
                    <Link href="/terms" target="_blank" className="text-cyan-400 hover:underline">
                      Terms
                    </Link>{" "}
                    &amp;{" "}
                    <Link href="/refund" target="_blank" className="text-cyan-400 hover:underline">
                      Refund Policy
                    </Link>
                    .
                  </p>

                  <p className="text-[11px] text-center text-white/40">
                    🔒 Sandbox simulation mode. Zero real currency will be charged.
                  </p>
                </div>
              )}

              {/* State: Cancelled */}
              {step === "cancelled" && (
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-center">
                  <AlertCircle className="size-8 text-yellow-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">Checkout Cancelled</h4>
                  <p className="text-xs text-white/70 mb-4">
                    No charges were made to your account. You can resume checkout whenever you&apos;re ready.
                  </p>
                  <button
                    onClick={() => setStep("ready")}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    Resume Checkout
                  </button>
                </div>
              )}

              {/* State: Error */}
              {step === "error" && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center">
                  <AlertCircle className="size-8 text-red-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">Payment Verification Failed</h4>
                  <p className="text-xs text-red-300 mb-4">{errorMessage}</p>
                  <button
                    onClick={() => setStep("ready")}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* State: Success (Requirement 9) */}
              {step === "success" && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-3">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Payment Complete!</h4>
                  <p className="text-xs text-white/70 mb-4">
                    Your license has been activated and added to your customer vault.
                  </p>

                  <div className="rounded-lg bg-black/40 border border-white/10 p-2.5 mb-4 text-left">
                    <span className="text-[10px] text-white/40 uppercase block">License Key</span>
                    <span className="font-mono text-xs font-bold text-emerald-300 select-all">
                      {licenseKey}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`/api/download/${template.id}`}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Download className="size-4" />
                      Download Template Source (.zip)
                    </a>
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] py-2.5 text-xs font-medium text-white/70 hover:text-white transition-all"
                    >
                      View in Vault Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
