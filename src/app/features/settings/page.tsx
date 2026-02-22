import { features } from "@/data/features";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";

export default function SettingsPage() {
  const feature = features.find((f) => f.slug === "settings")!;
  return <FeaturePageLayout feature={feature} />;
}
