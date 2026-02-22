"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { CodeBlock } from "@/components/CodeBlock";
import { tips } from "@/data/tips";
import type { Tip } from "@/lib/types";

const TABS = [
  "All",
  "Shortcuts",
  "Prompting",
  "Performance",
  "Configuration",
  "Workflow",
] as const;

type TabValue = (typeof TABS)[number];

const CATEGORY_BADGE: Record<
  Tip["category"],
  { bg: string; text: string; border: string }
> = {
  shortcuts: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  prompting: {
    bg: "bg-violet-500/15",
    text: "text-violet-400",
    border: "border-violet-500/30",
  },
  performance: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  configuration: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  workflow: {
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    border: "border-rose-500/30",
  },
};

export default function TipsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("All");

  const filteredTips = useMemo(() => {
    if (activeTab === "All") return tips;
    return tips.filter(
      (t) => t.category.toLowerCase() === activeTab.toLowerCase()
    );
  }, [activeTab]);

  return (
    <div>
      <SectionHeader
        title="Tips & Tricks"
        subtitle="Pro tips for getting the most out of Claude Code."
      />

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 mb-8 border-b border-white/8 pb-0">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-all duration-150 relative ${
                isActive
                  ? "text-primary-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab}
              {/* Active underline */}
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Card grid with staggered entrance */}
      <motion.div
        key={activeTab}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.07,
            },
          },
        }}
      >
        {filteredTips.map((tip) => {
          const badge = CATEGORY_BADGE[tip.category];

          return (
            <motion.div
              key={tip.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              <GlassCard hover className="h-full relative">
                {/* Category badge — top right */}
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="text-base font-semibold text-slate-100 leading-snug flex-1">
                    {tip.title}
                  </h3>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${badge.bg} ${badge.text} border ${badge.border}`}
                  >
                    {tip.category}
                  </span>
                </div>

                {/* Content */}
                <p className="text-slate-300 text-sm leading-relaxed">
                  {tip.content}
                </p>

                {/* Optional code example */}
                {tip.codeExample && (
                  <CodeBlock
                    code={tip.codeExample.code}
                    language={tip.codeExample.language}
                    title={tip.codeExample.title}
                  />
                )}
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredTips.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          No tips found for this category.
        </div>
      )}
    </div>
  );
}
