import { features } from "@/data/features";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";

export default function PluginsPage() {
  const feature = features.find((f) => f.slug === "plugins")!;
  return <FeaturePageLayout feature={feature} />;
}
