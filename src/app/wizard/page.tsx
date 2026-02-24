"use client";

import dynamic from "next/dynamic";

// Client-only rendering: the wizard reads from localStorage on mount,
// which would cause a hydration mismatch if server-rendered.
const WizardClient = dynamic(
  () => import("@/components/wizard/WizardClient"),
  { ssr: false }
);

export default function WizardPage() {
  return <WizardClient />;
}
