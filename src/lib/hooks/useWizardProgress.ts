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
