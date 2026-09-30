"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquarePlus, X, CheckCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TemplateRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState("SaaS");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !idea) return;
    setLoading(true);

    // Store in localStorage for demo
    try {
      const existing = JSON.parse(localStorage.getItem("dimensionui_template_requests") || "[]");
      existing.push({ email, idea, category, timestamp: new Date().toISOString() });
      localStorage.setItem("dimensionui_template_requests", JSON.stringify(existing));
    } catch {}

    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setIdea("");
      setEmail("");
    }, 2500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 backdrop-blur-md transition-all hover:border-purple-400/50 hover:bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
      >
        <MessageSquarePlus className="size-3.5" />
        Request a Custom Template
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Request a Custom Template"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d15] p-6 shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close template request modal"
                className="absolute right-4 top-4 rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
              >
                <X className="size-4" />
              </button>

              {submitted ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <CheckCircle className="size-12 text-emerald-400 mb-3" />
                  <h3 className="text-xl font-bold text-white">Request Received!</h3>
                  <p className="mt-1 text-sm text-white/60">
                    We&apos;ll review your template idea and notify you at <strong className="text-white">{email}</strong> as soon as it&apos;s built.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Community Wishlist</span>
                    <h3 className="text-xl font-bold text-white mt-1">Request a Website Template</h3>
                    <p className="text-xs text-white/50 mt-1">
                      Need a specific niche or 3D feature we don&apos;t have yet? Tell us and we&apos;ll build it.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="founder@company.com"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-purple-500/60 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Category / Industry</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#161622] px-3.5 py-2.5 text-sm text-white focus:border-purple-500/60 focus:outline-none"
                      >
                        <option value="SaaS">SaaS & AI</option>
                        <option value="E-Commerce">E-Commerce & Fashion</option>
                        <option value="Health">Clinic, Wellness & MedTech</option>
                        <option value="Agency">Agency & Studio</option>
                        <option value="3D">3D & Interactive Experience</option>
                        <option value="Other">Other / Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Describe What You Need</label>
                      <textarea
                        required
                        rows={3}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="e.g. A dark mode cybersecurity portal with animated shield glow and interactive incident dashboard..."
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-purple-500/60 focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : "Submit Template Request"}
                      <Send className="size-4" />
                    </button>

                    <p className="mt-2 text-center text-[10px] text-white/40">
                      Your email is only used to notify you when your template is released. See our{" "}
                      <Link href="/privacy" onClick={() => setIsOpen(false)} className="text-purple-400 hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
