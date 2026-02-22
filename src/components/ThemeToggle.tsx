"use client";

import { useTheme } from "@/lib/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
        bg-slate-800/60 hover:bg-slate-700/60 border border-white/10
        text-slate-300 hover:text-slate-100
        transition-all duration-200 cursor-pointer select-none
        light:bg-slate-200/60 light:hover:bg-slate-300/60 light:border-black/10 light:text-slate-600 light:hover:text-slate-900"
    >
      {/* Track */}
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
          isDark ? "bg-primary-600" : "bg-slate-400"
        }`}
      >
        {/* Thumb */}
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-300 ${
            isDark ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </span>

      {/* Icon */}
      <span className="text-base leading-none">
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
