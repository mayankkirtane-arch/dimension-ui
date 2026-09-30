"use client";

import { useState, useEffect } from "react";
import { Sparkles, X, Send, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TEMPLATES, type TemplateItem } from "@/lib/site";
import Link from "next/link";
import { useCartStore } from "@/lib/store";

interface Message {
  role: "user" | "ai";
  content: string;
  recommendations?: TemplateItem[];
}

export function AiRecommender() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi! Describe your project (e.g., 'cybersecurity platform', 'luxury travel resort', 'e-commerce shop', 'helpdesk SaaS'), and I'll match the best templates for you.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    const newMessages: Message[] = [...messages, { role: "user", content: userQuery }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      // Smart keyword scoring algorithm
      const terms = userQuery.toLowerCase().split(/\s+/);
      const scored = TEMPLATES.map((t) => {
        let score = 0;
        const text = `${t.name} ${t.blurb} ${t.category} ${t.features.join(" ")} ${t.tier}`.toLowerCase();
        for (const term of terms) {
          if (term.length > 2 && text.includes(term)) {
            score += 2;
          }
        }
        if (terms.some(term => ["free", "cheap", "$0"].includes(term)) && t.tier === "free") {
          score += 5;
        }
        return { template: t, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const topMatches = scored.filter((s) => s.score > 0).slice(0, 3).map((s) => s.template);

      const aiResponse: Message = {
        role: "ai",
        content:
          topMatches.length > 0
            ? `Here are the top ${topMatches.length} matching templates for your project:`
            : "I couldn't find an exact match for that specific term, but here are some of our most popular starting points:",
        recommendations: topMatches.length > 0 ? topMatches : TEMPLATES.slice(0, 2),
      };

      setMessages([...newMessages, aiResponse]);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-purple-400/40 bg-gradient-to-r from-purple-600/90 to-cyan-600/90 px-5 py-3 text-xs font-bold text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] backdrop-blur-xl hover:scale-105 transition-all"
        >
          <Sparkles className="size-4 animate-pulse" />
          <span>AI Template Finder</span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="AI Template Matcher"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d16] shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-500">
                  <Sparkles className="size-3.5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">AI Template Matcher</h4>
                  <span className="text-[0.65rem] text-emerald-400 font-medium">● Instant recommendations</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close AI template matcher"
                className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                      m.role === "user"
                        ? "bg-purple-600 text-white font-medium"
                        : "bg-white/[0.05] border border-white/10 text-white/80"
                    }`}
                  >
                    {m.content}
                  </div>

                  {m.recommendations && (
                    <div className="mt-2.5 w-full space-y-2">
                      {m.recommendations.map((t) => (
                        <div
                          key={t.id}
                          className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[0.65rem] font-bold text-cyan-400 uppercase">{t.category}</span>
                            <span className="font-mono text-xs font-bold text-white">{t.price === "$0" ? "FREE" : t.price}</span>
                          </div>
                          <h5 className="font-bold text-white text-xs mt-0.5">{t.name}</h5>
                          <p className="text-[0.68rem] text-white/50 line-clamp-2 mt-0.5">{t.blurb}</p>

                          <div className="mt-2.5 flex items-center gap-2">
                            <Link
                              href={`/template/${t.id}`}
                              className="flex items-center gap-1 text-[0.68rem] font-semibold text-purple-400 hover:text-purple-300"
                            >
                              Details <ArrowRight className="size-3" />
                            </Link>
                            <button
                              onClick={() => addItem(t)}
                              className="ml-auto rounded-lg bg-white/10 border border-white/15 px-2.5 py-1 text-[0.65rem] font-bold text-white hover:bg-white/20"
                            >
                              + Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-1.5 text-white/40 text-xs">
                  <span className="size-1.5 rounded-full bg-purple-400 animate-bounce" />
                  <span className="size-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="size-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[0.7rem]">Finding best templates...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="border-t border-white/10 bg-black/40 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask e.g. '3D landing page for AI'"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:border-purple-500/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex size-8 items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50 shrink-0"
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
