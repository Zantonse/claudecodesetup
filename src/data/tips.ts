import { Tip } from '@/lib/types';

export const tips: Tip[] = [
  // ─── Shortcuts ───────────────────────────────────────────────────────────────

  {
    id: 'escape-to-interrupt',
    title: 'Escape to Interrupt',
    content:
      'Press Escape at any time to interrupt Claude mid-response without cancelling the session. This is useful when Claude starts going in the wrong direction and you want to redirect it immediately. The conversation state is preserved so you can provide a correction and continue.',
    category: 'shortcuts',
  },
  {
    id: 'ctrl-c-to-cancel',
    title: 'Ctrl+C to Cancel Tool Execution',
    content:
      'Press Ctrl+C to cancel a tool call or Bash command that Claude is currently running. Unlike Escape, this cancels the active operation — useful when you realize a running command will take too long or produce unwanted side effects.',
    category: 'shortcuts',
  },
  {
    id: 'compact-to-reduce-context',
    title: '/compact to Reduce Context Size',
    content:
      'Run /compact to have Claude summarize the conversation into a compact memory before the context window fills up. This preserves the key decisions and findings from the session without consuming tokens on verbatim message history. Use it proactively before you hit the context limit.',
    category: 'shortcuts',
    codeExample: {
      title: 'When to Use /compact',
      language: 'bash',
      code: `# Check current token usage
/cost

# If approaching the limit, compact the session
/compact

# Claude summarizes all prior context into a brief,
# dense memory and continues with a fresh window`,
    },
  },
  {
    id: 'clear-to-start-fresh',
    title: '/clear to Start a Fresh Session',
    content:
      'Run /clear to wipe the conversation history and start with a completely empty context. This is the right choice when switching to an unrelated task or when the accumulated context is causing Claude to produce confused or inconsistent responses.',
    category: 'shortcuts',
  },
  {
    id: 'tab-completion',
    title: 'Tab Completion for File Paths',
    content:
      'After running /terminal-setup, Claude Code provides tab completion for file paths in the terminal. This speeds up referencing specific files in your prompts and eliminates typos in long directory paths. It also completes claude command flags.',
    category: 'shortcuts',
  },
  {
    id: 'cost-to-check-usage',
    title: '/cost to Monitor Token Usage',
    content:
      'Run /cost at any time to see a breakdown of token usage and estimated API cost for the current session. This helps you understand when to run /compact (before hitting limits) and gives you a sense of the cost-per-task for budgeting purposes.',
    category: 'shortcuts',
    codeExample: {
      title: 'Checking Session Cost',
      language: 'bash',
      code: `# View current session token usage
/cost

# Output example:
# Input tokens:  42,150
# Output tokens: 8,320
# Total cost:    ~$0.18
# Context used:  21% of limit`,
    },
  },

  {
    id: 'continue-and-resume-sessions',
    title: 'Use --continue and --resume to Pick Up Where You Left Off',
    content:
      'Run claude --continue (alias: ccc) to resume your most recent session with full conversation history intact. Use claude --resume <session-id> to resume a specific older session. This lets you close your terminal, take a break, and come back without losing context — especially valuable for multi-day features.',
    category: 'shortcuts',
    codeExample: {
      title: 'Session Continuation',
      language: 'bash',
      code: `# Resume the most recent session
claude --continue
# or use the alias
ccc

# List recent sessions to find a specific one
claude sessions list

# Resume a specific session by ID
claude --resume abc123def`,
    },
  },
  {
    id: 'model-switching-mid-session',
    title: 'Switch Models Mid-Session with /model',
    content:
      'Use /model to switch between Claude models without starting a new session. Start with Sonnet for fast iteration, then switch to Opus for a complex architecture decision, then back to Sonnet for implementation. Your conversation history carries over.',
    category: 'shortcuts',
  },

  // ─── Prompting ───────────────────────────────────────────────────────────────

  {
    id: 'be-specific-about-changes',
    title: 'Be Specific About What You Want Changed',
    content:
      'Vague prompts like "improve this function" lead to unpredictable refactors. Instead, say exactly what should change: "rename the parameter from d to durationMs", "extract the validation logic into a separate function called validateInput", or "add JSDoc to the exported functions". Specific instructions produce targeted changes you can review quickly.',
    category: 'prompting',
  },
  {
    id: 'reference-file-paths-explicitly',
    title: 'Reference File Paths Explicitly',
    content:
      'Say "read src/auth/session.ts" rather than "look at the session code". Explicit paths eliminate ambiguity in codebases with multiple files that share similar names. Claude will read the exact file you mean rather than searching and potentially landing on the wrong one.',
    category: 'prompting',
    codeExample: {
      title: 'Explicit vs Vague File References',
      language: 'bash',
      code: `# Vague — Claude must search and may pick the wrong file
"Look at the user model and tell me how sessions work"

# Explicit — Claude reads exactly what you mean
"Read src/models/User.ts and src/auth/session.ts,
then explain how user sessions are created and validated"`,
    },
  },
  {
    id: 'provide-output-examples',
    title: 'Provide Examples of Desired Output',
    content:
      'When you have a specific format, style, or structure in mind, show Claude an example before asking it to produce output. Examples convey intent far more accurately than descriptions alone, especially for code style, API response shapes, or prose tone.',
    category: 'prompting',
  },
  {
    id: 'break-complex-tasks-into-steps',
    title: 'Break Complex Tasks into Steps',
    content:
      'For large features or multi-file refactors, break the task into an ordered sequence of smaller steps and ask Claude to complete one step at a time. Smaller scopes produce more accurate results, are easier to review, and generate clean commit-sized changesets.',
    category: 'prompting',
  },
  {
    id: 'use-dont-change',
    title: 'Use "Don\'t Change X" to Protect Existing Code',
    content:
      'Explicitly tell Claude what not to touch when you want only targeted changes. "Refactor the validation logic but don\'t change the function signature" or "fix the bug but don\'t add any new dependencies" prevents Claude from making well-intentioned but unwanted modifications to adjacent code.',
    category: 'prompting',
  },
  {
    id: 'read-file-first-for-context',
    title: 'Start with "Read X First" for Context',
    content:
      'When asking Claude to work on code it has not seen in the current session, start your prompt with "Read [file path] first, then...". This ensures Claude\'s response is grounded in the actual current state of the code rather than assumptions from earlier in the conversation.',
    category: 'prompting',
    codeExample: {
      title: 'Loading Context Before a Task',
      language: 'bash',
      code: `# Without context loading — Claude may use stale assumptions
"Add error handling to the database client"

# With explicit context loading — grounded in current code
"Read src/db/client.ts first, then add try/catch error
handling to every public method and throw a typed
DatabaseError with the original error as its cause"`,
    },
  },

  // ─── Performance ─────────────────────────────────────────────────────────────

  {
    id: 'compact-regularly-long-sessions',
    title: 'Run /compact Regularly in Long Sessions',
    content:
      'For sessions lasting more than an hour or covering many topics, run /compact every 30-40 minutes rather than waiting until the context limit is reached. Proactive compaction keeps Claude\'s working memory fresh and prevents the degraded response quality that occurs near the context ceiling.',
    category: 'performance',
  },
  {
    id: 'reference-specific-files',
    title: 'Reference Specific Files Instead of "the Codebase"',
    content:
      'Asking Claude to "understand the codebase" triggers broad file reads that consume large amounts of context. Instead, identify the three to five files most relevant to your task and reference them explicitly. This keeps context usage predictable and responses more focused.',
    category: 'performance',
  },
  {
    id: 'use-claude-md-for-context',
    title: 'Use CLAUDE.md to Avoid Repeating Context',
    content:
      'Project context that you find yourself re-explaining at the start of every session belongs in CLAUDE.md. Tech stack, coding conventions, architecture decisions, and things Claude should never do are all good CLAUDE.md candidates. Claude reads it automatically so you never have to paste it again.',
    category: 'performance',
    codeExample: {
      title: 'CLAUDE.md Context vs Re-Explanation',
      language: 'markdown',
      code: `# Instead of starting every session with:
"We use Next.js 15 with App Router, TypeScript strict mode,
Tailwind CSS, Prisma for the database, and all components
use named exports..."

# Add it to CLAUDE.md once:
## Tech Stack
- Next.js 15 App Router + TypeScript (strict)
- Tailwind CSS, Prisma ORM, PostgreSQL
- Named exports only — no default exports`,
    },
  },
  {
    id: 'limit-tool-permissions',
    title: 'Limit Tool Permissions to Reduce Unnecessary Operations',
    content:
      'When you restrict Claude to only the tools it needs for a task (e.g., Read and Write but not Bash), it cannot attempt tangential operations that waste context and time. Use .claude/settings.json to define a minimal tool set and expand it only when necessary.',
    category: 'performance',
  },
  {
    id: 'use-subagents-for-parallel-tasks',
    title: 'Use Subagents for Independent Parallel Tasks',
    content:
      'When you have multiple independent tasks — audit dependencies, generate tests, and update documentation — dispatch them as parallel subagents via the Task tool instead of running them sequentially. Parallel execution can reduce total wall-clock time by 60-80% for common multi-task workflows.',
    category: 'performance',
    codeExample: {
      title: 'Parallel Agent Dispatch',
      language: 'typescript',
      code: `// Run three independent tasks simultaneously
const [audit, tests, docs] = await Promise.all([
  Task({ agent: 'dependency-auditor', prompt: 'Audit /package.json' }),
  Task({ agent: 'test-generator', prompt: 'Write tests for /src/utils/' }),
  Task({ agent: 'doc-writer', prompt: 'Document /src/api/ endpoints' }),
]);`,
    },
  },

  // ─── Configuration ────────────────────────────────────────────────────────────

  {
    id: 'setup-claude-md-day-one',
    title: 'Set Up Project CLAUDE.md on Day One',
    content:
      'Create a project CLAUDE.md before writing the first line of application code. A CLAUDE.md that documents your tech stack, conventions, and constraints from the start means every Claude session has accurate context immediately, rather than inheriting assumptions from a blank slate.',
    category: 'configuration',
  },
  {
    id: 'use-hooks-for-quality-checks',
    title: 'Use Hooks for Automated Quality Checks',
    content:
      'PostToolUse hooks on Write and Edit operations can automatically run linters, formatters, and security scanners after every file change. This creates a continuous quality gate that catches issues the moment code is written rather than at PR review time.',
    category: 'configuration',
    codeExample: {
      title: 'Auto-Lint Hook',
      language: 'json',
      code: `{
  "hooks": [
    {
      "type": "PostToolUse",
      "matcher": "Write|Edit|MultiEdit",
      "action": {
        "type": "shell",
        "command": "FILE=$(echo '$TOOL_INPUT' | jq -r '.path // .file_path'); [[ $FILE == *.ts || $FILE == *.tsx ]] && npx eslint --fix $FILE 2>/dev/null || true"
      }
    }
  ]
}`,
    },
  },
  {
    id: 'configure-mcp-for-integrations',
    title: 'Configure MCP Servers for External Integrations',
    content:
      'Any external service your team uses regularly — databases, GitHub, Jira, Figma — should be configured as an MCP server in the project .mcp.json. This gives Claude direct access to real data and removes the copy-paste overhead of sharing information manually.',
    category: 'configuration',
  },
  {
    id: 'settings-json-for-preferences',
    title: 'Use .claude/settings.json for Persistent Preferences',
    content:
      'Store your preferred model, max token limits, and permission rules in .claude/settings.json so they apply automatically to every session in that project. This eliminates the need to set preferences with /model or /permissions at the start of each session.',
    category: 'configuration',
    codeExample: {
      title: 'Persistent Session Settings',
      language: 'json',
      code: `{
  "model": "claude-sonnet-4-6",
  "maxTokens": 8096,
  "permissions": {
    "allow": ["Read", "Write", "Edit", "Bash(npm *)", "Bash(git *)"],
    "deny": ["Bash(rm -rf *)", "WebFetch"]
  }
}`,
    },
  },
  {
    id: 'terminal-setup-command',
    title: 'Run /terminal-setup for the Best Terminal Experience',
    content:
      'The /terminal-setup command configures shell completions, aliases (cc for claude, ccc for claude --continue), and a session status indicator in your PS1 prompt. Five minutes of setup pays dividends across every future session.',
    category: 'configuration',
  },

  {
    id: 'writing-effective-claude-md',
    title: 'Write an Effective CLAUDE.md with Three Tiers',
    content:
      'CLAUDE.md files cascade from global to project to local. Put personal preferences (indentation style, language choice) in ~/.claude/CLAUDE.md. Put project standards (tech stack, naming conventions, git workflow) in ./CLAUDE.md at the project root. Put team or environment overrides in .claude/CLAUDE.md. Keep each file concise — bullet points and headings, not paragraphs. Include a "Do Not" section for hard constraints Claude must respect.',
    category: 'configuration',
    codeExample: {
      title: 'Three-Tier CLAUDE.md Strategy',
      language: 'markdown',
      code: `# ~/.claude/CLAUDE.md (global — all projects)
## Preferences
- TypeScript over JavaScript
- 2-space indentation
- Functional patterns over classes

# ./CLAUDE.md (project root — this project)
## Tech Stack
- Next.js 15, Tailwind CSS, Prisma
## Do Not
- Modify package.json without discussion
- Push directly to main

# .claude/CLAUDE.md (local — team/env overrides)
## Testing
- Run \`npm test\` after every file change`,
    },
  },

  // ─── Advanced ─────────────────────────────────────────────────────────────────

  {
    id: 'use-headless-print-mode',
    title: 'Use --print for Non-Interactive Scripting',
    content:
      'The --print flag runs Claude in headless mode: it processes a single prompt and exits with the result. This is the foundation for integrating Claude Code into shell scripts, CI pipelines, and automation tools. Combine with --output-format json for machine-readable output that can be piped to jq or parsed by other scripts.',
    category: 'workflow',
    codeExample: {
      title: 'Headless Mode Examples',
      language: 'bash',
      code: `# Simple one-shot task
claude --print "Explain what this function does" < src/utils/parse.ts

# Pipe a diff for review
git diff HEAD~1 | claude --print "Review this diff for bugs"

# JSON output for scripting
claude --print --output-format json "List all TODO comments in src/"

# Chain with shell tools
claude --print "Generate a migration for adding a user_roles table" > migrations/001_user_roles.sql`,
    },
  },
  {
    id: 'use-init-to-bootstrap-claude-md',
    title: 'Use /init to Auto-Generate CLAUDE.md',
    content:
      'The /init command reads your project structure, dependencies, and configuration files, then generates a starter CLAUDE.md tailored to your project. It is faster and more accurate than writing one from scratch, and it catches patterns you might forget to document (like your test runner, linter config, or build system).',
    category: 'configuration',
    codeExample: {
      title: 'Bootstrapping Project Memory',
      language: 'bash',
      code: `# Generate a starter CLAUDE.md for your project
/init

# Claude reads package.json, tsconfig, .eslintrc, etc.
# and generates sections for:
#   - Tech stack and framework
#   - Build and test commands
#   - Coding conventions detected from config
#   - Project structure overview

# Review and refine the generated file
/memory`,
    },
  },
  {
    id: 'use-at-syntax-for-file-inclusion',
    title: 'Use @ Syntax to Include Files in Prompts',
    content:
      'Prefix a file path with @ to embed its contents directly into your prompt. This is more precise than asking Claude to "read" a file — the content is available immediately in the prompt context. Use it for config files, type definitions, or reference code that Claude needs to see before starting work.',
    category: 'prompting',
    codeExample: {
      title: 'File Inclusion with @',
      language: 'bash',
      code: `# Include a file directly in your prompt
"Based on the types in @src/lib/types.ts, write a
validation function for the User interface"

# Include multiple reference files
"Using the patterns in @src/api/users.ts, create a
similar endpoint for @src/lib/types.ts#Order"

# Include a config file for context
"Given @tsconfig.json, why might this import fail?"`,
    },
  },
  {
    id: 'paste-images-for-visual-context',
    title: 'Paste Images Directly for Visual Context',
    content:
      'Claude Code is multimodal — you can paste screenshots, mockups, error screenshots, and diagrams directly into the prompt. This is invaluable for UI work (paste a Figma screenshot and say "implement this"), debugging visual bugs, or showing Claude what an error looks like in a browser.',
    category: 'prompting',
  },
  {
    id: 'use-allowed-tools-for-scoped-sessions',
    title: 'Use --allowedTools to Restrict Per-Session Capabilities',
    content:
      'The --allowedTools and --disallowedTools CLI flags let you restrict Claude\'s capabilities for a specific invocation without modifying settings.json. This is useful for read-only audit sessions, analysis tasks, or when you want Claude to plan without executing.',
    category: 'configuration',
    codeExample: {
      title: 'Scoped Tool Permissions',
      language: 'bash',
      code: `# Read-only analysis session
claude --allowedTools Read,Grep,Glob "Audit src/ for security issues"

# Planning session — no file modifications
claude --disallowedTools Write,Edit,Bash "Design the new auth system"

# CI review — only read and report
claude --print --allowedTools Read,Grep "Find all functions missing error handling in src/api/"`,
    },
  },
  {
    id: 'extended-thinking-for-complex-problems',
    title: 'Prompt for Extended Thinking on Hard Problems',
    content:
      'For complex architectural decisions, tricky debugging, or multi-step reasoning, explicitly ask Claude to think deeply before responding. Phrases like "think step by step", "consider the trade-offs carefully", or "reason through this before suggesting a solution" activate more thorough analysis. Using Opus models amplifies this capability.',
    category: 'prompting',
  },
  {
    id: 'run-parallel-sessions-for-speed',
    title: 'Run Parallel Claude Sessions for Independent Tasks',
    content:
      'Open multiple terminal tabs and run separate Claude sessions for independent tasks (e.g., tests in one, implementation in another, documentation in a third). Each session has its own context window, so they do not interfere with each other. This is the simplest form of parallelism and requires no agent configuration.',
    category: 'workflow',
    codeExample: {
      title: 'Multi-Terminal Parallelism',
      language: 'bash',
      code: `# Terminal 1 — implementation
claude "Implement the user authentication module"

# Terminal 2 — tests (separate session, separate context)
claude "Write comprehensive tests for src/api/users.ts"

# Terminal 3 — documentation
claude "Write API documentation for all endpoints in src/api/"

# Each session runs independently with its own context`,
    },
  },
  {
    id: 'use-dangerously-skip-permissions-in-ci',
    title: 'Use --dangerously-skip-permissions Only in Sandboxed Environments',
    content:
      'The --dangerously-skip-permissions flag auto-approves all tool calls without prompting. This is required for non-interactive CI environments but should never be used on a developer machine with access to production data. Always pair it with a sandboxed environment (Docker container, ephemeral CI runner) and restrictive --allowedTools.',
    category: 'configuration',
    codeExample: {
      title: 'Safe CI Usage',
      language: 'yaml',
      code: `# GitHub Actions example — sandboxed runner
- name: Claude Code Review
  run: |
    claude --print \\
      --dangerously-skip-permissions \\
      --allowedTools Read,Grep,Glob \\
      "Review the code changes for security issues"
  env:
    ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}`,
    },
  },

  // ─── Workflow ─────────────────────────────────────────────────────────────────

  {
    id: 'commit-frequently',
    title: 'Commit Frequently — Claude Can Always git reset',
    content:
      'Commit after every working increment, not just at the end of a feature. Frequent commits give you safe rollback points so you can fearlessly ask Claude to attempt larger refactors. If Claude\'s approach goes wrong, git reset --hard HEAD~1 puts you back to a known-good state instantly.',
    category: 'workflow',
  },
  {
    id: 'use-plan-mode-for-complex-features',
    title: 'Use Plan Mode for Complex Features',
    content:
      'For features that touch many files or involve architectural decisions, ask Claude to plan before implementing. "Describe the approach you would take, the files you would modify, and any risks you see, before writing any code." A good plan prevents wasted work from fundamental misunderstandings.',
    category: 'workflow',
    codeExample: {
      title: 'Requesting a Plan',
      language: 'bash',
      code: `# Ask for a plan before implementation
"Before writing any code, read the existing auth system
and describe your approach to adding OAuth support:
which files you will modify, what new files you will
create, and what risks or edge cases you see."

# Only proceed after you have reviewed and approved the plan`,
    },
  },
  {
    id: 'run-tests-after-every-change',
    title: 'Run Tests After Every Change',
    content:
      'Make "run tests" part of your automation via a PostToolUse hook or by simply asking Claude to run the test suite after every significant change. Catching regressions immediately — while the change is still fresh — is vastly cheaper than debugging a test failure hours later.',
    category: 'workflow',
  },
  {
    id: 'let-claude-read-before-suggesting',
    title: 'Let Claude Read Code Before Suggesting Changes',
    content:
      'Resist accepting Claude\'s first suggestion if it has not read the code it is modifying. Ask "Read the file first" or include the file path in your prompt. Suggestions grounded in the actual current code are far more likely to be correct and consistent with existing patterns.',
    category: 'workflow',
  },
  {
    id: 'use-explore-agent-for-understanding',
    title: 'Use the Explore Agent for Codebase Understanding',
    content:
      'When joining a new project or diving into an unfamiliar part of the codebase, invoke the built-in Explore agent before asking Claude to make changes. The Explore agent maps architecture, traces data flows, and produces a summary that becomes the foundation for accurate subsequent work.',
    category: 'workflow',
    codeExample: {
      title: 'Explore Agent Usage',
      language: 'bash',
      code: `# Map out an unfamiliar system before working on it
"Use the explore agent to understand the payment processing
flow in this application — trace a purchase from the API
endpoint through the database and back to the response"

# Then work from the Explore agent's findings
"Based on what explore found, add support for partial refunds
to the payment service"`,
    },
  },
];
