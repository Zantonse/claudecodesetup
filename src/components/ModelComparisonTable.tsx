"use client";

import { useState, useMemo } from "react";
import { models } from "@/data/models";
import { ClaudeModel } from "@/lib/types";

type SortKey = "name" | "tier" | "speed" | "intelligence";
type SortDir = "asc" | "desc";

const TIER_ORDER: Record<ClaudeModel["tier"], number> = { haiku: 0, sonnet: 1, opus: 2 };
const SPEED_ORDER: Record<ClaudeModel["speed"], number> = { fast: 0, medium: 1, slow: 2 };
const INTELLIGENCE_ORDER: Record<ClaudeModel["intelligence"], number> = {
  standard: 0,
  high: 1,
  highest: 2,
};

const TIER_BADGE: Record<ClaudeModel["tier"], string> = {
  haiku: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  sonnet: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  opus: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
};

const SPEED_DOT: Record<ClaudeModel["speed"], string> = {
  fast: "bg-emerald-400",
  medium: "bg-amber-400",
  slow: "bg-rose-400",
};

const SPEED_LABEL: Record<ClaudeModel["speed"], string> = {
  fast: "Fast",
  medium: "Medium",
  slow: "Slow",
};

const INTELLIGENCE_BARS = (level: ClaudeModel["intelligence"]) => {
  const count = { standard: 1, high: 2, highest: 3 }[level];
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`h-2 w-4 rounded-sm ${n <= count ? "bg-violet-400" : "bg-slate-700"}`}
        />
      ))}
      <span className="ml-1 text-xs text-slate-400 capitalize">{level}</span>
    </span>
  );
};

export function ModelComparisonTable() {
  const [sortKey, setSortKey] = useState<SortKey>("tier");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...models];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortKey === "tier") {
        cmp = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
      } else if (sortKey === "speed") {
        cmp = SPEED_ORDER[a.speed] - SPEED_ORDER[b.speed];
      } else if (sortKey === "intelligence") {
        cmp = INTELLIGENCE_ORDER[a.intelligence] - INTELLIGENCE_ORDER[b.intelligence];
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (col !== sortKey) return <span className="ml-1 text-slate-600">↕</span>;
    return <span className="ml-1 text-violet-400">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/40">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-slate-800/90 backdrop-blur-sm">
          <tr>
            {(
              [
                { key: "name", label: "Model Name" },
                { key: "tier", label: "Tier" },
                { key: "speed", label: "Speed" },
                { key: "intelligence", label: "Intelligence" },
              ] as { key: SortKey; label: string }[]
            ).map(({ key, label }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="px-4 py-3 text-left font-semibold text-slate-300 cursor-pointer select-none hover:text-white transition-colors whitespace-nowrap"
              >
                {label}
                <SortIcon col={key} />
              </th>
            ))}
            <th className="px-4 py-3 text-left font-semibold text-slate-300 whitespace-nowrap">
              Best For
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((model, idx) => (
            <tr
              key={model.id}
              className={`border-t border-slate-700/30 transition-colors hover:bg-slate-700/20 ${
                idx % 2 === 0 ? "bg-transparent" : "bg-slate-800/10"
              }`}
            >
              {/* Name */}
              <td className="px-4 py-3 font-medium text-slate-100 whitespace-nowrap">
                {model.name}
              </td>

              {/* Tier */}
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${TIER_BADGE[model.tier]}`}
                >
                  {model.tier}
                </span>
              </td>

              {/* Speed */}
              <td className="px-4 py-3">
                <span className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${SPEED_DOT[model.speed]}`} />
                  <span className="text-slate-300">{SPEED_LABEL[model.speed]}</span>
                </span>
              </td>

              {/* Intelligence */}
              <td className="px-4 py-3">{INTELLIGENCE_BARS(model.intelligence)}</td>

              {/* Best For */}
              <td className="px-4 py-3 text-slate-400 max-w-xs">
                {model.bestFor[0]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
