import { features } from "@/data/features";
import { FeaturePageLayout } from "@/components/FeaturePageLayout";

export default function McpServersPage() {
  const feature = features.find((f) => f.slug === "mcp-servers")!;
  return <FeaturePageLayout feature={feature} />;
}
