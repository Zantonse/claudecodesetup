"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { ideas } from "@/data/ideas";
import type { ProjectStatus } from "@/lib/types";

export function useProjectStatus() {
  const [statuses, setStatuses] = useLocalStorage<ProjectStatus[]>("project-statuses", []);

  const updateStatus = useCallback((projectId: string, status: ProjectStatus["status"]) => {
    setStatuses((prev) => {
      const existing = prev.findIndex((s) => s.projectId === projectId);
      const now = new Date().toISOString();
      const entry: ProjectStatus = {
        projectId,
        status,
        startedAt: status === "in-progress" ? now : prev.find(s => s.projectId === projectId)?.startedAt,
        completedAt: status === "completed" ? now : undefined,
      };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], ...entry };
        return updated;
      }
      return [...prev, entry];
    });
  }, [setStatuses]);

  const getStatus = (projectId: string): ProjectStatus["status"] => {
    return statuses.find((s) => s.projectId === projectId)?.status ?? "not-started";
  };

  const getProjectStatus = (projectId: string): ProjectStatus | undefined => {
    return statuses.find((s) => s.projectId === projectId);
  };

  const completedIds = useMemo(() => {
    return statuses.filter((s) => s.status === "completed").map((s) => s.projectId);
  }, [statuses]);

  const stats = useMemo(() => {
    const notStarted = statuses.filter((s) => s.status === "not-started").length;
    const inProgress = statuses.filter((s) => s.status === "in-progress").length;
    const completed = statuses.filter((s) => s.status === "completed").length;
    return { notStarted, inProgress, completed, total: ideas.length };
  }, [statuses]);

  return { statuses, updateStatus, getStatus, getProjectStatus, completedIds, stats };
}
