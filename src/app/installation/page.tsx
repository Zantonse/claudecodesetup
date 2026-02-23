"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { GlassCard } from "@/components/GlassCard";
import { CodeBlock } from "@/components/CodeBlock";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Data ──────────────────────────────────────────────────────────────────── */

interface PlanFeature {
  label: string;
  included: boolean;
}

interface SubscriptionPlan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  recommended?: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: "Claude Pro",
    price: "$20/mo",
    description: "Access to Claude Code with standard usage limits.",
    features: [
      { label: "Claude Code CLI access", included: true },
      { label: "Sonnet 4.5 model", included: true },
      { label: "Standard usage limits", included: true },
      { label: "Extended thinking", included: false },
      { label: "Higher rate limits", included: false },
    ],
  },
  {
    name: "Claude Max",
    price: "$100–200/mo",
    description:
      "Power-user plan with higher limits and access to all models including Opus.",
    features: [
      { label: "Claude Code CLI access", included: true },
      { label: "All models (Opus, Sonnet, Haiku)", included: true },
      { label: "5× higher usage limits", included: true },
      { label: "Extended thinking", included: true },
      { label: "Higher rate limits", included: true },
    ],
    recommended: true,
  },
  {
    name: "API Key (Console)",
    price: "Pay-as-you-go",
    description:
      "Use your own Anthropic API key. Billed per token with no monthly commitment.",
    features: [
      { label: "Claude Code CLI access", included: true },
      { label: "All models (choose per session)", included: true },
      { label: "No monthly cap — pay per token", included: true },
      { label: "Extended thinking", included: true },
      { label: "Full API rate limits", included: true },
    ],
  },
];

interface TroubleshootEntry {
  id: string;
  symptom: string;
  cause: string;
  solution: string;
  code?: string;
  codeTitle?: string;
}

const TROUBLESHOOTING: TroubleshootEntry[] = [
  {
    id: "cmd-not-found",
    symptom: '"command not found: claude" after installation',
    cause:
      "The install directory (~/.local/bin) is not on your system PATH, or the shell hasn't reloaded after install.",
    solution:
      "Add ~/.local/bin to your PATH, then restart your terminal. Or use the native installer which handles this automatically.",
    code: `# Check if ~/.local/bin is in PATH
echo $PATH | tr ':' '\\n' | grep local

# Add to PATH (add to ~/.zshrc or ~/.bashrc)
export PATH="$HOME/.local/bin:$PATH"

# Reload your shell
source ~/.zshrc   # or source ~/.bashrc`,
    codeTitle: "Fix PATH",
  },
  {
    id: "permission-denied",
    symptom: "EPERM or permission denied errors during npm install",
    cause:
      "Your npm global prefix points to a system directory like /usr or /usr/local that requires root access.",
    solution:
      "Use the native installer instead of npm — it installs to your home directory and doesn't need root. Alternatively, reconfigure npm's global prefix.",
    code: `# Preferred: use the native installer
curl -fsSL https://claude.ai/install.sh | bash

# Alternative: change npm global prefix
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH="$HOME/.npm-global/bin:$PATH"`,
    codeTitle: "Fix permissions",
  },
  {
    id: "esm-error",
    symptom: "ERR_REQUIRE_ESM or module-related errors on startup",
    cause:
      "Your Node.js version is too old and doesn't support ES modules. Claude Code requires Node.js 18+.",
    solution:
      "Update Node.js to version 18 or later. Use nvm for easy version management.",
    code: `# Check your Node version
node --version

# Install Node 18+ via nvm
nvm install 18
nvm use 18

# Verify
node --version  # Should be v18.x.x or higher`,
    codeTitle: "Update Node.js",
  },
  {
    id: "auth-failed",
    symptom: "Authentication fails or credentials not accepted",
    cause:
      "Stale or corrupted auth tokens stored from a previous session, or an expired API key.",
    solution:
      "Clear the stored authentication data and re-login. If using an API key, verify it's still valid in the Anthropic Console.",
    code: `# Remove stored auth data
rm -rf ~/.config/claude-code/auth.json

# Re-launch and login fresh
claude

# If using API key, verify it's set
echo $ANTHROPIC_API_KEY`,
    codeTitle: "Reset auth",
  },
  {
    id: "rate-limit",
    symptom: "429 errors or \"rate limit exceeded\" messages",
    cause:
      "You've hit the usage limit for your current plan tier. Claude Pro has lower limits than Max.",
    solution:
      "Wait for the rate limit window to reset (usually a few minutes), or upgrade to Claude Max for 5× higher limits. API key users can check their usage dashboard.",
    code: `# Check your current usage
/cost

# Switch to a more efficient model for bulk work
/model claude-haiku-4-5`,
    codeTitle: "Handle rate limits",
  },
  {
    id: "overloaded",
    symptom: "529 \"overloaded\" errors",
    cause:
      "The Claude API is experiencing high traffic. This is a server-side issue, not a problem with your setup.",
    solution:
      "Wait a few minutes and retry. Claude Code automatically retries with exponential backoff. If persistent, check the Anthropic status page.",
    code: `# Check Anthropic status page
# https://status.anthropic.com

# Claude Code retries automatically, but you can also
# restart your session
/clear`,
    codeTitle: "Server overload",
  },
  {
    id: "proxy-firewall",
    symptom: "Connection timeouts or network errors behind a corporate proxy",
    cause:
      "Your network requires proxy configuration that Claude Code doesn't pick up automatically.",
    solution:
      "Set the standard HTTP proxy environment variables. Claude Code respects these for all API connections.",
    code: `# Set proxy environment variables
export HTTP_PROXY="http://proxy.company.com:8080"
export HTTPS_PROXY="http://proxy.company.com:8080"
export NO_PROXY="localhost,127.0.0.1"

# Then start Claude Code
claude`,
    codeTitle: "Proxy configuration",
  },
  {
    id: "config-corrupt",
    symptom: "Claude Code crashes on startup or behaves unexpectedly",
    cause:
      "Corrupted configuration files, settings, or plugin state from a previous session or failed update.",
    solution:
      "Reset configuration files to defaults. This clears all settings but preserves your projects and code.",
    code: `# Run the built-in diagnostics first
claude /doctor

# If that doesn't help, reset configuration
# (back up first if you have custom settings)
cp -r ~/.claude ~/.claude-backup

# Reset user settings and state
rm ~/.claude.json
rm -rf ~/.claude/

# Reset project-specific settings
rm -rf .claude/
rm .mcp.json

# Restart Claude Code
claude`,
    codeTitle: "Reset configuration",
  },
  {
    id: "plugin-errors",
    symptom: "Plugin or language server errors, high memory usage",
    cause:
      "A language server (like rust-analyzer or pyright) is misbehaving, or a plugin configuration is invalid.",
    solution:
      "Check the plugin error tab for details, and disable problematic plugins. Claude's built-in search tools work without language servers.",
    code: `# Check plugin status in Claude Code
/plugin

# Disable a problematic plugin
/plugin disable <plugin-name>

# Claude's built-in Glob, Grep, and Read tools
# work without any plugins`,
    codeTitle: "Fix plugin issues",
  },
];

/* ─── Accordion component ────────────────────────────────────────────────── */

function TroubleshootItem({ entry }: { entry: TroubleshootEntry }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden transition-colors hover:border-white/12">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-start gap-3 px-5 py-4 text-left"
      >
        {/* Status icon */}
        <span className="mt-0.5 text-rose-400 text-lg flex-shrink-0">⚠</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100 leading-snug">
            {entry.symptom}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{entry.cause}</p>
        </div>
        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-slate-500 flex-shrink-0 mt-1 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 space-y-3">
              {/* Cause */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Why it happens
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">{entry.cause}</p>
              </div>

              {/* Solution */}
              <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                  Fix
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {entry.solution}
                </p>
              </div>

              {/* Code */}
              {entry.code && (
                <CodeBlock
                  code={entry.code}
                  language="bash"
                  title={entry.codeTitle}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Tabbed Install Section ─────────────────────────────────────────────── */

type Platform = "macos" | "linux" | "windows";

const INSTALL_COMMANDS: Record<Platform, { primary: string; primaryLabel: string; alt?: string; altLabel?: string }> = {
  macos: {
    primary: "curl -fsSL https://claude.ai/install.sh | bash",
    primaryLabel: "Native Installer (Recommended)",
    alt: "brew install --cask claude-code",
    altLabel: "Homebrew",
  },
  linux: {
    primary: "curl -fsSL https://claude.ai/install.sh | bash",
    primaryLabel: "Native Installer (Recommended)",
  },
  windows: {
    primary: "irm https://claude.ai/install.ps1 | iex",
    primaryLabel: "PowerShell (Recommended)",
    alt: "winget install Anthropic.ClaudeCode",
    altLabel: "WinGet",
  },
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function InstallationPage() {
  const [platform, setPlatform] = useState<Platform>("macos");

  const cmd = INSTALL_COMMANDS[platform];

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Installation & Setup"
        subtitle="Get Claude Code running with your Claude subscription in minutes."
      />

      {/* ── Prerequisites ──────────────────────────────────────────────── */}
      <GlassCard hover={false}>
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Prerequisites</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <p className="text-sm font-semibold text-violet-400 mb-1">
              Claude Subscription
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              A <strong className="text-slate-200">Claude Pro</strong>,{" "}
              <strong className="text-slate-200">Max</strong>,{" "}
              <strong className="text-slate-200">Team</strong>, or{" "}
              <strong className="text-slate-200">Enterprise</strong> subscription — or an{" "}
              <strong className="text-slate-200">Anthropic API key</strong> from the
              Console.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <p className="text-sm font-semibold text-cyan-400 mb-1">
              Node.js 18+ <span className="text-slate-500 font-normal">(npm only)</span>
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Only required if installing via npm. The native installer and Homebrew/WinGet
              handle dependencies automatically.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ── Install ────────────────────────────────────────────────────── */}
      <GlassCard hover={false}>
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          Install Claude Code
        </h2>

        {/* Platform tabs */}
        <div className="flex gap-2 mb-4">
          {(["macos", "linux", "windows"] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                platform === p
                  ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
              }`}
            >
              {p === "macos" ? "macOS" : p === "linux" ? "Linux / WSL" : "Windows"}
            </button>
          ))}
        </div>

        {/* Primary install command */}
        <CodeBlock code={cmd.primary} language="bash" title={cmd.primaryLabel} />

        {/* Alt method */}
        {cmd.alt && (
          <CodeBlock code={cmd.alt} language="bash" title={cmd.altLabel} />
        )}

        {/* npm fallback */}
        <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-amber-500/20">
          <p className="text-xs text-amber-400 font-semibold mb-1">
            npm install (legacy)
          </p>
          <p className="text-xs text-slate-400 mb-2">
            The npm method still works but is no longer the recommended approach. The
            native installer updates automatically and avoids Node.js version issues.
          </p>
          <CodeBlock
            code="npm install -g @anthropic-ai/claude-code"
            language="bash"
            title="npm (requires Node.js 18+)"
          />
        </div>

        {/* Version pinning */}
        <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
          <p className="text-xs text-slate-400 font-semibold mb-1">
            Install a specific version
          </p>
          <CodeBlock
            code={`# Install a specific version\ncurl -fsSL https://claude.ai/install.sh | bash -s 1.0.58\n\n# Install the latest pre-release\ncurl -fsSL https://claude.ai/install.sh | bash -s latest`}
            language="bash"
            title="Version pinning"
          />
        </div>
      </GlassCard>

      {/* ── Authentication & Login ─────────────────────────────────────── */}
      <GlassCard hover={false}>
        <h2 className="text-xl font-semibold text-slate-100 mb-3">
          Authentication & Login
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          After installation, run <code className="text-violet-400 text-sm font-mono">claude</code> in
          your terminal. You&apos;ll be prompted to log in via one of these methods:
        </p>

        <div className="space-y-3">
          {/* OAuth / subscription */}
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-start gap-3">
              <span className="text-lg">🔐</span>
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  Claude Pro / Max / Team / Enterprise (OAuth)
                </p>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Select &quot;Claude subscription&quot; when prompted. A browser window opens for
                  OAuth login. Your credentials are stored securely and persist across
                  sessions. Switch accounts anytime with{" "}
                  <code className="text-violet-400 font-mono text-xs">/login</code>.
                </p>
              </div>
            </div>
          </div>

          {/* API key */}
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-start gap-3">
              <span className="text-lg">🔑</span>
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  Anthropic API Key (Console)
                </p>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Select &quot;API key&quot; and paste your key from{" "}
                  <span className="text-cyan-400">console.anthropic.com</span>. Or set it
                  as an environment variable:
                </p>
                <CodeBlock
                  code={'export ANTHROPIC_API_KEY="sk-ant-..."'}
                  language="bash"
                  title="Environment variable"
                />
              </div>
            </div>
          </div>

          {/* Enterprise cloud */}
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-start gap-3">
              <span className="text-lg">☁️</span>
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  Enterprise Cloud Providers
                </p>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Claude Code also supports login via{" "}
                  <strong className="text-slate-200">Amazon Bedrock</strong>,{" "}
                  <strong className="text-slate-200">Google Vertex AI</strong>, and{" "}
                  <strong className="text-slate-200">Microsoft Foundry</strong> for
                  enterprise deployments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── First Run ──────────────────────────────────────────────────── */}
      <GlassCard hover={false}>
        <h2 className="text-xl font-semibold text-slate-100 mb-3">
          First Run & Initial Setup
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Once authenticated, here&apos;s what to do in your first session:
        </p>

        <ol className="space-y-4 text-sm text-slate-300">
          <li className="flex gap-3">
            <span className="text-violet-400 font-bold text-base leading-none mt-0.5">1</span>
            <div>
              <p className="font-semibold text-slate-100">Navigate to your project</p>
              <CodeBlock code="cd ~/my-project && claude" language="bash" title="Start in project" />
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-violet-400 font-bold text-base leading-none mt-0.5">2</span>
            <div>
              <p className="font-semibold text-slate-100">Run terminal setup</p>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Configures shell completions, aliases (<code className="text-violet-400 font-mono text-xs">cc</code> for <code className="text-violet-400 font-mono text-xs">claude</code>), and keybindings.
              </p>
              <CodeBlock code="/terminal-setup" language="bash" title="Terminal setup wizard" />
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-violet-400 font-bold text-base leading-none mt-0.5">3</span>
            <div>
              <p className="font-semibold text-slate-100">Run diagnostics</p>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Checks your installation, settings, connected servers, and keybindings for issues.
              </p>
              <CodeBlock code="/doctor" language="bash" title="Run health check" />
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-violet-400 font-bold text-base leading-none mt-0.5">4</span>
            <div>
              <p className="font-semibold text-slate-100">Create your project CLAUDE.md</p>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Give Claude persistent context about your tech stack, conventions, and constraints.
              </p>
              <CodeBlock code="/memory" language="bash" title="Edit CLAUDE.md" />
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-violet-400 font-bold text-base leading-none mt-0.5">5</span>
            <div>
              <p className="font-semibold text-slate-100">Verify everything works</p>
              <CodeBlock
                code={`# Ask Claude something about your project\nclaude "explain the architecture of this codebase"`}
                language="bash"
                title="Smoke test"
              />
            </div>
          </li>
        </ol>
      </GlassCard>

      {/* ── Subscription Plans ─────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          Subscription Plans
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Claude Code is available with any of these plans. Choose based on your usage
          volume and model needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <GlassCard key={plan.name} hover={false} className="relative">
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet-600 text-white text-xs font-bold tracking-wide">
                  RECOMMENDED
                </div>
              )}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-slate-100">{plan.name}</h3>
                <p className="text-2xl font-bold gradient-text mt-1">{plan.price}</p>
                <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
              </div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-sm">
                    <span className={f.included ? "text-emerald-400" : "text-slate-600"}>
                      {f.included ? "✓" : "—"}
                    </span>
                    <span className={f.included ? "text-slate-300" : "text-slate-600"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* ── Troubleshooting ────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-2">
          Troubleshooting
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Click an issue to expand the diagnosis and fix. If none of these match, run{" "}
          <code className="text-violet-400 font-mono text-xs">/doctor</code> inside Claude
          Code or file a bug with{" "}
          <code className="text-violet-400 font-mono text-xs">/bug</code>.
        </p>

        <div className="space-y-2">
          {TROUBLESHOOTING.map((entry) => (
            <TroubleshootItem key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      {/* ── Getting More Help ──────────────────────────────────────────── */}
      <GlassCard hover={false}>
        <h2 className="text-xl font-semibold text-slate-100 mb-3">
          Getting More Help
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <p className="font-semibold text-violet-400 mb-1">/doctor</p>
            <p className="text-slate-400 leading-relaxed">
              Built-in diagnostics that check installation details, update status, settings
              validity, server config, keybindings, context usage, and plugin loading.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <p className="font-semibold text-violet-400 mb-1">/bug</p>
            <p className="text-slate-400 leading-relaxed">
              Report an issue directly to Anthropic with diagnostic context automatically
              attached.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <p className="font-semibold text-cyan-400 mb-1">GitHub Issues</p>
            <p className="text-slate-400 leading-relaxed">
              Check known issues and report new ones at{" "}
              <span className="text-slate-300">github.com/anthropics/claude-code</span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <p className="font-semibold text-cyan-400 mb-1">Ask Claude</p>
            <p className="text-slate-400 leading-relaxed">
              Claude Code has access to its own documentation. Ask it directly about
              features, configuration, or capabilities.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
