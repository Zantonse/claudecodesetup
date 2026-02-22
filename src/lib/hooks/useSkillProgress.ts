"use client";

import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { ideas } from "@/data/ideas";
import type { SkillProgress } from "@/lib/types";

export function useSkillProgress() {
  const [skillProgress, setSkillProgress] = useLocalStorage<SkillProgress[]>("skill-progress", []);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    ideas.forEach((idea) => idea.skills.forEach((s) => skills.add(s)));
    return Array.from(skills).sort();
  }, []);

  const updateSkill = (skillId: string, level: SkillProgress["level"]) => {
    setSkillProgress((prev) => {
      const existing = prev.findIndex((s) => s.skillId === skillId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { skillId, level };
        return updated;
      }
      return [...prev, { skillId, level }];
    });
  };

  const getSkillLevel = (skillId: string): SkillProgress["level"] => {
    return skillProgress.find((s) => s.skillId === skillId)?.level ?? "not-started";
  };

  const stats = useMemo(() => {
    const learning = skillProgress.filter((s) => s.level === "learning").length;
    const comfortable = skillProgress.filter((s) => s.level === "comfortable").length;
    const mastered = skillProgress.filter((s) => s.level === "mastered").length;
    return { learning, comfortable, mastered, total: allSkills.length };
  }, [skillProgress, allSkills.length]);

  return { skillProgress, allSkills, updateSkill, getSkillLevel, stats };
}
