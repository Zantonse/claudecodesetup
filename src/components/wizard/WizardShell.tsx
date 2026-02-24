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
