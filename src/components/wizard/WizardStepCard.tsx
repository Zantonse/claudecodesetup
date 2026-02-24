"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { CodeBlock } from "@/components/CodeBlock";
import { WizardStep, PHASE_COLORS } from "@/lib/types";

interface WizardStepCardProps {
  step: WizardStep;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function WizardStepCard({
  step,
  isFirst,
  isLast,
  onNext,
  onBack,
}: WizardStepCardProps) {
  const phaseColor = PHASE_COLORS[step.phase as keyof typeof PHASE_COLORS] ?? "#A855F7";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <GlassCard hover={false} className="p-8 md:p-10">
          {/* Phase badge */}
          <div className="mb-6">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{
                backgroundColor: `${phaseColor}22`,
                color: phaseColor,
                border: `1px solid ${phaseColor}44`,
              }}
            >
              {step.phaseTitle}
            </span>
          </div>

          {/* Headline */}
          <h2 className="gradient-text text-2xl md:text-3xl font-bold leading-tight mb-4">
            {step.headline}
          </h2>

          {/* Explanation */}
          <p className="text-slate-300 text-[17px] leading-relaxed mb-6">
            {step.explanation}
          </p>

          {/* Action area */}
          {step.action && (
            <div className="mb-6">
              {step.action.type === "command" && step.action.command && (
                <div>
                  <CodeBlock code={step.action.command} language="bash" />
                  {step.whatThisDoes && (
                    <div className="mt-3 rounded-lg border border-slate-700/50 bg-slate-800/40 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                        What this does
                      </p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {step.whatThisDoes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step.action.type === "instruction" && step.action.instruction && (
                <div className="flex gap-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-4 py-4">
                  <span className="mt-0.5 text-cyan-400 text-lg select-none" aria-hidden="true">
                    ℹ
                  </span>
                  <p className="text-sm md:text-base text-cyan-100 leading-relaxed">
                    {step.action.instruction}
                  </p>
                </div>
              )}

              {step.action.type === "confirmation" && step.action.confirmLabel && (
                <div className="rounded-lg border border-slate-600/40 bg-slate-800/30 px-5 py-4 text-center">
                  <p className="text-slate-300 text-base leading-relaxed italic">
                    {step.action.confirmLabel}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Troubleshooting */}
          {step.troubleshooting && (
            <div className="mb-6 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-4">
              <span className="mt-0.5 text-amber-400 text-lg select-none" aria-hidden="true">
                ⚠
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-500 mb-1">
                  Having trouble?
                </p>
                <p className="text-sm text-amber-100/80 leading-relaxed">
                  {step.troubleshooting}
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2 mt-2">
            {/* Back button — hidden on first step */}
            {!isFirst ? (
              <button
                onClick={onBack}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 border border-slate-600/50 bg-transparent hover:border-slate-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {/* Next / Get Started / Finish button */}
            <button
              onClick={onNext}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700 transition-colors shadow-lg shadow-violet-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {isFirst ? "Get Started →" : isLast ? "Finish!" : "Next →"}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
