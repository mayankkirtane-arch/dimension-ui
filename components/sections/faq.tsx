"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { EASE, Reveal, SectionHeader, SectionShell } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { FAQ_ITEMS } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Accordion                                                         */
/*                                                                    */
/*  Height is animated via `height: auto` — Framer measures the child  */
/*  and interpolates, which keeps it correct no matter how the answer  */
/*  wraps at a given viewport.                                        */
/* ------------------------------------------------------------------ */

function FaqRow({
  question,
  answer,
  open,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <Reveal as="li" delay={index * 0.04}>
      <div
        className={cn(
          "overflow-hidden rounded-2xl border bg-surface/55 backdrop-blur-xl transition-colors duration-400",
          open ? "border-neon-purple/25" : "border-hairline hover:border-hairline-strong",
        )}
      >
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-300"
        >
          <span
            className={cn(
              "text-[0.9375rem] font-medium transition-colors duration-300",
              open ? "text-ink" : "text-ink-dim",
            )}
          >
            {question}
          </span>

          <span
            className={cn(
              "inline-flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-400",
              open
                ? "rotate-180 border-neon-purple/40 bg-neon-purple/[0.16] text-neon-purple-bright"
                : "border-hairline bg-white/[0.04] text-ink-faint",
            )}
            aria-hidden="true"
          >
            {open ? (
              <Minus className="size-3.5" strokeWidth={2.5} />
            ) : (
              <Plus className="size-3.5" strokeWidth={2.5} />
            )}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="panel"
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden"
            >
              <p className="border-t border-hairline px-5 py-4 text-[0.875rem] leading-relaxed text-ink-dim">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */

export function FaqSection() {
  // First item open by default: gives the section visual weight on arrival
  // and shows the interaction affordance without requiring a click.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionShell id="faq">
      <SectionHeader
        eyebrow="Questions"
        title="Everything buyers ask before they pay"
        description="Licensing, framework support, updates and refunds — answered without the hedging."
        centered
      />

      <ul className="mx-auto mt-9 flex max-w-3xl flex-col gap-3">
        {FAQ_ITEMS.map((item, i) => (
          <FaqRow
            key={item.question}
            index={i}
            question={item.question}
            answer={item.answer}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </ul>
    </SectionShell>
  );
}

export default FaqSection;
