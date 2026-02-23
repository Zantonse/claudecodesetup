"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { SkillTag } from "@/components/SkillTag";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/types";
import type { ProjectIdea } from "@/lib/types";

const SCOPE_COLORS: Record<ProjectIdea["estimatedScope"], string> = {
  Weekend: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  "Multi-day": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Week+": "bg-amber-500/15 text-amber-400 border-amber-500/25",
};

interface IdeaDetailModalProps {
  idea: ProjectIdea | null;
  onClose: () => void;
  // Optional slot for extensibility (Tasks 11-14: status controls, etc.)
  actionSlot?: React.ReactNode;
}

export function IdeaDetailModal({ idea, onClose, actionSlot }: IdeaDetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!idea) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [idea, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (idea) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [idea]);

  return (
    <AnimatePresence>
      {idea && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-card w-full max-w-2xl max-h-[80vh] overflow-y-auto pointer-events-auto relative"
              style={{
                borderLeft: `4px solid ${CATEGORY_COLORS[idea.category]}`,
              }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="p-6 space-y-5">
                {/* Title + badges */}
                <div>
                  <h2 id="modal-title" className="text-2xl font-bold text-white mb-3 pr-8">
                    {idea.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={idea.difficulty} />
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${SCOPE_COLORS[idea.estimatedScope]}`}
                    >
                      {idea.estimatedScope}
                    </span>
                    {/* Category label */}
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: `${CATEGORY_COLORS[idea.category]}20`,
                        color: CATEGORY_COLORS[idea.category],
                        border: `1px solid ${CATEGORY_COLORS[idea.category]}35`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: CATEGORY_COLORS[idea.category],
                        }}
                      />
                      {CATEGORY_LABELS[idea.category]}
                    </span>
                  </div>
                </div>

                {/* Optional action slot (extensibility for Tasks 11-14) */}
                {actionSlot && <div>{actionSlot}</div>}

                {/* Description */}
                <div>
                  <p className="text-slate-300 leading-relaxed">
                    {idea.description}
                  </p>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
                    Learning Outcomes
                  </h3>
                  <ul className="space-y-2">
                    {idea.learningOutcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <svg
                          className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-slate-300 text-sm leading-relaxed">
                          {outcome}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                {idea.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
                      Prerequisites
                    </h3>
                    <ul className="space-y-1.5">
                      {idea.prerequisites.map((prereq, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-2" />
                          <span className="text-slate-400 text-sm leading-relaxed">
                            {prereq}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.skills.map((skill) => (
                      <SkillTag key={skill} label={skill} />
                    ))}
                  </div>
                </div>

                {/* Claude Features */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
                    Claude Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.claudeFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary-600/15 text-primary-400 border border-primary-600/25"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
