import { features } from "@/data/features";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";

export default function CommandsPage() {
  const feature = features.find((f) => f.slug === "commands")!;
  return <FeaturePageLayout feature={feature} />;
}
