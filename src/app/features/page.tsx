"use client";

import { motion } from "framer-motion";
import { features } from "@/data/features";
import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeader } from "@/components/SectionHeader";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function FeaturesPage() {
  return (
    <div>
      <SectionHeader
        title="Features"
        subtitle="Deep dive into every Claude Code capability."
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature) => (
          <motion.div key={feature.id} variants={itemVariants}>
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              summary={feature.summary}
              href={`/features/${feature.slug}`}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
