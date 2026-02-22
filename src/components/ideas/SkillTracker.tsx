"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SkillProgress } from "@/lib/types";

interface SkillTrackerProps {
  allSkills: string[];
  getSkillLevel: (skillId: string) => SkillProgress["level"];
  updateSkill: (skillId: string, level: SkillProgress["level"]) => void;
  stats: {
    learning: number;
    comfortable: number;
    mastered: number;
    total: number;
  };
}

const LEVEL_OPTIONS: { value: SkillProgress["level"]; label: string }[] = [
  { value: "not-started", label: "Not Started" },
  { value: "learning", label: "Learning" },
  { value: "comfortable", label: "Comfortable" },
  { value: "mastered", label: "Mastered" },
];

const LEVEL_STYLES: Record<SkillProgress["level"], string> = {
  "not-started": "bg-slate-700/50 text-slate-400 border-slate-600/50",
  learning: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  comfortable: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  mastered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
};

const LEVEL_DOT_STYLES: Record<SkillProgress["level"], string> = {
  "not-started": "bg-slate-500",
  learning: "bg-amber-400",
  comfortable: "bg-cyan-400",
  mastered: "bg-emerald-400",
};

export function SkillTracker({ allSkills, getSkillLevel, updateSkill, stats }: SkillTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Group skills by first letter
  const grouped = allSkills.reduce<Record<string, string[]>>((acc, skill) => {
    const letter = skill[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(skill);
    return acc;
  }, {});

  const groupLetters = Object.keys(grouped).sort();

  return (
    <div className="glass-card rounded-xl mb-4 overflow-hidden">
      {/* Header row — always visible */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
        aria-controls="skill-tracker-body"
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-white">Skill Progress</span>

          {/* Summary stats */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            {stats.learning > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {stats.learning} learning
              </span>
            )}
            {stats.comfortable > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {stats.comfortable} comfortable
              </span>
            )}
            {stats.mastered > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {stats.mastered} mastered
              </span>
            )}
            {stats.learning === 0 && stats.comfortable === 0 && stats.mastered === 0 && (
              <span className="text-slate-500">Track your progress across {stats.total} skills</span>
            )}
          </div>
        </div>

        {/* Chevron toggle icon */}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-slate-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="skill-tracker-body"
            key="skill-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {/* Mobile summary */}
            <div className="sm:hidden px-5 pb-3 flex flex-wrap gap-2 text-xs">
              {stats.learning > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {stats.learning} learning
                </span>
              )}
              {stats.comfortable > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {stats.comfortable} comfortable
                </span>
              )}
              {stats.mastered > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {stats.mastered} mastered
                </span>
              )}
            </div>

            <div className="px-5 pb-5 space-y-5 border-t border-white/10 pt-4">
              {groupLetters.map((letter) => (
                <div key={letter}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    {letter}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {grouped[letter].map((skill) => {
                      const level = getSkillLevel(skill);
                      return (
                        <div
                          key={skill}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
                        >
                          {/* Level dot */}
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${LEVEL_DOT_STYLES[level]}`}
                            aria-hidden="true"
                          />

                          {/* Skill name */}
                          <span className="text-sm text-slate-300 flex-1 min-w-0 truncate">
                            {skill}
                          </span>

                          {/* Level selector */}
                          <select
                            value={level}
                            onChange={(e) =>
                              updateSkill(skill, e.target.value as SkillProgress["level"])
                            }
                            className={`text-xs rounded-md border px-1.5 py-0.5 bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 ${LEVEL_STYLES[level]}`}
                            aria-label={`Set level for ${skill}`}
                          >
                            {LEVEL_OPTIONS.map((opt) => (
                              <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-slate-800 text-slate-200"
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
