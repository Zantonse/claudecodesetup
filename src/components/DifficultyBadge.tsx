import { DIFFICULTY_COLORS } from "@/lib/types";

interface DifficultyBadgeProps {
  difficulty: "beginner" | "intermediate" | "advanced";
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const colors = DIFFICULTY_COLORS[difficulty];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}
