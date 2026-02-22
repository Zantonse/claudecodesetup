"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: "⌂" },
  { label: "Fundamentals", href: "/fundamentals", icon: "📖" },
  {
    label: "Features",
    href: "/features",
    icon: "⚡",
    children: [
      { label: "Hooks", href: "/features/hooks" },
      { label: "Skills", href: "/features/skills" },
      { label: "MCP Servers", href: "/features/mcp-servers" },
      { label: "Commands", href: "/features/commands" },
      { label: "Agents", href: "/features/agents" },
      { label: "Plugins", href: "/features/plugins" },
      { label: "Settings", href: "/features/settings" },
      { label: "IDE Integrations", href: "/features/ide-integrations" },
    ],
  },
  { label: "Models", href: "/models", icon: "🧠" },
  { label: "Workflows", href: "/workflows", icon: "🔄" },
  { label: "Tips & Tricks", href: "/tips", icon: "💡" },
  { label: "Idea Generator", href: "/ideas", icon: "🚀" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarContent = (
    <aside
      className="glass-card flex flex-col h-full rounded-none lg:rounded-none"
      style={{
        borderRadius: 0,
        borderTop: "none",
        borderBottom: "none",
        borderLeft: "none",
      }}
    >
      {/* Animated gradient line at top */}
      <div className="sidebar-gradient-line w-full flex-shrink-0" />

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/8 relative">
        {/* Ambient glow behind logo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 70%)",
          }}
        />
        <Link href="/" onClick={() => setMobileOpen(false)} className="relative z-10 block">
          <h1 className="text-xl font-bold gradient-text leading-tight">
            Claude Code
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium tracking-wide">
            Learning Hub
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);

          if (item.children) {
            const sectionActive = isActive(item.href);

            return (
              <div key={item.href}>
                {/* Parent row */}
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      sectionActive
                        ? "bg-primary-600/20 text-primary-400 shadow-[0_0_16px_rgba(124,58,237,0.25)] border-l-2 border-violet-500/70 pl-[10px]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-base w-5 text-center">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>

                  {/* Expand/collapse toggle */}
                  <button
                    onClick={() => setFeaturesExpanded((prev) => !prev)}
                    aria-label={featuresExpanded ? "Collapse Features" : "Expand Features"}
                    className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        featuresExpanded ? "rotate-0" : "-rotate-90"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Children */}
                {featuresExpanded && (
                  <ul className="mt-0.5 ml-5 pl-3 border-l border-white/8 space-y-0.5">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-3 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                              childActive
                                ? "bg-primary-600/20 text-primary-400 shadow-[0_0_10px_rgba(124,58,237,0.2)] border-l-2 border-violet-400/60 pl-[10px]"
                                : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-primary-600/20 text-primary-400 shadow-[0_0_16px_rgba(124,58,237,0.25)] border-l-2 border-violet-500/70 pl-[10px]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer — ThemeToggle */}
      <div className="px-4 py-4 border-t border-white/8">
        <ThemeToggle />
      </div>
    </aside>
  );

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800/90 border border-white/10 text-slate-300 hover:text-white transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — desktop always visible, mobile slide-in */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-40 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
