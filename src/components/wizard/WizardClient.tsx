"use client";

import { useState } from "react";
import { wizardSteps } from "@/data/wizard-steps";
import { useWizardProgress } from "@/lib/hooks/useWizardProgress";
import { WizardShell } from "@/components/wizard/WizardShell";
import { StepProgress } from "@/components/wizard/StepProgress";
import { WizardStepCard } from "@/components/wizard/WizardStepCard";

export default function WizardClient() {
  const { currentStep, next, back, goTo, reset, isFirst, isLast } =
    useWizardProgress(wizardSteps.length);

  // 1 = forward, -1 = backward
  const [direction, setDirection] = useState<number>(1);

  function handleNext() {
    setDirection(1);
    next();
  }

  function handleBack() {
    setDirection(-1);
    back();
  }

  function handleGoTo(step: number) {
    setDirection(step > currentStep ? 1 : -1);
    goTo(step);
  }

  function handleReset() {
    setDirection(1);
    reset();
  }

  const step = wizardSteps[currentStep];

  return (
    <WizardShell>
      <StepProgress
        steps={wizardSteps}
        currentStep={currentStep}
        totalSteps={wizardSteps.length}
        onStepClick={handleGoTo}
      />
      <WizardStepCard
        step={step}
        isFirst={isFirst}
        isLast={isLast}
        direction={direction}
        onNext={handleNext}
        onBack={handleBack}
        onReset={handleReset}
      />
    </WizardShell>
  );
}
