# Beginner Wizard Mode — Design Document

**Date:** 2026-02-23
**Author:** Craig Verzosa (via Claude Code brainstorming)
**Status:** Approved

## Overview

A full-screen, step-by-step guided wizard for complete beginners who have never used a terminal. Designed for someone who doesn't know what a terminal is, has never run a command, and needs hand-holding from "What is Terminal?" all the way through building their first webpage with Claude Code.

## Target Audience

Complete beginners — specifically Craig's wife, but applicable to anyone new to both terminals and Claude Code. Zero assumed knowledge of programming, command-line interfaces, or AI coding tools.

## Approach

**Full-screen wizard route** at `/wizard`. No sidebar, no breadcrumbs, no navigation chrome. A single centered card walks the user through 14 steps in 4 phases. The wizard is completely isolated from the regular documentation site — different audience, different UX goals.

## Wizard Flow

### Phase 1: Opening the Terminal (Steps 1-3)

**Step 1 — "What is the Terminal?"**
Explain that the terminal is how you talk to your computer using text instead of clicking. It's been around since before mice existed. Everything you do by clicking — opening files, installing apps, creating folders — can also be done by typing.

**Step 2 — "Open Terminal"**
Press `Cmd + Space`, type `Terminal`, hit Enter. Describe what they'll see: a mostly-blank window with their name and a blinking cursor. That cursor means the terminal is waiting for an instruction.

**Step 3 — "Your First Command"**
Type `whoami` and press Enter. The terminal responds with their username. Explain: "Every time you type something and hit Enter, the terminal runs that instruction and shows you the result. You just ran your first command!"

### Phase 2: Installing Claude Code (Steps 4-6)

**Step 4 — "What is Claude Code?"**
One-paragraph explanation: "Claude Code is an AI assistant that lives in your terminal. Instead of clicking buttons in an app, you have a conversation with Claude — tell it what you want to build, and it writes the code, creates files, and runs commands for you."

**Step 5 — "Install Claude Code"**
Command: `curl -fsSL https://claude.ai/install.sh | bash`
Explain: "This downloads Claude Code from the internet and installs it on your Mac. Think of it like downloading an app from the App Store, but using text instead of clicking a button. The `curl` part downloads it, and `bash` runs the installer."

**Step 6 — "Verify It Installed"**
Command: `claude --version`
Explain: "This asks Claude Code to report its version number. If you see a number like `1.x.x`, the installation worked. If you see 'command not found', something went wrong and we'll troubleshoot."
Include: inline troubleshooting for the "command not found" case (close and reopen Terminal, then try again).

### Phase 3: Logging In (Steps 7-9)

**Step 7 — "You Need a Claude Account"**
Explain that Claude Code connects to Claude's AI brain in the cloud, and that requires an account. If they already have a Claude Pro, Max, or Team subscription, they're good. If not, link to sign up.

**Step 8 — "Log In to Claude"**
Command: `claude`
Explain: "Just type `claude` and hit Enter. A browser window will pop open — log in with your Claude account there, then come back to the terminal. Claude Code will remember you so you only have to do this once."

**Step 9 — "Confirm You're Logged In"**
Explain what the welcome message looks like. "You should see Claude greeting you and a blinking cursor. That means Claude is ready and waiting for your first instruction."
Include: what to do if login fails (try `claude` again, check internet connection).

### Phase 4: Using Claude Code (Steps 10-14)

**Step 10 — "Navigate to a Folder"**
Explain what folders (directories) are in the terminal context. Two commands:
1. `cd ~/Desktop` — "This tells the terminal to go to your Desktop folder. `cd` stands for 'change directory' — it's how you move around."
2. `mkdir my-first-project && cd my-first-project` — "This creates a new folder called 'my-first-project' and goes into it. `mkdir` means 'make directory'."

**Step 11 — "Start Claude Code"**
Command: `claude`
Explain: "You're now inside your project folder, talking to Claude. The blinking cursor means Claude is waiting for your instruction. Whatever you type next, Claude will try to do."

**Step 12 — "Ask Claude to Build Something"**
Prompt to type: `Create a simple webpage that says "Hello! I made this with Claude Code!" and save it as index.html`
Explain: "Watch Claude work — it'll create a file right in your project folder. You'll see it thinking and then writing code."

**Step 13 — "See What Claude Made"**
Command: `open index.html`
Explain: "This opens the file in your web browser. You should see a webpage with your message on it!"

**Step 14 — "You Did It!"**
Celebration screen. Recap what they learned: opening the terminal, running commands, installing software, navigating folders, and building something with AI. Link to the full site for continued learning.

## UI Design

### Layout
- Full-screen, centered GlassCard (~600px max-width, vertically centered)
- Dark background matching main site (`#0F172A`)
- No sidebar, no breadcrumbs, no navigation

### Step Card Elements
- **Phase badge** — Small colored badge at top ("Phase 2: Installing Claude Code")
- **Step progress** — Horizontal dot/step indicator across all 14 steps, current step glowing violet
- **Headline** — Large gradient-text heading (matching main site aesthetic)
- **Explanation** — Friendly, conversational text at ~17px. No jargon. Uses analogies.
- **Action area** — One of:
  - CodeBlock with command + copy button
  - Visual instruction with descriptive text
  - Confirmation prompt ("Did you see the version number?")
- **"What does this do?" section** — Expanded by default below each command. Plain-English explanation of the command.
- **Navigation** — Back (ghost button, left) + Next (prominent violet button, right)
- **Exit** — Small "Skip to full site →" link in top-right corner

### Entry Points
- **Home page**: "New to coding? Start the guided setup" card below the hero section, above Quick Start grid
- **Direct URL**: `/wizard`

### Visual Tone
- Same glassmorphism + gradient aesthetic as the main site
- Warmer, friendlier copy — no jargon, analogies to everyday concepts
- More padding and larger text than reference pages — spacious, not cramped
- Final step gets celebratory treatment (animated gradient border, subtle confetti or particle effect)

### State Persistence
- Current step stored in `localStorage` via `useLocalStorage("wizard-step", 0)`
- Resumable: closing browser and returning to `/wizard` picks up at the saved step
- "Start over" option resets to step 0

## Data Model

```typescript
interface WizardStep {
  id: string;
  phase: number;
  phaseTitle: string;
  headline: string;
  explanation: string;        // Plain-English, non-technical
  action?: {
    type: 'command' | 'instruction' | 'confirmation';
    command?: string;          // For type 'command'
    instruction?: string;      // For type 'instruction'
    confirmLabel?: string;     // For type 'confirmation' (e.g., "Yes, I see it!")
  };
  whatThisDoes?: string;       // Expanded explanation of the command
  troubleshooting?: string;    // Inline help if something goes wrong
}
```

## Tech Stack
- Same as main site (Next.js 16, Tailwind CSS 4, Framer Motion)
- Reuses existing components: `GlassCard`, `CodeBlock`
- New components: `WizardShell`, `WizardStepCard`, `StepProgress`, `WizardEntryCard`
- New hook: `useWizardProgress` (wraps `useLocalStorage`)

## File Structure
```
src/
├── app/wizard/
│   └── page.tsx              # Wizard page (no AppShell)
│   └── layout.tsx            # Custom layout (no sidebar)
├── components/wizard/
│   ├── WizardShell.tsx       # Full-screen centered layout
│   ├── WizardStepCard.tsx    # Individual step renderer
│   ├── StepProgress.tsx      # Dot/step indicator
│   └── WizardEntryCard.tsx   # Home page entry point card
├── data/
│   └── wizard-steps.ts       # All 14 steps as typed data
└── lib/hooks/
    └── useWizardProgress.ts  # Step state + localStorage
```

## Not In Scope (YAGNI)
- Windows/Linux support (macOS only for this user)
- Video tutorials or animated GIFs
- Interactive terminal emulator in the browser
- Account creation flow (link to Anthropic site instead)
- Automated verification that commands succeeded
- Multi-language support
