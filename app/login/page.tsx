"use client";

// Skip static prerendering — this page needs runtime env vars (Supabase URL)
export const dynamic = "force-dynamic";

/**
 * Login Page
 * Supports magic link (passwordless) login and Google OAuth via Supabase.
 */
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Zap, Mail, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for error parameters in URL on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      if (urlError) {
        setError(urlError);
      }
    }
  });

  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      if (error.message.toLowerCase().includes("not enabled")) {
        setError(
          "Google sign-in is not yet enabled in your Supabase project dashboard. Please sign in using the Email Magic Link below, or enable the Google provider in Supabase Authentication settings."
        );
      } else {
        setError(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="size-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500">
              <Zap className="size-5 text-white" />
            </div>
            <span className="text-xl font-black text-white">DimensionUI</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
          {sent ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle className="size-12 text-emerald-400" />
              <h1 className="text-2xl font-bold text-white">Check your email!</h1>
              <p className="text-white/60 text-sm">
                We sent a magic link to <strong className="text-white">{email}</strong>. Click it to sign in and access your purchases.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
              <p className="text-white/50 text-sm mb-6">Sign in to access your purchased templates.</p>

              {error && (
                <div className="p-3 mb-4 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-300 leading-relaxed">
                  {error}
                </div>
              )}

              {/* Google OAuth */}
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors mb-4"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0a0a12] px-3 text-xs text-white/40">or continue with email</span>
                </div>
              </div>

              {/* Magic link form */}
              <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 text-sm font-bold text-white hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Magic Link"}
                  <ArrowRight className="size-4" />
                </button>
              </form>

              <p className="mt-4 text-center text-[11px] text-white/40 leading-relaxed">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                  Terms
                </Link>
                ,{" "}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="/refund" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                  Refund Policy
                </Link>
                .
              </p>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-white/30">
          Don&apos;t have an account?{" "}
          <Link href="/#gallery" className="text-purple-400 hover:text-purple-300">
            Browse templates first
          </Link>
        </p>
      </div>
    </div>
  );
}
