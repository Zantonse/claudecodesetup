import { SectionHeader } from "@/components/SectionHeader";
import { GlassCard } from "@/components/GlassCard";
import { CodeBlock } from "@/components/CodeBlock";

const coreConcepts = [
  {
    title: "Tools",
    description:
      "Claude Code has built-in tools (Read, Write, Edit, Bash, Glob, Grep) that it uses autonomously to interact with your filesystem and terminal.",
  },
  {
    title: "Context",
    description:
      "Claude reads your files and understands the codebase structure, allowing it to make informed edits and suggestions across your project.",
  },
  {
    title: "Permissions",
    description:
      "You control what Claude can do. Approve or deny file edits, command execution, and other actions before they take effect.",
  },
  {
    title: "CLAUDE.md",
    description:
      "A project-specific instructions file that Claude reads automatically whenever it starts a session in your project directory.",
  },
];

export default function FundamentalsPage() {
  return (
    <div className="space-y-10">
      <SectionHeader
        title="Fundamentals"
        subtitle="Everything you need to get started with Claude Code."
      />

      {/* What is Claude Code? */}
      <GlassCard hover={false}>
        <h2 className="text-xl font-semibold text-slate-100 mb-3">What is Claude Code?</h2>
        <p className="text-slate-300 leading-relaxed">
          Claude Code is an agentic CLI tool built by Anthropic that runs directly in your
          terminal. It understands your codebase and helps with coding, debugging, git workflows,
          and much more. Unlike simple autocomplete, Claude Code can{" "}
          <strong className="text-slate-100">read files</strong>,{" "}
          <strong className="text-slate-100">run commands</strong>,{" "}
          <strong className="text-slate-100">edit code</strong>, and{" "}
          <strong className="text-slate-100">manage git</strong> — acting as a true agentic
          collaborator rather than a passive suggestion engine.
        </p>
      </GlassCard>

      {/* Installation */}
      <GlassCard hover={false}>
        <h2 className="text-xl font-semibold text-slate-100 mb-3">Installation</h2>
        <p className="text-slate-400 mb-2 text-sm">
          Install via the native installer (recommended) — it handles dependencies and auto-updates:
        </p>
        <CodeBlock code="curl -fsSL https://claude.ai/install.sh | bash" language="bash" title="macOS / Linux (Recommended)" />
        <CodeBlock code="irm https://claude.ai/install.ps1 | iex" language="bash" title="Windows (PowerShell)" />
        <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-amber-500/20">
          <p className="text-xs text-amber-400 font-semibold mb-1">npm (legacy)</p>
          <p className="text-xs text-slate-400 mb-2">
            The npm method still works but is no longer recommended. The native installer auto-updates and avoids Node.js version issues.
          </p>
          <CodeBlock code="npm install -g @anthropic-ai/claude-code" language="bash" title="npm (requires Node.js 18+)" />
        </div>
        <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
          <p className="text-sm text-slate-400 font-semibold mb-1">Requirements</p>
          <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
            <li>A Claude Pro, Max, Team, or Enterprise subscription — or an Anthropic API key</li>
          </ul>
          <p className="text-xs text-slate-500 mt-2">
            For detailed setup, troubleshooting, and subscription plans, see the{" "}
            <a href="/installation" className="text-violet-400 hover:text-violet-300 underline">Installation &amp; Setup</a> page.
          </p>
        </div>
      </GlassCard>

      {/* Authentication */}
      <GlassCard hover={false}>
        <h2 className="text-xl font-semibold text-slate-100 mb-3">Authentication</h2>
        <p className="text-slate-300 leading-relaxed mb-2">
          After installation, authenticate with your Anthropic account. Claude Code supports both
          API key authentication and OAuth login.
        </p>
        <CodeBlock code="claude login" language="bash" title="Authenticate" />
        <p className="text-slate-400 text-sm mt-2">
          Follow the prompts to log in with your API key or Claude Max account via OAuth.
        </p>
      </GlassCard>

      {/* Core Concepts */}
      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Core Concepts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coreConcepts.map((concept) => (
            <GlassCard key={concept.title} hover={false}>
              <h3 className="text-base font-semibold text-violet-400 mb-2">{concept.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{concept.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Basic Commands */}
      <GlassCard hover={false}>
        <h2 className="text-xl font-semibold text-slate-100 mb-3">Basic Commands</h2>
        <p className="text-slate-400 text-sm mb-4">
          Get up and running with these common starter commands:
        </p>
        <div className="space-y-1">
          <CodeBlock code="claude" language="bash" title="Start interactive session" />
          <CodeBlock
            code={'claude "explain this file"'}
            language="bash"
            title="One-shot command"
          />
          <CodeBlock code="claude commit" language="bash" title="Generate commit message" />
          <CodeBlock code="/help" language="bash" title="List available commands" />
        </div>
      </GlassCard>
    </div>
  );
}
