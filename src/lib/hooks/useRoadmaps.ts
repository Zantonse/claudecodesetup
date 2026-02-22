"use client";

import { useLocalStorage } from "./useLocalStorage";
import type { LearningRoadmap } from "@/lib/types";

export function useRoadmaps() {
  const [roadmaps, setRoadmaps] = useLocalStorage<LearningRoadmap[]>("roadmaps", []);

  const createRoadmap = (name: string) => {
    const newRoadmap: LearningRoadmap = {
      id: `roadmap-${Date.now()}`,
      name,
      projectIds: [],
      createdAt: new Date().toISOString(),
    };
    setRoadmaps((prev) => [...prev, newRoadmap]);
    return newRoadmap.id;
  };

  const deleteRoadmap = (id: string) => {
    setRoadmaps((prev) => prev.filter((r) => r.id !== id));
  };

  const addProjectToRoadmap = (roadmapId: string, projectId: string) => {
    setRoadmaps((prev) =>
      prev.map((r) =>
        r.id === roadmapId && !r.projectIds.includes(projectId)
          ? { ...r, projectIds: [...r.projectIds, projectId] }
          : r
      )
    );
  };

  const removeProjectFromRoadmap = (roadmapId: string, projectId: string) => {
    setRoadmaps((prev) =>
      prev.map((r) =>
        r.id === roadmapId ? { ...r, projectIds: r.projectIds.filter((id) => id !== projectId) } : r
      )
    );
  };

  const reorderProjects = (roadmapId: string, projectIds: string[]) => {
    setRoadmaps((prev) =>
      prev.map((r) => (r.id === roadmapId ? { ...r, projectIds } : r))
    );
  };

  return { roadmaps, createRoadmap, deleteRoadmap, addProjectToRoadmap, removeProjectFromRoadmap, reorderProjects };
}
