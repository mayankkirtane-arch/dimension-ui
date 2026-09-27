"use client";

/**
 * Newsletter / Waitlist Capture
 * Simple email form that saves to localStorage and shows a toast confirmation.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

const STORAGE_KEY = "dimensionui_waitlist_email";

export function NewsletterCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // In production: POST to your API route or Supabase here
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem(STORAGE_KEY, email);
    setLoading(false);
    setSubmitted(true);
  };

  const alreadySignedUp = typeof window !== "undefined" && !!localStorage.getItem(STORAGE_KEY);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-950/60 via-slate-950 to-cyan-950/40 p-8 text-center">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-64 rounded-full bg-purple-600/10 blur-[80px]" />
      </div>

      <div className="relative">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10">
          <Mail className="size-5 text-purple-400" />
        </div>

        <h3 className="text-xl font-black text-white mb-2">
          Get Early Access to New Templates
        </h3>
        <p className="text-sm text-white/50 mb-6 max-w-sm mx-auto">
          Be the first to know when new 3D, SaaS, and premium templates drop. No spam, ever.
        </p>

        <AnimatePresence mode="wait">
          {submitted || alreadySignedUp ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-emerald-400 font-semibold"
            >
              <CheckCircle className="size-5" />
              You&apos;re on the list! We&apos;ll be in touch.
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-2 max-w-sm mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-purple-500/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white hover:brightness-110 transition-all disabled:opacity-60"
              >
                {loading ? "..." : "Join"}
                <ArrowRight className="size-3.5" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
