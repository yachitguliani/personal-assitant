"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "none";
  animated?: boolean;
}

export function GlassCard({
  children,
  className = "",
  glowColor = "none",
  animated = false,
}: GlassCardProps) {
  const glowClasses = {
    cyan: "border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,255,255,0.08)]",
    purple: "border-cyber-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.08)]",
    none: "border-white/5",
  };

  const Component = animated ? motion.div : "div";
  const motionProps = animated
    ? {
        whileHover: { scale: 1.01, borderColor: "rgba(0, 255, 255, 0.4)" },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Component
      {...motionProps}
      className={`relative overflow-hidden rounded-xl border bg-cyber-glass p-5 backdrop-blur-md ${glowClasses[glowColor]} ${className}`}
    >
      {/* Cinematic corner brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-cyan/40" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan/40" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-cyan/40" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-cyan/40" />

      {/* Decorative background grid pattern layer */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

      <div className="relative z-10">{children}</div>
    </Component>
  );
}
