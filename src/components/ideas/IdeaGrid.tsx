"use client";

import { useMemo } from "react";
import type React from "react";
import { motion } from "framer-motion";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import type { ProjectIdea, ViewMode } from "@/lib/types";

interface IdeaGridProps {
  ideas: ProjectIdea[];
  viewMode: ViewMode;
  onSelectIdea: (idea: ProjectIdea) => void;
  // Optional render-prop slots threaded down to IdeaCard (Task 12: status tracking)
  getStatusBadge?: (idea: ProjectIdea) => React.ReactNode;
  getActionSlot?: (idea: ProjectIdea) => React.ReactNode;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function IdeaGrid({ ideas, viewMode, onSelectIdea, getStatusBadge, getActionSlot }: IdeaGridProps) {
  // Group ideas by skill for skills view
  const skillGroups = useMemo(() => {
    if (viewMode !== "skills") return null;
    const map = new Map<string, ProjectIdea[]>();
    ideas.forEach((idea) => {
      idea.skills.forEach((skill) => {
        const existing = map.get(skill) ?? [];
        map.set(skill, [...existing, idea]);
      });
    });
    // Sort by count descending, then alphabetically
    return Array.from(map.entries()).sort((a, b) => {
      if (b[1].length !== a[1].length) return b[1].length - a[1].length;
      return a[0].localeCompare(b[0]);
    });
  }, [ideas, viewMode]);

  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          className="w-12 h-12 text-slate-600 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-slate-400 text-lg font-medium mb-1">
          No projects match your filters
        </p>
        <p className="text-slate-500 text-sm">
          Try adjusting your search or removing some filters.
        </p>
      </div>
    );
  }

  // Skills view: grouped by skill
  if (viewMode === "skills" && skillGroups) {
    return (
      <div className="space-y-10">
        {skillGroups.map(([skill, skillIdeas]) => (
          <section key={skill}>
            {/* Skill group header */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-slate-200">{skill}</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/60 text-slate-400 border border-slate-600/30">
                {skillIdeas.length} {skillIdeas.length === 1 ? "project" : "projects"}
              </span>
              <div className="flex-1 h-px bg-slate-700/40" />
            </div>

            {/* Cards for this skill */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {skillIdeas.map((idea) => (
                <motion.div key={idea.id} variants={itemVariants}>
                  <IdeaCard
                    idea={idea}
                    onSelect={onSelectIdea}
                    statusBadge={getStatusBadge?.(idea)}
                    actionSlot={getActionSlot?.(idea)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        ))}
      </div>
    );
  }

  // Projects view: flat responsive grid
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {ideas.map((idea) => (
        <motion.div key={idea.id} variants={itemVariants}>
          <IdeaCard
            idea={idea}
            onSelect={onSelectIdea}
            statusBadge={getStatusBadge?.(idea)}
            actionSlot={getActionSlot?.(idea)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
