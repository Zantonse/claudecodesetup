import { Workflow } from '@/lib/types';

export const workflows: Workflow[] = [
  {
    id: 'debugging-a-bug',
    title: 'Debugging a Bug',
    description:
      'A systematic approach to identifying and fixing bugs using Claude Code. This workflow takes you from the first symptom all the way to a verified fix with a regression test, ensuring the bug never returns.',
    category: 'debugging',
    claudeFeatures: ['Bash', 'Read', 'Grep', 'agents', 'hooks'],
    steps: [
      {
        title: 'Reproduce the Issue',
        description:
          'Before involving Claude, confirm you can reliably reproduce the bug. Write down the exact steps, expected behavior, and actual behavior. A bug you cannot reproduce cannot be fixed with confidence.',
        tip: 'If reproduction is flaky, add logging or use a debugger to capture state at failure time before asking Claude to investigate.',
      },
      {
        title: 'Share Error Messages in Full',
        description:
          'Paste the complete error message, stack trace, and any relevant logs into Claude. Truncated errors cause Claude to make incorrect assumptions about root cause.',
        command: '# Capture full output\nnpm test 2>&1 | tee test-output.txt',
        tip: 'Include the Node/runtime version, OS, and any recent changes — Claude can spot environmental factors in error messages.',
      },
      {
        title: 'Ask Claude to Investigate',
        description:
          'Tell Claude the symptoms and ask it to read the relevant files before suggesting a cause. Prompt: "Read the files involved in this error and explain what could cause this output."',
        tip: 'Resist suggesting a cause yourself — anchoring Claude to your hypothesis can prevent it from finding the real root cause.',
      },
      {
        title: 'Narrow Down the Root Cause',
        description:
          'Work with Claude to bisect the problem. Add temporary debug logging, narrow the input space, or write a minimal failing reproduction case that isolates the bug from other code.',
        command: '# Add temporary debug output\ngit stash && git bisect start',
        tip: 'Ask Claude to add debug assertions rather than log statements — assertions fail loudly and make the exact failure point obvious.',
      },
      {
        title: 'Implement the Fix',
        description:
          'Once the root cause is clear, have Claude implement the fix. Review the change carefully — understand exactly what changed and why, so you can catch unintended side effects.',
        tip: 'Ask Claude to explain why its fix works, not just what it changed. This reveals whether the fix addresses root cause or just suppresses the symptom.',
      },
      {
        title: 'Write a Regression Test',
        description:
          'Immediately after the fix, write a test that would have caught this bug. The test should fail on the original code and pass on the fix.',
        command: 'npm test -- --testNamePattern="regression"',
        tip: 'Name the test after the issue or ticket number so future engineers know its purpose.',
      },
      {
        title: 'Verify the Fix End-to-End',
        description:
          'Run the full test suite to confirm no regressions, then manually reproduce the original bug scenario to confirm it is resolved.',
        command: 'npm test && npm run e2e',
      },
    ],
  },

  {
    id: 'refactoring-code',
    title: 'Refactoring Code',
    description:
      'Safely transform existing code to improve its structure, readability, or performance without changing behavior. Claude Code handles the mechanical work while you guide the intent.',
    category: 'refactoring',
    claudeFeatures: ['Read', 'Write', 'Edit', 'Bash', 'agents'],
    steps: [
      {
        title: 'Identify Code Smells',
        description:
          'Ask Claude to read the target code and list specific code smells: duplicated logic, overly long functions, unclear naming, deep nesting, or missing abstractions.',
        tip: 'Ask for concrete examples with line numbers so you can verify the diagnosis before starting work.',
      },
      {
        title: 'Write Tests Before Refactoring',
        description:
          'If test coverage is thin, add characterization tests that capture the current behavior. Refactoring is safe only when you have a test harness that detects behavioral regressions.',
        command: 'npm test -- --coverage',
        tip: 'Target coverage for the specific function or module you are refactoring, not global coverage.',
      },
      {
        title: 'Ask Claude to Refactor',
        description:
          'Describe your refactoring goal clearly: "Extract this logic into a named function", "Replace these conditionals with a strategy pattern", "Inline this unnecessary abstraction". Specificity produces better results.',
        tip: 'Refactor one pattern at a time — asking Claude to do everything at once leads to large, hard-to-review diffs.',
      },
      {
        title: 'Review Each Change',
        description:
          'Read every line of the diff. Confirm that the behavior is identical, variable names are clear, and no unintended changes slipped in. Use /review to get Claude\'s own analysis of the diff.',
        command: '/review',
        tip: 'Pay extra attention to edge cases in conditionals — refactors frequently introduce subtle logic differences at boundaries.',
      },
      {
        title: 'Run the Test Suite',
        description:
          'Run all tests after each refactoring step. If any test fails, revert to the last green commit and try a smaller step.',
        command: 'npm test',
        tip: 'Keep refactoring commits small and atomic so reverting is never painful.',
      },
      {
        title: 'Commit with Clear Intent',
        description:
          'Commit refactoring changes separately from feature changes with a message that describes the transformation, not just the files changed.',
        command: 'git commit -m "refactor: extract validation logic into validateUser() helper"',
      },
    ],
  },

  {
    id: 'test-driven-development',
    title: 'Test-Driven Development',
    description:
      'Build features incrementally using the Red-Green-Refactor cycle. Claude Code accelerates TDD by writing tests and minimal implementations on demand while you maintain control over design.',
    category: 'testing',
    claudeFeatures: ['Write', 'Edit', 'Bash', 'skills'],
    steps: [
      {
        title: 'Write a Failing Test',
        description:
          'Describe the desired behavior as a test before writing any implementation. Ask Claude to write the test if you want a starting point, but review it to confirm it describes the right behavior.',
        tip: 'Load the TDD skill with /skill tdd to give Claude explicit instructions to follow the Red-Green-Refactor cycle strictly.',
      },
      {
        title: 'Run the Test to Verify Failure',
        description:
          'Run the test suite and confirm the new test fails with the expected error — not a different error. A test that fails for the wrong reason is not a valid Red phase.',
        command: 'npm test -- --testNamePattern="your new test"',
        tip: 'If the test passes without implementation, the test is wrong — it does not actually assert the desired behavior.',
      },
      {
        title: 'Implement the Minimal Code',
        description:
          'Ask Claude to write the simplest possible code that makes the failing test pass. Resist the urge to add more logic than the test requires — you will add it when the next test demands it.',
        tip: 'Remind Claude: "Write only enough code to make this specific test pass, nothing more."',
      },
      {
        title: 'Run to Verify the Test Passes',
        description:
          'Run the full test suite — not just the new test — to confirm the implementation passes the target test without breaking any existing tests.',
        command: 'npm test',
      },
      {
        title: 'Refactor Without Changing Behavior',
        description:
          'Now that the tests are green, clean up the code. Rename variables, extract functions, remove duplication — all with the confidence that any regression will be caught immediately.',
        tip: 'Run the tests after every small refactoring step, not just at the end.',
      },
      {
        title: 'Repeat for the Next Behavior',
        description:
          'Go back to the Red phase and write the next failing test for the next piece of behavior. Each cycle should be short — aim for under five minutes per cycle.',
        tip: 'If a cycle is taking longer than ten minutes, the test is too large. Split it into smaller behavioral increments.',
      },
    ],
  },

  {
    id: 'code-review',
    title: 'Code Review',
    description:
      'Use Claude Code to perform a thorough code review of staged changes, examining correctness, security, performance, and style before opening a pull request.',
    category: 'review',
    claudeFeatures: ['Read', 'Bash', 'commands', 'skills'],
    steps: [
      {
        title: 'Stage Your Changes',
        description:
          'Stage all the files you want reviewed. If your changes span multiple logical concerns, consider staging and reviewing them separately for clearer feedback.',
        command: 'git add -p   # Stage interactively to review your own changes first',
      },
      {
        title: 'Run the /review Command',
        description:
          'Run /review to have Claude examine the staged diff. Claude reads the changes in context with the surrounding code and provides structured feedback.',
        command: '/review',
        tip: 'If you have a code-review skill configured, load it first to apply your team\'s specific checklist.',
      },
      {
        title: 'Examine the Diff with Claude',
        description:
          'Ask Claude to walk through the most significant changes and explain their impact. For complex changes, ask Claude to trace the execution path through the modified code.',
        tip: 'Ask "What could go wrong with this change?" to surface edge cases Claude may not have mentioned in its initial review.',
      },
      {
        title: 'Check for Common Issues',
        description:
          'Ask Claude to explicitly check for: missing error handling, hardcoded values that should be config, test coverage gaps, security vulnerabilities, and N+1 query patterns.',
        tip: 'Use a review skill or custom /review command that encodes your team\'s specific checklist so nothing is missed.',
      },
      {
        title: 'Implement Suggested Fixes',
        description:
          'For each issue Claude identifies, ask it to implement the fix. Review each fix before accepting to ensure you understand and agree with the change.',
        tip: 'Do not accept all suggested fixes blindly — some are style preferences, not correctness issues.',
      },
      {
        title: 'Final Verification',
        description:
          'Run the full test suite and linter one final time, then review the complete diff before pushing.',
        command: 'npm test && npm run lint && git diff --staged',
      },
    ],
  },

  {
    id: 'git-workflows',
    title: 'Git Workflows',
    description:
      'Efficient git operations with Claude Code assistance, from branching and committing to resolving merge conflicts and creating well-documented pull requests.',
    category: 'git',
    claudeFeatures: ['Bash', 'Read', 'commands'],
    steps: [
      {
        title: 'Create a Feature Branch',
        description:
          'Always work on a feature branch. Ask Claude to create one with a name that follows your team\'s conventions.',
        command: 'git checkout -b feature/add-user-authentication',
        tip: 'Add the ticket or issue number to the branch name: feature/PROJ-123-user-auth',
      },
      {
        title: 'Make Focused Changes',
        description:
          'Keep your changes focused on one concern per commit. Claude Code can help you identify when changes are drifting into multiple concerns.',
        tip: 'If Claude\'s changes touch files unrelated to your feature, ask it to revert those and make them in a separate session.',
      },
      {
        title: 'Stage Files Selectively',
        description:
          'Stage files explicitly by name rather than with git add -A to avoid accidentally including debugging artifacts or sensitive files.',
        command: 'git add src/auth/login.ts src/auth/session.ts',
        tip: 'Use git add -p to stage changes interactively if a file contains both intentional and debug changes.',
      },
      {
        title: 'Commit with a Conventional Message',
        description:
          'Write a commit message that follows Conventional Commits (feat:, fix:, refactor:) and describes the why, not just the what.',
        command: 'git commit -m "feat(auth): add JWT-based session management with refresh tokens"',
        tip: 'Ask Claude to write the commit message based on the diff — it often produces better summaries than writing one yourself.',
      },
      {
        title: 'Push and Create a Pull Request',
        description:
          'Push the branch and create a pull request. Ask Claude to draft the PR description, including context about the approach taken and any trade-offs made.',
        command: 'git push -u origin feature/add-user-authentication',
        tip: 'Include a test plan in the PR description so reviewers know how to verify the change.',
      },
      {
        title: 'Resolve Merge Conflicts',
        description:
          'When conflicts arise, show Claude the conflict markers and ask it to resolve them. Claude understands both sides of the conflict and can produce the correct merged result.',
        command: 'git merge main   # Then ask Claude to resolve conflicts in conflicted files',
        tip: 'Always review Claude\'s conflict resolution — it may favor one side when the correct result needs logic from both.',
      },
    ],
  },

  {
    id: 'adding-a-new-feature',
    title: 'Adding a New Feature',
    description:
      'A complete end-to-end workflow for implementing a new feature from planning through polished, tested, and committed code.',
    category: 'feature',
    claudeFeatures: ['Read', 'Write', 'Edit', 'Bash', 'agents', 'commands'],
    steps: [
      {
        title: 'Brainstorm the Approach',
        description:
          'Before writing code, ask Claude to read the relevant parts of the codebase and suggest an implementation approach. Discuss trade-offs before committing to one.',
        tip: 'Use "Use the plan agent to design the approach" for complex features to get a structured plan with risks and alternatives.',
      },
      {
        title: 'Set Up Scaffolding',
        description:
          'Create the files, directories, and boilerplate needed for the feature. Ask Claude to follow existing patterns in the codebase for file organization and naming.',
        tip: 'Ask Claude to identify the most similar existing feature and follow its structure as a template.',
      },
      {
        title: 'Write Failing Tests First',
        description:
          'Define the expected behavior as tests before implementing the feature. This makes the implementation goal concrete and prevents scope creep.',
        command: 'npm test -- --testNamePattern="new feature" --watch',
        tip: 'Write tests for the happy path, error cases, and edge cases before a single line of implementation.',
      },
      {
        title: 'Implement Core Logic',
        description:
          'Implement the feature logic incrementally, running tests after each step. Keep Claude focused on one sub-problem at a time.',
        tip: 'Break the implementation into small vertical slices — each delivering a working increment — rather than building all layers at once.',
      },
      {
        title: 'Integrate with Existing Code',
        description:
          'Connect the new feature to existing systems: routing, database, UI components, API handlers. Ask Claude to check for integration issues by reading the surrounding code.',
        tip: 'Run the full test suite after integration, not just the new feature tests.',
      },
      {
        title: 'Polish and Review',
        description:
          'Run /review on the full feature diff, address feedback, add error handling for edge cases, and ensure the code follows project conventions.',
        command: '/review',
      },
      {
        title: 'Commit and Open a PR',
        description:
          'Commit the feature with a clear message and open a PR with Claude\'s help to write the description. Include screenshots or recordings for UI features.',
        command: 'git commit -m "feat: add user profile settings page with avatar upload"',
      },
    ],
  },

  {
    id: 'setting-up-a-project',
    title: 'Setting Up a Project',
    description:
      'Configure a new project for productive Claude Code usage from day one, including CLAUDE.md memory, MCP integrations, hooks, and permissions.',
    category: 'setup',
    claudeFeatures: ['Write', 'Bash', 'commands', 'settings', 'mcp-servers', 'hooks'],
    steps: [
      {
        title: 'Initialize the Project',
        description:
          'Create the project directory and initialize your framework, package manager, and version control. Claude Code can scaffold common project types automatically.',
        command: 'mkdir my-project && cd my-project && git init && npm init -y',
      },
      {
        title: 'Configure Tooling',
        description:
          'Set up linting, formatting, and testing. Ask Claude to configure ESLint, Prettier, and your test runner using your preferred settings.',
        tip: 'Commit config files (eslint.config.js, prettier.config.js) before writing application code so standards are enforced from the first commit.',
      },
      {
        title: 'Create the Project CLAUDE.md',
        description:
          'Run /init to generate a starter CLAUDE.md or write it manually. Document the tech stack, coding conventions, git workflow, and things Claude should never do.',
        command: '/init',
        tip: 'Keep CLAUDE.md focused on what is unique to this project. Global preferences belong in ~/.claude/CLAUDE.md.',
      },
      {
        title: 'Configure Permissions',
        description:
          'Create .claude/settings.json to define which tools Claude is allowed to use. Restrict Bash to npm scripts and git commands for safety in early project phases.',
        tip: 'Start with a restrictive permission set and loosen it as you gain confidence in Claude\'s behavior in this project.',
      },
      {
        title: 'Add MCP Servers',
        description:
          'Add .mcp.json with any external service integrations the project needs: database, GitHub, Jira, Figma. Commit this file so all teammates get the same integrations.',
        command: '/mcp   # Verify all servers connected successfully',
        tip: 'Use environment variable references in .mcp.json for credentials — never commit actual secrets.',
      },
      {
        title: 'Set Up Hooks',
        description:
          'Add .claude/hooks.json with quality-enforcing hooks: auto-format on write, prevent unsafe Bash commands, log MCP usage.',
        tip: 'Start with one or two targeted hooks. Too many hooks running on every tool call add latency and noise.',
      },
      {
        title: 'Verify the Setup',
        description:
          'Run /doctor to check for configuration issues, then do a quick test session to confirm hooks, MCP servers, and permissions all behave as expected.',
        command: '/doctor',
      },
    ],
  },

  {
    id: 'working-with-apis',
    title: 'Working with APIs',
    description:
      'Build robust API integrations with Claude Code handling client setup, endpoint implementation, error handling, and test fixtures.',
    category: 'api',
    claudeFeatures: ['Read', 'Write', 'Bash', 'mcp-servers'],
    steps: [
      {
        title: 'Understand the API Documentation',
        description:
          'Share the API docs or OpenAPI spec with Claude. Ask it to summarize the authentication method, available endpoints, rate limits, and error codes before writing any code.',
        tip: 'If the API has an OpenAPI/Swagger spec, give Claude the URL or file path — it can derive the full client from the spec.',
      },
      {
        title: 'Create an API Client',
        description:
          'Ask Claude to create a typed API client class that handles authentication, base URL configuration, and request/response serialization.',
        tip: 'Request a client that separates concerns — transport layer separate from business logic — so it is easy to mock in tests.',
      },
      {
        title: 'Implement Endpoint Wrappers',
        description:
          'Build typed wrapper functions for each endpoint your application needs, with proper TypeScript types derived from the API schema.',
        tip: 'Implement endpoints incrementally — one at a time — and test each before moving to the next.',
      },
      {
        title: 'Add Comprehensive Error Handling',
        description:
          'Ask Claude to handle all error cases: network errors, authentication failures, rate limiting, and unexpected response shapes. Wrap JSON.parse calls in try/catch.',
        tip: 'Create typed error classes for different failure modes so calling code can distinguish recoverable from fatal errors.',
      },
      {
        title: 'Write Tests with Mocked Responses',
        description:
          'Ask Claude to write unit tests using mock responses from the actual API. Use fixtures captured from real API calls for accurate test data.',
        command: 'npm test -- src/api/',
        tip: 'Use MSW (Mock Service Worker) for integration tests that exercise the full HTTP layer without hitting the real API.',
      },
      {
        title: 'Document and Validate',
        description:
          'Add JSDoc comments to all public API functions and validate the integration against the live API sandbox with a manual smoke test.',
        tip: 'Include example calls in JSDoc comments — they double as documentation and help Claude understand usage context in future sessions.',
      },
    ],
  },

  {
    id: 'writing-documentation',
    title: 'Writing Documentation',
    description:
      'Produce clear, accurate technical documentation by letting Claude Code read the actual source code and generate docs that reflect the real implementation.',
    category: 'docs',
    claudeFeatures: ['Read', 'Write', 'Bash', 'commands'],
    steps: [
      {
        title: 'Identify the Audience',
        description:
          'Define who will read this documentation: end users, API consumers, new contributors, or operators. The audience determines what to include and how deeply to explain concepts.',
        tip: 'Different audiences need different docs — write a README for users and a CONTRIBUTING guide for contributors separately.',
      },
      {
        title: 'Outline the Structure',
        description:
          'Ask Claude to read the codebase and suggest a documentation structure that matches the actual architecture. A structure derived from code is more accurate than one invented upfront.',
        tip: 'Start with the most important section for your audience (usually Getting Started or API Reference) and fill in the rest later.',
      },
      {
        title: 'Generate Content from Source',
        description:
          'Ask Claude to write each documentation section by reading the relevant source files. Documentation derived from code is more accurate than documentation written from memory.',
        tip: 'Tell Claude: "Read the source files before writing — prioritize accuracy over completeness."',
      },
      {
        title: 'Add Concrete Examples',
        description:
          'Every API function, configuration option, and workflow should have a working code example. Ask Claude to write examples it would actually run to verify they work.',
        tip: 'Test every code example — examples that do not run are worse than no examples at all.',
      },
      {
        title: 'Review for Accuracy',
        description:
          'Compare the documentation against the source code to catch any discrepancies. Ask Claude to read both and flag any places where the docs describe behavior that the code does not implement.',
        command: '/review',
        tip: 'Outdated docs are a maintenance liability — set up a review process to update them whenever the relevant code changes.',
      },
      {
        title: 'Publish and Integrate',
        description:
          'Integrate the documentation into your project (README, docs/ directory, hosted site) and add a note in CONTRIBUTING.md that docs must be updated with relevant code changes.',
      },
    ],
  },

  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description:
      'Identify and eliminate performance bottlenecks systematically using profiling data, targeted fixes, and measurable verification.',
    category: 'performance',
    claudeFeatures: ['Read', 'Bash', 'agents', 'commands'],
    steps: [
      {
        title: 'Profile First, Optimize Second',
        description:
          'Never optimize without profiling data. Use your runtime\'s profiler (Node.js --prof, browser DevTools, Python cProfile) to capture actual performance data before making any changes.',
        command: 'node --prof src/index.js && node --prof-process isolate-*.log',
        tip: 'Profile in conditions that mirror production — same data volumes, same hardware class.',
      },
      {
        title: 'Identify the Real Bottlenecks',
        description:
          'Share the profiling output with Claude and ask it to identify the top three bottlenecks. Focus on the hot paths — the 20% of code responsible for 80% of execution time.',
        tip: 'Ask Claude to categorize bottlenecks: I/O bound (network, disk), CPU bound (computation), memory bound (GC pressure, large allocations).',
      },
      {
        title: 'Prioritize by Impact',
        description:
          'Rank optimizations by expected impact versus effort. A 10ms improvement in a function called once at startup is worth less than a 1ms improvement in a function called 10,000 times per request.',
        tip: 'Ask Claude to estimate the theoretical maximum speedup for each optimization using Amdahl\'s Law.',
      },
      {
        title: 'Implement Targeted Optimizations',
        description:
          'Fix one bottleneck at a time. Ask Claude to implement the optimization and explain the approach: caching, algorithm replacement, batching, lazy loading, or parallel execution.',
        tip: 'Isolate each optimization in a separate commit so you can measure its individual impact and revert if it causes regressions.',
      },
      {
        title: 'Measure the Results',
        description:
          'Re-run the profiler after each optimization to measure actual improvement. Compare against your baseline. If the improvement is negligible, revert and move to the next candidate.',
        command: 'npm run benchmark',
        tip: 'Run benchmarks three times and take the median — single runs are noisy.',
      },
      {
        title: 'Iterate and Document',
        description:
          'Continue the profile-fix-measure cycle until you reach your performance target. Document each optimization with the measured before/after numbers so future engineers understand why the code is structured the way it is.',
        tip: 'Add performance regression tests (benchmarks with thresholds) to CI so the gains are protected from future regressions.',
      },
    ],
  },
  {
    id: 'ci-cd-integration',
    title: 'CI/CD Integration',
    description:
      'Run Claude Code non-interactively in CI/CD pipelines for automated code review, test generation, and deployment verification. Claude Code supports headless mode with structured output for scripting.',
    category: 'setup',
    claudeFeatures: ['Bash', 'Read', 'commands', 'settings'],
    steps: [
      {
        title: 'Use Non-Interactive Mode',
        description:
          'The --print flag runs Claude Code in non-interactive mode — it processes a single prompt and exits. This is the foundation for CI/CD integration, where there is no terminal to interact with.',
        command: 'claude --print "Run the test suite and report any failures"',
        tip: 'Combine --print with shell exit codes for pass/fail decisions in your pipeline.',
      },
      {
        title: 'Structure Output for Parsing',
        description:
          'Use --output-format json to get machine-readable output that your CI scripts can parse. This is useful for extracting specific results (test counts, lint errors) from Claude\'s response.',
        command: 'claude --print --output-format json "List all TypeScript compiler errors in this project"',
        tip: 'Pipe JSON output to jq for extracting specific fields in shell scripts.',
      },
      {
        title: 'Pipe Input for Context',
        description:
          'Pipe file content or command output directly to Claude for analysis. This lets your CI pipeline feed Claude specific diffs, test results, or logs to review.',
        command: 'git diff HEAD~1 | claude --print "Review this diff for bugs and security issues"',
        tip: 'Pipe narrowly scoped input — a full repo dump wastes context. Feed only the relevant diff or log section.',
      },
      {
        title: 'Continue Previous Sessions',
        description:
          'Use --continue to resume the most recent session or --resume with a session ID for a specific one. This is useful for multi-stage pipelines where later stages build on earlier analysis.',
        command: '# Continue the most recent session\nclaude --continue --print "Now generate tests for the issues you found"\n\n# Resume a specific session by ID\nclaude --resume <session-id> --print "Apply the fixes you recommended"',
        tip: 'Store the session ID from the first stage as a pipeline artifact so later stages can resume it.',
      },
      {
        title: 'Set Up Permissions for CI',
        description:
          'Create a CI-specific .claude/settings.json that restricts Claude to read-only operations. In CI environments, you typically want Claude to analyze and report, not modify files directly.',
        command: '# .claude/settings.json for CI\n# {\n#   "permissions": {\n#     "allow": ["Read", "Bash(npm test *)", "Bash(npm run lint *)"],\n#     "deny": ["Write", "Edit", "Bash(rm *)"]\n#   }\n# }',
        tip: 'Use a separate settings file for CI by setting CLAUDE_CONFIG_DIR to a CI-specific directory.',
      },
      {
        title: 'Integrate with GitHub Actions',
        description:
          'Claude Code can run as a GitHub Action that reviews PRs, comments on diffs, and responds to @claude mentions in PR comments. Set ANTHROPIC_API_KEY as a repository secret.',
        command: '# In .github/workflows/claude-review.yml\n# uses: anthropics/claude-code-action@v1\n# with:\n#   anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}\n#   trigger_phrase: "@claude"',
        tip: 'Limit the action to specific file patterns with path filters so Claude only reviews relevant changes.',
      },
    ],
  },
];
