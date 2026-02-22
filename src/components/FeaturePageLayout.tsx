import type { Feature } from "@/lib/types";
import { SectionHeader } from "./SectionHeader";
import { CodeBlock } from "./CodeBlock";
import { GlassCard } from "./GlassCard";

export function FeaturePageLayout({ feature }: { feature: Feature }) {
  return (
    <div>
      <SectionHeader title={`${feature.icon} ${feature.title}`} subtitle={feature.summary} />

      {/* Description */}
      <section className="mb-12">
        <p className="text-slate-300 leading-relaxed text-lg">{feature.description}</p>
      </section>

      {/* Key Concepts */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Key Concepts</h2>
        <ul className="space-y-3">
          {feature.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300">
              <span className="text-emerald-400 mt-1 shrink-0">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Code Examples */}
      {feature.codeExamples.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Examples</h2>
          {feature.codeExamples.map((example, i) => (
            <div key={i} className="mb-6">
              {example.description && (
                <p className="text-sm text-slate-400 mb-2">{example.description}</p>
              )}
              <CodeBlock code={example.code} language={example.language} title={example.title} />
            </div>
          ))}
        </section>
      )}

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feature.useCases.map((useCase, i) => (
            <GlassCard key={i} hover={false} className="!p-4">
              <p className="text-sm text-slate-300">{useCase}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Tips</h2>
        <div className="space-y-3">
          {feature.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <span className="text-amber-400 shrink-0">💡</span>
              <p className="text-sm text-slate-300">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
