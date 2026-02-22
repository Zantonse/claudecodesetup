"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { getRecommendedProjects } from "@/lib/recommendations";
import type { ProjectIdea, SkillProgress } from "@/lib/types";

interface RecommendedProjectsProps {
  ideas: ProjectIdea[];
  skillProgress: SkillProgress[];
  completedProjectIds: string[];
  onSelectIdea: (idea: ProjectIdea) => void;
}

export function RecommendedProjects({
  ideas,
  skillProgress,
  completedProjectIds,
  onSelectIdea,
}: RecommendedProjectsProps) {
  // Only render when at least 1 skill has been set beyond "not-started"
  const hasProgress = skillProgress.some((s) => s.level !== "not-started");

  const recommended = useMemo(
    () => getRecommendedProjects(ideas, skillProgress, completedProjectIds, 3),
    [ideas, skillProgress, completedProjectIds]
  );

  if (!hasProgress || recommended.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        {/* Sparkle icon with pulse animation */}
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
          className="text-amber-400 text-lg leading-none"
        >
          ✦
        </motion.span>
        <h2 className="text-base font-semibold text-white">Recommended For You</h2>
        <p className="text-sm text-slate-500 hidden sm:block">— Based on your skill progress</p>
      </div>

      <p className="text-sm text-slate-500 sm:hidden mb-3">Based on your skill progress</p>

      {/* 3-column grid (responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommended.map((idea) => (
          <div key={idea.id} className="relative flex flex-col">
            {/* "Recommended" badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <span aria-hidden="true">✦</span>
                Recommended
              </span>
            </div>
            <IdeaCard idea={idea} onSelect={onSelectIdea} />
          </div>
        ))}
      </div>
    </div>
  );
}
