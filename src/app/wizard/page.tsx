"use client";

import { wizardSteps } from "@/data/wizard-steps";
import { useWizardProgress } from "@/lib/hooks/useWizardProgress";
import { WizardShell } from "@/components/wizard/WizardShell";
import { StepProgress } from "@/components/wizard/StepProgress";
import { WizardStepCard } from "@/components/wizard/WizardStepCard";

export default function WizardPage() {
  const { currentStep, next, back, goTo, isFirst, isLast } =
    useWizardProgress(wizardSteps.length);

  const step = wizardSteps[currentStep];

  return (
    <WizardShell>
      <StepProgress
        steps={wizardSteps}
        currentStep={currentStep}
        totalSteps={wizardSteps.length}
        onStepClick={goTo}
      />
      <WizardStepCard
        step={step}
        isFirst={isFirst}
        isLast={isLast}
        onNext={next}
        onBack={back}
      />
    </WizardShell>
  );
}
