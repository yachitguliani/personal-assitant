"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";

interface BurnoutGaugeProps {
  score: number;
  threshold?: number;
  label?: string;
}

export function BurnoutGauge({ score, threshold = 65, label = "Burnout Risk" }: BurnoutGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elevated = score > threshold;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = size * 0.38;
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    const sweep = endAngle - startAngle;
    const progress = Math.min(score / 100, 1);

    ctx.clearRect(0, 0, size, size);

    // Track
    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.stroke();

    // Progress arc
    const color = elevated
      ? `rgba(255, 60, 80, ${0.7 + progress * 0.3})`
      : score > 40
        ? "rgba(255, 200, 50, 0.85)"
        : "rgba(0, 255, 255, 0.85)";

    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, startAngle + sweep * progress);
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.shadowColor = elevated ? "rgba(255,60,80,0.8)" : "rgba(0,255,255,0.5)";
    ctx.shadowBlur = elevated ? 18 : 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Threshold marker
    const thresholdAngle = startAngle + sweep * (threshold / 100);
    const tx = center + Math.cos(thresholdAngle) * (radius + 14);
    const ty = center + Math.sin(thresholdAngle) * (radius + 14);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "8px monospace";
    ctx.textAlign = "center";
    ctx.fillText("65", tx, ty);
  }, [score, threshold, elevated]);

  return (
    <GlassCard
      glowColor={elevated ? "none" : "cyan"}
      className={`py-4 ${elevated ? "border-cyber-red/40 shadow-[0_0_20px_rgba(255,60,80,0.15)]" : ""}`}
    >
      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 mb-3 block">
        {label}
      </span>
      <div className="flex flex-col items-center">
        <motion.div
          animate={elevated ? { scale: [1, 1.02, 1] } : {}}
          transition={{ repeat: elevated ? Infinity : 0, duration: 2 }}
        >
          <canvas ref={canvasRef} width={180} height={180} className="mx-auto" />
        </motion.div>
        <div className="text-center -mt-10">
          <span
            className={`font-display text-3xl font-black ${
              elevated ? "text-cyber-red" : score > 40 ? "text-yellow-400" : "text-cyber-cyan"
            }`}
          >
            {Math.round(score)}
          </span>
          <span className="text-[10px] font-mono text-white/40 ml-1">/100</span>
        </div>
        <p className="text-[9px] font-mono text-white/40 mt-2 uppercase tracking-wider">
          {elevated ? "Warning threshold exceeded" : score > 40 ? "Elevated drift" : "Systems nominal"}
        </p>
      </div>
    </GlassCard>
  );
}
