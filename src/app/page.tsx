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
        className="noise-overlay ambient-glow rounded-2xl overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #2D1B69 0%, #1E1B4B 30%, #0F172A 60%, #1a1040 100%)",
          padding: "6rem 2rem",
        }}
      >
        {/* Animated gradient mesh background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.18) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(79, 70, 229, 0.14) 0%, transparent 45%),
              radial-gradient(ellipse at 60% 80%, rgba(6, 182, 212, 0.10) 0%, transparent 45%)
            `,
          }}
        />

        {/* Floating decorative orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg
            className="absolute orb-slow"
            style={{ top: "15%", left: "8%", opacity: 0.15 }}
            width="120"
            height="120"
            viewBox="0 0 120 120"
          >
            <circle cx="60" cy="60" r="60" fill="url(#orb1)" />
            <defs>
              <radialGradient id="orb1" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>

          <svg
            className="absolute orb-medium"
            style={{ top: "55%", right: "10%", opacity: 0.12 }}
            width="90"
            height="90"
            viewBox="0 0 90 90"
          >
            <circle cx="45" cy="45" r="45" fill="url(#orb2)" />
            <defs>
              <radialGradient id="orb2" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>

          <svg
            className="absolute orb-fast"
            style={{ bottom: "20%", left: "25%", opacity: 0.10 }}
            width="60"
            height="60"
            viewBox="0 0 60 60"
          >
            <circle cx="30" cy="30" r="30" fill="url(#orb3)" />
            <defs>
              <radialGradient id="orb3" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>

          <svg
            className="absolute orb-slow"
            style={{ top: "10%", right: "20%", opacity: 0.08 }}
            width="160"
            height="160"
            viewBox="0 0 160 160"
          >
            <circle cx="80" cy="80" r="80" fill="url(#orb4)" />
            <defs>
              <radialGradient id="orb4" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1
              className="text-4xl lg:text-6xl font-extrabold gradient-text"
              style={{ lineHeight: 1.15, fontFamily: "var(--font-display, inherit)" }}
            >
              Master Claude Code
            </h1>
          </motion.div>
          <motion.p
            className="text-slate-300 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            Your personal learning hub for mastering Claude Code — features, workflows, and
            project-based learning.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 justify-center pt-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
          >
            <Link
              href="/fundamentals"
              className="px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all text-sm shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_28px_rgba(124,58,237,0.6)]"
            >
              Get Started
            </Link>
            <Link
              href="/features"
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors text-sm border border-white/20 hover:border-white/40"
            >
              Explore Features
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick-start Cards */}
      <section>
        <h2 className="text-xl font-semibold text-slate-300 mb-6" style={{ fontFamily: "var(--font-display, inherit)" }}>Quick Start</h2>
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
