"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { CodeBlock } from "@/components/CodeBlock";
import { WizardStep, PHASE_COLORS } from "@/lib/types";

interface WizardStepCardProps {
  step: WizardStep;
  isFirst: boolean;
  isLast: boolean;
  direction: number;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}

const CELEBRATION_ITEMS = [
  "Opened the Terminal and ran your first command",
  "Installed Claude Code using the command line",
  "Logged in to your Claude account",
  "Navigated to a project folder",
  "Built a real webpage with AI",
];

function CheckIcon() {
  return (
    <svg
      className="shrink-0 mt-0.5 text-violet-400"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="9" fill="currentColor" fillOpacity="0.15" />
      <path
        d="M5 9.5l3 3 5-5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CelebrationCard({ onReset }: { onReset: () => void }) {
  return (
    <div className="relative">
      {/* Sparkle particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" aria-hidden="true">
        <span className="sparkle sparkle-1" />
        <span className="sparkle sparkle-2" />
        <span className="sparkle sparkle-3" />
        <span className="sparkle sparkle-4" />
        <span className="sparkle sparkle-5" />
      </div>

      <GlassCard hover={false} className="gradient-border p-8 md:p-10 relative z-10">
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Complete
          </span>
        </div>

        {/* Headline */}
        <h2 className="gradient-text text-3xl md:text-4xl font-bold leading-tight mb-4">
          You Did It!
        </h2>

        {/* Sub-headline */}
        <p className="text-slate-300 text-[17px] leading-relaxed mb-8">
          You have gone from zero to building real things with AI. Here is everything you accomplished in this guide:
        </p>

        {/* Summary list */}
        <ul className="mb-8 space-y-3">
          {CELEBRATION_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckIcon />
              <span className="text-slate-200 text-[15px] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="border-t border-slate-700/50 mb-8" />

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto text-center px-6 py-2.5 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700 transition-colors shadow-lg shadow-violet-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Explore the Full Site
          </Link>
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-300 border border-slate-600/50 bg-transparent hover:border-slate-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Start Over
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

export function WizardStepCard({
  step,
  isFirst,
  isLast,
  direction,
  onNext,
  onBack,
  onReset,
}: WizardStepCardProps) {
  const phaseColor = PHASE_COLORS[step.phase as keyof typeof PHASE_COLORS] ?? "#A855F7";

  // x offsets: entering from the right (+60) when going forward, from the left (-60) when going back
  const xInitial = direction >= 0 ? 60 : -60;
  const xExit = direction >= 0 ? -60 : 60;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={step.id}
        custom={direction}
        initial={{ opacity: 0, x: xInitial, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: xExit, y: -8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isLast ? (
          <CelebrationCard onReset={onReset} />
        ) : (
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
                      &#x2139;
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
                  &#x26A0;
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
              {!isFirst ? (
                <button
                  onClick={onBack}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 border border-slate-600/50 bg-transparent hover:border-slate-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  &larr; Back
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={onNext}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700 transition-colors shadow-lg shadow-violet-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {isFirst ? "Get Started \u2192" : "Next \u2192"}
              </button>
            </div>
          </GlassCard>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
