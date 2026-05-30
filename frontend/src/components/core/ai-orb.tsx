"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { OrbState } from "@/context/neuron-os-context";

interface AiOrbProps {
  state: OrbState;
  size?: number;
  className?: string;
  audioLevel?: number;
  awakenProgress?: number;
}

const STATE_COLORS: Record<OrbState, { primary: string; secondary: string; glow: string }> = {
  idle: { primary: "rgba(0,255,255,0.9)", secondary: "rgba(168,85,247,0.6)", glow: "rgba(0,255,255,0.4)" },
  awakening: { primary: "rgba(0,255,255,0.5)", secondary: "rgba(168,85,247,0.3)", glow: "rgba(0,255,255,0.2)" },
  listening: { primary: "rgba(0,255,255,1)", secondary: "rgba(34,211,238,0.8)", glow: "rgba(0,255,255,0.7)" },
  typing: { primary: "rgba(168,85,247,0.9)", secondary: "rgba(0,255,255,0.5)", glow: "rgba(168,85,247,0.5)" },
  thinking: { primary: "rgba(168,85,247,1)", secondary: "rgba(0,255,255,0.4)", glow: "rgba(168,85,247,0.6)" },
  speaking: { primary: "rgba(0,255,255,1)", secondary: "rgba(168,85,247,0.9)", glow: "rgba(0,255,255,0.8)" },
};

const STATE_LABELS: Record<OrbState, string> = {
  idle: "STANDBY",
  awakening: "INITIALIZING",
  listening: "LISTENING",
  typing: "INPUT DETECTED",
  thinking: "PROCESSING",
  speaking: "ONLINE",
};

export function AiOrb({ state, size = 180, className = "", audioLevel = 0, awakenProgress = 1 }: AiOrbProps) {
  const colors = STATE_COLORS[state];
  const isActive = state !== "idle" && state !== "awakening";
  const isAwakening = state === "awakening";
  const isSpeaking = state === "speaking";

  const effectiveAwaken = isAwakening ? awakenProgress : 1;
  const speakIntensity = isSpeaking ? 0.6 + audioLevel * 0.4 : 1;

  const pulseSpeed = useMemo(() => {
    switch (state) {
      case "listening": return 0.8;
      case "thinking": return 0.5;
      case "speaking": return 0.4 + (1 - audioLevel) * 0.3;
      case "awakening": return 3;
      case "typing": return 1.5;
      default: return 2;
    }
  }, [state, audioLevel]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size * effectiveAwaken }}
    >
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border"
          style={{
            width: size * (0.7 + ring * 0.22) * effectiveAwaken,
            height: size * (0.7 + ring * 0.22) * effectiveAwaken,
            borderColor: `rgba(0, 255, 255, ${0.05 + effectiveAwaken * 0.12})`,
            opacity: effectiveAwaken,
          }}
          animate={{
            scale: isSpeaking
              ? [1, 1 + audioLevel * 0.08, 1]
              : isActive
                ? [1, 1.05, 1]
                : isAwakening
                  ? [0.8, 0.95, 0.8]
                  : [1, 1.02, 1],
            opacity: isAwakening
              ? [0.1, 0.3 * effectiveAwaken, 0.1]
              : isActive
                ? [0.3, 0.6, 0.3]
                : [0.15, 0.3, 0.15],
            rotate: state === "thinking" ? [0, 180, 360] : 0,
          }}
          transition={{
            duration: pulseSpeed * ring,
            repeat: Infinity,
            ease: "easeInOut",
            delay: ring * 0.2,
          }}
        />
      ))}

      {(state === "listening" || state === "speaking") && (
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          {Array.from({ length: state === "speaking" ? 12 : 8 }).map((_, i) => (
            <motion.div
              key={i}
              className={`rounded-full ${state === "speaking" ? "w-[3px] bg-cyber-cyan" : "w-0.5 bg-cyber-cyan"}`}
              animate={{
                height: state === "speaking"
                  ? [6, 12 + audioLevel * 28 + Math.sin(i) * 6, 6]
                  : [8, 24 + Math.random() * 16, 8],
              }}
              transition={{ duration: state === "speaking" ? 0.15 + i * 0.02 : 0.4 + i * 0.05, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="relative rounded-full"
        style={{
          width: size * 0.55 * effectiveAwaken,
          height: size * 0.55 * effectiveAwaken,
        }}
        animate={{
          y: state === "idle" ? [0, -8, 0] : isAwakening ? [4, 0] : [0, -4, 0],
          scale: isSpeaking
            ? [1, 1 + audioLevel * 0.08 * speakIntensity, 1]
            : state === "thinking"
              ? [1, 0.97, 1.03, 1]
              : isAwakening
                ? effectiveAwaken
                : 1,
        }}
        transition={{
          y: { duration: state === "idle" ? 4 : isAwakening ? 2 : 1.5, repeat: isAwakening ? 0 : Infinity, ease: "easeInOut" },
          scale: {
            duration: isSpeaking ? 0.25 : isAwakening ? 2 : 1.2,
            repeat: isAwakening ? 0 : Infinity,
          },
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ background: colors.glow }}
          animate={{
            opacity: isAwakening
              ? effectiveAwaken * 0.5
              : isSpeaking
                ? [0.5 + audioLevel * 0.2, 1, 0.5 + audioLevel * 0.2]
                : isActive
                  ? [0.5, 1, 0.5]
                  : [0.3, 0.5, 0.3],
            scale: isSpeaking ? [1, 1 + audioLevel * 0.3, 1] : isActive ? [1, 1.2, 1] : [1, 1.05, 1],
          }}
          transition={{ duration: isSpeaking ? 0.2 : pulseSpeed, repeat: Infinity }}
        />

        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${colors.primary}, ${colors.secondary} 50%, rgba(3,7,18,0.9) 100%)`,
            boxShadow: `0 0 ${30 + audioLevel * 30}px ${colors.glow}, inset 0 0 30px rgba(0,255,255,${0.05 + effectiveAwaken * 0.1})`,
            opacity: effectiveAwaken,
          }}
        >
          <div className="absolute top-[15%] left-[20%] w-[30%] h-[20%] rounded-full bg-white/20 blur-md" />

          <motion.div
            className="absolute inset-0"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, rgba(0,255,255,0.15) 10%, transparent 20%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: state === "thinking" ? 2 : isAwakening ? 8 : 6, repeat: Infinity, ease: "linear" }}
          />

          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />

          {state === "thinking" &&
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-cyber-purple"
                style={{ top: "50%", left: "50%" }}
                animate={{
                  x: [0, Math.cos((i / 6) * Math.PI * 2) * 30],
                  y: [0, Math.sin((i / 6) * Math.PI * 2) * 30],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}

          {isAwakening && (
            <motion.div
              className="absolute inset-0 bg-cyber-cyan/10"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            width: 6 + audioLevel * 4,
            height: 6 + audioLevel * 4,
            boxShadow: `0 0 ${12 + audioLevel * 16}px ${colors.primary}`,
          }}
          animate={{
            opacity: isAwakening ? effectiveAwaken * 0.8 : [0.6, 1, 0.6],
            scale: isSpeaking ? [0.9, 1 + audioLevel * 0.3, 0.9] : [0.8, 1.2, 0.8],
          }}
          transition={{ duration: isSpeaking ? 0.15 : pulseSpeed * 0.5, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: effectiveAwaken }}
      >
        <span className="text-[8px] font-mono tracking-[0.3em] text-cyber-cyan/70 uppercase">
          {STATE_LABELS[state]}
        </span>
      </motion.div>
    </div>
  );
}
