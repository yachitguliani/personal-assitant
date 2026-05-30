"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOrb } from "./ai-orb";
import { StartupHud } from "./startup-hud";
import { VoiceWaveform } from "./voice-waveform";
import { AmbientParticles } from "./ambient-particles";
import { useNeuronVoice } from "@/hooks/use-neuron-voice";
import { buildStartupContext, BOOT_KERNEL_LINES, STARTUP_STATUS_MODULES, type StartupContext } from "@/lib/startup-data";
import { CyberButton } from "@/components/ui/cyber-button";
import { Volume2 } from "lucide-react";

type BootPhase = "kernel" | "awakening" | "intro" | "transition" | "done";

interface BootSequenceProps {
  userName?: string;
  onComplete: () => void;
}

export function BootSequence({ userName, onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<BootPhase>("kernel");
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [bootProgress, setBootProgress] = useState(0);
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [awakenProgress, setAwakenProgress] = useState(0);
  const [startupCtx, setStartupCtx] = useState<StartupContext | null>(null);
  const [subtitle, setSubtitle] = useState("");
  const [orbState, setOrbState] = useState<"awakening" | "thinking" | "speaking" | "idle">("awakening");
  const [voiceStarted, setVoiceStarted] = useState(false);
  const introStartedRef = useRef(false);
  const completedRef = useRef(false);

  const finishBoot = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setPhase("transition");
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 1200);
  }, [onComplete]);

  const { audioLevel, speakSequence, cancel, isSpeaking, needsUnlock, unlockAndSpeak } = useNeuronVoice({
    onLineStart: (line) => {
      setVoiceStarted(true);
      setSubtitle(line);
      setOrbState("speaking");
    },
    onLineEnd: () => setOrbState("thinking"),
    onComplete: finishBoot,
    onSpeakingChange: (speaking) => {
      if (!speaking && phase === "intro") setOrbState("idle");
    },
  });

  const handleSkip = useCallback(() => {
    cancel();
    finishBoot();
  }, [cancel, finishBoot]);

  useEffect(() => {
    buildStartupContext(userName).then(setStartupCtx);
  }, [userName]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") handleSkip();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleSkip]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_KERNEL_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, line.text]);
          setBootProgress(((i + 1) / (BOOT_KERNEL_LINES.length + 3)) * 70);
        }, line.delay)
      );
    });

    STARTUP_STATUS_MODULES.forEach((mod) => {
      timers.push(
        setTimeout(() => {
          setActiveModules((prev) => [...prev, mod.id]);
        }, mod.delay)
      );
    });

    timers.push(setTimeout(() => setPhase("awakening"), 3200));

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "awakening") return;

    const start = performance.now();
    const duration = 2200;

    const tick = () => {
      const elapsed = performance.now() - start;
      const progress = Math.min(1, elapsed / duration);
      setAwakenProgress(progress);
      setBootProgress(70 + progress * 20);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setPhase("intro");
        setOrbState("thinking");
        setBootProgress(95);
      }
    };

    requestAnimationFrame(tick);
  }, [phase]);

  const startVoiceIntro = useCallback(async () => {
    if (!startupCtx) return;
    setVoiceStarted(true);
    setOrbState("thinking");
    await unlockAndSpeak(startupCtx.lines);
  }, [startupCtx, unlockAndSpeak]);

  useEffect(() => {
    if (phase !== "intro" || !startupCtx || introStartedRef.current) return;
    introStartedRef.current = true;
    setBootProgress(100);
    setActiveModules(STARTUP_STATUS_MODULES.map((m) => m.id));

    const autoTimer = setTimeout(() => {
      speakSequence(startupCtx.lines);
    }, 600);

    return () => clearTimeout(autoTimer);
  }, [phase, startupCtx, speakSequence]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-cyber-dark flex flex-col items-center justify-center scanline overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: phase === "transition" ? 0 : 1 }}
          transition={{ duration: phase === "transition" ? 1.2 : 0.3 }}
        >
          <AmbientParticles />
          <div className="absolute inset-0 cyber-grid opacity-15" />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-cyan/5 blur-[120px]"
            animate={{
              width: phase === "intro" ? 700 : 500,
              height: phase === "intro" ? 700 : 500,
              opacity: phase === "intro" ? 0.15 : 0.08,
            }}
            transition={{ duration: 2 }}
          />

          <StartupHud
            bootProgress={bootProgress}
            activeModules={activeModules}
            timeDisplay={startupCtx?.timeDisplay ?? ""}
            location={startupCtx?.location ?? ""}
            scanning={phase === "kernel"}
          />

          {(phase === "awakening" || phase === "intro" || phase === "transition") && (
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: phase === "awakening" ? 2 : 0.8, ease: "easeOut" }}
            >
              <AiOrb
                state={orbState}
                size={phase === "intro" ? 200 : 160}
                audioLevel={audioLevel}
                awakenProgress={phase === "awakening" ? awakenProgress : 1}
              />

              {phase === "intro" && (
                <motion.div
                  className="mt-10 flex flex-col items-center gap-4 max-w-md px-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <VoiceWaveform active={isSpeaking} level={audioLevel} barCount={28} />

                  {(needsUnlock || !voiceStarted) && !isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <CyberButton
                        variant="cyan"
                        size="sm"
                        onClick={startVoiceIntro}
                        className={needsUnlock ? "animate-glow-breathe" : ""}
                      >
                        <Volume2 size={14} className="mr-1.5" />
                        ACTIVATE VOICE INTERFACE
                      </CyberButton>
                      <span className="text-[9px] font-mono text-white/30 tracking-wider">
                        {needsUnlock ? "Browser requires a click to enable audio" : "Tap to hear NEURON"}
                      </span>
                    </motion.div>
                  )}

                  <AnimatePresence mode="wait">
                    {subtitle && (
                      <motion.p
                        key={subtitle}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="text-sm md:text-base font-sans text-white/85 text-center leading-relaxed tracking-wide"
                      >
                        {subtitle}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === "kernel" && (
            <div className="relative z-10 w-full max-w-lg px-8 mt-auto mb-auto">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 border-2 border-cyber-cyan rounded flex items-center justify-center font-display font-black text-sm text-cyber-cyan shadow-[0_0_12px_rgba(0,255,255,0.4)]">
                  N
                </div>
                <span className="font-display font-bold text-sm tracking-[0.3em] text-white">
                  NEURON <span className="text-cyber-cyan">OS</span>
                </span>
              </div>

              <div className="font-mono text-[11px] space-y-1.5 min-h-[180px]">
                {visibleLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-cyber-cyan/50">&gt;</span>
                    <span className={i === visibleLines.length - 1 ? "text-cyber-cyan" : "text-white/50"}>
                      {line}
                    </span>
                    {i === visibleLines.length - 1 && (
                      <span className="w-1.5 h-3 bg-cyber-cyan animate-pulse inline-block" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-[9px] font-mono text-white/30 mb-1">
                  <span>SYSTEM INITIALIZATION</span>
                  <span>{Math.round(bootProgress)}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
                    style={{ width: `${bootProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <motion.button
            onClick={handleSkip}
            className="absolute bottom-6 right-6 z-20 text-[9px] font-mono text-white/20 hover:text-white/50 uppercase tracking-widest transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Press any key to skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
