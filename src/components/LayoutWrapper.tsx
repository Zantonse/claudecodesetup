"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/AppShell";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/wizard")) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
