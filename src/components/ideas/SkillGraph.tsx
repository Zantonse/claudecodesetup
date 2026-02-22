"use client";

import { useState, useMemo } from "react";
import { skillNodes, skillEdges } from "@/data/skill-graph";
import { ideas } from "@/data/ideas";
import type { SkillProgress } from "@/lib/types";

interface SkillGraphProps {
  skillProgress: SkillProgress[];
  getSkillLevel: (skillId: string) => SkillProgress["level"];
  onSkillSelect: (skillId: string) => void;
}

// Mapping from skillNode id to the label strings used in ideas.skills[]
const SKILL_ID_TO_LABELS: Record<string, string[]> = {
  typescript:        ["TypeScript"],
  javascript:        ["JavaScript"],
  "html-css":        ["HTML/CSS", "CSS", "HTML"],
  git:               ["Git"],
  react:             ["React"],
  nodejs:            ["Node.js", "NodeJS"],
  "cli-development": ["CLI Development"],
  testing:           ["Testing"],
  database:          ["Database", "SQL", "PostgreSQL", "MongoDB"],
  "api-design":      ["API Design", "REST API", "GraphQL"],
  "state-management":["State Management"],
  websocket:         ["WebSocket", "WebSockets"],
  "data-visualization":["Data Visualization", "Charts"],
  hooks:             ["Hooks"],
  "mcp-servers":     ["MCP Servers"],
  "skills-system":   ["Skills System"],
  agents:            ["Agents"],
  plugins:           ["Plugins"],
  automation:        ["Automation"],
  devops:            ["DevOps", "CI/CD"],
  performance:       ["Performance", "Performance Optimization"],
};

const LEVEL_COLORS: Record<SkillProgress["level"], { fill: string; stroke: string; glow: string }> = {
  "not-started": {
    fill:   "rgba(100, 116, 139, 0.3)",
    stroke: "rgba(100, 116, 139, 0.7)",
    glow:   "rgba(100, 116, 139, 0.5)",
  },
  learning: {
    fill:   "rgba(245, 158, 11, 0.3)",
    stroke: "rgba(245, 158, 11, 0.7)",
    glow:   "rgba(245, 158, 11, 0.5)",
  },
  comfortable: {
    fill:   "rgba(6, 182, 212, 0.3)",
    stroke: "rgba(6, 182, 212, 0.7)",
    glow:   "rgba(6, 182, 212, 0.5)",
  },
  mastered: {
    fill:   "rgba(16, 185, 129, 0.3)",
    stroke: "rgba(16, 185, 129, 0.7)",
    glow:   "rgba(16, 185, 129, 0.5)",
  },
};

const NODE_WIDTH  = 120;
const NODE_HEIGHT = 40;

// Pre-compute a map of skillId → project count from the ideas data
function buildProjectCountMap(): Record<string, number> {
  const countMap: Record<string, number> = {};
  for (const node of skillNodes) {
    const matchLabels = SKILL_ID_TO_LABELS[node.id] ?? [];
    const count = ideas.filter((idea) =>
      idea.skills.some((s) => matchLabels.includes(s))
    ).length;
    countMap[node.id] = count;
  }
  return countMap;
}

const PROJECT_COUNT_MAP = buildProjectCountMap();

export function SkillGraph({ skillProgress, getSkillLevel, onSkillSelect }: SkillGraphProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Build a fast lookup: nodeId → {x, y}
  const nodePositions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    for (const node of skillNodes) {
      map[node.id] = { x: node.x, y: node.y };
    }
    return map;
  }, []);

  const hoveredNode = hoveredNodeId
    ? skillNodes.find((n) => n.id === hoveredNodeId) ?? null
    : null;

  return (
    <div className="space-y-3">
      {/* SVG graph */}
      <div className="overflow-x-auto rounded-xl border border-white/8 bg-slate-900/80">
        {/* Inline keyframes for the edge dash animation */}
        <style>{`
          @keyframes skill-dash {
            to { stroke-dashoffset: -10; }
          }
          .skill-edge-path {
            animation: skill-dash 1.2s linear infinite;
          }
          .skill-node-group {
            cursor: pointer;
          }
          .skill-node-group:hover .skill-node-rect {
            filter: brightness(1.25);
          }
        `}</style>

        <svg
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto min-w-[600px]"
          aria-label="Skill dependency graph"
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            </pattern>

            {/* Arrow marker for edges */}
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                fill="rgba(124, 58, 237, 0.5)"
              />
            </marker>
          </defs>

          {/* Background fill + grid */}
          <rect width="1000" height="600" fill="rgba(15, 23, 42, 0.9)" />
          <rect width="1000" height="600" fill="url(#grid)" />

          {/* Edges */}
          <g>
            {skillEdges.map((edge, i) => {
              const src = nodePositions[edge.from];
              const tgt = nodePositions[edge.to];
              if (!src || !tgt) return null;

              const sourceX = src.x + NODE_WIDTH / 2;
              const sourceY = src.y + NODE_HEIGHT / 2;
              const targetX = tgt.x + NODE_WIDTH / 2;
              const targetY = tgt.y + NODE_HEIGHT / 2;

              const dx = targetX - sourceX;
              const dy = targetY - sourceY;
              const cx = sourceX + dx * 0.5;
              const cy = sourceY + dy * 0.2;

              const d = `M ${sourceX} ${sourceY} Q ${cx} ${cy} ${targetX} ${targetY}`;

              return (
                <path
                  key={`edge-${i}`}
                  d={d}
                  fill="none"
                  stroke="rgba(124, 58, 237, 0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                  className="skill-edge-path"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {skillNodes.map((node) => {
              const level = getSkillLevel(node.id);
              const colors = LEVEL_COLORS[level];
              const isHovered = hoveredNodeId === node.id;
              const isClaude = node.category === "claude";

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="skill-node-group"
                  onClick={() => onSkillSelect(node.id)}
                  onMouseEnter={(e) => {
                    setHoveredNodeId(node.id);
                    const svg = (e.currentTarget as SVGGElement).closest("svg");
                    if (svg) {
                      const rect = svg.getBoundingClientRect();
                      const svgWidth = 1000;
                      const svgHeight = 600;
                      const scaleX = rect.width / svgWidth;
                      const scaleY = rect.height / svgHeight;
                      setTooltipPos({
                        x: node.x * scaleX,
                        y: (node.y + NODE_HEIGHT) * scaleY,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  {/* Glow filter rect (behind) */}
                  {isHovered && (
                    <rect
                      x={-4}
                      y={-4}
                      width={NODE_WIDTH + 8}
                      height={NODE_HEIGHT + 8}
                      rx={12}
                      fill="none"
                      stroke={colors.glow}
                      strokeWidth={3}
                      style={{
                        filter: `drop-shadow(0 0 8px ${colors.glow})`,
                        opacity: 0.8,
                      }}
                    />
                  )}

                  {/* Main rect */}
                  <rect
                    className="skill-node-rect"
                    x={0}
                    y={0}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx={8}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={isClaude ? 2 : 1.5}
                    strokeDasharray={isClaude ? "4,2" : undefined}
                    style={{
                      filter: isHovered
                        ? `drop-shadow(0 0 6px ${colors.glow})`
                        : `drop-shadow(0 0 3px ${colors.glow})`,
                      transition: "filter 0.2s ease",
                    }}
                  />

                  {/* Claude category dot */}
                  {isClaude && (
                    <circle
                      cx={NODE_WIDTH - 10}
                      cy={10}
                      r={4}
                      fill="rgba(124, 58, 237, 0.9)"
                      style={{
                        filter: "drop-shadow(0 0 3px rgba(124, 58, 237, 0.8))",
                      }}
                    />
                  )}

                  {/* Label */}
                  <text
                    x={NODE_WIDTH / 2}
                    y={NODE_HEIGHT / 2 + 4}
                    textAnchor="middle"
                    fill="rgba(241, 245, 249, 0.95)"
                    fontSize="11"
                    fontWeight={isHovered ? "600" : "400"}
                    style={{ userSelect: "none", transition: "font-weight 0.1s" }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip — positioned absolutely within the container */}
        <div className="relative">
          {hoveredNode && (() => {
            const level = getSkillLevel(hoveredNode.id);
            const projectCount = PROJECT_COUNT_MAP[hoveredNode.id] ?? 0;
            const levelLabel =
              level === "not-started" ? "Not Started"
              : level === "learning"   ? "Learning"
              : level === "comfortable" ? "Comfortable"
              : "Mastered";

            return (
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  left: tooltipPos.x,
                  top: -8,
                  transform: "translateY(-100%)",
                }}
              >
                <div className="glass-card px-3 py-2 text-xs text-slate-200 whitespace-nowrap shadow-lg">
                  <p className="font-semibold text-white">{hoveredNode.label}</p>
                  <p className="text-slate-400">Level: <span className="text-slate-200">{levelLabel}</span></p>
                  <p className="text-slate-400">
                    Projects: <span className="text-slate-200">{projectCount}</span>
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-400 px-1">
        <span className="font-medium text-slate-300">Legend:</span>
        {([
          { level: "not-started", label: "Not Started", color: "bg-slate-500/50 border-slate-500/70" },
          { level: "learning",    label: "Learning",    color: "bg-amber-500/30 border-amber-500/70" },
          { level: "comfortable", label: "Comfortable", color: "bg-cyan-500/30 border-cyan-500/70" },
          { level: "mastered",    label: "Mastered",    color: "bg-emerald-500/30 border-emerald-500/70" },
        ] as const).map(({ level, label, color }) => (
          <span key={level} className="flex items-center gap-1.5">
            <span className={`inline-block w-3 h-3 rounded border ${color}`} />
            {label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 ml-2">
          <span className="inline-block w-3 h-3 rounded border-2 border-dashed border-violet-500/70 bg-violet-500/20" />
          Claude Feature
        </span>
      </div>
    </div>
  );
}
