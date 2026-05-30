"use client";

import React from "react";
import { motion } from "framer-motion";

interface VoiceWaveformProps {
  active: boolean;
  level?: number;
  barCount?: number;
  className?: string;
}

export function VoiceWaveform({ active, level = 0.5, barCount = 24, className = "" }: VoiceWaveformProps) {
  return (
    <div className={`flex items-center justify-center gap-[3px] h-8 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => {
        const center = barCount / 2;
        const dist = Math.abs(i - center) / center;
        const baseHeight = active ? 4 + (1 - dist) * 20 * level : 3;
        const maxHeight = active ? baseHeight + 8 * level : 4;

        return (
          <motion.div
            key={i}
            className="w-[2px] rounded-full bg-gradient-to-t from-cyber-cyan/40 to-cyber-cyan"
            animate={{
              height: active
                ? [baseHeight, maxHeight + Math.sin(i) * 4, baseHeight]
                : 3,
              opacity: active ? [0.5, 1, 0.5] : 0.2,
            }}
            transition={{
              duration: active ? 0.55 + (i % 5) * 0.06 : 0.8,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
              delay: i * 0.03,
            }}
          />
        );
      })}
    </div>
  );
}
