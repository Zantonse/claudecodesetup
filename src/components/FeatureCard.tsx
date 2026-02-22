import Link from "next/link";
import { GlassCard } from "./GlassCard";

interface FeatureCardProps {
  icon: string;
  title: string;
  summary: string;
  href: string;
}

export function FeatureCard({ icon, title, summary, href }: FeatureCardProps) {
  return (
    <Link href={href}>
      <GlassCard>
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{summary}</p>
      </GlassCard>
    </Link>
  );
}
