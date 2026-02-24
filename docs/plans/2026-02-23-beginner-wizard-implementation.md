# Beginner Wizard Mode Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full-screen, step-by-step beginner wizard at `/wizard` that guides a complete non-technical user from "What is the Terminal?" through their first Claude Code session.

**Architecture:** A dedicated `/wizard` route with its own layout (no sidebar/breadcrumbs) renders a single centered card that steps through 14 wizard steps stored in a typed data file. A custom hook persists progress to localStorage. The wizard reuses existing GlassCard/CodeBlock components but lives in its own component tree. An entry card on the home page links into the wizard.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 4, Framer Motion, existing component library (GlassCard, CodeBlock)

**Design doc:** `docs/plans/2026-02-23-beginner-wizard-design.md`

---

## Dependency Graph

```
Task 1 (types + data)
  ↓
Task 2 (hook)
  ↓
Task 3 (wizard layout) ─── can parallel with Task 4
  ↓                         ↓
Task 4 (StepProgress)      Task 5 (WizardStepCard)
  ↓                         ↓
Task 6 (wizard page — assembles all)
  ↓
Task 7 (home page entry card)
  ↓
Task 8 (visual polish + celebration step — use @frontend-design)
  ↓
Task 9 (commit + verify)
```

**Parallelizable:** Tasks 3+4 can run together. Tasks 4+5 can run together.

---

### Task 1: Wizard Step Data File

**Files:**
- Modify: `src/lib/types.ts` — Add WizardStep interface
- Create: `src/data/wizard-steps.ts` — All 14 steps

**Step 1: Add WizardStep type**

Add to the bottom of `src/lib/types.ts`:

```typescript
/* ─── Wizard ────────────────────────────────────────────────────────────────── */

export interface WizardAction {
  type: 'command' | 'instruction' | 'confirmation';
  command?: string;
  instruction?: string;
  confirmLabel?: string;
}

export interface WizardStep {
  id: string;
  phase: number;
  phaseTitle: string;
  headline: string;
  explanation: string;
  action?: WizardAction;
  whatThisDoes?: string;
  troubleshooting?: string;
}

export const PHASE_COLORS: Record<number, string> = {
  1: '#06B6D4',  // cyan  — Opening the Terminal
  2: '#A855F7',  // purple — Installing Claude Code
  3: '#F59E0B',  // amber  — Logging In
  4: '#10B981',  // green  — Using Claude Code
};
```

**Step 2: Create wizard-steps.ts**

Create `src/data/wizard-steps.ts` with all 14 steps. Each step must have:
- Friendly, non-technical `explanation` text using analogies
- A `whatThisDoes` field for every command action
- A `troubleshooting` field where something might go wrong

The full content for each step is specified in the design doc at `docs/plans/2026-02-23-beginner-wizard-design.md` — use the exact phase/step descriptions from that document for the copy. Keep explanations conversational and jargon-free.

**Step 3: Verify build**

Run: `curl -s http://localhost:3000 -o /dev/null -w "%{http_code}"`
Expected: `200` (types compile, no import errors)

**Step 4: Commit**

```bash
git add src/lib/types.ts src/data/wizard-steps.ts
git commit -m "feat(wizard): add WizardStep type and 14-step data file"
```

---

### Task 2: Wizard Progress Hook

**Files:**
- Create: `src/lib/hooks/useWizardProgress.ts`

**Step 1: Create the hook**

```typescript
"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useWizardProgress(totalSteps: number) {
  const [currentStep, setCurrentStep] = useLocalStorage("wizard-step", 0);

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [setCurrentStep, totalSteps]);

  const back = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, [setCurrentStep]);

  const goTo = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [setCurrentStep, totalSteps]);

  const reset = useCallback(() => {
    setCurrentStep(0);
  }, [setCurrentStep]);

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return { currentStep, next, back, goTo, reset, isFirst, isLast, progress };
}
```

**Step 2: Verify build**

Run: `curl -s http://localhost:3000 -o /dev/null -w "%{http_code}"`
Expected: `200`

**Step 3: Commit**

```bash
git add src/lib/hooks/useWizardProgress.ts
git commit -m "feat(wizard): add useWizardProgress hook with localStorage persistence"
```

---

### Task 3: Wizard Layout (No Sidebar)

**Files:**
- Create: `src/app/wizard/layout.tsx`
- Create: `src/components/wizard/WizardShell.tsx`

**Step 1: Create wizard layout**

The wizard needs its own layout that does NOT include `<AppShell>` (no sidebar, no breadcrumbs). Next.js App Router nested layouts make this possible — `src/app/wizard/layout.tsx` replaces the root layout's `<AppShell>` wrapper.

`src/app/wizard/layout.tsx`:
```typescript
export const metadata = {
  title: "Claude Code — Guided Setup",
  description: "A step-by-step guide for complete beginners to install and use Claude Code.",
};

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

**Important:** The root `src/app/layout.tsx` wraps ALL pages in `<AppShell>`. The wizard must NOT be inside AppShell. Modify `src/app/layout.tsx` to conditionally render AppShell based on the route. The cleanest way: create a client component wrapper that checks `usePathname()` and skips AppShell for `/wizard`.

Modify `src/app/layout.tsx`:
- Replace `<AppShell>{children}</AppShell>` with a new `<LayoutWrapper>{children}</LayoutWrapper>` component
- Create `src/components/LayoutWrapper.tsx` that uses `usePathname()` — if path starts with `/wizard`, render children directly; otherwise render `<AppShell>{children}</AppShell>`

**Step 2: Create WizardShell**

`src/components/wizard/WizardShell.tsx` — full-screen centered layout:
```tsx
"use client";

import Link from "next/link";

interface WizardShellProps {
  children: React.ReactNode;
}

export function WizardShell({ children }: WizardShellProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative">
      {/* Exit link */}
      <Link
        href="/"
        className="absolute top-6 right-6 text-sm text-slate-500 hover:text-slate-300 transition-colors"
      >
        Skip to full site →
      </Link>

      {/* Centered content area */}
      <div className="w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
}
```

**Step 3: Verify build**

Run: `curl -s http://localhost:3000 -o /dev/null -w "%{http_code}"` AND `curl -s http://localhost:3000/wizard -o /dev/null -w "%{http_code}"`
Expected: Both `200`

**Step 4: Commit**

```bash
git add src/app/wizard/layout.tsx src/components/wizard/WizardShell.tsx src/components/LayoutWrapper.tsx src/app/layout.tsx
git commit -m "feat(wizard): add wizard layout and shell without sidebar"
```

---

### Task 4: Step Progress Indicator

**Files:**
- Create: `src/components/wizard/StepProgress.tsx`

**Step 1: Create StepProgress component**

A horizontal row of dots representing all 14 steps, grouped by phase. Current step glows violet. Completed steps are filled. Future steps are dim.

Props:
- `currentStep: number`
- `totalSteps: number`
- `steps: WizardStep[]` — needed to read phase numbers for grouping/coloring
- `onStepClick?: (step: number) => void` — optional, for clicking back to a completed step

Use phase colors from `PHASE_COLORS` in types.ts. Each dot is a small circle (8-10px). Phase groups are separated by a small gap. Current step dot is larger (12px) with a glow shadow matching the phase color. Completed steps use the phase color fill. Future steps are `bg-slate-700`.

Animate transitions with Framer Motion `layoutId` or simple scale transitions.

**Step 2: Verify build**

Run: `curl -s http://localhost:3000/wizard -o /dev/null -w "%{http_code}"`
Expected: `200`

**Step 3: Commit**

```bash
git add src/components/wizard/StepProgress.tsx
git commit -m "feat(wizard): add step progress indicator with phase-colored dots"
```

---

### Task 5: Wizard Step Card

**Files:**
- Create: `src/components/wizard/WizardStepCard.tsx`

**Step 1: Create WizardStepCard component**

This is the main card that renders a single wizard step. It receives a `WizardStep` object and renders:

1. **Phase badge** — small pill at top with phase color background and phase title text
2. **Headline** — large gradient-text heading
3. **Explanation** — body text at ~17px, `text-slate-300`, `leading-relaxed`
4. **Action area** — conditional on `action.type`:
   - `'command'` → render `<CodeBlock>` with the command, plus a `whatThisDoes` section below it in a subtle bordered box
   - `'instruction'` → render the instruction text in a highlighted callout box (cyan border, icon)
   - `'confirmation'` → render a prompt with the `confirmLabel` text styled as a subtle question
5. **Troubleshooting** — if present, render in an amber callout box with a "Having trouble?" label
6. **Navigation** — Back button (ghost/outline, left) + Next button (violet filled, right). Hide Back on step 0. Show "Get Started →" on step 0 instead of Next. Show "Finish!" on the last step.

Props:
- `step: WizardStep`
- `isFirst: boolean`
- `isLast: boolean`
- `onNext: () => void`
- `onBack: () => void`

Use Framer Motion `AnimatePresence` with a key on `step.id` to animate card transitions (fade + slight slide).

Import `GlassCard` from `@/components/GlassCard` (set `hover={false}`) and `CodeBlock` from `@/components/CodeBlock`.

**Step 2: Verify build**

Run: `curl -s http://localhost:3000/wizard -o /dev/null -w "%{http_code}"`
Expected: `200`

**Step 3: Commit**

```bash
git add src/components/wizard/WizardStepCard.tsx
git commit -m "feat(wizard): add WizardStepCard with action types and navigation"
```

---

### Task 6: Wizard Page (Assembly)

**Files:**
- Create: `src/app/wizard/page.tsx`

**Step 1: Assemble the wizard page**

This is the page component at `/wizard`. It:

1. Imports `wizardSteps` from `@/data/wizard-steps`
2. Calls `useWizardProgress(wizardSteps.length)` to get state
3. Gets the current step object: `wizardSteps[currentStep]`
4. Renders `<WizardShell>` wrapping:
   - `<StepProgress>` at the top
   - `<WizardStepCard>` in the center with the current step
5. Add `"use client"` directive since it uses hooks

The page should be minimal — just wiring. All rendering logic lives in the child components.

**Step 2: Verify the wizard works end-to-end**

Navigate to `http://localhost:3000/wizard` in a browser:
- Confirm no sidebar is visible
- Confirm step 1 shows ("What is the Terminal?")
- Click Next through several steps
- Verify progress dots update
- Refresh the page — confirm it resumes at the saved step
- Verify the "Skip to full site →" link goes to home

**Step 3: Commit**

```bash
git add src/app/wizard/page.tsx
git commit -m "feat(wizard): assemble wizard page with progress and step rendering"
```

---

### Task 7: Home Page Entry Card

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Add wizard entry card to home page**

Insert a new section between the Hero section and the "Quick Start" section in `src/app/page.tsx`.

The card should be:
- A `GlassCard` with a gradient left border (use the animated gradient-border style or a static violet→cyan gradient)
- Headline: "New to coding?" in gradient-text
- Subtext: "Never used a terminal before? Our guided setup walks you through everything step by step — no experience needed."
- A prominent link/button: "Start Guided Setup →" linking to `/wizard`
- An icon or emoji on the left (e.g., a sparkles ✨ or wand 🪄 emoji)

Keep it compact — 1-2 lines max — so it doesn't push the Quick Start grid too far down.

**Step 2: Verify**

Navigate to `http://localhost:3000` — confirm the entry card is visible between hero and Quick Start.

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(wizard): add beginner wizard entry card to home page"
```

---

### Task 8: Visual Polish & Celebration Step

**Files:**
- Modify: `src/components/wizard/WizardStepCard.tsx`
- Modify: `src/app/globals.css` (if needed for new keyframes)

Use @frontend-design skill for this task.

**Step 1: Polish the wizard step card**

- Add smooth Framer Motion transitions between steps (fade + translateX direction based on forward/back)
- Add a subtle entrance animation when the wizard first loads
- Ensure the card has a nice glassmorphism effect with generous padding (~p-8 or p-10)
- Make the headline text larger than regular pages (~text-2xl or text-3xl)

**Step 2: Build the celebration step (Step 14)**

The last step needs special treatment. When `isLast` is true:

- Animated gradient border around the card (reuse `.gradient-border` from globals.css)
- A larger, more exuberant headline ("You Did It! 🎉")
- A summary list of what they learned (5 bullet points with checkmarks)
- Two buttons: "Explore the Full Site →" (primary, links to `/`) and "Start Over" (ghost, calls `reset`)
- Optional: a subtle particle/sparkle effect using CSS animations (a few small dots floating up and fading)

**Step 3: Verify**

Navigate through all 14 steps in the wizard. Confirm:
- Transitions are smooth
- Step 14 shows the celebration treatment
- "Explore the Full Site" and "Start Over" buttons work

**Step 4: Commit**

```bash
git add src/components/wizard/WizardStepCard.tsx src/app/globals.css
git commit -m "feat(wizard): add step transitions and celebration screen"
```

---

### Task 9: Final Verification & Deploy

**Step 1: Full build check**

Run: `npm run build`
Expected: All 20 routes build successfully (19 existing + `/wizard`), no TypeScript errors.

**Step 2: Smoke test all wizard steps**

Open `http://localhost:3000/wizard` and click through all 14 steps:
- [ ] Step 1-3: Phase 1 badge shows, explanations are clear
- [ ] Step 4-6: Commands have copy buttons, "what this does" sections show
- [ ] Step 7-9: Login instructions render correctly
- [ ] Step 10-14: Navigation commands, celebration screen works
- [ ] Progress dots reflect current step
- [ ] Back/Next navigation works
- [ ] "Skip to full site" link works
- [ ] Refreshing preserves step position
- [ ] Home page entry card links to wizard

**Step 3: Commit and push**

```bash
git add -A
git commit -m "feat(wizard): complete beginner wizard mode with 14-step guided setup"
git push
```
