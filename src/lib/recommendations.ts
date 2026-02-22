import type { ProjectIdea, SkillProgress } from "./types";

export function getRecommendedProjects(
  ideas: ProjectIdea[],
  skillProgress: SkillProgress[],
  completedProjectIds: string[],
  count: number = 3
): ProjectIdea[] {
  const skillMap = new Map(skillProgress.map((s) => [s.skillId, s.level]));

  const scored = ideas
    .filter((idea) => !completedProjectIds.includes(idea.id))
    .map((idea) => {
      let score = 0;

      // Boost projects that build on "learning" skills
      const learningSkills = idea.skills.filter((s) => skillMap.get(s) === "learning");
      score += learningSkills.length * 3;

      // Boost projects that introduce 1-2 new skills
      const newSkills = idea.skills.filter((s) => !skillMap.has(s) || skillMap.get(s) === "not-started");
      if (newSkills.length >= 1 && newSkills.length <= 2) score += 2;
      if (newSkills.length > 3) score -= 1;

      // Small boost for using comfortable skills (reinforcement)
      const comfortableSkills = idea.skills.filter((s) => skillMap.get(s) === "comfortable");
      score += comfortableSkills.length * 0.5;

      // Penalize projects where all skills are mastered
      const masteredSkills = idea.skills.filter((s) => skillMap.get(s) === "mastered");
      if (masteredSkills.length === idea.skills.length) score -= 5;

      return { idea, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map((s) => s.idea);
}
