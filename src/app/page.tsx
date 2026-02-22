"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";

const quickStartCards = [
  {
    emoji: "📚",
    title: "Fundamentals",
    description: "Start here — installation, authentication, and core concepts.",
    href: "/fundamentals",
  },
  {
    emoji: "⚡",
    title: "Features",
    description: "Explore every tool and capability Claude Code has to offer.",
    href: "/features",
  },
  {
    emoji: "🤖",
    title: "Models",
    description: "Compare Claude models and choose the right one for each task.",
    href: "/models",
  },
  {
    emoji: "🔄",
    title: "Workflows",
    description: "Real-world workflows for common development tasks.",
    href: "/workflows",
  },
  {
    emoji: "💡",
    title: "Tips & Tricks",
    description: "Power-user tips to get the most out of Claude Code.",
    href: "/tips",
  },
  {
    emoji: "🚀",
    title: "Idea Generator",
    description: "Browse and filter project ideas matched to your skill level.",
    href: "/ideas",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section
        className="noise-overlay rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4C1D95 0%, #4338CA 50%, #6D28D9 100%)",
          padding: "3rem 2rem",
        }}
      >
        <div className="relative z-10 text-center space-y-4">
          <h1
            className="text-4xl lg:text-6xl font-extrabold gradient-text"
            style={{ lineHeight: 1.15 }}
          >
            Master Claude Code
          </h1>
          <p className="text-slate-300 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Your personal learning hub for mastering Claude Code — features, workflows, and
            project-based learning.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/fundamentals"
              className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors text-sm"
            >
              Get Started
            </Link>
            <Link
              href="/features"
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors text-sm border border-white/20"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Quick-start Cards */}
      <section>
        <h2 className="text-xl font-semibold text-slate-300 mb-6">Quick Start</h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {quickStartCards.map((card) => (
            <motion.div key={card.href} variants={cardVariants}>
              <Link href={card.href} className="block h-full">
                <GlassCard className="h-full">
                  <div className="flex flex-col gap-2">
                    <span className="text-3xl">{card.emoji}</span>
                    <h3 className="text-base font-semibold text-slate-100">{card.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
