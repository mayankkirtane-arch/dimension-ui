import React from "react";
import {
  Blocks,
  CheckCircle2,
  Database,
  Mail,
  Github,
  Coins,
  Smartphone,
  BarChart3,
  CreditCard,
  Box,
  Layers,
  Info,
} from "lucide-react";
import { TemplateIntegration, IntegrationStatus } from "@/lib/site";

interface TemplateIntegrationsProps {
  templateName: string;
  integrations: TemplateIntegration[];
}

export function TemplateIntegrations({
  templateName,
  integrations,
}: TemplateIntegrationsProps) {
  const getIntegrationIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("paypal") || lower.includes("payment")) {
      return <CreditCard className="size-4 text-amber-400" />;
    }
    if (lower.includes("supabase")) {
      return <Database className="size-4 text-emerald-400" />;
    }
    if (lower.includes("resend") || lower.includes("email") || lower.includes("mail")) {
      return <Mail className="size-4 text-cyan-400" />;
    }
    if (lower.includes("github")) {
      return <Github className="size-4 text-purple-400" />;
    }
    if (lower.includes("web3") || lower.includes("wallet")) {
      return <Coins className="size-4 text-amber-400" />;
    }
    if (lower.includes("app store") || lower.includes("mobile")) {
      return <Smartphone className="size-4 text-sky-400" />;
    }
    if (lower.includes("posthog") || lower.includes("analytics")) {
      return <BarChart3 className="size-4 text-rose-400" />;
    }
    return <Blocks className="size-4 text-purple-400" />;
  };

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case "Included":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="size-3" />
            Included
          </span>
        );
      case "Configured":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
            <Layers className="size-3" />
            Configured
          </span>
        );
      case "Example only":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
            <Info className="size-3" />
            Example only
          </span>
        );
      case "Compatible":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
            <Blocks className="size-3" />
            Compatible
          </span>
        );
      default:
        return null;
    }
  };

  const hasIntegrations = integrations.length > 0;

  return (
    <section id="integrations" className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Blocks className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Supported Integrations</h2>
            <p className="text-xs text-white/50">Genuinely implemented connectors, payment gateways, and APIs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasIntegrations ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Blocks className="size-3.5" />
              {integrations.length} {integrations.length === 1 ? "Integration" : "Integrations"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              Self-Contained (0 Third-Party)
            </span>
          )}
        </div>
      </div>

      {/* Body: Integrations Grid OR Self-Contained State */}
      {hasIntegrations ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10">
                    {getIntegrationIcon(item.name)}
                  </div>
                  <span className="text-sm font-bold text-white">{item.name}</span>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Box className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-300">100% Self-Contained & Vendor-Independent</h4>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              {templateName} has no required third-party services, external databases, or API keys. It runs entirely using local Next.js 15, Tailwind CSS, and standard browser capabilities without external vendor lock-in.
            </p>
          </div>
        </div>
      )}

      {/* Integration Status Legend */}
      <div className="rounded-xl border border-white/5 bg-white/[0.015] p-4">
        <p className="text-xs font-semibold text-white/80 mb-2">Integration Classification Standard</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-white/50">
          <div>
            <span className="font-semibold text-emerald-400">Included:</span> Working component code or native provider integration built directly into the template.
          </div>
          <div>
            <span className="font-semibold text-cyan-400">Configured:</span> Architecture, environment variables, or schema pre-configured for connection.
          </div>
          <div>
            <span className="font-semibold text-amber-300">Example only:</span> Front-end interactive demo, mock flow, or simulated UI intake.
          </div>
          <div>
            <span className="font-semibold text-purple-300">Compatible:</span> Standard Next.js 15 App Router provider compatibility without conflicts.
          </div>
        </div>
      </div>
    </section>
  );
}
