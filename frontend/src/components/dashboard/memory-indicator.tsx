"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Activity } from "lucide-react";

interface MemoryIndicatorProps {
  activity: number;
}

export function MemoryIndicator({ activity }: MemoryIndicatorProps) {
  const bars = 12;
  const activeBars = Math.floor((activity / 100) * bars);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-1">
          <BrainCircuit size={10} className="text-cyber-purple" /> Memory Activity
        </span>
        <span className="text-[9px] font-mono text-cyber-purple font-bold">{Math.round(activity)}%</span>
      </div>

      <div className="flex items-end gap-0.5 h-8">
        {Array.from({ length: bars }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              background:
                i < activeBars
                  ? `linear-gradient(to top, hsl(270, 100%, ${30 + i * 4}%), hsl(270, 100%, 60%))`
                  : "rgba(255,255,255,0.05)",
            }}
            animate={
              i < activeBars
                ? { height: [`${30 + Math.random() * 40}%`, `${50 + Math.random() * 50}%`, `${30 + Math.random() * 40}%`] }
                : { height: "15%" }
            }
            transition={{ duration: 1 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-[8px] font-mono text-white/25">
        <Activity size={8} className="text-cyber-cyan animate-pulse" />
        Semantic index synchronized
      </div>
    </div>
  );
}
