"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "bash", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/30 my-4">
      {title && (
        <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700/30 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">{title}</span>
          <span className="text-xs text-slate-500">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm font-mono bg-slate-900/50 text-slate-300">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
