"use client";

import { useState, useMemo } from "react";
import { ideas } from "@/data/ideas";
import type { ProjectIdea, ViewMode } from "@/lib/types";

export function useIdeaFilters() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("projects");

  // Derive all unique values for filter UI
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    ideas.forEach((idea) => idea.skills.forEach((s) => skills.add(s)));
    return Array.from(skills).sort();
  }, []);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    ideas.forEach((idea) => cats.add(idea.category));
    return Array.from(cats).sort();
  }, []);

  // Filter ideas based on current filter state
  const filteredIdeas = useMemo<ProjectIdea[]>(() => {
    return ideas.filter((idea) => {
      // Skill filter: idea must have ALL selected skills
      if (
        selectedSkills.length > 0 &&
        !selectedSkills.every((s) => idea.skills.includes(s))
      ) {
        return false;
      }
      // Difficulty filter
      if (
        selectedDifficulty !== "all" &&
        idea.difficulty !== selectedDifficulty
      ) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && idea.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          idea.title.toLowerCase().includes(q) ||
          idea.description.toLowerCase().includes(q) ||
          idea.skills.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedSkills, selectedDifficulty, selectedCategory, searchQuery]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setSelectedDifficulty("all");
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return {
    // Filter state
    selectedSkills,
    selectedDifficulty,
    selectedCategory,
    searchQuery,
    viewMode,
    // Derived data
    filteredIdeas,
    allSkills,
    allCategories,
    // Actions
    toggleSkill,
    setSelectedDifficulty,
    setSelectedCategory,
    setSearchQuery,
    setViewMode,
    clearFilters,
  };
}
