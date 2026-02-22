"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { FilterBar } from "@/components/ideas/FilterBar";
import { IdeaGrid } from "@/components/ideas/IdeaGrid";
import { IdeaDetailModal } from "@/components/ideas/IdeaDetailModal";
import { useIdeaFilters } from "@/lib/hooks/useIdeaFilters";
import { ideas } from "@/data/ideas";
import type { ProjectIdea } from "@/lib/types";

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

  return (
    <div>
      <SectionHeader
        title="Idea Generator"
        subtitle="Find your next project based on the skills you want to learn."
      />

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

      {/* Idea grid */}
      <IdeaGrid
        ideas={filteredIdeas}
        viewMode={viewMode}
        onSelectIdea={setSelectedIdea}
      />

      {/* Detail modal */}
      <IdeaDetailModal
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
      />
    </div>
  );
}
