"use client";

import { Sidebar } from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main content — offset by sidebar width on desktop */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs />
          {children}
        </div>
      </main>
    </div>
  );
}
