import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Gauge,
  Sparkles,
  Search,
  PackageCheck,
  Code2,
  Info,
  Clock,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { TemplateQualityReport, QualityIndicatorItem } from "@/lib/site";

interface TemplateQualityBadgesProps {
  report: TemplateQualityReport;
}

export function TemplateQualityBadges({ report }: TemplateQualityBadgesProps) {
  const getCategoryIcon = (category: QualityIndicatorItem["category"]) => {
    switch (category) {
      case "Performance":
        return <Gauge className="size-4 text-amber-400" />;
      case "Accessibility":
        return <ShieldCheck className="size-4 text-cyan-400" />;
      case "Best Practices":
        return <Sparkles className="size-4 text-emerald-400" />;
      case "SEO":
        return <Search className="size-4 text-purple-400" />;
      case "Production Build":
        return <PackageCheck className="size-4 text-emerald-400" />;
      case "TypeScript":
        return <Code2 className="size-4 text-blue-400" />;
      default:
        return <ShieldCheck className="size-4 text-purple-400" />;
    }
  };

  const getStatusBadge = (item: QualityIndicatorItem) => {
    if (item.status === "passed") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="size-3" />
          Passed
        </span>
      );
    }

    if (item.status === "verified") {
      const score = item.numericScore ?? 0;
      let colorCls = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      if (score < 80 && score >= 50) {
        colorCls = "border-amber-500/30 bg-amber-500/10 text-amber-300";
      } else if (score < 50) {
        colorCls = "border-rose-500/30 bg-rose-500/10 text-rose-300";
      }

      return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${colorCls}`}>
          {item.value}
        </span>
      );
    }

    // Pending / Not tested
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-white/50">
        <HelpCircle className="size-3" />
        Audit Pending
      </span>
    );
  };

  return (
    <section id="quality" className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Verified Quality Indicators</h2>
            <p className="text-xs text-white/50">Real measured audit scores and build checks. No fabricated marketing numbers.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
            <Clock className="size-3 text-white/40" />
            Tested on {report.auditDate}
          </span>
          {report.hasMeasuredLighthouse ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="size-3" />
              Lighthouse Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <Info className="size-3" />
              Build Verified (LH Queued)
            </span>
          )}
        </div>
      </div>

      {/* Grid of indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {report.indicators.map((item) => (
          <div
            key={item.category}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {getCategoryIcon(item.category)}
                <span className="text-sm font-semibold text-white">{item.category}</span>
              </div>
              {getStatusBadge(item)}
            </div>

            <div className="mt-2 pt-2 border-t border-white/5">
              <p className="text-xs text-white/60 leading-relaxed">{item.notes}</p>
              <div className="mt-2 flex items-center justify-between text-[0.68rem] text-white/40">
                <span className="truncate max-w-[180px]" title={item.environment}>
                  {item.environment}
                </span>
                <span>{item.testedOn}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Methodology & Limitations Notice */}
      <div className="rounded-xl border border-white/5 bg-white/[0.015] p-4 flex flex-col sm:flex-row items-start gap-3 text-xs text-white/50">
        <Info className="size-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-semibold text-white/80">Audit Methodology & Limitations</p>
          <p className="mt-0.5">
            Lighthouse scores are measured using headless Chrome on production-ready Next.js 15.5.25 builds running in local benchmark environments ({report.environment}). Unmeasured templates display &quot;Audit Pending&quot; rather than synthetic estimates. Local benchmark results reflect test environment conditions and do not represent permanent external CDN guarantees.
          </p>
        </div>
      </div>
    </section>
  );
}
