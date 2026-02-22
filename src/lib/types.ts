export interface Feature {
  id: string;
  title: string;
  slug: string;
  icon: string;
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
