"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function GlassCard({ children, className = "", hover = true, onClick, style }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-xl p-6 ${hover ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      style={style}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      {...(onClick ? { role: "button", tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } } : {})}
    >
      {children}
    </motion.div>
  );
}
