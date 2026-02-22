import { SkillNode, SkillEdge } from '@/lib/types';

export const skillNodes: SkillNode[] = [
  // Left column — foundational languages and tooling (x: 50–150)
  { id: 'typescript',        label: 'TypeScript',        category: 'language',   x: 100, y: 100 },
  { id: 'javascript',        label: 'JavaScript',        category: 'language',   x: 100, y: 200 },
  { id: 'html-css',          label: 'HTML/CSS',          category: 'language',   x: 100, y: 300 },
  { id: 'git',               label: 'Git',               category: 'tool',       x: 100, y: 400 },

  // Middle-left column — core frameworks and dev practices (x: 250–350)
  { id: 'react',             label: 'React',             category: 'framework',  x: 300, y: 100 },
  { id: 'nodejs',            label: 'Node.js',           category: 'framework',  x: 300, y: 200 },
  { id: 'cli-development',   label: 'CLI Development',   category: 'concept',    x: 300, y: 300 },
  { id: 'testing',           label: 'Testing',           category: 'concept',    x: 300, y: 400 },
  { id: 'database',          label: 'Database',          category: 'concept',    x: 300, y: 500 },

  // Center column — higher-level concepts (x: 450–550)
  { id: 'api-design',        label: 'API Design',        category: 'concept',    x: 500, y: 150 },
  { id: 'state-management',  label: 'State Management',  category: 'concept',    x: 500, y: 250 },
  { id: 'websocket',         label: 'WebSocket',         category: 'concept',    x: 500, y: 350 },
  { id: 'data-visualization',label: 'Data Visualization',category: 'concept',    x: 500, y: 450 },

  // Middle-right column — Claude Code features (x: 650–750)
  { id: 'hooks',             label: 'Hooks',             category: 'claude',     x: 700, y: 100 },
  { id: 'mcp-servers',       label: 'MCP Servers',       category: 'claude',     x: 700, y: 200 },
  { id: 'skills-system',     label: 'Skills System',     category: 'claude',     x: 700, y: 300 },
  { id: 'agents',            label: 'Agents',            category: 'claude',     x: 700, y: 400 },
  { id: 'plugins',           label: 'Plugins',           category: 'claude',     x: 700, y: 500 },

  // Right column — advanced engineering disciplines (x: 850–950)
  { id: 'automation',        label: 'Automation',        category: 'concept',    x: 900, y: 150 },
  { id: 'devops',            label: 'DevOps',            category: 'concept',    x: 900, y: 300 },
  { id: 'performance',       label: 'Performance',       category: 'concept',    x: 900, y: 450 },
];

export const skillEdges: SkillEdge[] = [
  // JavaScript is the prerequisite for TypeScript
  { from: 'javascript',        to: 'typescript' },

  // TypeScript unlocks framework and systems work
  { from: 'typescript',        to: 'react' },
  { from: 'typescript',        to: 'nodejs' },
  { from: 'typescript',        to: 'cli-development' },

  // HTML/CSS feeds into React UI development
  { from: 'html-css',          to: 'react' },

  // React unlocks state management patterns
  { from: 'react',             to: 'state-management' },

  // Node.js unlocks server-side and tooling concepts
  { from: 'nodejs',            to: 'api-design' },
  { from: 'nodejs',            to: 'websocket' },
  { from: 'nodejs',            to: 'hooks' },

  // CLI development feeds into autonomous agents
  { from: 'cli-development',   to: 'agents' },

  // Database knowledge is required for good API design
  { from: 'database',          to: 'api-design' },

  // Git is a prerequisite for DevOps practices
  { from: 'git',               to: 'devops' },

  // State management enables rich data visualization UIs
  { from: 'state-management',  to: 'data-visualization' },

  // API design is a prerequisite for MCP Servers
  { from: 'api-design',        to: 'mcp-servers' },

  // Claude Code feature dependencies and unlocks
  { from: 'hooks',             to: 'automation' },
  { from: 'mcp-servers',       to: 'automation' },
  { from: 'skills-system',     to: 'plugins' },
  { from: 'agents',            to: 'automation' },

  // High-level discipline relationships
  { from: 'automation',        to: 'devops' },
  { from: 'devops',            to: 'performance' },
];
