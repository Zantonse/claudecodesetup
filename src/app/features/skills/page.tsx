import { features } from "@/data/features";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";

export default function SkillsPage() {
  const feature = features.find((f) => f.slug === "skills")!;
  return <FeaturePageLayout feature={feature} />;
}
