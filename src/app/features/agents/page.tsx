import { features } from "@/data/features";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";

export default function AgentsPage() {
  const feature = features.find((f) => f.slug === "agents")!;
  return <FeaturePageLayout feature={feature} />;
}
