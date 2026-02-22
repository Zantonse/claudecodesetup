"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { ideas } from "@/data/ideas";

interface RoadmapTimelineProps {
  projectIds: string[];
  onReorder: (ids: string[]) => void;
  onRemove: (id: string) => void;
}

export function RoadmapTimeline({ projectIds, onReorder, onRemove }: RoadmapTimelineProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const projects = useMemo(
    () =>
      projectIds
        .map((id) => ideas.find((idea) => idea.id === id))
        .filter(Boolean) as typeof ideas,
    [projectIds]
  );

  const allUniqueSkills = useMemo(() => {
    const skills = new Set<string>();
    projects.forEach((p) => p.skills.forEach((s) => skills.add(s)));
    return Array.from(skills);
  }, [projects]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDropTargetIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDropTargetIndex(null);
      return;
    }

    const newIds = [...projectIds];
    const [removed] = newIds.splice(draggedIndex, 1);
    newIds.splice(dropIndex, 0, removed);
    onReorder(newIds);

    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-500">
        <div className="text-3xl mb-3 opacity-40">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="text-sm">Add projects to your roadmap</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical connecting line */}
      {projects.length > 1 && (
        <div
          className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary-500/60 via-primary-500/30 to-primary-500/10"
          style={{ zIndex: 0 }}
        />
      )}

      <div className="relative flex flex-col gap-2">
        <AnimatePresence>
          {projects.map((project, index) => {
            const isDragging = draggedIndex === index;
            const isDropTarget = dropTargetIndex === index && draggedIndex !== null && draggedIndex !== index;

            return (
              <motion.div
                key={project.id}
                layoutId={project.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: isDragging ? 0.4 : 1, x: 0, scale: isDragging ? 0.97 : 1 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative flex gap-3 items-start p-3 rounded-lg transition-colors ${
                  isDropTarget
                    ? "ring-2 ring-primary-500/60 bg-primary-500/10"
                    : "hover:bg-slate-800/40"
                }`}
                style={{ zIndex: 1 }}
              >
                {/* Step number circle */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary-600/30 border border-primary-500/50 flex items-center justify-center text-xs font-bold text-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.15)]">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-semibold text-white leading-snug">{project.title}</h4>
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Remove button */}
                      <button
                        onClick={() => onRemove(project.id)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        aria-label={`Remove ${project.title} from roadmap`}
                      >
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {/* Drag handle */}
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors"
                        aria-label="Drag to reorder"
                      >
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="9" cy="5" r="1.5" />
                          <circle cx="15" cy="5" r="1.5" />
                          <circle cx="9" cy="12" r="1.5" />
                          <circle cx="15" cy="12" r="1.5" />
                          <circle cx="9" cy="19" r="1.5" />
                          <circle cx="15" cy="19" r="1.5" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <DifficultyBadge difficulty={project.difficulty} />
                    {project.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs text-slate-400 bg-slate-700/30 border border-slate-600/20"
                      >
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 3 && (
                      <span className="text-xs text-slate-500">+{project.skills.length - 3}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Cumulative skills footer */}
      {allUniqueSkills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/40">
          <p className="text-xs font-medium text-slate-400 mb-2">Skills you&apos;ll gain:</p>
          <div className="flex flex-wrap gap-1.5">
            {allUniqueSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary-600/15 text-primary-400 border border-primary-600/25"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
