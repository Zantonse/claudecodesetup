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
        {/* Animated shifting gradient overlay */}
        <div className="absolute inset-0 hero-animated-gradient pointer-events-none" />

        {/* Animated gradient mesh background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(168, 85, 247, 0.30) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(99, 102, 241, 0.24) 0%, transparent 45%),
              radial-gradient(ellipse at 60% 80%, rgba(6, 182, 212, 0.20) 0%, transparent 45%),
              radial-gradient(ellipse at 50% 50%, rgba(124, 58, 237, 0.12) 0%, transparent 70%)
            `,
          }}
        />

        {/* Floating decorative orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg
            className="absolute orb-slow"
            style={{ top: "10%", left: "6%", opacity: 0.20 }}
            width="220"
            height="220"
            viewBox="0 0 220 220"
          >
            <circle cx="110" cy="110" r="110" fill="url(#orb1)" />
            <defs>
              <radialGradient id="orb1" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>

          <svg
            className="absolute orb-medium"
            style={{ top: "50%", right: "6%", opacity: 0.18 }}
            width="200"
            height="200"
            viewBox="0 0 200 200"
          >
            <circle cx="100" cy="100" r="100" fill="url(#orb2)" />
            <defs>
              <radialGradient id="orb2" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>

          <svg
            className="absolute orb-fast"
            style={{ bottom: "15%", left: "22%", opacity: 0.15 }}
            width="140"
            height="140"
            viewBox="0 0 140 140"
          >
            <circle cx="70" cy="70" r="70" fill="url(#orb3)" />
            <defs>
              <radialGradient id="orb3" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>

          <svg
            className="absolute orb-slow"
            style={{ top: "5%", right: "18%", opacity: 0.16 }}
            width="280"
            height="280"
            viewBox="0 0 280 280"
          >
            <circle cx="140" cy="140" r="140" fill="url(#orb4)" />
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
              href="/wizard"
              className="px-6 py-3 rounded-lg bg-cyan-600/80 hover:bg-cyan-500/80 text-white font-semibold transition-all text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_28px_rgba(6,182,212,0.5)]"
            >
              Guided Setup
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

      {/* Beginner Wizard Entry Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
      >
        <GlassCard
          hover={false}
          style={{
            borderLeft: "3px solid transparent",
            borderImage: "linear-gradient(to bottom, #7C3AED, #06B6D4) 1",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold gradient-text">New to coding?</h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Never used a terminal before? Our guided setup walks you through everything step by step — no experience needed.
              </p>
            </div>
            <Link
              href="/wizard"
              className="shrink-0 text-sm font-semibold text-violet-400 hover:text-violet-300 hover:underline transition-colors whitespace-nowrap"
            >
              Start Guided Setup &rarr;
            </Link>
          </div>
        </GlassCard>
      </motion.div>

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
