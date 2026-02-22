"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { RoadmapTimeline } from "./RoadmapTimeline";
import { useRoadmaps } from "@/lib/hooks/useRoadmaps";
import { ideas } from "@/data/ideas";

export function RoadmapBuilder() {
  const { roadmaps, createRoadmap, deleteRoadmap, addProjectToRoadmap, removeProjectFromRoadmap, reorderProjects } =
    useRoadmaps();

  const [collapsed, setCollapsed] = useState(false);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newRoadmapName, setNewRoadmapName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const addDropdownRef = useRef<HTMLDivElement>(null);

  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId) ?? roadmaps[0] ?? null;

  const handleCreate = () => {
    const trimmed = newRoadmapName.trim();
    if (!trimmed) return;
    const id = createRoadmap(trimmed);
    setActiveRoadmapId(id);
    setNewRoadmapName("");
    setShowCreateInput(false);
  };

  const handleDeleteConfirm = (id: string) => {
    deleteRoadmap(id);
    setConfirmDeleteId(null);
    if (activeRoadmap?.id === id) {
      const remaining = roadmaps.filter((r) => r.id !== id);
      setActiveRoadmapId(remaining[0]?.id ?? null);
    }
  };

  // Projects not yet in the active roadmap
  const availableProjects = activeRoadmap
    ? ideas.filter((idea) => !activeRoadmap.projectIds.includes(idea.id))
    : [];

  return (
    <GlassCard hover={false} className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary-400">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">Learning Roadmaps</h2>
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition-colors"
          aria-label={collapsed ? "Expand roadmaps" : "Collapse roadmaps"}
        >
          <motion.span animate={{ rotate: collapsed ? -90 : 0 }} transition={{ duration: 0.2 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.span>
        </button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            {/* Empty state */}
            {roadmaps.length === 0 && !showCreateInput && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mb-4">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-500">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  Create your first learning roadmap to plan your learning path
                </p>
                <button
                  onClick={() => setShowCreateInput(true)}
                  className="px-4 py-2 rounded-lg bg-primary-600/20 border border-primary-500/30 text-primary-400 text-sm font-medium hover:bg-primary-600/30 transition-colors"
                >
                  + Create Roadmap
                </button>
              </div>
            )}

            {/* Roadmap tabs */}
            {(roadmaps.length > 0 || showCreateInput) && (
              <>
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  {roadmaps.map((roadmap) => (
                    <button
                      key={roadmap.id}
                      onClick={() => {
                        setActiveRoadmapId(roadmap.id);
                        setShowCreateInput(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeRoadmap?.id === roadmap.id && !showCreateInput
                          ? "bg-primary-600/25 text-primary-300 border border-primary-500/40"
                          : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-700/30"
                      }`}
                    >
                      {roadmap.name}
                    </button>
                  ))}

                  {/* Create new tab button */}
                  {!showCreateInput ? (
                    <button
                      onClick={() => {
                        setShowCreateInput(true);
                        setActiveRoadmapId(activeRoadmap?.id ?? null);
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm text-slate-500 border border-dashed border-slate-600/40 hover:text-slate-300 hover:border-slate-500/50 transition-colors"
                    >
                      + New
                    </button>
                  ) : null}
                </div>

                {/* Create new roadmap inline form */}
                {showCreateInput && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={newRoadmapName}
                      onChange={(e) => setNewRoadmapName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreate();
                        if (e.key === "Escape") {
                          setShowCreateInput(false);
                          setNewRoadmapName("");
                        }
                      }}
                      placeholder="Roadmap name..."
                      className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none border-none"
                    />
                    <button
                      onClick={handleCreate}
                      disabled={!newRoadmapName.trim()}
                      className="px-3 py-1 rounded-md text-xs font-medium bg-primary-600/25 text-primary-300 border border-primary-500/40 hover:bg-primary-600/35 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateInput(false);
                        setNewRoadmapName("");
                      }}
                      className="px-2 py-1 rounded-md text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}

                {/* Active roadmap content */}
                {activeRoadmap && !showCreateInput && (
                  <div>
                    {/* Roadmap header with delete */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{activeRoadmap.name}</h3>
                        <p className="text-xs text-slate-500">
                          {activeRoadmap.projectIds.length} project{activeRoadmap.projectIds.length !== 1 ? "s" : ""}
                        </p>
                      </div>

                      {/* Delete button / confirmation */}
                      {confirmDeleteId === activeRoadmap.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Delete this roadmap?</span>
                          <button
                            onClick={() => handleDeleteConfirm(activeRoadmap.id)}
                            className="px-2 py-1 rounded text-xs font-medium bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 rounded text-xs text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(activeRoadmap.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete roadmap
                        </button>
                      )}
                    </div>

                    {/* Timeline */}
                    <RoadmapTimeline
                      projectIds={activeRoadmap.projectIds}
                      onReorder={(ids) => reorderProjects(activeRoadmap.id, ids)}
                      onRemove={(projectId) => removeProjectFromRoadmap(activeRoadmap.id, projectId)}
                    />

                    {/* Add project dropdown */}
                    {availableProjects.length > 0 && (
                      <div className="relative mt-4" ref={addDropdownRef}>
                        <button
                          onClick={() => setAddDropdownOpen((o) => !o)}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-400 border border-dashed border-slate-600/40 hover:text-slate-200 hover:border-slate-500/50 transition-colors"
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Project
                        </button>

                        <AnimatePresence>
                          {addDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.97 }}
                              transition={{ duration: 0.15 }}
                              className="absolute z-20 top-full mt-1 left-0 right-0 max-h-64 overflow-y-auto bg-slate-900/95 border border-slate-700/50 rounded-lg shadow-xl backdrop-blur-sm"
                            >
                              {availableProjects.map((project) => (
                                <button
                                  key={project.id}
                                  onClick={() => {
                                    addProjectToRoadmap(activeRoadmap.id, project.id);
                                    setAddDropdownOpen(false);
                                  }}
                                  className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-slate-800/60 transition-colors border-b border-slate-700/20 last:border-b-0"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{project.title}</p>
                                  </div>
                                  <DifficultyBadge difficulty={project.difficulty} />
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Close dropdown when clicking outside */}
                        {addDropdownOpen && (
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setAddDropdownOpen(false)}
                          />
                        )}
                      </div>
                    )}

                    {availableProjects.length === 0 && activeRoadmap.projectIds.length > 0 && (
                      <p className="mt-3 text-xs text-slate-500 text-center">
                        All projects added to this roadmap.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
