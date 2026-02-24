"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { GlassCard } from "@/components/GlassCard";
import { CodeBlock } from "@/components/CodeBlock";
import { skillLevels } from "@/data/skill-levels";
import type { SkillLevel } from "@/data/skill-levels";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

/** Render backtick-wrapped text as <code> elements */
function renderWithCode(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-slate-200 font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function TierCard({ level, isExpanded, onToggle }: { level: SkillLevel; isExpanded: boolean; onToggle: () => void }) {
  return (
    <motion.div variants={itemVariants}>
      <GlassCard
        hover={false}
        className="!p-0 overflow-hidden"
        style={{
          borderLeft: `3px solid ${level.color}`,
          boxShadow: isExpanded ? `0 0 24px ${level.glowColor}` : undefined,
        }}
      >
        {/* Header — always visible */}
        <button
          onClick={onToggle}
          className="w-full text-left px-6 py-5 flex items-center gap-4 hover:bg-white/5 transition-colors"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: `${level.color}20` }}
          >
            {level.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                style={{ color: level.color, background: `${level.color}20` }}
              >
                Tier {level.tier}
              </span>
              <h3 className="text-lg font-bold text-white">{level.title}</h3>
              <span className="text-sm text-slate-500">{level.subtitle}</span>
            </div>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{level.description}</p>
          </div>
          <svg
            className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-8 border-t border-white/8 pt-6">
                {/* Description */}
                <p className="text-slate-300 leading-relaxed">{level.description}</p>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                    Skills to Master
                  </h4>
                  <ul className="space-y-2">
                    {level.skills.map((skill, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className="mt-0.5 shrink-0" style={{ color: level.color }}>
                          ✓
                        </span>
                        <span>{renderWithCode(skill)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Example Prompts */}
                <div>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                    Example Prompts at This Level
                  </h4>
                  <div className="space-y-4">
                    {level.examplePrompts.map((example, i) => (
                      <div key={i} className="rounded-lg bg-slate-900/60 border border-white/5 p-4">
                        <CodeBlock code={example.prompt} language="markdown" title={`Example ${i + 1}`} />
                        <p className="text-xs text-slate-500 mt-2 italic">
                          <span className="text-slate-400 not-italic font-medium">Why this works:</span>{" "}
                          {example.why}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Used */}
                <div>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                    Features You&apos;ll Use
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {level.featuresUsed.map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1.5 rounded-full border font-medium"
                        style={{
                          color: level.color,
                          borderColor: `${level.color}40`,
                          background: `${level.color}10`,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ready for Next Level */}
                <div
                  className="rounded-lg p-4 border"
                  style={{
                    background: `${level.color}08`,
                    borderColor: `${level.color}20`,
                  }}
                >
                  <h4 className="text-sm font-semibold mb-2" style={{ color: level.color }}>
                    {level.tier < 4 ? "You're ready for the next level when..." : "You've reached the top when..."}
                  </h4>
                  <ul className="space-y-1.5">
                    {level.readyForNext.map((criteria, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <span style={{ color: level.color }} className="shrink-0">&rarr;</span>
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

export default function LevelsPage() {
  const [expanded, setExpanded] = useState<string | null>("beginner");

  return (
    <div>
      <SectionHeader
        title="Skill Levels"
        subtitle="Four tiers of Claude Code mastery — from first terminal command to architecting multi-agent systems. Find your current level and see what to learn next."
      />

      {/* Level overview bar */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {skillLevels.map((level, i) => (
          <button
            key={level.id}
            onClick={() => setExpanded(expanded === level.id ? null : level.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
            style={{
              background: expanded === level.id ? `${level.color}20` : "transparent",
              color: expanded === level.id ? level.color : "#94a3b8",
              borderBottom: expanded === level.id ? `2px solid ${level.color}` : "2px solid transparent",
            }}
          >
            <span>{level.icon}</span>
            <span>{level.title}</span>
            {i < skillLevels.length - 1 && (
              <span className="text-slate-600 ml-2">&rarr;</span>
            )}
          </button>
        ))}
      </div>

      {/* Tier cards */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {skillLevels.map((level) => (
          <TierCard
            key={level.id}
            level={level}
            isExpanded={expanded === level.id}
            onToggle={() => setExpanded(expanded === level.id ? null : level.id)}
          />
        ))}
      </motion.div>
    </div>
  );
}
