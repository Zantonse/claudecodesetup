"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { CodeBlock } from "@/components/CodeBlock";
import { workflows } from "@/data/workflows";

const CATEGORIES = [
  "All",
  "debugging",
  "refactoring",
  "testing",
  "review",
  "git",
  "feature",
  "setup",
  "api",
  "docs",
  "performance",
] as const;

export default function WorkflowsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filteredWorkflows = useMemo(() => {
    if (selectedCategory === "All") return workflows;
    return workflows.filter((w) => w.category === selectedCategory);
  }, [selectedCategory]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div>
      <SectionHeader
        title="Common Workflows"
        subtitle="Step-by-step guides for everyday Claude Code tasks."
      />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 capitalize ${
              selectedCategory === cat
                ? "bg-primary-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]"
                : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 border border-white/8"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Workflow accordion list */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow, index) => {
          const isExpanded = expandedIds.has(workflow.id);

          return (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <GlassCard hover={false} className="p-0 overflow-hidden" style={{ borderLeftColor: "rgba(124, 58, 237, 0.7)", borderLeftWidth: "3px", borderLeftStyle: "solid" }}>
                {/* Accordion header */}
                <button
                  onClick={() => toggleExpanded(workflow.id)}
                  className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-white/3 transition-colors duration-150"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg font-semibold text-slate-100 truncate">
                      {workflow.title}
                    </span>
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-600/20 text-primary-400 border border-primary-600/30 capitalize">
                      {workflow.category}
                    </span>
                  </div>
                  {/* Chevron */}
                  <svg
                    className={`shrink-0 w-5 h-5 text-slate-400 transition-transform duration-200 ml-4 ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Accordion body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/8">
                        {/* Description */}
                        <p className="text-slate-300 mt-5 mb-5 leading-relaxed">
                          {workflow.description}
                        </p>

                        {/* Claude Features */}
                        <div className="flex flex-wrap gap-2 mb-7">
                          {workflow.claudeFeatures.map((feature) => (
                            <span
                              key={feature}
                              className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-700/60 text-slate-300 border border-slate-600/40"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Timeline steps */}
                        <div className="space-y-0">
                          {workflow.steps.map((step, stepIndex) => {
                            const isLastStep = stepIndex === workflow.steps.length - 1;
                            return (
                              <div key={stepIndex} className="flex gap-4">
                                {/* Left column: circle + connector line */}
                                <div className="flex flex-col items-center">
                                  {/* Numbered circle */}
                                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center shadow-[0_0_10px_rgba(79,70,229,0.4)] z-10">
                                    {stepIndex + 1}
                                  </div>
                                  {/* Connector line */}
                                  {!isLastStep && (
                                    <div className="w-px flex-1 bg-slate-700/60 mt-1 mb-1" />
                                  )}
                                </div>

                                {/* Right column: step content */}
                                <div className={`flex-1 ${isLastStep ? "pb-0" : "pb-6"}`}>
                                  <h4 className="text-base font-semibold text-slate-100 mb-1.5 leading-snug">
                                    {step.title}
                                  </h4>
                                  <p className="text-slate-400 text-sm leading-relaxed mb-2">
                                    {step.description}
                                  </p>

                                  {/* Command code block */}
                                  {step.command && (
                                    <CodeBlock
                                      code={step.command}
                                      language="bash"
                                    />
                                  )}

                                  {/* Tip callout */}
                                  {step.tip && (
                                    <div className="flex gap-2.5 mt-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/25">
                                      <span className="shrink-0 text-amber-400 text-base leading-5">
                                        💡
                                      </span>
                                      <p className="text-amber-200/90 text-sm leading-relaxed">
                                        {step.tip}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          No workflows found for this category.
        </div>
      )}
    </div>
  );
}
