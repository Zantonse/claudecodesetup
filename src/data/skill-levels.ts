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
    subtitle: 'First Steps',
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
      'Use `/clear` to start fresh when the conversation gets confusing',
      'Create a basic CLAUDE.md with your project\'s tech stack',
      'Use `/cost` to monitor token usage and understand spending',
      'Ask Claude to explain code you don\'t understand',
      'Use `--continue` to resume where you left off after closing the terminal',
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
      'Switch models mid-session with `/model` (Sonnet for speed, Opus for complexity)',
      'Configure `.claude/settings.json` with allow/deny permissions',
      'Use `/review` to get structured feedback on staged changes',
      'Break complex tasks into sequential steps and guide Claude through each',
      'Use git workflows with Claude: branch, commit with good messages, create PRs',
      'Write a three-tier CLAUDE.md (global, project, local)',
      'Use `/init` to bootstrap CLAUDE.md for new projects',
      'Set up `/terminal-setup` for completions and aliases',
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
    id: 'competent',
    tier: 3,
    title: 'Competent',
    subtitle: 'Workflow Customizer',
    color: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.3)',
    icon: '🛠',
    description:
      'You\'ve moved beyond using Claude as a chat partner into actively customizing how it operates. You write hooks that enforce code quality automatically, create custom slash commands that encode your team\'s processes, and use the `@` file syntax to inject precise context. The difference from intermediate is that you\'re building reusable automation rather than typing the same prompts repeatedly.',
    skills: [
      'Write PostToolUse hooks that auto-format or lint code after every file change',
      'Create custom slash commands in `.claude/commands/` for team-specific workflows',
      'Use the `@` file inclusion syntax to inject precise context into prompts',
      'Configure PreToolUse hooks to block dangerous operations (e.g., `rm -rf`, modifying package.json)',
      'Build custom skills (SKILL.md) with frontmatter trigger phrases',
      'Use `--print` for non-interactive one-shot tasks and shell scripts',
      'Paste screenshots and images directly for UI debugging and implementation',
      'Use Notification hooks for desktop alerts when Claude needs attention',
      'Use `--allowedTools` to create read-only analysis sessions',
      'Write CLAUDE.md with structured "Do Not" constraints that Claude respects',
    ],
    examplePrompts: [
      {
        prompt: 'Create a PostToolUse hook that runs prettier --write on every file Claude edits, but only for .ts and .tsx files. Add it to .claude/hooks.json.',
        why: 'Building automated quality gates — code is always formatted without ever asking Claude to format it.',
      },
      {
        prompt: 'Create a custom /deploy command that runs the test suite, checks for uncommitted changes, builds the project, and deploys to the environment passed as $1.',
        why: 'Encoding a multi-step workflow as a single command. The team runs /deploy staging instead of remembering the steps.',
      },
      {
        prompt: 'Based on the types in @src/lib/types.ts and the validation patterns in @src/api/middleware/validate.ts, create a Zod schema for the Order entity.',
        why: 'Using @ syntax for precise context injection so Claude sees the exact patterns to follow.',
      },
    ],
    featuresUsed: [
      'Hooks (PostToolUse, PreToolUse, Notification)',
      'Custom commands (.claude/commands/)',
      'Custom skills (.claude/skills/)',
      '@ file inclusion in prompts',
      '--print headless mode',
      '--allowedTools / --disallowedTools',
      'Image pasting for visual context',
      'Structured CLAUDE.md constraints',
    ],
    readyForNext: [
      'You have hooks running on every project that enforce quality automatically',
      'Your team uses custom commands you built for common workflows',
      'You use @ syntax naturally and rarely ask Claude to "read" files',
      'You\'ve built at least one custom skill with trigger phrases',
    ],
  },
  {
    id: 'advanced',
    tier: 4,
    title: 'Advanced',
    subtitle: 'Multi-Agent Power User',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    icon: '🔮',
    description:
      'You think beyond single-session workflows. You connect Claude to external services via MCP servers, dispatch parallel subagents for independent tasks, and integrate Claude into CI/CD pipelines. The defining skill at this level is orchestration — you decompose complex work into independent pieces and let multiple agents handle them simultaneously.',
    skills: [
      'Configure MCP servers to connect Claude to databases, GitHub, Figma, Jira, etc.',
      'Dispatch parallel subagents via the Task tool for independent tasks',
      'Write custom agent definitions in `.claude/agents/` with restricted tool access',
      'Integrate Claude into CI/CD with `--print --output-format json` for structured output',
      'Pipe diffs, logs, and test output to Claude for automated analysis',
      'Use `--resume` to chain multi-stage pipelines across separate invocations',
      'Configure MCP servers with environment variable secrets for team sharing',
      'Use `--dangerously-skip-permissions` safely in sandboxed CI environments',
      'Build agents with `max_turns` limits and `allowed_tools` restrictions',
      'Design prompt chains where one Claude invocation feeds into the next',
    ],
    examplePrompts: [
      {
        prompt: 'Dispatch three parallel agents: one to audit dependencies for CVEs, one to generate missing tests for src/api/, and one to update the API documentation. Compile the results into a single report.',
        why: 'Multi-agent orchestration. Decomposing work into parallel independent tasks and aggregating results.',
      },
      {
        prompt: 'Configure an MCP server for our PostgreSQL database so Claude can query the schema and sample data when writing migrations. Use DATABASE_URL from the environment.',
        why: 'Connecting Claude to live data sources so it works with real schemas rather than guessing.',
      },
      {
        prompt: 'Set up a GitHub Actions workflow that uses claude --print to review every PR diff for security issues and post the findings as a PR comment.',
        why: 'CI integration — Claude as an automated code reviewer that runs on every pull request.',
      },
    ],
    featuresUsed: [
      'MCP Servers (.mcp.json)',
      'Agent definitions (.claude/agents/)',
      'Task tool for parallel agent dispatch',
      '--print + --output-format json',
      '--resume for multi-stage pipelines',
      '--dangerously-skip-permissions for CI',
      'GitHub Actions / CI integration',
      'Pipe input (git diff | claude)',
      'Environment variable MCP secrets',
    ],
    readyForNext: [
      'You run multi-agent workflows with parallel dispatch regularly',
      'Claude is integrated into your CI/CD pipeline as a first-class participant',
      'You have MCP servers configured for databases, GitHub, and other key services',
      'You design agent definitions with appropriate tool restrictions and turn limits',
    ],
  },
  {
    id: 'virtuoso',
    tier: 5,
    title: 'Virtuoso',
    subtitle: 'Systems Builder',
    color: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.3)',
    icon: '🎯',
    description:
      'You build the systems that other people use. You package your team\'s entire workflow into plugins, design multi-stage agent pipelines (planner → implementer → reviewer), and use the Claude Code SDK to embed Claude programmatically into custom tools. You understand how all the pieces compose together and can design complex autonomous workflows with appropriate safety guardrails.',
    skills: [
      'Build and distribute plugins that bundle commands, agents, skills, hooks, and MCP configs',
      'Design multi-stage agent pipelines: planner → implementer → reviewer → deployer',
      'Use the Claude Code SDK (`@anthropic-ai/claude-code`) for programmatic integration',
      'Build plugins with `plugin.json` manifests and semantic versioning',
      'Create skill libraries with progressive disclosure for different experience levels',
      'Design agent-to-agent communication patterns with structured output handoff',
      'Run Claude Code as an MCP server (`claude mcp serve`) to expose its tools to other clients',
      'Implement cost monitoring and token budgeting across teams',
      'Write integration tests for hooks, skills, and custom commands',
      'Create CLAUDE.md templates that scale across an organization',
    ],
    examplePrompts: [
      {
        prompt: 'Design a plugin that packages our entire release workflow: a /release command, a pre-deploy security audit agent, a changelog generator skill, and a PostToolUse hook that runs the test suite. Structure it for distribution via our internal npm registry.',
        why: 'Plugin architecture — packaging an entire workflow as a single installable unit.',
      },
      {
        prompt: 'Build a three-stage pipeline using the Claude Code SDK: stage 1 analyzes the PR and outputs a JSON review, stage 2 generates fix suggestions for critical issues, stage 3 applies fixes and creates a follow-up commit. Handle failures at each stage gracefully.',
        why: 'Programmatic multi-stage orchestration using the SDK with structured error handling.',
      },
      {
        prompt: 'Create a skill library with three tiers: a junior-dev skill that enforces strict TDD and frequent commits, a senior-dev skill that allows more autonomy with spot checks, and a maintenance-mode skill that prioritizes backwards compatibility. Each should have trigger phrases.',
        why: 'Designing progressive skill systems that adapt Claude\'s behavior to the user\'s experience level.',
      },
    ],
    featuresUsed: [
      'Plugin development (plugin.json)',
      'Claude Code SDK (@anthropic-ai/claude-code)',
      'claude mcp serve (Claude as MCP server)',
      'Multi-stage agent pipelines',
      'Structured JSON output for agent handoff',
      'Plugin distribution (marketplace, git, local)',
      'Skill library design',
      'Cost monitoring and budgeting',
      'Integration testing for extensions',
      'Org-wide CLAUDE.md templates',
    ],
    readyForNext: [
      'Your plugins are installed by teams beyond your own',
      'You\'ve built SDK integrations that run in production',
      'You design multi-stage pipelines with proper error handling and fallbacks',
      'Other engineers come to you for guidance on Claude Code architecture',
    ],
  },
  {
    id: 'expert',
    tier: 6,
    title: 'Expert',
    subtitle: 'Ecosystem Architect',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    icon: '👑',
    description:
      'You shape how Claude Code is used at the organizational level and beyond. You build custom MCP servers that expose domain-specific tools, architect enterprise-wide plugin ecosystems, design autonomous agent teams that handle entire development workflows, and contribute to the Claude Code community. You understand not just how to use every feature — but how they compose into systems that multiply an entire team\'s capabilities.',
    skills: [
      'Build custom MCP servers that expose domain-specific tools to Claude',
      'Architect enterprise plugin ecosystems with versioning, distribution, and governance',
      'Design fully autonomous agent workflows (plan → implement → test → review → deploy)',
      'Create onboarding systems that teach new engineers through interactive Claude sessions',
      'Implement organization-wide cost governance and usage analytics',
      'Build evaluation frameworks for measuring Claude Code effectiveness across teams',
      'Design security policies: permission templates, hook-based guardrails, audit logging',
      'Contribute plugins, skills, or MCP servers to the community ecosystem',
      'Architect hybrid workflows where Claude orchestrates human review at critical checkpoints',
      'Design fallback and retry strategies for production Claude integrations',
    ],
    examplePrompts: [
      {
        prompt: 'Build an MCP server that exposes our internal feature flag system as tools Claude can call. It should support reading flag states, toggling flags in staging, listing flags by service, and audit-logging every change with the requesting session ID.',
        why: 'Custom MCP server development — extending Claude\'s capabilities with domain-specific tools and audit trails.',
      },
      {
        prompt: 'Design an autonomous development pipeline: an architect agent creates the implementation plan, an implementer agent executes each task, a reviewer agent validates against the spec, and a deployer agent handles staging and production pushes. Include human review gates before production.',
        why: 'Full lifecycle automation with appropriate human checkpoints — the highest expression of multi-agent orchestration.',
      },
      {
        prompt: 'Create an enterprise Claude Code governance package: a base plugin with org-wide CLAUDE.md, mandatory hooks for security scanning and secret detection, a pre-configured MCP server for our internal tools, and cost dashboards that report team-level usage.',
        why: 'Organization-scale systems design — standardizing Claude Code behavior across hundreds of engineers.',
      },
    ],
    featuresUsed: [
      'Custom MCP server development',
      'Enterprise plugin ecosystems',
      'Autonomous multi-agent pipelines',
      'Human-in-the-loop checkpoint design',
      'Cost governance and analytics',
      'Security policy architecture',
      'Evaluation and measurement frameworks',
      'Community contributions',
      'Production retry and fallback design',
      'Organization-wide onboarding systems',
    ],
    readyForNext: [
      'There is no next level — you\'re shaping how Claude Code evolves',
      'You\'re building infrastructure that hundreds of engineers depend on',
      'Your MCP servers, plugins, and agent designs are used in production',
      'You contribute back to the Claude Code ecosystem and mentor others at every level',
    ],
  },
];
