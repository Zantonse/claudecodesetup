interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl lg:text-4xl font-bold gradient-text mb-2">{title}</h1>
      {subtitle && <p className="text-lg text-slate-400">{subtitle}</p>}
    </div>
  );
}
