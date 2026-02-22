import { features } from "@/data/features";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";

export default function IdeIntegrationsPage() {
  const feature = features.find((f) => f.slug === "ide-integrations")!;
  return <FeaturePageLayout feature={feature} />;
}
