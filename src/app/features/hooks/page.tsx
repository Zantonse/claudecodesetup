import { features } from "@/data/features";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";

export default function HooksPage() {
  const feature = features.find((f) => f.slug === "hooks")!;
  return <FeaturePageLayout feature={feature} />;
}
