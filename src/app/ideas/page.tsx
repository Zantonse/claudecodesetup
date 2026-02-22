"use client";

import { useState, useMemo } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { FilterBar } from "@/components/ideas/FilterBar";
import { IdeaGrid } from "@/components/ideas/IdeaGrid";
import { IdeaDetailModal } from "@/components/ideas/IdeaDetailModal";
import { ProgressDashboard } from "@/components/ideas/ProgressDashboard";
import { SkillGraph } from "@/components/ideas/SkillGraph";
import { SkillTracker } from "@/components/ideas/SkillTracker";
import { RecommendedProjects } from "@/components/ideas/RecommendedProjects";
import { RoadmapBuilder } from "@/components/ideas/RoadmapBuilder";
import { useIdeaFilters } from "@/lib/hooks/useIdeaFilters";
import { useProjectStatus } from "@/lib/hooks/useProjectStatus";
import { useSkillProgress } from "@/lib/hooks/useSkillProgress";
import { ideas } from "@/data/ideas";
import { skillNodes } from "@/data/skill-graph";
import type { ProjectIdea, ProjectStatus } from "@/lib/types";

// Status dot indicator shown on each IdeaCard
function StatusDot({ status }: { status: ProjectStatus["status"] }) {
  if (status === "not-started") return null;
  if (status === "in-progress") {
    return (
      <span className="relative flex h-3 w-3 mt-0.5" title="In Progress">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
      </span>
    );
  }
  // completed
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40"
      title="Completed"
    >
      <svg
        className="w-3 h-3 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

// Small status quick-set dropdown shown in IdeaCard actionSlot
function CardStatusDropdown({
  projectId,
  currentStatus,
  onUpdate,
}: {
  projectId: string;
  currentStatus: ProjectStatus["status"];
  onUpdate: (id: string, status: ProjectStatus["status"]) => void;
}) {
  const options: { value: ProjectStatus["status"]; label: string }[] = [
    { value: "not-started", label: "Not Started" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <select
      value={currentStatus}
      onChange={(e) => onUpdate(projectId, e.target.value as ProjectStatus["status"])}
      className="w-full text-xs rounded-md px-2 py-1.5 bg-slate-800/80 border border-slate-700/60 text-slate-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/50 transition-colors"
      aria-label="Set project status"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// Status controls shown inside IdeaDetailModal actionSlot
function ModalStatusControls({
  projectId,
  projectStatus,
  onUpdate,
}: {
  projectId: string;
  projectStatus: ProjectStatus | undefined;
  onUpdate: (id: string, status: ProjectStatus["status"]) => void;
}) {
  const currentStatus = projectStatus?.status ?? "not-started";

  const buttons: { value: ProjectStatus["status"]; label: string; active: string; inactive: string }[] = [
    {
      value: "not-started",
      label: "Not Started",
      active: "bg-slate-700 text-slate-200 border-slate-500",
      inactive: "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600",
    },
    {
      value: "in-progress",
      label: "In Progress",
      active: "bg-amber-500/20 text-amber-300 border-amber-500/50",
      inactive: "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-amber-500/40 hover:text-amber-400/70",
    },
    {
      value: "completed",
      label: "Completed",
      active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      inactive: "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-emerald-500/40 hover:text-emerald-400/70",
    },
  ];

  const formatDate = (iso?: string) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Project Status
      </p>
      <div className="flex flex-wrap gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => onUpdate(projectId, btn.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              currentStatus === btn.value ? btn.active : btn.inactive
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      {/* Show dates when relevant */}
      {(projectStatus?.startedAt || projectStatus?.completedAt) && (
        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
          {projectStatus.startedAt && (
            <span>
              Started:{" "}
              <span className="text-slate-300">{formatDate(projectStatus.startedAt)}</span>
            </span>
          )}
          {projectStatus.completedAt && (
            <span>
              Completed:{" "}
              <span className="text-emerald-400">{formatDate(projectStatus.completedAt)}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function IdeasPage() {
  const {
    selectedSkills,
    selectedDifficulty,
    selectedCategory,
    searchQuery,
    viewMode,
    filteredIdeas,
    allSkills,
    toggleSkill,
    setSelectedDifficulty,
    setSelectedCategory,
    setSearchQuery,
    setViewMode,
    clearFilters,
  } = useIdeaFilters();

  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);
  const [graphOpen, setGraphOpen] = useState(false);

  const { stats, updateStatus, getStatus, getProjectStatus, completedIds } = useProjectStatus();
  const { skillProgress, allSkills: trackerSkills, updateSkill, getSkillLevel, stats: skillStats } = useSkillProgress();

  // Map skillNode ids to the label strings used by the FilterBar (e.g. "typescript" → "TypeScript")
  const skillIdToFilterLabel = useMemo(() => {
    const map: Record<string, string> = {};
    for (const node of skillNodes) {
      const match = allSkills.find(
        (s) => s.toLowerCase() === node.label.toLowerCase()
      );
      if (match) map[node.id] = match;
    }
    return map;
  }, [allSkills]);

  const handleSkillSelect = (skillId: string) => {
    const filterLabel = skillIdToFilterLabel[skillId];
    if (filterLabel) toggleSkill(filterLabel);
  };

  return (
    <div>
      <SectionHeader
        title="Idea Generator"
        subtitle="Find your next project based on the skills you want to learn."
      />

      {/* Progress Dashboard */}
      <ProgressDashboard stats={stats} ideas={ideas} />

      {/* Skill tracker — collapsible */}
      <SkillTracker
        allSkills={trackerSkills}
        getSkillLevel={getSkillLevel}
        updateSkill={updateSkill}
        stats={skillStats}
      />

      {/* Recommended projects — only shown when user has skill progress */}
      <RecommendedProjects
        ideas={ideas}
        skillProgress={skillProgress}
        completedProjectIds={completedIds}
        onSelectIdea={setSelectedIdea}
      />

      {/* Skill Dependency Graph (collapsible) */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setGraphOpen((prev) => !prev)}
          className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors mb-3 group"
          aria-expanded={graphOpen}
        >
          <span
            className="inline-block transition-transform duration-200"
            style={{ transform: graphOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            &#9658;
          </span>
          Skill Dependency Graph
          <span className="text-slate-500 font-normal text-xs group-hover:text-slate-400 transition-colors">
            — click a node to filter by skill
          </span>
        </button>

        {graphOpen && (
          <SkillGraph
            skillProgress={skillProgress}
            getSkillLevel={getSkillLevel}
            onSkillSelect={handleSkillSelect}
          />
        )}
      </div>

      {/* Filter bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSkills={selectedSkills}
        toggleSkill={toggleSkill}
        allSkills={allSkills}
        viewMode={viewMode}
        setViewMode={setViewMode}
        clearFilters={clearFilters}
      />

      {/* Result count */}
      <p className="text-sm text-slate-500 mb-4">
        Showing{" "}
        <span className="text-slate-300 font-medium">{filteredIdeas.length}</span>{" "}
        of{" "}
        <span className="text-slate-300 font-medium">{ideas.length}</span>{" "}
        projects
      </p>

      {/* Idea grid — pass status badge and action slot to each card */}
      <IdeaGrid
        ideas={filteredIdeas}
        viewMode={viewMode}
        onSelectIdea={setSelectedIdea}
        getStatusBadge={(idea) => <StatusDot status={getStatus(idea.id)} />}
        getActionSlot={(idea) => (
          <CardStatusDropdown
            projectId={idea.id}
            currentStatus={getStatus(idea.id)}
            onUpdate={updateStatus}
          />
        )}
      />

      {/* Roadmap Builder */}
      <RoadmapBuilder />

      {/* Detail modal — pass status controls as actionSlot */}
      <IdeaDetailModal
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
        actionSlot={
          selectedIdea ? (
            <ModalStatusControls
              projectId={selectedIdea.id}
              projectStatus={getProjectStatus(selectedIdea.id)}
              onUpdate={updateStatus}
            />
          ) : undefined
        }
      />
    </div>
  );
}
