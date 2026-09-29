"use client";

import React, { useState } from "react";
import {
  GitCommit,
  Calendar,
  PlusCircle,
  RefreshCw,
  Wrench,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { type ChangelogEntry } from "@/lib/site";

export interface TemplateChangelogProps {
  templateName: string;
  currentVersion: string;
  entries: ChangelogEntry[];
}

export function TemplateChangelog({
  templateName,
  currentVersion,
  entries,
}: TemplateChangelogProps) {
  // Allow expanding/collapsing past entries if there are multiple
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="changelog" className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <GitCommit className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Changelog & Release History</h2>
              <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-purple-300">
                {currentVersion}
              </span>
            </div>
            <p className="text-xs text-white/50">Verified release notes, dependency updates, and feature additions</p>
          </div>
        </div>

        <div className="text-xs text-white/40">
          Showing {entries.length} release {entries.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      {/* Timeline Entries */}
      <div className="flex flex-col gap-6">
        {entries.map((entry, idx) => {
          const isLatest = idx === 0;
          const isExpanded = expandedIndex === idx || entries.length === 1;

          return (
            <div
              key={entry.version}
              className={`rounded-xl border transition-all ${
                isLatest
                  ? "border-purple-500/30 bg-white/[0.03]"
                  : "border-white/5 bg-white/[0.01]"
              } p-5 sm:p-6`}
            >
              {/* Entry Header */}
              <div
                onClick={() => entries.length > 1 && toggleExpand(idx)}
                className={`flex items-center justify-between gap-4 ${
                  entries.length > 1 ? "cursor-pointer select-none" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-base font-bold text-white tracking-wide">
                    {entry.version}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <Calendar className="size-3 text-white/40" />
                    <span>{entry.date}</span>
                  </div>
                  {isLatest && (
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                      Current Version
                    </span>
                  )}
                  {idx === entries.length - 1 && entries.length > 1 && (
                    <span className="rounded-full bg-white/[0.04] border border-white/10 px-2 py-0.5 text-[10px] font-medium text-white/40">
                      Initial Release
                    </span>
                  )}
                </div>

                {entries.length > 1 && (
                  <button
                    type="button"
                    aria-label={isExpanded ? "Collapse changelog entry" : "Expand changelog entry"}
                    className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                )}
              </div>

              {/* Entry Body */}
              {isExpanded && (
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-white/5">
                  {/* Added Section */}
                  {entry.added && entry.added.length > 0 && (
                    <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-4">
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        <PlusCircle className="size-3.5" />
                        <span>Added</span>
                      </div>
                      <ul className="flex flex-col gap-1.5 text-xs text-white/80">
                        {entry.added.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Updated Section */}
                  {entry.updated && entry.updated.length > 0 && (
                    <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/[0.02] p-4">
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                        <RefreshCw className="size-3.5" />
                        <span>Updated</span>
                      </div>
                      <ul className="flex flex-col gap-1.5 text-xs text-white/80">
                        {entry.updated.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-bold shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Changed Section */}
                  {entry.changed && entry.changed.length > 0 && (
                    <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-4">
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                        <Sparkles className="size-3.5" />
                        <span>Changed</span>
                      </div>
                      <ul className="flex flex-col gap-1.5 text-xs text-white/80">
                        {entry.changed.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fixed Section */}
                  {entry.fixed && entry.fixed.length > 0 && (
                    <div className="rounded-xl border border-purple-500/10 bg-purple-500/[0.02] p-4">
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                        <Wrench className="size-3.5" />
                        <span>Fixed</span>
                      </div>
                      <ul className="flex flex-col gap-1.5 text-xs text-white/80">
                        {entry.fixed.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-purple-400 font-bold shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
