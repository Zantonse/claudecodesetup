"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { GlassCard } from "@/components/GlassCard";
import { ModelComparisonTable } from "@/components/ModelComparisonTable";
import { models } from "@/data/models";
import { ClaudeModel } from "@/lib/types";

const TIER_BADGE: Record<ClaudeModel["tier"], string> = {
  haiku: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  sonnet: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  opus: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
};

const guidance = [
  {
    tier: "Opus",
    color: "text-amber-400",
    icon: "🏆",
    tips: [
      "Complex architecture decisions and large-scale refactoring",
      "Nuanced code analysis requiring deep domain knowledge",
      "Security audits and vulnerability analysis",
      "When correctness matters more than speed or cost",
    ],
  },
  {
    tier: "Sonnet",
    color: "text-violet-400",
    icon: "⚡",
    tips: [
      "Day-to-day coding, debugging, and code review",
      "Multi-turn agentic workflows and feature development",
      "Enterprise codebases with complex business logic",
      "The recommended default for most Claude Code sessions",
    ],
  },
  {
    tier: "Haiku",
    color: "text-cyan-400",
    icon: "🚀",
    tips: [
      "Fast iterations on simple, well-defined tasks",
      "High-volume pipelines where cost is a primary concern",
      "Quick syntax fixes and autocomplete-style interactions",
      "Batch processing of repetitive code transformations",
    ],
  },
];

function ModelDetailCard({ model }: { model: ClaudeModel }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard onClick={() => setExpanded((v) => !v)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-100">{model.name}</h3>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${TIER_BADGE[model.tier]}`}
            >
              {model.tier}
            </span>
          </div>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {model.description}
          </p>
        </div>
        <button
          className="flex-shrink-0 text-slate-500 hover:text-slate-200 transition-colors text-lg leading-none mt-0.5"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? "−" : "+"}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-700/40 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">{model.description}</p>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Best For
            </p>
            <ul className="space-y-1">
              {model.bestFor.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Capabilities
            </p>
            <div className="flex flex-wrap gap-2">
              {model.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-2 py-0.5 rounded-md text-xs bg-slate-700/50 text-slate-300 border border-slate-600/40"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center p-2 rounded-lg bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-0.5">Speed</p>
              <p className="font-semibold text-slate-200 capitalize">{model.speed}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-0.5">Intelligence</p>
              <p className="font-semibold text-slate-200 capitalize">{model.intelligence}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-0.5">Model ID</p>
              <p className="font-mono text-xs text-slate-300 break-all">{model.modelId}</p>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

export default function ModelsPage() {
  return (
    <div className="space-y-10">
      <SectionHeader
        title="Claude Models"
        subtitle="Understanding the Claude model family and when to use each one."
      />

      <p className="text-slate-400 leading-relaxed -mt-4">
        Claude Code supports several models across the Haiku, Sonnet, and Opus tiers. Choosing
        the right model balances response quality, speed, and cost for your specific task.
      </p>

      {/* Comparison Table */}
      <section>
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Model Comparison</h2>
        <ModelComparisonTable />
      </section>

      {/* Expandable Detail Cards */}
      <section>
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Model Details</h2>
        <div className="space-y-3">
          {models.map((model) => (
            <ModelDetailCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Choosing a Model */}
      <section>
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Choosing a Model</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guidance.map((g) => (
            <GlassCard key={g.tier} hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{g.icon}</span>
                <h3 className={`font-semibold text-base ${g.color}`}>{g.tier}</h3>
              </div>
              <ul className="space-y-2">
                {g.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className={`${g.color} mt-0.5 flex-shrink-0`}>▸</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
