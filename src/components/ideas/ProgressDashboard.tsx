"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/types";
import type { ProjectIdea } from "@/lib/types";

interface Stats {
  notStarted: number;
  inProgress: number;
  completed: number;
  total: number;
}

interface ProgressDashboardProps {
  stats: Stats;
  ideas: ProjectIdea[];
}

function AnimatedNumber({ value }: { value: number }) {
  const prevRef = useRef(0);
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    prevRef.current = value;

    if (start === end) return;

    const duration = 600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      if (displayRef.current) {
        displayRef.current.textContent = String(current);
      }
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [value]);

  return <span ref={displayRef}>{value}</span>;
}

export function ProgressDashboard({ stats, ideas }: ProgressDashboardProps) {
  const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // SVG ring parameters
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (completionPct / 100) * circumference;

  // Category breakdown
  const categories = Object.keys(CATEGORY_COLORS) as (keyof typeof CATEGORY_COLORS)[];
  const categoryBreakdown = categories.map((cat) => {
    const total = ideas.filter((i) => i.category === cat).length;
    return { cat, total, label: CATEGORY_LABELS[cat], color: CATEGORY_COLORS[cat] };
  });
  const maxCategoryCount = Math.max(...categoryBreakdown.map((c) => c.total), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-card p-6 mb-6"
    >
      {/* Header */}
      <h2 className="text-lg font-bold text-white mb-5">Your Progress</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Stats row + ring */}
        <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
          {/* Circular progress ring */}
          <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
            <svg width="120" height="120" className="-rotate-90">
              {/* Background track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="rgb(51 65 85 / 0.6)"
                strokeWidth="10"
              />
              {/* Progress arc */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{completionPct}%</span>
              <span className="text-xs text-slate-400 font-medium">done</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            {/* Total */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
              <span className="text-2xl font-bold text-white">
                <AnimatedNumber value={stats.total} />
              </span>
              <span className="text-xs text-slate-400 mt-0.5 text-center">Total</span>
            </div>

            {/* Not Started */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
              <span className="text-2xl font-bold text-slate-400">
                <AnimatedNumber value={stats.total - stats.inProgress - stats.completed} />
              </span>
              <span className="text-xs text-slate-400 mt-0.5 text-center">Not Started</span>
            </div>

            {/* In Progress */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
              <span className="text-2xl font-bold text-amber-400 flex items-center gap-1">
                <AnimatedNumber value={stats.inProgress} />
                {stats.inProgress > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                  </span>
                )}
              </span>
              <span className="text-xs text-amber-400/70 mt-0.5 text-center">In Progress</span>
            </div>

            {/* Completed */}
            <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
              <span className="text-2xl font-bold text-emerald-400">
                <AnimatedNumber value={stats.completed} />
              </span>
              <span className="text-xs text-emerald-400/70 mt-0.5 text-center">Completed</span>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="lg:w-64 space-y-2.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            By Category
          </p>
          {categoryBreakdown.map(({ cat, total, label, color }) => (
            <div key={cat} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-28 shrink-0 truncate">{label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: total > 0 ? `${(total / maxCategoryCount) * 100}%` : "0%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-slate-400 w-8 text-right shrink-0">{total}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
