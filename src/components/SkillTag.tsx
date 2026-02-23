interface SkillTagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function SkillTag({ label, active = false, onClick }: SkillTagProps) {
  const baseClasses = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
    active
      ? "bg-primary-600/30 text-primary-500 border border-primary-600/40 shadow-[0_0_8px_rgba(99,102,241,0.2)]"
      : "bg-slate-700/30 text-slate-400 border border-slate-600/20"
  }`;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} cursor-pointer hover:border-slate-500/40 hover:text-slate-300`}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={baseClasses}>
      {label}
    </span>
  );
}
