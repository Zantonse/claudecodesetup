"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABEL_MAP: Record<string, string> = {
  fundamentals: "Fundamentals",
  features: "Features",
  hooks: "Hooks",
  skills: "Skills",
  "mcp-servers": "MCP Servers",
  commands: "Commands",
  agents: "Agents",
  plugins: "Plugins",
  settings: "Settings",
  "ide-integrations": "IDE Integrations",
  models: "Models",
  workflows: "Workflows",
  tips: "Tips & Tricks",
  ideas: "Idea Generator",
};

function segmentLabel(segment: string): string {
  return LABEL_MAP[segment] ?? segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname();

  // Hide on home
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return { label: segmentLabel(segment), href };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400">
        <li>
          <Link
            href="/"
            className="hover:text-slate-200 transition-colors duration-150"
          >
            Home
          </Link>
        </li>

        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {/* Separator */}
              <span className="text-slate-600" aria-hidden="true">
                /
              </span>

              {isLast ? (
                <span className="text-slate-200 font-medium" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-slate-200 transition-colors duration-150"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
