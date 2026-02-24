export interface SkillLevel {
  id: string;
  tier: number;
  title: string;
  subtitle: string;
  color: string;
  glowColor: string;
  icon: string;
  description: string;
  skills: string[];
  examplePrompts: ExamplePrompt[];
  featuresUsed: string[];
  readyForNext: string[];
}

export interface ExamplePrompt {
  prompt: string;
  why: string;
}

export const skillLevels: SkillLevel[] = [
  {
    id: 'beginner',
    tier: 1,
    title: 'Beginner',
    subtitle: 'Getting Started',
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    icon: '🌱',
    description:
      'You\'re new to Claude Code (and maybe new to coding). You know how to open a terminal, run basic commands, and ask Claude to do things in plain English. This is where everyone starts — the goal is to build confidence and muscle memory with the core loop: ask, review, accept or redirect.',
    skills: [
      'Open a terminal and launch Claude Code with `claude`',
      'Ask Claude to create, read, and edit files using natural language',
      'Use Escape to interrupt and Ctrl+C to cancel when Claude goes off track',
      'Review diffs before accepting file changes',
      'Use /clear to start fresh when the conversation gets confusing',
      'Create a basic CLAUDE.md with your project\'s tech stack',
      'Use /cost to monitor token usage and understand spending',
      'Ask Claude to explain code you don\'t understand',
      'Use --continue to resume where you left off after closing the terminal',
    ],
    examplePrompts: [
      {
        prompt: 'Create a new file called utils.ts with a function that formats dates as YYYY-MM-DD',
        why: 'Clear, single-task request with a specific output format. Good beginner prompt because it gives Claude everything it needs.',
      },
      {
        prompt: 'Read src/app.ts and explain what it does',
        why: 'Using Claude as a learning tool — having it explain code is one of the highest-value beginner workflows.',
      },
      {
        prompt: 'Fix the TypeScript error in src/api/users.ts',
        why: 'Simple debugging request. Let Claude read the file, identify the error, and propose a fix for you to review.',
      },
    ],
    featuresUsed: [
      'Basic file operations (Read, Write, Edit)',
      'Bash commands through Claude',
      '/clear, /cost, /compact',
      '--continue for session resumption',
      'CLAUDE.md for project context',
    ],
    readyForNext: [
      'You can ask Claude to build small features and review the output confidently',
      'You understand the review-accept-reject cycle and don\'t blindly accept every change',
      'You use /clear and /compact to manage your session proactively',
      'You\'ve created a CLAUDE.md that describes your project',
    ],
  },
  {
    id: 'intermediate',
    tier: 2,
    title: 'Intermediate',
    subtitle: 'Productive Daily Driver',
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    icon: '⚡',
    description:
      'You use Claude Code daily and it\'s part of your workflow. You know how to write effective prompts, reference specific files, and guide Claude through multi-step tasks. You\'re comfortable with the permission system, model switching, and basic configuration. Your focus is on speed and accuracy.',
    skills: [
      'Write specific, scoped prompts that reference exact file paths',
      'Use "Don\'t change X" constraints to protect existing code',
      'Switch models mid-session with /model (Sonnet for speed, Opus for complexity)',
      'Configure .claude/settings.json with allow/deny permissions',
      'Use /review to get structured feedback on staged changes',
      'Break complex tasks into sequential steps and guide Claude through each',
      'Use git workflows with Claude: branch, commit with good messages, create PRs',
      'Write a three-tier CLAUDE.md (global, project, local)',
      'Use /init to bootstrap CLAUDE.md for new projects',
      'Set up /terminal-setup for completions and aliases',
    ],
    examplePrompts: [
      {
        prompt: 'Read src/api/auth.ts and src/middleware/session.ts first, then add rate limiting to the login endpoint. Use the existing RateLimiter class in src/lib/rate-limiter.ts. Don\'t change the function signatures.',
        why: 'References exact files, uses existing code, sets a constraint. Claude has full context before starting work.',
      },
      {
        prompt: 'Before writing any code, describe your approach to adding WebSocket support to the notification system. Which files would you modify, what new files would you create, and what are the risks?',
        why: 'Asking for a plan before implementation. Intermediate users know that preventing wasted work is worth the extra prompt.',
      },
      {
        prompt: 'Review the staged changes, focusing on error handling and potential race conditions. Flag anything that could fail silently.',
        why: 'Directed code review with specific concerns. More effective than a generic "review this" because it tells Claude what to look for.',
      },
    ],
    featuresUsed: [
      '.claude/settings.json for permissions',
      '/model for switching between Sonnet and Opus',
      '/review for code review',
      '/init for project bootstrapping',
      '/terminal-setup for shell integration',
      'Git workflows (branch, commit, PR)',
      'Three-tier CLAUDE.md configuration',
    ],
    readyForNext: [
      'You write prompts that consistently produce accurate, reviewable results on the first try',
      'You switch models strategically based on task complexity',
      'You have settings.json configured and a solid CLAUDE.md for every project',
      'You use git workflows with Claude fluently and commit frequently',
    ],
  },
  {
    id: 'advanced',
    tier: 3,
    title: 'Advanced',
    subtitle: 'Power User',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    icon: '🔮',
    description:
      'You\'ve customized Claude Code to fit your exact workflow. Hooks auto-format your code, MCP servers connect Claude to your databases and APIs, and custom commands encode your team\'s processes. You think in terms of systems — not individual prompts — and you design the environment so Claude produces great results by default.',
    skills: [
      'Write PreToolUse and PostToolUse hooks for automated quality gates',
      'Configure MCP servers to connect Claude to databases, GitHub, Figma, etc.',
      'Create custom slash commands for team-specific workflows (/deploy, /release, /review-pr)',
      'Build custom skills (SKILL.md) with trigger phrases and structured methodology',
      'Use the @ file inclusion syntax for precise context injection',
      'Dispatch parallel subagents via the Task tool for independent tasks',
      'Use --print for headless scripting and CI/CD integration',
      'Use --allowedTools to create scoped sessions for specific tasks',
      'Write agents that run in isolated contexts with restricted tool access',
      'Configure Notification hooks for desktop alerts on long-running tasks',
    ],
    examplePrompts: [
      {
        prompt: 'Dispatch three parallel agents: one to audit dependencies for CVEs, one to generate missing tests for src/api/, and one to update the API documentation. Compile the results.',
        why: 'Multi-agent orchestration. Advanced users decompose work into parallel independent tasks and aggregate results.',
      },
      {
        prompt: 'Create a PreToolUse hook on Bash that blocks any command containing rm -rf, and a PostToolUse hook on Write that runs eslint --fix on every saved file. Add both to .claude/hooks.json.',
        why: 'Building automated safety and quality systems rather than relying on manual review.',
      },
      {
        prompt: 'Based on @src/lib/types.ts and the patterns in @src/api/users.ts, generate the complete CRUD API for the Order entity including validation, error handling, and tests.',
        why: 'Pattern-based generation using @ syntax for precise context. The existing code serves as the template.',
      },
    ],
    featuresUsed: [
      'Hooks (PreToolUse, PostToolUse, Notification)',
      'MCP Servers (.mcp.json)',
      'Custom commands (.claude/commands/)',
      'Custom skills (.claude/skills/)',
      'Agents and Task tool dispatch',
      '@ file inclusion in prompts',
      '--print headless mode',
      '--allowedTools / --disallowedTools',
      'Plugins for packaging extensions',
    ],
    readyForNext: [
      'Your Claude Code environment is fully customized with hooks, MCP servers, and commands',
      'You dispatch parallel agents and integrate Claude into CI/CD pipelines',
      'You build reusable skills and commands that the whole team uses',
      'You can explain the permission model, hook lifecycle, and MCP architecture to others',
    ],
  },
  {
    id: 'expert',
    tier: 4,
    title: 'Expert',
    subtitle: 'Architect & Multiplier',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    icon: '👑',
    description:
      'You don\'t just use Claude Code — you design systems around it. You build plugins that your team installs, create agent libraries for common workflows, and architect multi-agent pipelines that handle entire development lifecycles. You understand the Claude Code SDK, extend it programmatically, and teach others to be more effective with it.',
    skills: [
      'Build and distribute plugins that package commands, agents, skills, hooks, and MCP configs',
      'Design multi-agent pipelines: planner → implementer → reviewer → deployer',
      'Use the Claude Code SDK (@anthropic-ai/claude-code) for programmatic integration',
      'Create CLAUDE.md templates that scale across teams and organizations',
      'Architect CI/CD pipelines with Claude Code as a first-class participant',
      'Build MCP servers that expose custom domain-specific tools to Claude',
      'Design skill libraries with progressive disclosure for different experience levels',
      'Run Claude Code as an MCP server to expose its capabilities to other tools',
      'Implement cost monitoring and optimization strategies for team-wide Claude usage',
      'Create onboarding systems that teach new team members through interactive Claude workflows',
    ],
    examplePrompts: [
      {
        prompt: 'Design a plugin that packages our entire release workflow: a /release command, a pre-deploy security audit agent, a changelog generator skill, and a PostToolUse hook that runs the test suite. Structure it for distribution via our internal npm registry.',
        why: 'Plugin architecture design — packaging an entire workflow as a distributable unit that the team installs with one command.',
      },
      {
        prompt: 'Implement a multi-stage CI pipeline: Claude reviews the PR diff for security issues, generates missing test cases, and if all checks pass, drafts the release notes. Use --print with --output-format json at each stage and pass results forward.',
        why: 'CI pipeline architecture using Claude as a programmable pipeline participant with structured I/O between stages.',
      },
      {
        prompt: 'Build an MCP server that exposes our internal feature flag system as tools Claude can call. It should support reading flag states, toggling flags in staging, and listing flags by service.',
        why: 'Extending Claude\'s capabilities by building custom MCP servers for domain-specific tools.',
      },
    ],
    featuresUsed: [
      'Plugin development and distribution',
      'Claude Code SDK for programmatic use',
      'Custom MCP server development',
      'claude mcp serve (Claude as MCP server)',
      'Multi-agent pipeline orchestration',
      '--print + --output-format json for CI',
      'Organization-wide CLAUDE.md templates',
      'Cost optimization and monitoring',
      'Team onboarding automation',
      'Agent library design',
    ],
    readyForNext: [
      'There is no next level — you\'re contributing to the Claude Code ecosystem itself',
      'You\'re building tools, plugins, and workflows that other people use',
      'You\'re teaching others and shaping how your organization uses Claude Code',
      'You understand the internals well enough to file feature requests and contribute feedback',
    ],
  },
];
