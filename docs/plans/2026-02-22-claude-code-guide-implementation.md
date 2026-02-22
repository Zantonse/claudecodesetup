# Claude Code Learning Hub — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a bold, glassmorphism-styled Next.js documentation site and interactive Idea Generator for learning Claude Code.

**Architecture:** Next.js 15 App Router with static TypeScript data files, Tailwind CSS 4 for styling, Framer Motion for animations, localStorage for state persistence. No backend or database. All content hardcoded in `src/data/` files.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, Framer Motion, Inter + JetBrains Mono fonts

**Design Doc:** `docs/plans/2026-02-22-claude-code-guide-design.md`

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`
- Create: `src/app/layout.tsx`, `src/app/globals.css`
- Create: `src/lib/types.ts`

**Step 1: Initialize Next.js project**

Run:
```bash
cd /Users/craigverzosa/Documents/Personal/Vibes/Claude/claude-code-guide
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

Expected: Next.js project scaffolded with App Router, Tailwind CSS, TypeScript.

**Step 2: Install additional dependencies**

Run:
```bash
cd /Users/craigverzosa/Documents/Personal/Vibes/Claude/claude-code-guide
npm install framer-motion @fontsource/inter @fontsource/jetbrains-mono
```

**Step 3: Configure Tailwind with custom design tokens**

Edit `src/app/globals.css` to set up the design system:

```css
@import "tailwindcss";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/inter/700.css";
@import "@fontsource/jetbrains-mono/400.css";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --color-primary-400: #818CF8;
  --color-primary-500: #6366F1;
  --color-primary-600: #4F46E5;
  --color-primary-700: #4338CA;

  --color-violet-400: #A78BFA;
  --color-violet-500: #8B5CF6;
  --color-violet-600: #7C3AED;

  --color-cyan-400: #22D3EE;
  --color-cyan-500: #06B6D4;

  --color-amber-400: #FBBF24;
  --color-amber-500: #F59E0B;

  --color-emerald-400: #34D399;
  --color-emerald-500: #10B981;

  --color-rose-400: #FB7185;
  --color-rose-500: #F43F5E;

  --color-surface-dark: #0F172A;
  --color-surface-light: #F8FAFC;
  --color-surface-card-dark: rgba(30, 41, 59, 0.5);
  --color-surface-card-light: rgba(255, 255, 255, 0.7);
}

/* Glass card utility */
.glass-card {
  background: var(--color-surface-card-dark);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.glass-card:hover {
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
}

:where(.light) .glass-card {
  background: var(--color-surface-card-light);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(148, 163, 184, 0.2);
}
:where(.light) .glass-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.08);
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #7C3AED, #4F46E5, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Noise texture overlay */
.noise-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}

/* Neon glow for skill graph nodes */
.neon-glow {
  filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.6));
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

body {
  font-family: var(--font-sans);
}
```

**Step 4: Create shared types**

Create `src/lib/types.ts`:

```typescript
export interface Feature {
  id: string;
  title: string;
  slug: string;
  icon: string;       // emoji or text icon
  summary: string;
  description: string;
  keyPoints: string[];
  codeExamples: CodeExample[];
  useCases: string[];
  tips: string[];
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  description?: string;
}

export interface ClaudeModel {
  id: string;
  name: string;
  modelId: string;
  description: string;
  capabilities: string[];
  bestFor: string[];
  speed: 'fast' | 'medium' | 'slow';
  intelligence: 'standard' | 'high' | 'highest';
  tier: 'haiku' | 'sonnet' | 'opus';
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
  claudeFeatures: string[];
  category: string;
}

export interface WorkflowStep {
  title: string;
  description: string;
  command?: string;
  tip?: string;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'shortcuts' | 'prompting' | 'performance' | 'configuration' | 'workflow';
  codeExample?: CodeExample;
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  claudeFeatures: string[];
  category: 'developer-tools' | 'web-app' | 'automation' | 'data-api' | 'learning';
  estimatedScope: 'Weekend' | 'Multi-day' | 'Week+';
  learningOutcomes: string[];
  prerequisites: string[];
}

export interface SkillProgress {
  skillId: string;
  level: 'not-started' | 'learning' | 'comfortable' | 'mastered';
}

export interface ProjectStatus {
  projectId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
}

export interface LearningRoadmap {
  id: string;
  name: string;
  projectIds: string[];
  createdAt: string;
}

export interface SkillNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
}

export interface SkillEdge {
  from: string;
  to: string;
}

export type ThemeMode = 'dark' | 'light';
export type ViewMode = 'projects' | 'skills';

export const DIFFICULTY_COLORS = {
  beginner: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  intermediate: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  advanced: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
} as const;

export const CATEGORY_COLORS = {
  'developer-tools': '#6366F1',
  'web-app': '#06B6D4',
  'automation': '#F59E0B',
  'data-api': '#10B981',
  'learning': '#8B5CF6',
} as const;

export const CATEGORY_LABELS = {
  'developer-tools': 'Developer Tools',
  'web-app': 'Web App',
  'automation': 'Automation',
  'data-api': 'Data & API',
  'learning': 'Learning',
} as const;
```

**Step 5: Set up root layout with dark mode default**

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Code Learning Hub",
  description: "Personal learning hub for mastering Claude Code",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-surface-dark text-slate-100 dark:bg-surface-dark dark:text-slate-100 light:bg-surface-light light:text-slate-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Step 6: Verify project runs**

Run:
```bash
cd /Users/craigverzosa/Documents/Personal/Vibes/Claude/claude-code-guide
npm run dev
```
Expected: Dev server starts, page loads at http://localhost:3000

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind, design tokens, and shared types"
```

---

## Task 2: localStorage Utilities & Theme System

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/lib/hooks/useLocalStorage.ts`
- Create: `src/lib/hooks/useTheme.ts`

**Step 1: Create safe localStorage wrapper**

Create `src/lib/storage.ts`:

```typescript
export function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeSetItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // QuotaExceededError or other storage failure
    console.warn(`Failed to save to localStorage key "${key}"`);
    return false;
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}
```

**Step 2: Create useLocalStorage hook**

Create `src/lib/hooks/useLocalStorage.ts`:

```typescript
"use client";

import { useState, useCallback } from "react";
import { safeGetItem, safeSetItem } from "../storage";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => safeGetItem(key, initialValue));

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        safeSetItem(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
```

**Step 3: Create useTheme hook**

Create `src/lib/hooks/useTheme.ts`:

```typescript
"use client";

import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { ThemeMode } from "../types";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<ThemeMode>("theme", "dark");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return { theme, toggleTheme };
}
```

**Step 4: Commit**

```bash
git add src/lib/
git commit -m "feat: add localStorage utilities and theme hook with safe error handling"
```

---

## Task 3: Core Layout — Sidebar, Theme Toggle, Breadcrumbs

**Files:**
- Create: `src/components/Sidebar.tsx`
- Create: `src/components/ThemeToggle.tsx`
- Create: `src/components/Breadcrumbs.tsx`
- Create: `src/components/AppShell.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create ThemeToggle component**

Create `src/components/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "@/lib/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-slate-700/50 dark:bg-slate-700/50 border border-slate-600/30 transition-colors hover:border-primary-500/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-200 shadow-md transition-transform duration-200 flex items-center justify-center text-sm ${
          theme === "light" ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
```

**Step 2: Create Sidebar component**

Create `src/components/Sidebar.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "⌂" },
  { label: "Fundamentals", href: "/fundamentals", icon: "📖" },
  {
    label: "Features",
    href: "/features",
    icon: "⚡",
    children: [
      { label: "Hooks", href: "/features/hooks" },
      { label: "Skills", href: "/features/skills" },
      { label: "MCP Servers", href: "/features/mcp-servers" },
      { label: "Commands", href: "/features/commands" },
      { label: "Agents", href: "/features/agents" },
      { label: "Plugins", href: "/features/plugins" },
      { label: "Settings", href: "/features/settings" },
      { label: "IDE Integrations", href: "/features/ide-integrations" },
    ],
  },
  { label: "Models", href: "/models", icon: "🧠" },
  { label: "Workflows", href: "/workflows", icon: "🔄" },
  { label: "Tips & Tricks", href: "/tips", icon: "💡" },
  { label: "Idea Generator", href: "/ideas", icon: "🚀" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["Features"]);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-lg glass-card flex items-center justify-center text-lg"
        aria-label="Toggle navigation"
      >
        {collapsed ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${
          collapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-72 glass-card border-r border-slate-700/30 dark:border-slate-700/30 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/20">
          <Link href="/" className="block">
            <h1 className="text-lg font-bold gradient-text">Claude Code</h1>
            <p className="text-xs text-slate-400 mt-0.5">Learning Hub</p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              {"children" in item && item.children ? (
                <>
                  <button
                    onClick={() => toggleSection(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-primary-600/20 text-primary-400"
                        : "text-slate-300 hover:bg-slate-700/30 hover:text-white"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <span
                      className={`text-xs transition-transform ${
                        expandedSections.includes(item.label) ? "rotate-90" : ""
                      }`}
                    >
                      ▸
                    </span>
                  </button>
                  {expandedSections.includes(item.label) && (
                    <div className="ml-8 mt-1 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                            pathname === child.href
                              ? "text-primary-400 bg-primary-600/10"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/20"
                          }`}
                          onClick={() => setCollapsed(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary-600/20 text-primary-400 shadow-[inset_0_0_12px_rgba(99,102,241,0.1)]"
                      : "text-slate-300 hover:bg-slate-700/30 hover:text-white"
                  }`}
                  onClick={() => setCollapsed(false)}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/20 flex items-center justify-between">
          <ThemeToggle />
          <span className="text-xs text-slate-500">v1.0</span>
        </div>
      </aside>
    </>
  );
}
```

**Step 3: Create Breadcrumbs component**

Create `src/components/Breadcrumbs.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABEL_MAP: Record<string, string> = {
  fundamentals: "Fundamentals",
  features: "Features",
  hooks: "Hooks",
  skills: "Skills",
  "mcp-servers": "MCP Servers",
  commands: "Commands",
  agents: "Agents",
  plugins: "Plugins",
  settings: "Settings",
  "ide-integrations": "IDE Integrations",
  models: "Models",
  workflows: "Workflows",
  tips: "Tips & Tricks",
  ideas: "Idea Generator",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: LABEL_MAP[seg] || seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
      <Link href="/" className="hover:text-primary-400 transition-colors">
        Home
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <span className="text-slate-600">/</span>
          {crumb.isLast ? (
            <span className="text-slate-200">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-primary-400 transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
```

**Step 4: Create AppShell wrapper**

Create `src/components/AppShell.tsx`:

```tsx
"use client";

import { Sidebar } from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs />
          {children}
        </div>
      </main>
    </div>
  );
}
```

**Step 5: Update root layout to use AppShell**

Modify `src/app/layout.tsx` to wrap children in `<AppShell>`:

```tsx
import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Code Learning Hub",
  description: "Personal learning hub for mastering Claude Code",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-[#0F172A] text-slate-100">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

**Step 6: Verify sidebar renders, navigation works**

Run: `npm run dev`, navigate between pages.

**Step 7: Commit**

```bash
git add src/components/ src/app/layout.tsx
git commit -m "feat: add Sidebar, ThemeToggle, Breadcrumbs, and AppShell layout"
```

---

## Task 4: Shared Components — FeatureCard, CodeBlock, GlassCard

**Files:**
- Create: `src/components/FeatureCard.tsx`
- Create: `src/components/CodeBlock.tsx`
- Create: `src/components/GlassCard.tsx`
- Create: `src/components/SectionHeader.tsx`
- Create: `src/components/DifficultyBadge.tsx`
- Create: `src/components/SkillTag.tsx`

**Step 1: Create GlassCard reusable wrapper**

Create `src/components/GlassCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", hover = true, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-xl p-6 ${hover ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Create FeatureCard**

Create `src/components/FeatureCard.tsx`:

```tsx
import Link from "next/link";
import { GlassCard } from "./GlassCard";

interface FeatureCardProps {
  icon: string;
  title: string;
  summary: string;
  href: string;
}

export function FeatureCard({ icon, title, summary, href }: FeatureCardProps) {
  return (
    <Link href={href}>
      <GlassCard>
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{summary}</p>
      </GlassCard>
    </Link>
  );
}
```

**Step 3: Create CodeBlock with copy button**

Create `src/components/CodeBlock.tsx`:

```tsx
"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "bash", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/30 my-4">
      {title && (
        <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700/30 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">{title}</span>
          <span className="text-xs text-slate-500">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm font-mono bg-slate-900/50 text-slate-300">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
```

**Step 4: Create SectionHeader, DifficultyBadge, SkillTag**

Create `src/components/SectionHeader.tsx`:

```tsx
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl lg:text-4xl font-bold gradient-text mb-2">{title}</h1>
      {subtitle && <p className="text-lg text-slate-400">{subtitle}</p>}
    </div>
  );
}
```

Create `src/components/DifficultyBadge.tsx`:

```tsx
import { DIFFICULTY_COLORS } from "@/lib/types";

interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const colors = DIFFICULTY_COLORS[difficulty];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}
```

Create `src/components/SkillTag.tsx`:

```tsx
interface SkillTagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function SkillTag({ label, active = false, onClick }: SkillTagProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
        active
          ? "bg-primary-600/30 text-primary-300 border border-primary-500/40 shadow-[0_0_8px_rgba(99,102,241,0.2)]"
          : "bg-slate-700/30 text-slate-400 border border-slate-600/20 hover:border-slate-500/40 hover:text-slate-300"
      }`}
    >
      {label}
    </button>
  );
}
```

**Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add shared UI components — GlassCard, FeatureCard, CodeBlock, badges, tags"
```

---

## Task 5: Data Files — Features, Models, Workflows, Tips

**Files:**
- Create: `src/data/features.ts`
- Create: `src/data/models.ts`
- Create: `src/data/workflows.ts`
- Create: `src/data/tips.ts`

**Context:** These files contain ALL the educational content for the site. Each file should be comprehensive and detailed, pulling from the Claude Code documentation gathered during brainstorming. The agent implementing this task should use Context7 to query `/anthropics/claude-code` and `/websites/code_claude` for accurate, detailed content for each feature, model, workflow, and tip.

**Step 1: Create features.ts**

Create `src/data/features.ts` with an array of `Feature` objects (from `@/lib/types`). Must include all 8 features:

1. **Hooks** — PreToolUse, PostToolUse, Notification, Stop hooks. Event-driven automation. JSON config format with matchers. Include code examples for common patterns (file protection, MCP monitoring, auto-formatting).
2. **Skills** — Agent skills with SKILL.md files. Progressive disclosure. Trigger conditions. Rigid vs flexible skills. Include example skill structure.
3. **MCP Servers** — Model Context Protocol integration. `.mcp.json` config. stdio and SSE transports. Claude Code as MCP server. Include config examples.
4. **Commands** — Slash commands with frontmatter. `.md` file format. Arguments and flags. Built-in commands list. Include example command.
5. **Agents** — Autonomous agent definitions. `.md` files in agents directory. Task delegation. Subagent types. Include example agent.
6. **Plugins** — Plugin system with `.claude-plugin/plugin.json`. Marketplace. Component discovery. Directory structure. Include plugin.json example.
7. **Settings** — CLAUDE.md files (global, project, local). Settings hierarchy. Configuration options. Permissions. Include CLAUDE.md example.
8. **IDE Integrations** — VS Code extension, JetBrains, terminal. Setup instructions. Features per IDE.

Each feature should have 3-5 code examples, 3-5 use cases, and 3-5 tips.

**Step 2: Create models.ts**

Create `src/data/models.ts` with array of `ClaudeModel` objects. Include all current models:
- Claude Opus 4.6, Opus 4.5, Opus 4.1, Opus 4.0
- Claude Sonnet 4.6, Sonnet 4.5, Sonnet 4.0
- Claude Haiku 4.5, Haiku 3.5

Each with: modelId, description, capabilities list, bestFor list, speed rating, intelligence rating, tier.

**Step 3: Create workflows.ts**

Create `src/data/workflows.ts` with 8-10 detailed workflows:
- Debugging a bug
- Refactoring code
- Writing tests (TDD)
- Code review
- Git workflows (branching, PRs)
- Adding a new feature
- Setting up a project
- Working with APIs
- Writing documentation
- Performance optimization

Each workflow has 4-8 ordered steps with commands and tips.

**Step 4: Create tips.ts**

Create `src/data/tips.ts` with 20-25 tips across categories:
- Shortcuts (5-6): keyboard shortcuts, slash commands
- Prompting (5-6): how to write effective prompts for Claude Code
- Performance (4-5): context management, reducing token usage
- Configuration (4-5): CLAUDE.md, settings, hooks
- Workflow (4-5): efficient patterns, batch operations

**Step 5: Commit**

```bash
git add src/data/
git commit -m "feat: add comprehensive data files for features, models, workflows, and tips"
```

---

## Task 6: Data File — Project Ideas (30-40 ideas)

**Files:**
- Create: `src/data/ideas.ts`
- Create: `src/data/skill-graph.ts`

**Step 1: Create ideas.ts**

Create `src/data/ideas.ts` with 35 `ProjectIdea` objects spread across categories:

**Developer Tools (7 ideas):**
1. CLI Task Manager — beginner, Weekend
2. Git Hook Linter — intermediate, Weekend
3. VS Code Extension Starter — intermediate, Multi-day
4. Code Snippet Manager — beginner, Weekend
5. Project Scaffolding Tool — intermediate, Multi-day
6. Log Analyzer CLI — intermediate, Weekend
7. Custom REPL Builder — advanced, Multi-day

**Web Applications (7 ideas):**
8. Personal Dashboard — beginner, Weekend
9. Markdown Blog Engine — intermediate, Multi-day
10. Real-time Chat App — advanced, Week+
11. Recipe Organizer — beginner, Weekend
12. Portfolio Site Generator — intermediate, Multi-day
13. Kanban Board — intermediate, Multi-day
14. API Documentation Viewer — intermediate, Multi-day

**Automation (7 ideas):**
15. File Organizer Bot — beginner, Weekend
16. CI/CD Pipeline Builder — advanced, Week+
17. Email Template Processor — intermediate, Multi-day
18. Scheduled Report Generator — intermediate, Multi-day
19. GitHub Issue Tracker — intermediate, Multi-day
20. Deployment Automator — advanced, Multi-day
21. Environment Setup Script — beginner, Weekend

**Data & API (7 ideas):**
22. Weather Dashboard — beginner, Weekend
23. API Aggregator — intermediate, Multi-day
24. Data Visualization Tool — intermediate, Multi-day
25. Web Scraper Framework — intermediate, Multi-day
26. Database Migration Tool — advanced, Multi-day
27. RSS Feed Reader — beginner, Weekend
28. Stock Tracker — intermediate, Multi-day

**Learning (7 ideas):**
29. Build Your Own Router — advanced, Multi-day
30. Algorithm Visualizer — intermediate, Multi-day
31. TypeScript Type Challenges — beginner, Weekend
32. Build Your Own Testing Framework — advanced, Week+
33. HTTP Server From Scratch — advanced, Week+
34. State Machine Visualizer — intermediate, Multi-day
35. Regex Playground — beginner, Weekend

Each idea must have: `skills` (3-5 general dev skills), `claudeFeatures` (2-4 Claude Code features), `learningOutcomes` (3-4 bullet points), and `prerequisites` (1-3 items).

**Step 2: Create skill-graph.ts**

Create `src/data/skill-graph.ts` with `SkillNode[]` and `SkillEdge[]` defining skill dependencies:

Nodes (~20 skills): TypeScript, React, Node.js, CLI Development, Git, Testing, API Design, Database, CSS/Styling, DevOps, Hooks, MCP Servers, Skills System, Agents, Plugins, Automation, Web Scraping, Data Visualization, State Management, Performance Optimization

Edges (skill dependencies):
- TypeScript → React, Node.js, CLI Development
- React → State Management
- Node.js → API Design, CLI Development, Automation
- Git → DevOps
- Testing → TDD
- Hooks → Automation
- etc.

Each node needs x,y coordinates for the graph layout (arrange in a logical flow from left to right, fundamentals on left, advanced on right).

**Step 3: Commit**

```bash
git add src/data/ideas.ts src/data/skill-graph.ts
git commit -m "feat: add 35 project ideas and skill dependency graph data"
```

---

## Task 7: Content Pages — Home, Fundamentals, Models

**Files:**
- Create: `src/app/page.tsx` (Home)
- Create: `src/app/fundamentals/page.tsx`
- Create: `src/app/models/page.tsx`
- Create: `src/components/ModelComparisonTable.tsx`

**Step 1: Create Home page**

Create `src/app/page.tsx`:
- Full-width hero section with gradient background (blue-violet → indigo → purple), noise overlay
- Animated gradient text: "Master Claude Code"
- Subtitle explaining the hub
- 6 quick-start cards (GlassCard) linking to main sections with staggered entrance animations (framer-motion)
- "Getting Started" mini section with 3 numbered steps

**Step 2: Create Fundamentals page**

Create `src/app/fundamentals/page.tsx`:
- SectionHeader: "Fundamentals"
- Sections: What is Claude Code, Installation, Authentication, Core Concepts (tools, context, permissions), Basic Usage
- Use CodeBlock components for install commands and example prompts
- Use GlassCard for concept explanations

**Step 3: Create ModelComparisonTable**

Create `src/components/ModelComparisonTable.tsx`:
- Sortable table (click column headers to sort)
- Columns: Model Name, Tier, Speed, Intelligence, Best For
- Sticky header
- Row hover highlighting
- Speed/Intelligence shown as colored dots or bars
- Uses `useMemo` to avoid recomputing sorted data on every render

**Step 4: Create Models page**

Create `src/app/models/page.tsx`:
- SectionHeader: "Claude Models"
- Brief intro paragraph
- ModelComparisonTable using data from `src/data/models.ts`
- Below table: expandable cards for each model with full details
- "Choosing a Model" section with decision flowchart (text-based)

**Step 5: Verify pages render, verify nav links work**

Run: `npm run dev`, check all 3 pages.

**Step 6: Commit**

```bash
git add src/app/page.tsx src/app/fundamentals/ src/app/models/ src/components/ModelComparisonTable.tsx
git commit -m "feat: add Home, Fundamentals, and Models pages with comparison table"
```

---

## Task 8: Content Pages — Features Index + 8 Subpages

**Files:**
- Create: `src/app/features/page.tsx` (index)
- Create: `src/app/features/hooks/page.tsx`
- Create: `src/app/features/skills/page.tsx`
- Create: `src/app/features/mcp-servers/page.tsx`
- Create: `src/app/features/commands/page.tsx`
- Create: `src/app/features/agents/page.tsx`
- Create: `src/app/features/plugins/page.tsx`
- Create: `src/app/features/settings/page.tsx`
- Create: `src/app/features/ide-integrations/page.tsx`
- Create: `src/components/FeaturePageLayout.tsx`

**Step 1: Create FeaturePageLayout template**

Create `src/components/FeaturePageLayout.tsx`:
A reusable layout for all feature pages. Takes a `Feature` object and renders:
- SectionHeader with icon and title
- Description section
- Key Points as a styled list with check icons
- Code Examples section using CodeBlock components
- Use Cases as cards
- Tips as highlighted callout boxes

```tsx
import type { Feature } from "@/lib/types";
import { SectionHeader } from "./SectionHeader";
import { CodeBlock } from "./CodeBlock";
import { GlassCard } from "./GlassCard";

export function FeaturePageLayout({ feature }: { feature: Feature }) {
  return (
    <div>
      <SectionHeader title={`${feature.icon} ${feature.title}`} subtitle={feature.summary} />

      <section className="prose-slate mb-12">
        <p className="text-slate-300 leading-relaxed text-lg">{feature.description}</p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Key Concepts</h2>
        <ul className="space-y-3">
          {feature.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300">
              <span className="text-emerald-400 mt-1">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {feature.codeExamples.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Examples</h2>
          {feature.codeExamples.map((example, i) => (
            <div key={i} className="mb-6">
              {example.description && (
                <p className="text-sm text-slate-400 mb-2">{example.description}</p>
              )}
              <CodeBlock code={example.code} language={example.language} title={example.title} />
            </div>
          ))}
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feature.useCases.map((useCase, i) => (
            <GlassCard key={i} hover={false} className="!p-4">
              <p className="text-sm text-slate-300">{useCase}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Tips</h2>
        <div className="space-y-3">
          {feature.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <span className="text-amber-400">💡</span>
              <p className="text-sm text-slate-300">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Create Features index page**

Create `src/app/features/page.tsx`:
- SectionHeader: "Features"
- Grid of 8 FeatureCard components (2 columns on desktop, 1 on mobile)
- Data from `src/data/features.ts`
- Staggered animation entrance

**Step 3: Create all 8 feature subpages**

Each subpage follows the same pattern:
```tsx
import { features } from "@/data/features";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";

export default function HooksPage() {
  const feature = features.find((f) => f.slug === "hooks")!;
  return <FeaturePageLayout feature={feature} />;
}
```

Create all 8: hooks, skills, mcp-servers, commands, agents, plugins, settings, ide-integrations.

**Step 4: Verify all feature pages render with content**

Run: `npm run dev`, navigate to each feature page.

**Step 5: Commit**

```bash
git add src/app/features/ src/components/FeaturePageLayout.tsx
git commit -m "feat: add Features index and 8 feature detail pages"
```

---

## Task 9: Content Pages — Workflows + Tips

**Files:**
- Create: `src/app/workflows/page.tsx`
- Create: `src/app/tips/page.tsx`

**Step 1: Create Workflows page**

Create `src/app/workflows/page.tsx`:
- SectionHeader: "Common Workflows"
- Accordion-style expandable workflow cards
- Each workflow shows: title, description, then expandable step-by-step guide
- Steps shown as numbered vertical timeline with connecting line
- Each step has: title, description, optional command (CodeBlock), optional tip (callout)
- Category filter at top (all, debugging, git, testing, etc.)
- Data from `src/data/workflows.ts`

**Step 2: Create Tips page**

Create `src/app/tips/page.tsx`:
- SectionHeader: "Tips & Tricks"
- Category tabs at top: All, Shortcuts, Prompting, Performance, Configuration, Workflow
- Grid of tip cards (GlassCard)
- Each card: title, content, optional code example
- Category badge on each card
- Data from `src/data/tips.ts`

**Step 3: Verify both pages render**

Run: `npm run dev`, navigate to Workflows and Tips.

**Step 4: Commit**

```bash
git add src/app/workflows/ src/app/tips/
git commit -m "feat: add Workflows (accordion timeline) and Tips (tabbed grid) pages"
```

---

## Task 10: Idea Generator — Core (Filtering, Cards, Views)

**Files:**
- Create: `src/app/ideas/page.tsx`
- Create: `src/components/ideas/FilterBar.tsx`
- Create: `src/components/ideas/IdeaCard.tsx`
- Create: `src/components/ideas/IdeaGrid.tsx`
- Create: `src/components/ideas/IdeaDetailModal.tsx`
- Create: `src/lib/hooks/useIdeaFilters.ts`

**Step 1: Create useIdeaFilters hook**

Create `src/lib/hooks/useIdeaFilters.ts`:
- Manages filter state: selectedSkills, selectedDifficulty, selectedCategory, selectedClaudeFeatures, searchQuery, viewMode ('projects' | 'skills')
- Filters derived via `useMemo` from the full ideas list
- Returns: filteredIdeas, filter setters, all unique skill/category values for the filter UI

**Step 2: Create FilterBar component**

Create `src/components/ideas/FilterBar.tsx`:
- Row of SkillTag chips for skills (multi-select, toggleable)
- Dropdown for difficulty (All/Beginner/Intermediate/Advanced)
- Dropdown for category (All + 5 categories)
- Text search input
- View toggle button (Projects vs Skills)
- "Clear all" button
- All wrapped in a glass-card bar

**Step 3: Create IdeaCard component**

Create `src/components/ideas/IdeaCard.tsx`:
- GlassCard with colored left border (by category)
- Title, difficulty badge, scope badge
- Skill tags row (glowing)
- Claude features row
- Brief description (truncated)
- Click to open detail modal

**Step 4: Create IdeaDetailModal**

Create `src/components/ideas/IdeaDetailModal.tsx`:
- Full modal overlay with glass backdrop
- Complete project info: title, description, difficulty, scope
- Learning Outcomes as checklist
- Prerequisites list
- Skills and Claude Features as tags
- Status control (not-started/in-progress/completed) — wired in Task 12

**Step 5: Create IdeaGrid**

Create `src/components/ideas/IdeaGrid.tsx`:
- Takes `filteredIdeas` and `viewMode`
- Projects view: responsive card grid
- Skills view: groups ideas by skill, shows skill headers with idea cards underneath
- Staggered entrance animation

**Step 6: Create Ideas page**

Create `src/app/ideas/page.tsx`:
- SectionHeader: "Idea Generator"
- FilterBar
- IdeaGrid
- Empty state when no ideas match filters
- Integrates useIdeaFilters hook

**Step 7: Verify filtering, card rendering, modal, view toggle**

Run: `npm run dev`, test the Idea Generator.

**Step 8: Commit**

```bash
git add src/app/ideas/ src/components/ideas/ src/lib/hooks/useIdeaFilters.ts
git commit -m "feat: add Idea Generator with filtering, card grid, detail modal, and skill-first view"
```

---

## Task 11: Idea Generator — Skill Tracker + Recommendations

**Files:**
- Create: `src/components/ideas/SkillTracker.tsx`
- Create: `src/components/ideas/RecommendedProjects.tsx`
- Create: `src/lib/hooks/useSkillProgress.ts`
- Create: `src/lib/recommendations.ts`
- Modify: `src/app/ideas/page.tsx` (add tracker + recommendations sections)

**Step 1: Create useSkillProgress hook**

Create `src/lib/hooks/useSkillProgress.ts`:
- Uses `useLocalStorage` to persist `SkillProgress[]`
- Returns: skillProgress array, updateSkill function, getSkillLevel function
- Derives all unique skills from ideas data

**Step 2: Create recommendation algorithm**

Create `src/lib/recommendations.ts`:

```typescript
import type { ProjectIdea, SkillProgress } from "./types";

export function getRecommendedProjects(
  ideas: ProjectIdea[],
  skillProgress: SkillProgress[],
  completedProjectIds: string[],
  count: number = 3
): ProjectIdea[] {
  const skillMap = new Map(skillProgress.map((s) => [s.skillId, s.level]));

  const scored = ideas
    .filter((idea) => !completedProjectIds.includes(idea.id))
    .map((idea) => {
      let score = 0;

      // Boost projects that build on "learning" skills
      const learningSkills = idea.skills.filter((s) => skillMap.get(s) === "learning");
      score += learningSkills.length * 3;

      // Boost projects that introduce 1-2 new skills (not too many)
      const newSkills = idea.skills.filter((s) => !skillMap.has(s) || skillMap.get(s) === "not-started");
      if (newSkills.length >= 1 && newSkills.length <= 2) score += 2;
      if (newSkills.length > 3) score -= 1; // Penalty for too many new skills

      // Small boost for using comfortable skills (reinforcement)
      const comfortableSkills = idea.skills.filter((s) => skillMap.get(s) === "comfortable");
      score += comfortableSkills.length * 0.5;

      // Penalize projects where all skills are mastered (nothing to learn)
      const masteredSkills = idea.skills.filter((s) => skillMap.get(s) === "mastered");
      if (masteredSkills.length === idea.skills.length) score -= 5;

      return { idea, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map((s) => s.idea);
}
```

**Step 3: Create SkillTracker component**

Create `src/components/ideas/SkillTracker.tsx`:
- Collapsible panel (glass card)
- Lists all skills from the ideas data
- Each skill shows: name, current level (dropdown: not-started/learning/comfortable/mastered)
- Color-coded progress bar per skill
- Summary stats at top: X skills learning, Y comfortable, Z mastered

**Step 4: Create RecommendedProjects component**

Create `src/components/ideas/RecommendedProjects.tsx`:
- Highlighted section at top of Idea Generator
- "Recommended For You" header with pulse animation
- 3 IdeaCards in a row
- Brief explanation: "Based on your skill progress, these projects will help you grow"
- Only shows when user has set at least 1 skill level

**Step 5: Integrate into Ideas page**

Modify `src/app/ideas/page.tsx`:
- Add SkillTracker (collapsible, above filters)
- Add RecommendedProjects (below tracker, above main grid)
- Pass skillProgress to recommendation engine

**Step 6: Verify skill tracking persists across page reloads, recommendations update**

Run: `npm run dev`, set some skill levels, verify recommendations change.

**Step 7: Commit**

```bash
git add src/components/ideas/ src/lib/hooks/useSkillProgress.ts src/lib/recommendations.ts src/app/ideas/page.tsx
git commit -m "feat: add skill progress tracker and smart project recommendations"
```

---

## Task 12: Idea Generator — Completion Tracking + Dashboard

**Files:**
- Create: `src/components/ideas/ProgressDashboard.tsx`
- Create: `src/lib/hooks/useProjectStatus.ts`
- Modify: `src/components/ideas/IdeaCard.tsx` (add status control)
- Modify: `src/components/ideas/IdeaDetailModal.tsx` (add status control)
- Modify: `src/app/ideas/page.tsx` (add dashboard)

**Step 1: Create useProjectStatus hook**

Create `src/lib/hooks/useProjectStatus.ts`:
- Uses `useLocalStorage` to persist `ProjectStatus[]`
- Returns: statuses, updateStatus, getStatus
- updateStatus sets startedAt when moving to in-progress, completedAt when completing

**Step 2: Create ProgressDashboard component**

Create `src/components/ideas/ProgressDashboard.tsx`:
- Glass card with animated counters (framer-motion)
- Stats: Total projects, Not Started, In Progress, Completed
- Circular progress ring (SVG) showing overall completion %
- Breakdown by category (horizontal bar chart)
- Breakdown by skill (shows which skills you've practiced most)

**Step 3: Add status controls to IdeaCard and IdeaDetailModal**

Modify `src/components/ideas/IdeaCard.tsx`:
- Add small status indicator dot (gray/amber/green) in top-right corner
- Status dropdown on hover or click

Modify `src/components/ideas/IdeaDetailModal.tsx`:
- Add prominent status selector buttons
- Show started/completed dates when applicable

**Step 4: Integrate dashboard into Ideas page**

Modify `src/app/ideas/page.tsx`:
- Add ProgressDashboard at very top (always visible)
- Pass project statuses to all components

**Step 5: Verify status changes persist, dashboard updates, counters animate**

Run: `npm run dev`, mark some projects, verify persistence.

**Step 6: Commit**

```bash
git add src/components/ideas/ src/lib/hooks/useProjectStatus.ts src/app/ideas/page.tsx
git commit -m "feat: add project completion tracking with animated progress dashboard"
```

---

## Task 13: Idea Generator — Roadmap Builder

**Files:**
- Create: `src/components/ideas/RoadmapBuilder.tsx`
- Create: `src/components/ideas/RoadmapTimeline.tsx`
- Create: `src/lib/hooks/useRoadmaps.ts`
- Modify: `src/app/ideas/page.tsx` (add roadmap tab/section)

**Step 1: Create useRoadmaps hook**

Create `src/lib/hooks/useRoadmaps.ts`:
- Uses `useLocalStorage` to persist `LearningRoadmap[]`
- Returns: roadmaps, createRoadmap, deleteRoadmap, addProjectToRoadmap, removeProjectFromRoadmap, reorderProjects
- reorderProjects takes roadmapId + new ordered projectIds array

**Step 2: Create RoadmapTimeline component**

Create `src/components/ideas/RoadmapTimeline.tsx`:
- Visual vertical timeline with connected nodes
- Each node shows project title, difficulty badge, skill tags
- Connecting line between nodes with gradient
- Drag-and-drop reordering using HTML drag events (no heavy library)
- Remove button (X) on each node
- Skills accumulated indicator: as you move down the timeline, shows cumulative skills gained

Implementation of drag-and-drop:
```tsx
// Use native HTML5 drag and drop
// onDragStart: set dragged index
// onDragOver: prevent default, show drop indicator
// onDrop: reorder array, call reorderProjects
```

**Step 3: Create RoadmapBuilder component**

Create `src/components/ideas/RoadmapBuilder.tsx`:
- Glass card panel
- Tabs for each roadmap + "Create New" button
- Create new: text input for roadmap name
- Active roadmap shows: RoadmapTimeline + "Add Project" dropdown (filtered to projects not in roadmap)
- Delete roadmap button with confirmation
- Empty state: "Create your first learning roadmap"

**Step 4: Add roadmap section to Ideas page**

Modify `src/app/ideas/page.tsx`:
- Add "Roadmap Builder" section below the main grid (or as a toggleable tab)
- "Add to Roadmap" button on each IdeaCard (opens dropdown of roadmaps)

**Step 5: Verify create/delete roadmaps, drag-drop reorder, persistence**

Run: `npm run dev`, test full roadmap workflow.

**Step 6: Commit**

```bash
git add src/components/ideas/ src/lib/hooks/useRoadmaps.ts src/app/ideas/page.tsx
git commit -m "feat: add roadmap builder with drag-and-drop timeline and multi-roadmap support"
```

---

## Task 14: Idea Generator — Skill Dependency Graph

**Files:**
- Create: `src/components/ideas/SkillGraph.tsx`
- Modify: `src/app/ideas/page.tsx` (add graph section)

**Step 1: Create SkillGraph component**

Create `src/components/ideas/SkillGraph.tsx`:

SVG-based skill dependency visualization:
- Dark background container with subtle grid pattern
- Nodes: rounded rectangles with skill name, colored by category
- Neon glow effect on nodes (filter: drop-shadow)
- Edges: curved SVG paths connecting nodes, with animated dash offset
- Node colors reflect skill progress (gray=not started, amber=learning, cyan=comfortable, green=mastered)
- Click a node → filters the Idea Generator to show projects teaching that skill
- Hover tooltip showing: skill name, current level, number of projects
- Responsive: scales down on smaller screens using viewBox

Layout: Use the pre-computed x,y coordinates from `src/data/skill-graph.ts`.

Edge rendering:
```tsx
// For each edge, draw a quadratic bezier curve between node centers
// Use <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} />
// Animate with CSS stroke-dashoffset
```

Node rendering:
```tsx
// <g> containing:
// - <rect> with rounded corners, glass fill, neon glow
// - <text> centered in rect
// - Click handler that calls onSkillSelect(skillId)
```

**Step 2: Integrate into Ideas page**

Modify `src/app/ideas/page.tsx`:
- Add SkillGraph as a collapsible section between SkillTracker and filters
- When a graph node is clicked, set the skill filter to that skill
- Pass skill progress to graph for coloring nodes

**Step 3: Verify graph renders, nodes are clickable, filtering works**

Run: `npm run dev`, test the skill graph.

**Step 4: Commit**

```bash
git add src/components/ideas/SkillGraph.tsx src/app/ideas/page.tsx
git commit -m "feat: add interactive SVG skill dependency graph with neon glow and click-to-filter"
```

---

## Task 15: Polish — Animations, Responsive, Dark/Light

**Files:**
- Modify: Multiple component files for animation polish
- Modify: `src/app/globals.css` (light mode styles)
- Create: `src/components/AnimatedCounter.tsx`

**Step 1: Create AnimatedCounter component**

Create `src/components/AnimatedCounter.tsx`:
```tsx
"use client";
import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const diff = value - start;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value, duration]);

  return <span>{display}</span>;
}
```

**Step 2: Add stagger animations to card grids**

In every page that renders a grid of cards, wrap items with framer-motion stagger:
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.06 } },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      ...
    </motion.div>
  ))}
</motion.div>
```

Apply to: Home page cards, Features grid, Tips grid, Ideas grid.

**Step 3: Finalize light mode styles**

Ensure all glass-card, text, and background styles work in light mode:
- Body: `bg-surface-light text-slate-900` in light mode
- Glass cards: lighter backdrop with subtle shadows
- Gradient text still readable in light mode
- Sidebar adjusts background and text colors
- Skill graph nodes readable in both modes

Test by toggling theme on every page.

**Step 4: Responsive polish**

Verify on:
- Desktop (1200px+): sidebar visible, 2-column grids
- Tablet (768px-1199px): sidebar collapsed by default, 2-column grids
- Mobile (< 768px): hamburger menu, single column, smaller text
- Ensure no horizontal overflow anywhere
- Ensure modals are scrollable on small screens

**Step 5: Final `npm run build` check**

Run:
```bash
cd /Users/craigverzosa/Documents/Personal/Vibes/Claude/claude-code-guide
npm run build
```
Expected: Build succeeds with no errors. Fix any TypeScript or build errors.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: polish animations, responsive layout, and light/dark mode across all pages"
```

---

## Summary

| Task | Description | Dependencies |
|------|-------------|--------------|
| 1 | Project scaffolding | None |
| 2 | localStorage utilities & theme | 1 |
| 3 | Core layout (Sidebar, Breadcrumbs) | 1, 2 |
| 4 | Shared components (GlassCard, CodeBlock, etc.) | 1 |
| 5 | Data files (features, models, workflows, tips) | 1 |
| 6 | Data file (35 project ideas + skill graph) | 1 |
| 7 | Home, Fundamentals, Models pages | 3, 4, 5 |
| 8 | Features index + 8 subpages | 3, 4, 5 |
| 9 | Workflows + Tips pages | 3, 4, 5 |
| 10 | Idea Generator core (filtering, cards) | 3, 4, 6 |
| 11 | Skill tracker + recommendations | 10 |
| 12 | Completion tracking + dashboard | 10 |
| 13 | Roadmap builder | 10 |
| 14 | Skill dependency graph | 10, 6 |
| 15 | Polish (animations, responsive, theming) | All above |

**Parallelizable groups:**
- Tasks 4, 5, 6 can run in parallel (no interdependence)
- Tasks 7, 8, 9 can run in parallel (once 3, 4, 5 are done)
- Tasks 11, 12, 13, 14 can run in parallel (once 10 is done)
