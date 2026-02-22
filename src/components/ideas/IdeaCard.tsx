"use client";

import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/types";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { SkillTag } from "@/components/SkillTag";
import type { ProjectIdea } from "@/lib/types";

interface IdeaCardProps {
  idea: ProjectIdea;
  onSelect: (idea: ProjectIdea) => void;
  // Optional additional props for extensibility (Tasks 11-14)
  statusBadge?: React.ReactNode;
  actionSlot?: React.ReactNode;
}

const SCOPE_LABEL: Record<ProjectIdea["estimatedScope"], string> = {
  Weekend: "Weekend",
  "Multi-day": "Multi-day",
  "Week+": "Week+",
};

const SCOPE_COLORS: Record<ProjectIdea["estimatedScope"], string> = {
  Weekend: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  "Multi-day": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Week+": "bg-amber-500/15 text-amber-400 border-amber-500/25",
};

export function IdeaCard({ idea, onSelect, statusBadge, actionSlot }: IdeaCardProps) {
  const borderColor = CATEGORY_COLORS[idea.category];

  return (
    <div
      className="glass-card p-5 cursor-pointer flex flex-col gap-3 h-full"
      style={{ borderLeft: `4px solid ${borderColor}` }}
      onClick={() => onSelect(idea)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(idea);
        }
      }}
    >
      {/* Header: title + optional status badge */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-white leading-snug flex-1">
          {idea.title}
        </h3>
        {statusBadge && <div className="shrink-0">{statusBadge}</div>}
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={idea.difficulty} />
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${SCOPE_COLORS[idea.estimatedScope]}`}
        >
          {SCOPE_LABEL[idea.estimatedScope]}
        </span>
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
          style={{
            background: `${borderColor}20`,
            color: borderColor,
            border: `1px solid ${borderColor}35`,
          }}
        >
          {CATEGORY_LABELS[idea.category]}
        </span>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1">
        {idea.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {idea.skills.slice(0, 4).map((skill) => (
          <SkillTag key={skill} label={skill} />
        ))}
        {idea.skills.length > 4 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-slate-500">
            +{idea.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Claude Features */}
      <div className="flex flex-wrap gap-1.5">
        {idea.claudeFeatures.map((feature) => (
          <span
            key={feature}
            className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary-600/15 text-primary-400 border border-primary-600/25"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Optional action slot */}
      {actionSlot && (
        <div className="mt-auto pt-1" onClick={(e) => e.stopPropagation()}>
          {actionSlot}
        </div>
      )}
    </div>
  );
}
