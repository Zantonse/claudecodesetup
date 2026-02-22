# Claude Code Learning Hub — Design Document

**Date:** 2026-02-22
**Author:** Craig Verzosa (via Claude Code brainstorming)
**Status:** Approved

## Overview

A personal learning hub and reference guide for Claude Code. Built as a Next.js App Router site with static TypeScript data files, featuring a bold modern documentation aesthetic with glassmorphism, gradients, and rich interactivity.

## Target Audience

Personal reference — Craig's learning hub for mastering Claude Code features, workflows, and building skills through project-based learning.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + CSS modules for complex components
- **Fonts:** Inter (body) + JetBrains Mono (code)
- **State:** React useState/useReducer + localStorage persistence
- **Animations:** CSS transitions + Framer Motion for complex sequences
- **No external CMS or database** — all content in TypeScript data files

## Site Structure

### Pages

1. **Home** (`/`) — Hero with animated gradient, "What is Claude Code?" overview, quick-start navigation cards
2. **Fundamentals** (`/fundamentals`) — Installation, auth, basic commands, how Claude Code works
3. **Features** (`/features`) — Index page with card grid linking to 8 subpages:
   - `/features/hooks` — Event-driven automation (PreToolUse, PostToolUse, etc.)
   - `/features/skills` — Agent skills and progressive disclosure
   - `/features/mcp-servers` — Model Context Protocol integration
   - `/features/commands` — Slash commands and frontmatter
   - `/features/agents` — Autonomous agent definitions
   - `/features/plugins` — Plugin system and marketplace
   - `/features/settings` — Configuration and CLAUDE.md
   - `/features/ide-integrations` — VS Code, JetBrains, terminal setup
4. **Models** (`/models`) — Claude model lineup with interactive comparison table
5. **Workflows** (`/workflows`) — Common patterns: debugging, refactoring, TDD, code review, git
6. **Tips** (`/tips`) — Keyboard shortcuts, prompting strategies, performance optimization
7. **Idea Generator** (`/ideas`) — Interactive project browser with full skill tracking system

### Component Library

- `Sidebar` — Collapsible left nav with glass effect, glow active states
- `ThemeToggle` — Light/dark mode (dark default)
- `FeatureCard` — Glassmorphism card with icon, hover lift, border glow
- `ModelComparisonTable` — Sortable table with sticky header
- `IdeaCard` — Project card with difficulty badge, skill tags, category border
- `FilterBar` — Multi-select chips, dropdowns, text search
- `SkillTracker` — Progress bars with self-assessment levels
- `RoadmapBuilder` — Drag-and-drop timeline with connected nodes
- `SkillGraph` — SVG/CSS node-edge dependency visualization
- `CodeBlock` — Syntax-highlighted code with copy button
- `ProgressDashboard` — Overall learning progress stats

## Visual Design

### Aesthetic: Bold Modern Documentation

- **Dark mode default** with light mode toggle
- **Gradient headers:** Blue-violet → indigo → purple with noise texture
- **Glassmorphism cards:** `backdrop-blur`, frosted glass, subtle border glow on hover
- **Color palette:**
  - Primary: Blue-violet (#7C3AED → #4F46E5)
  - Highlight: Electric cyan (#06B6D4)
  - Warning/badges: Warm amber (#F59E0B)
  - Success: Emerald (#10B981)
  - Danger: Rose (#F43F5E)
  - Backgrounds: Slate scale (#0F172A dark, #F8FAFC light)
- **Typography:** Inter for body (16px base), JetBrains Mono for code
- **Animations:** Card entrance stagger, smooth counters, pulse on recommendations, animated gradient text

### Layout

- Collapsible sidebar (280px) — semi-transparent glass, sticky
- Main content area — max-width 900px, generous padding
- Breadcrumbs at top of content
- Responsive: sidebar collapses to hamburger on mobile/tablet

## Idea Generator — Detailed Design

### Data Model

```typescript
interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];           // General dev skills
  claudeFeatures: string[];   // Claude Code features used
  category: string;           // developer-tools | web-app | automation | data-api | learning
  estimatedScope: string;     // Weekend | Multi-day | Week+
  learningOutcomes: string[];
  prerequisites: string[];
}

interface SkillProgress {
  skillId: string;
  level: 'not-started' | 'learning' | 'comfortable' | 'mastered';
}

interface ProjectStatus {
  projectId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
}

interface LearningRoadmap {
  id: string;
  name: string;
  projectIds: string[];       // Ordered list
  createdAt: string;
}
```

### Features

1. **Filter/Sort System** — Multi-select skill tags, difficulty dropdown, category filter, text search, Claude feature filter
2. **Skill Progress Tracker** — Self-assess skill levels (not-started/learning/comfortable/mastered). Persisted in localStorage.
3. **Recommended Next Project** — Scoring algorithm: prioritizes projects that build on "learning" skills + introduce 1-2 new ones. Shows top 3 recommendations.
4. **Project Roadmap Builder** — Select projects → drag-and-drop into ordered roadmap. Visual timeline. Multiple named roadmaps. localStorage persistence.
5. **Skill Dependency Graph** — SVG visualization of skill relationships. Neon-glow nodes on dark background, animated connection lines. Click node to filter projects.
6. **Completion Tracking** — Mark projects as not-started/in-progress/completed. Dashboard view with progress stats by skill category.
7. **Skill-First View Toggle** — Switch from project grid to skill-grouped view ("What do you want to learn?")

### Pre-populated Content

~30-40 project ideas spanning:
- **Developer Tools:** CLI apps, VS Code extensions, git hooks, linters
- **Web Applications:** Dashboards, portfolios, SaaS starters, real-time apps
- **Automation:** CI/CD pipelines, file processors, API integrators, bots
- **Data/API:** Scrapers, aggregators, visualizations, API wrappers
- **Learning:** Build-your-own-X, algorithm visualizers, coding challenges

## Data Files Structure

```
data/
├── features.ts       # Claude Code feature descriptions (hooks, skills, MCP, etc.)
├── models.ts         # Claude model data (names, capabilities, pricing, use cases)
├── workflows.ts      # Step-by-step workflow guides
├── tips.ts           # Pro tips, shortcuts, prompting strategies
└── ideas.ts          # 30-40 project ideas with full metadata
```

## State Management

- **Theme:** CSS class on `<html>`, persisted in localStorage
- **Skill Progress:** localStorage with try/catch wrapper
- **Project Status:** localStorage with try/catch wrapper
- **Roadmaps:** localStorage with try/catch wrapper
- **Filters:** URL search params (shareable filter states)
- All localStorage reads wrapped in JSON.parse try/catch with sensible defaults

## Error Handling

- localStorage quota exceeded: warn user, skip save
- Corrupted localStorage data: reset to defaults gracefully
- Missing data: fallback to empty arrays, never crash

## Not In Scope (YAGNI)

- Authentication/user accounts
- Backend/database
- AI-powered generation (all content is static)
- Commenting or social features
- Content export/import
- Analytics
