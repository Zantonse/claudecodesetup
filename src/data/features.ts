import { Feature } from '@/lib/types';

export const features: Feature[] = [
  {
    id: 'hooks',
    title: 'Hooks',
    slug: 'hooks',
    icon: '🪝',
    summary: 'Event-driven automation that intercepts tool calls to enforce rules, run scripts, and trigger side effects.',
    description:
      'Hooks let you attach shell commands or AI prompts to lifecycle events in Claude Code — PreToolUse, PostToolUse, Notification, and Stop. They run automatically whenever Claude attempts a matching tool call, giving you a programmable layer between Claude and your filesystem. Use them to prevent dangerous operations, enforce coding standards, or log every action Claude takes.',
    keyPoints: [
      'Four hook types: PreToolUse, PostToolUse, Notification, and Stop',
      'Matchers use regex patterns to filter which tools trigger a hook',
      'PreToolUse hooks can approve, reject, or modify a tool call before it executes',
      'PostToolUse hooks run after execution and can trigger follow-up actions',
      'Hooks are defined in hooks.json in your .claude directory',
      'Hooks can run shell commands or send prompts back to Claude',
    ],
    codeExamples: [
      {
        title: 'File Protection Hook',
        language: 'json',
        code: `{
  "hooks": [
    {
      "type": "PreToolUse",
      "matcher": "Write|Edit|MultiEdit",
      "action": {
        "type": "shell",
        "command": "if echo '$TOOL_INPUT' | grep -q 'package.json'; then echo 'REJECT: Do not modify package.json directly'; exit 1; fi"
      }
    }
  ]
}`,
        description: 'Prevents Claude from modifying package.json directly, enforcing that dependency changes go through a PR review.',
      },
      {
        title: 'Auto-Format on Save',
        language: 'json',
        code: `{
  "hooks": [
    {
      "type": "PostToolUse",
      "matcher": "Write|Edit",
      "action": {
        "type": "shell",
        "command": "FILE=$(echo '$TOOL_INPUT' | jq -r '.path'); npx prettier --write \"$FILE\" 2>/dev/null || true"
      }
    }
  ]
}`,
        description: 'Runs Prettier automatically on every file Claude writes or edits, keeping code formatted without a separate manual step.',
      },
      {
        title: 'MCP Tool Monitoring',
        language: 'json',
        code: `{
  "hooks": [
    {
      "type": "PostToolUse",
      "matcher": "mcp__.*",
      "action": {
        "type": "shell",
        "command": "echo \"$(date -u +%Y-%m-%dT%H:%M:%SZ) MCP: $TOOL_NAME\" >> ~/.claude/mcp-audit.log"
      }
    }
  ]
}`,
        description: 'Logs every MCP tool invocation to an audit file so you can review what external services Claude accessed during a session.',
      },
      {
        title: 'Notification Hook',
        language: 'json',
        code: `{
  "hooks": [
    {
      "type": "Notification",
      "action": {
        "type": "shell",
        "command": "osascript -e 'display notification \"Claude needs your attention\" with title \"Claude Code\"'"
      }
    }
  ]
}`,
        description: 'Sends a macOS system notification whenever Claude is waiting for user input, so you can step away and be alerted when action is needed.',
      },
      {
        title: 'Security Validation Hook',
        language: 'json',
        code: `{
  "hooks": [
    {
      "type": "PreToolUse",
      "matcher": "Bash",
      "action": {
        "type": "prompt",
        "prompt": "Check if this bash command is safe to run. If it deletes files, exports secrets, or makes network requests to unknown hosts, respond with REJECT followed by the reason. Otherwise respond with APPROVE."
      }
    }
  ]
}`,
        description: 'Uses an AI prompt hook to review every Bash command before execution, catching potentially dangerous operations with a second layer of judgment.',
      },
    ],
    useCases: [
      'Prevent accidental deletion of critical files or directories',
      'Auto-lint and format code after every write operation',
      'Audit all external API or MCP calls for security compliance',
      'Notify a Slack channel when a long-running Claude task completes',
      'Enforce commit message conventions before every git commit',
    ],
    tips: [
      'Use specific regex matchers rather than broad wildcards to avoid hook fatigue on irrelevant tool calls',
      'Prompt hooks receive full tool context and can inject additional instructions back into Claude\'s reasoning',
      'Test hooks in isolation by running the shell command manually with representative TOOL_INPUT values',
      'Chain PostToolUse hooks with git commands to create automatic checkpoints after major file changes',
    ],
  },

  {
    id: 'skills',
    title: 'Skills',
    slug: 'skills',
    icon: '🎯',
    summary: 'Reusable agent instructions loaded on-demand to guide Claude through specialized tasks and methodologies.',
    description:
      'Skills are SKILL.md files stored in named subdirectories under .claude/skills/. When Claude invokes a skill by name, it loads the full markdown content as additional context for its current task. Skills support frontmatter for trigger conditions and metadata, enabling progressive disclosure — simple tasks get a short prompt, complex ones unlock detailed step-by-step methodology.',
    keyPoints: [
      'Skills are SKILL.md files in .claude/skills/<name>/ subdirectories',
      'Frontmatter defines trigger conditions, descriptions, and metadata',
      'Loaded on-demand so they only consume context when needed',
      'Can reference external files and code examples inline',
      'Support rigid (prescriptive) and flexible (advisory) instruction styles',
      'Invoked explicitly with /skill <name> or triggered automatically by Claude',
    ],
    codeExamples: [
      {
        title: 'TDD Skill Definition',
        language: 'markdown',
        code: `---
name: tdd
description: Test-Driven Development workflow
triggers:
  - "write tests"
  - "TDD"
  - "test first"
---

# TDD Methodology

Follow this strict order for every feature:

1. **Red** — Write a failing test that describes the desired behavior
2. **Green** — Write the minimal code to make the test pass
3. **Refactor** — Improve the code without changing its behavior

## Rules
- Never write production code before a failing test exists
- Each cycle should take < 5 minutes
- Commit after each Green phase`,
        description: 'A skill that enforces the Red-Green-Refactor cycle for test-driven development, loaded whenever Claude is asked to write tests.',
      },
      {
        title: 'Code Review Skill',
        language: 'markdown',
        code: `---
name: code-review
description: Systematic code review checklist
---

# Code Review Checklist

For every diff, check in this order:

## Correctness
- [ ] Logic matches the requirements
- [ ] Edge cases are handled
- [ ] No off-by-one errors

## Security
- [ ] No secrets hardcoded
- [ ] Inputs are validated
- [ ] SQL/shell injection prevented

## Performance
- [ ] No N+1 queries
- [ ] Expensive ops are cached

## Style
- [ ] Naming is clear and consistent
- [ ] No dead code`,
        description: 'Provides a structured checklist Claude follows when reviewing code, ensuring nothing critical is missed.',
      },
      {
        title: 'Skill Invocation',
        language: 'bash',
        code: `# Invoke a skill explicitly
/skill tdd

# Claude will automatically trigger skills whose
# trigger conditions match your message
"Let's do TDD to implement the new auth module"

# List available skills
/skill list`,
        description: 'Skills can be triggered manually with a slash command or automatically when Claude detects matching keywords in your messages.',
      },
    ],
    useCases: [
      'Enforce TDD methodology across all feature development sessions',
      'Load project-specific debugging procedures for known problem areas',
      'Apply a security review checklist before every PR submission',
      'Guide new team members through deployment procedures step by step',
      'Activate domain-specific conventions when working in specialized codebases',
    ],
    tips: [
      'Keep each skill focused on one methodology — avoid combining unrelated workflows in a single file',
      'Use progressive disclosure: start with the minimal steps and add detail as conditional sections',
      'Test your trigger conditions with representative prompts to avoid false positives',
      'Version skills in git alongside your code so the team always uses the same methodology',
    ],
  },

  {
    id: 'mcp-servers',
    title: 'MCP Servers',
    slug: 'mcp-servers',
    icon: '🔌',
    summary: 'Extend Claude with external tools and services through the standardized Model Context Protocol.',
    description:
      'MCP (Model Context Protocol) servers expose tools, resources, and prompts to Claude Code over a standardized interface. Servers connect via stdio (local process) or SSE (HTTP stream) and are configured in .mcp.json at the project or user level. Claude Code can also act as an MCP server itself, exposing its file editing and Bash execution capabilities to other MCP-compatible clients.',
    keyPoints: [
      'Configured in .mcp.json at project root or ~/.claude/.mcp.json for user-wide servers',
      'Supports stdio transport (local subprocess) and SSE transport (remote HTTP)',
      'Each server exposes a set of named tools Claude can call like any built-in tool',
      'Claude Code itself can serve as an MCP server for other clients',
      'Use /mcp to list connected servers and their available tools',
      'Project-level .mcp.json is committed to git so the whole team shares the same tools',
    ],
    codeExamples: [
      {
        title: 'Project .mcp.json Configuration',
        language: 'json',
        code: `{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost:5432/mydb"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "\${GITHUB_TOKEN}"
      }
    }
  }
}`,
        description: 'Connects Claude to a local PostgreSQL database and the GitHub API, giving it tools to query data and manage issues without leaving the terminal.',
      },
      {
        title: 'Claude as MCP Server',
        language: 'json',
        code: `{
  "mcpServers": {
    "claude-code": {
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}`,
        description: 'Starts Claude Code as an MCP server, exposing file editing, Bash execution, and search tools to any MCP-compatible client application.',
      },
      {
        title: 'SSE Transport Configuration',
        language: 'json',
        code: `{
  "mcpServers": {
    "remote-api": {
      "transport": "sse",
      "url": "https://api.example.com/mcp/sse",
      "headers": {
        "Authorization": "Bearer \${API_KEY}"
      }
    }
  }
}`,
        description: 'Connects to a remote MCP server over HTTP/SSE, useful for shared team services or SaaS integrations that cannot run locally.',
      },
      {
        title: 'Figma MCP Integration',
        language: 'json',
        code: `{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "\${FIGMA_ACCESS_TOKEN}",
        "FIGMA_FILE_ID": "your-file-id"
      }
    }
  }
}`,
        description: 'Gives Claude access to Figma designs so it can read component names, styles, and layout information directly when writing front-end code.',
      },
    ],
    useCases: [
      'Query a production database to understand real data shapes when writing migrations',
      'Create GitHub issues and pull requests directly from the Claude terminal session',
      'Read Figma design tokens and component specs when implementing UI features',
      'Send Slack notifications when a long-running task completes',
      'Interact with a Jira board to link commits to tickets automatically',
    ],
    tips: [
      'Commit .mcp.json to your repository so every team member gets the same tool integrations automatically',
      'Run /mcp in Claude to verify all configured servers have connected successfully before starting work',
      'Use environment variable references like ${VAR} in .mcp.json to avoid committing secrets',
      'Prefer stdio transport for local tools — it is more reliable than SSE for development workflows',
    ],
  },

  {
    id: 'commands',
    title: 'Commands',
    slug: 'commands',
    icon: '⚡',
    summary: 'Slash commands — both built-in and custom — that trigger structured prompts and workflows instantly.',
    description:
      'Claude Code ships with a set of built-in slash commands for session management, configuration, and utilities. You can extend these with custom commands stored as markdown files in .claude/commands/. Custom commands support frontmatter for metadata, can accept arguments, and can reference file contents inline using @file syntax.',
    keyPoints: [
      'Custom commands are .md files stored in .claude/commands/',
      'Frontmatter supports description, arguments, and metadata fields',
      'Commands can embed file contents with @file references',
      'Built-in commands cover session control, config, and diagnostics',
      'Arguments are passed as $1, $2, or named placeholders in the markdown',
      'Commands are listed and searchable with /help',
    ],
    codeExamples: [
      {
        title: 'Custom Deploy Command',
        language: 'markdown',
        code: `---
description: Run pre-deploy checks and deploy to the specified environment
arguments:
  - name: environment
    description: Target environment (staging | production)
    required: true
---

# Deploy to $1

Before deploying, run these checks in order:

1. Run \`npm test\` and confirm all tests pass
2. Run \`npm run lint\` and fix any errors
3. Check that \`CHANGELOG.md\` has an entry for this release
4. Run \`npm run build\` to verify the production build succeeds

Then deploy with:
\`\`\`bash
./scripts/deploy.sh $1
\`\`\`

Confirm the deployment URL and check the health endpoint.`,
        description: 'A custom /deploy command that prompts Claude to run a pre-deploy checklist and then execute the deploy script for the given environment.',
      },
      {
        title: 'Onboarding Command',
        language: 'markdown',
        code: `---
description: Walk a new developer through project setup
---

# New Developer Onboarding

Read the following files first to understand the project:
- @README.md
- @CONTRIBUTING.md
- @.claude/CLAUDE.md

Then guide the developer through:
1. Installing dependencies with \`npm install\`
2. Copying \`.env.example\` to \`.env\` and filling in values
3. Running \`npm run dev\` to start the development server
4. Running the test suite to verify everything works`,
        description: 'Packages the full onboarding flow into a single command, loading relevant docs automatically so Claude has full context.',
      },
      {
        title: 'Built-in Commands Reference',
        language: 'bash',
        code: `# Session management
/clear          # Start a fresh conversation
/compact        # Summarize context to save tokens
/cost           # Show token usage and estimated cost

# Configuration
/model          # Switch the active Claude model
/memory         # View and edit CLAUDE.md memory
/permissions    # Manage tool allow/deny lists

# Utilities
/doctor         # Diagnose configuration issues
/review         # Request a code review of staged changes
/status         # Show current session status
/terminal-setup # Configure terminal for optimal experience
/vim            # Enable vim keybindings`,
        description: 'A reference of the most commonly used built-in commands for session control, configuration, and project utilities.',
      },
    ],
    useCases: [
      'Standardize deployment procedures across the team with a single /deploy command',
      'Automate new-hire onboarding with a /setup command that walks through every step',
      'Create environment-specific test commands that set correct flags and env vars',
      'Build a /release command that bumps the version, updates the changelog, and tags git',
      'Share project-specific debugging workflows so every engineer uses the same approach',
    ],
    tips: [
      'Keep each command focused on a single workflow — commands that try to do too much become hard to maintain',
      'Use descriptive names that match how your team talks about the task (e.g., /release, /hotfix, /review-pr)',
      'Document expected argument formats in the frontmatter so /help shows useful descriptions',
      'Reference your CLAUDE.md inside commands to inherit project-level context automatically',
    ],
  },

  {
    id: 'agents',
    title: 'Agents',
    slug: 'agents',
    icon: '🤖',
    summary: 'Autonomous agent definitions that run focused sub-tasks in isolated contexts with their own tool access.',
    description:
      'Agents in Claude Code are markdown definitions that describe a specialized role with specific tools and instructions. They run as subagents with a fresh context window, making them ideal for parallel tasks, exploratory research, or operations you want isolated from the main conversation. Agents can be dispatched programmatically via the Task tool or invoked with built-in agent types like Explore and Plan.',
    keyPoints: [
      'Agent definitions are .md files in .claude/agents/ with frontmatter for tools and metadata',
      'Each agent invocation starts with a fresh context window — no memory of parent session',
      'Agents can use a specific subset of tools defined in the frontmatter allowed_tools field',
      'The Task tool dispatches agents programmatically for parallel or sub-task execution',
      'Built-in agent types include Bash, Explore, Plan, and code-reviewer',
      'Completed agents return their output to the parent session; they can also be resumed',
    ],
    codeExamples: [
      {
        title: 'Custom Agent Definition',
        language: 'markdown',
        code: `---
name: dependency-auditor
description: Audits npm dependencies for security vulnerabilities and outdated packages
allowed_tools:
  - Bash
  - Read
  - Write
max_turns: 10
---

# Dependency Audit Agent

Your job is to audit the npm dependencies in this project.

## Steps
1. Run \`npm audit\` and capture the output
2. Run \`npm outdated\` to find packages with available updates
3. Categorize issues by severity: critical, high, medium, low
4. Write a report to \`audit-report.md\` with findings and recommended actions
5. For critical vulnerabilities, attempt \`npm audit fix\` automatically

Focus only on security and version issues. Do not modify application code.`,
        description: 'An agent that autonomously audits npm dependencies and writes a report — isolated so it cannot accidentally modify application files.',
      },
      {
        title: 'Dispatching via Task Tool',
        language: 'typescript',
        code: `// In a Claude Code session or hook, dispatch multiple agents in parallel
const results = await Promise.all([
  Task({
    agent: 'dependency-auditor',
    prompt: 'Audit the dependencies in /src/package.json',
  }),
  Task({
    agent: 'code-reviewer',
    prompt: 'Review the diff in /src/auth/ for security issues',
  }),
  Task({
    agent: 'test-generator',
    prompt: 'Write unit tests for /src/utils/validation.ts',
  }),
]);`,
        description: 'Uses the Task tool to dispatch three specialized agents in parallel, dramatically reducing the time for a full pre-release quality check.',
      },
      {
        title: 'Explore Agent Usage',
        language: 'bash',
        code: `# Use the built-in Explore agent to understand a codebase
"Use the explore agent to map out the authentication flow
in this application and explain how sessions are managed"

# Use Plan agent before making large changes
"Use the plan agent to create a migration strategy for
moving from REST to GraphQL without breaking existing clients"

# Dispatch a code reviewer
"Use the code-reviewer agent to review my staged changes"`,
        description: 'Built-in agents provide specialized reasoning modes — Explore for codebase understanding, Plan for strategy, code-reviewer for quality checks.',
      },
    ],
    useCases: [
      'Run security audit, test generation, and documentation in parallel after a feature is complete',
      'Use the Explore agent to onboard quickly to an unfamiliar codebase',
      'Isolate dangerous refactoring operations so they cannot affect the main conversation state',
      'Dispatch a Plan agent before any large architectural change to get a structured approach',
      'Create specialized agents for domain-specific tasks like database migration or API versioning',
    ],
    tips: [
      'Use the allowed_tools restriction to prevent agents from taking actions outside their defined scope',
      'Keep agent prompts specific — vague instructions lead to agents that wander and consume excess turns',
      'Set an appropriate max_turns limit to prevent runaway agents on tasks that should be quick',
      'Use parallel agent dispatch via Promise.all for independent tasks to cut total execution time significantly',
    ],
  },

  {
    id: 'plugins',
    title: 'Plugins',
    slug: 'plugins',
    icon: '📦',
    summary: 'Shareable extension packages that bundle commands, agents, skills, hooks, and MCP servers into a distributable unit.',
    description:
      'Plugins let you package multiple Claude Code extensions — commands, agents, skills, hooks, and MCP server configurations — into a single distributable directory. A plugin.json manifest describes the package and Claude Code discovers its components automatically. Plugins can be shared via the marketplace, distributed as git repositories, or committed directly into a project.',
    keyPoints: [
      'Plugins are directories with a .claude-plugin/plugin.json manifest',
      'A single plugin can contain commands, agents, skills, hooks, and MCP config',
      'Claude Code auto-discovers all plugin components on startup',
      'Supports semantic versioning for dependency management',
      'Can be installed from the marketplace, a git URL, or a local path',
      'README.md in the plugin root provides documentation surfaced in /help',
    ],
    codeExamples: [
      {
        title: 'plugin.json Manifest',
        language: 'json',
        code: `{
  "name": "@myorg/react-workflow",
  "version": "1.2.0",
  "description": "Complete React development workflow with TDD, review, and deploy",
  "author": "My Org",
  "license": "MIT",
  "engines": {
    "claude-code": ">=1.0.0"
  },
  "components": {
    "commands": ["commands/"],
    "agents": ["agents/"],
    "skills": ["skills/"],
    "hooks": "hooks.json",
    "mcp": ".mcp.json"
  },
  "repository": "https://github.com/myorg/react-workflow-plugin"
}`,
        description: 'The manifest file that describes a plugin, declares its components, and specifies version compatibility with Claude Code.',
      },
      {
        title: 'Plugin Directory Structure',
        language: 'bash',
        code: `.claude-plugin/
├── plugin.json          # Manifest
├── README.md            # Documentation
├── commands/
│   ├── test.md          # /test command
│   ├── review.md        # /review command
│   └── deploy.md        # /deploy command
├── agents/
│   ├── code-reviewer.md
│   └── test-generator.md
├── skills/
│   └── tdd/
│       └── SKILL.md
├── hooks.json           # Hook definitions
└── .mcp.json            # MCP server config`,
        description: 'The recommended directory structure for a plugin that bundles a complete development workflow for a React project.',
      },
      {
        title: 'Installing a Plugin',
        language: 'bash',
        code: `# Install from the marketplace
claude plugin install @myorg/react-workflow

# Install from a git repository
claude plugin install https://github.com/myorg/react-workflow-plugin

# Install from a local directory
claude plugin install ./my-local-plugin

# List installed plugins
claude plugin list

# Remove a plugin
claude plugin remove @myorg/react-workflow`,
        description: 'Plugin management commands for installing, listing, and removing plugins from your Claude Code environment.',
      },
    ],
    useCases: [
      'Package your team\'s entire development workflow and share it as a single install command',
      'Distribute specialized tooling for a framework (e.g., Django, Rails) to the community marketplace',
      'Standardize Claude Code configuration across a large engineering organization via a central plugin',
      'Create client-project-specific plugins that include all relevant commands and MCP integrations',
    ],
    tips: [
      'Follow directory naming conventions exactly — Claude Code\'s auto-discovery depends on them',
      'Include a thorough README.md so /help surfaces useful documentation for each component',
      'Test all plugin components independently before packaging to catch configuration errors early',
      'Use semantic versioning and document breaking changes in a CHANGELOG so users can upgrade safely',
    ],
  },

  {
    id: 'settings',
    title: 'Settings',
    slug: 'settings',
    icon: '⚙️',
    summary: 'Cascading configuration through CLAUDE.md memory files and settings.json for persistent, context-aware behavior.',
    description:
      'Claude Code reads configuration from three CLAUDE.md locations: global (~/.claude/CLAUDE.md), project (./CLAUDE.md), and local (.claude/CLAUDE.md). Settings cascade from global to local, with more specific files taking precedence. The permission system in settings.json controls which tool categories Claude can use, giving you fine-grained control over automation scope.',
    keyPoints: [
      'Global CLAUDE.md at ~/.claude/CLAUDE.md applies to every project',
      'Project CLAUDE.md at ./CLAUDE.md provides project-specific instructions',
      'Local .claude/CLAUDE.md overrides both for team-specific or personal adjustments',
      'Settings cascade: global < project < local, with local having highest precedence',
      'settings.json controls tool permissions with allow and deny lists per category',
      'CLAUDE.md supports markdown formatting, headings, and code blocks for structured instructions',
    ],
    codeExamples: [
      {
        title: 'Project CLAUDE.md',
        language: 'markdown',
        code: `# Project Guidelines

## Tech Stack
- Next.js 15 with App Router
- TypeScript (strict mode enabled)
- Tailwind CSS for styling
- Prisma ORM with PostgreSQL

## Coding Standards
- Use named exports, never default exports for components
- All API routes must validate input with Zod schemas
- Write tests for every new utility function in \`src/lib/\`
- Never commit \`.env\` files — use \`.env.example\` as template

## Git Conventions
- Commit messages follow Conventional Commits: feat:, fix:, chore:
- Branch names: feature/description, fix/issue-number
- Always create a PR — never push directly to main

## Do Not
- Modify \`package.json\` without discussing dependency changes
- Change \`tailwind.config.ts\` without a design review`,
        description: 'A comprehensive project CLAUDE.md that gives Claude persistent context about the tech stack, coding standards, and team conventions.',
      },
      {
        title: '.claude/settings.json Permissions',
        language: 'json',
        code: `{
  "permissions": {
    "allow": [
      "Read",
      "Write",
      "Edit",
      "Bash(npm *)",
      "Bash(git *)",
      "Bash(npx prettier *)",
      "Bash(npx eslint *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Bash(wget *)",
      "WebFetch"
    ]
  },
  "model": "claude-sonnet-4-6",
  "maxTokens": 8096
}`,
        description: 'Restricts Claude to safe file operations and common dev commands while blocking network requests and destructive shell operations.',
      },
      {
        title: 'Global CLAUDE.md',
        language: 'markdown',
        code: `# Global Guidelines

## My Preferences
- I prefer TypeScript over JavaScript
- Use 2-space indentation for all languages
- Prefer functional patterns over class-based code
- Always add JSDoc comments to exported functions

## Memory Management
- Every URL.createObjectURL() needs a matching revokeObjectURL()
- Wrap JSON.parse() in try/catch for external data
- Use useMemo for expensive derived state in React

## Communication Style
- Be concise — avoid unnecessary explanations
- Show code, not just descriptions
- Ask clarifying questions before large refactors`,
        description: 'A global CLAUDE.md that sets personal preferences applying to every project, ensuring consistent behavior without repeating instructions.',
      },
    ],
    useCases: [
      'Encode team coding standards in CLAUDE.md so Claude never needs to be reminded of them',
      'Restrict tool permissions to safe operations for junior engineers or CI environments',
      'Set global personal preferences once and have them apply across all projects automatically',
      'Document project architecture context so Claude understands the system without re-explanation',
    ],
    tips: [
      'Keep CLAUDE.md concise — verbose files waste context tokens; use bullet points and headings',
      'Use the "Do Not" section for constraints that matter most — Claude takes explicit prohibitions seriously',
      'Review and update CLAUDE.md as the project evolves so Claude\'s context stays accurate',
      'Combine settings.json permissions with hooks for defense-in-depth on critical operations',
    ],
  },

  {
    id: 'ide-integrations',
    title: 'IDE Integrations',
    slug: 'ide-integrations',
    icon: '🖥️',
    summary: 'Native extensions for VS Code and JetBrains IDEs that bring Claude Code capabilities into your editor UI.',
    description:
      'Claude Code integrates with VS Code via an official extension that adds inline suggestions, a sidebar panel, and keyboard shortcuts mapped directly to common Claude Code commands. JetBrains IDEs (IntelliJ, PyCharm, WebStorm) get a similar sidebar panel plugin. Both integrations are optional — Claude Code works in any terminal without an IDE extension.',
    keyPoints: [
      'VS Code extension adds inline diff view, sidebar chat, and editor-aware context',
      'JetBrains plugin provides a sidebar panel in IntelliJ, PyCharm, WebStorm, and others',
      'Terminal integration via /terminal-setup configures shell completions and keybindings',
      'Works in any terminal emulator without any IDE-specific setup',
      'VS Code extension can open diffs inline so you review changes without switching windows',
      'Keyboard shortcuts in both IDEs map to common Claude Code actions for faster workflows',
    ],
    codeExamples: [
      {
        title: 'VS Code Settings',
        language: 'json',
        code: `{
  "claude-code.modelId": "claude-sonnet-4-6",
  "claude-code.enableInlineSuggestions": true,
  "claude-code.autoOpenDiff": true,
  "claude-code.diffViewMode": "inline",
  "claude-code.terminalIntegration": true,
  "claude-code.keybindings.openPanel": "ctrl+shift+a",
  "claude-code.keybindings.acceptSuggestion": "tab",
  "claude-code.keybindings.rejectSuggestion": "escape"
}`,
        description: 'VS Code settings.json configuration for the Claude Code extension with inline diff view and custom keyboard shortcuts.',
      },
      {
        title: 'Terminal Setup',
        language: 'bash',
        code: `# Run the interactive terminal setup wizard
/terminal-setup

# What it configures:
# - Shell completions for claude commands and flags
# - Aliases: cc (claude), ccc (claude --continue)
# - PS1 indicator showing Claude session status
# - Key bindings for common actions

# Manual shell config additions (zsh example)
export CLAUDE_API_KEY="your-key"
alias cc="claude"
alias ccc="claude --continue"

# Enable completions
source ~/.claude/completions.zsh`,
        description: 'The /terminal-setup command interactively configures your shell for the best Claude Code terminal experience with completions and aliases.',
      },
      {
        title: 'Keyboard Shortcuts Reference',
        language: 'bash',
        code: `# VS Code keyboard shortcuts (after extension install)
Ctrl+Shift+A     # Open Claude Code panel
Ctrl+Shift+C     # Send selected code to Claude
Ctrl+Shift+R     # Run /review on current file
Ctrl+Shift+E     # Explain selected code

# Terminal shortcuts (after /terminal-setup)
Ctrl+R           # Search command history
Tab              # Complete file paths and claude commands
Up/Down          # Navigate command history
Escape           # Interrupt current Claude response`,
        description: 'A reference of keyboard shortcuts available in VS Code after installing the extension and in the terminal after running /terminal-setup.',
      },
    ],
    useCases: [
      'Review Claude\'s file changes inline in VS Code without switching to a separate diff tool',
      'Use the JetBrains sidebar to chat with Claude while keeping your editor in full view',
      'Configure terminal completions so you never have to remember exact flag names',
      'Set up editor-specific keybindings to trigger code review or explanation with a single chord',
    ],
    tips: [
      'Run /terminal-setup first — even without an IDE extension, good terminal config improves the experience significantly',
      'Configure keybindings that match your existing muscle memory to reduce friction',
      'Use the VS Code extension\'s inline diff view for large refactors so you can accept or reject hunks individually',
      'Both IDE extensions and the terminal can be active simultaneously — the session is shared',
    ],
  },
];
