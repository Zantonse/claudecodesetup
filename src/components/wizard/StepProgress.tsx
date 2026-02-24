"use client";

import { motion } from "framer-motion";
import { WizardStep, PHASE_COLORS } from "@/lib/types";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: WizardStep[];
  onStepClick?: (step: number) => void;
}

export function StepProgress({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}: StepProgressProps) {
  // Group step indices by phase for rendering with gaps between phases
  const phases: number[][] = [];
  let currentPhase: number | null = null;
  let currentGroup: number[] = [];

  steps.forEach((step, index) => {
    if (step.phase !== currentPhase) {
      if (currentGroup.length > 0) {
        phases.push(currentGroup);
      }
      currentGroup = [index];
      currentPhase = step.phase;
    } else {
      currentGroup.push(index);
    }
  });
  if (currentGroup.length > 0) {
    phases.push(currentGroup);
  }

  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
      className="flex items-center justify-center gap-3 py-2"
    >
      {phases.map((group, phaseIdx) => {
        const phaseNumber = steps[group[0]].phase as keyof typeof PHASE_COLORS;
        const phaseColor = PHASE_COLORS[phaseNumber];

        return (
          <div key={phaseIdx} className="flex items-center gap-1.5">
            {group.map((stepIndex) => {
              const isCompleted = stepIndex < currentStep;
              const isCurrent = stepIndex === currentStep;
              const isFuture = stepIndex > currentStep;
              const isClickable = isCompleted && onStepClick != null;

              const dotSize = isCurrent ? 12 : 8;

              const dotStyle: React.CSSProperties = {
                width: dotSize,
                height: dotSize,
                backgroundColor: isFuture ? undefined : phaseColor,
                boxShadow: isCurrent
                  ? `0 0 8px 2px ${phaseColor}80, 0 0 16px 4px ${phaseColor}40`
                  : undefined,
              };

              if (isClickable) {
                return (
                  <motion.button
                    key={stepIndex}
                    onClick={() => onStepClick(stepIndex)}
                    title={`Go to step ${stepIndex + 1}: ${steps[stepIndex].headline}`}
                    aria-label={`Go to step ${stepIndex + 1}: ${steps[stepIndex].headline}`}
                    className="rounded-full bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer"
                    style={dotStyle}
                    whileHover={{ scale: 1.3 }}
                    whileFocus={{ scale: 1.3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  />
                );
              }

              if (isCurrent) {
                return (
                  <motion.div
                    key={stepIndex}
                    className="rounded-full"
                    style={dotStyle}
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    aria-current="step"
                  />
                );
              }

              // Future step — static dim dot
              return (
                <div
                  key={stepIndex}
                  className="rounded-full bg-slate-700"
                  style={{ width: dotSize, height: dotSize }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
