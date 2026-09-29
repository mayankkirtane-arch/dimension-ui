"use client";

import React from "react";
import {
  CheckCircle2,
  HelpCircle,
  XCircle,
  Layers,
  Server,
  Code2,
} from "lucide-react";
import { type CompatibilityEntry, type CompatibilityStatus } from "@/lib/site";

export interface TemplateCompatibilityProps {
  entries: CompatibilityEntry[];
}

function StatusBadge({ status }: { status: CompatibilityStatus }) {
  if (status === "Supported") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
        <CheckCircle2 className="size-3 shrink-0" />
        Supported
      </span>
    );
  }

  if (status === "Not tested") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
        <HelpCircle className="size-3 shrink-0" />
        Not tested
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400">
      <XCircle className="size-3 shrink-0" />
      Not supported
    </span>
  );
}

export function TemplateCompatibility({ entries }: TemplateCompatibilityProps) {
  const frameworks = entries.filter((e) => e.category === "Framework");
  const platforms = entries.filter((e) => e.category === "Platform");

  const supportedCount = entries.filter((e) => e.status === "Supported").length;
  const notTestedCount = entries.filter((e) => e.status === "Not tested").length;

  return (
    <section id="compatibility" className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Layers className="size-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Compatibility Matrix</h2>
            <p className="text-xs text-white/50">Verified runtime dependencies and hosting platform compatibility</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
            {supportedCount} Supported
          </span>
          {notTestedCount > 0 && (
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
              {notTestedCount} Not tested
            </span>
          )}
        </div>
      </div>

      {/* Compact Grid: Frameworks & Tooling vs Deployment Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Frameworks & Tooling */}
        <div className="rounded-xl border border-white/5 bg-white/[0.015] p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/5 text-xs font-semibold text-white/80">
            <Code2 className="size-3.5 text-purple-400" />
            <span className="uppercase tracking-wider text-[11px] text-white/60">Core Framework & Language</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {frameworks.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-3 rounded-lg border border-white/[0.03] bg-white/[0.01] px-3 py-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="font-mono text-[11px] text-purple-300 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                      {item.version}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-[11px] text-white/40 mt-0.5 leading-snug">{item.notes}</p>
                  )}
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Platforms */}
        <div className="rounded-xl border border-white/5 bg-white/[0.015] p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/5 text-xs font-semibold text-white/80">
            <Server className="size-3.5 text-cyan-400" />
            <span className="uppercase tracking-wider text-[11px] text-white/60">Deployment Targets</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {platforms.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-3 rounded-lg border border-white/[0.03] bg-white/[0.01] px-3 py-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="font-mono text-[11px] text-cyan-300 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                      {item.version}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-[11px] text-white/40 mt-0.5 leading-snug">{item.notes}</p>
                  )}
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
