"use client";

import { SkillTag } from "@/components/SkillTag";
import type { ViewMode } from "@/lib/types";

interface FilterBarProps {
  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Difficulty
  selectedDifficulty: string;
  setSelectedDifficulty: (d: string) => void;
  // Category
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  // Skills
  selectedSkills: string[];
  toggleSkill: (s: string) => void;
  allSkills: string[];
  // View mode
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  // Clear
  clearFilters: () => void;
}

const DIFFICULTY_OPTIONS = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "developer-tools", label: "Developer Tools" },
  { value: "web-app", label: "Web App" },
  { value: "automation", label: "Automation" },
  { value: "data-api", label: "Data & API" },
  { value: "learning", label: "Learning" },
];

export function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedCategory,
  setSelectedCategory,
  selectedSkills,
  toggleSkill,
  allSkills,
  viewMode,
  setViewMode,
  clearFilters,
}: FilterBarProps) {
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedDifficulty !== "all" ||
    selectedCategory !== "all" ||
    selectedSkills.length > 0;

  return (
    <div className="glass-card p-5 mb-6">
      {/* Top row: search, dropdowns, view toggle, clear */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800/60 border border-white/8 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-colors"
          />
        </div>

        {/* Difficulty dropdown */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800/60 border border-white/8 text-slate-200 text-sm focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-colors cursor-pointer"
        >
          {DIFFICULTY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-800">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Category dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800/60 border border-white/8 text-slate-200 text-sm focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-colors cursor-pointer"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-800">
              {opt.label}
            </option>
          ))}
        </select>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-800/60 border border-white/8 rounded-lg p-1">
          {/* Projects view */}
          <button
            onClick={() => setViewMode("projects")}
            title="Projects view"
            aria-label="Projects view"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "projects"
                ? "bg-primary-600/40 text-primary-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          {/* Skills view */}
          <button
            onClick={() => setViewMode("skills")}
            title="Skills view"
            aria-label="Skills view"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "skills"
                ? "bg-primary-600/40 text-primary-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </button>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 rounded-lg text-sm font-medium text-rose-400 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Skills chips row */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        {allSkills.map((skill) => (
          <SkillTag
            key={skill}
            label={skill}
            active={selectedSkills.includes(skill)}
            onClick={() => toggleSkill(skill)}
          />
        ))}
      </div>
    </div>
  );
}
