"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Database, Shield, Github, ArrowRight, Activity } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

export default function LandingPage() {
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  const logs = [
    "NEURON SYSTEM INITIALIZING...",
    "LOADING COGNITIVE REASONING MATRIX v1.0.0...",
    "INTEGRATING VECTOR EMBEDDING INDICES [PORT 1536]...",
    "SYNAPSE ROUTERS: ONLINE",
    "ESTABLISHING TRANSIENT MEMORY SCHEMAS... OK",
    "ESTABLISHING SECURE AUTH SYMBOLS: ENCRYPTED",
    "SYSTEM SECURITY PROTOCOLS: ACTIVE",
    "NEURON OS IS ONLINE AND SYNCHRONIZED.",
  ];

  useEffect(() => {
    if (currentLine < logs.length) {
      const timer = setTimeout(() => {
        setBootLog((prev) => [...prev, logs[currentLine]]);
        setCurrentLine((c) => c + 1);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentLine]);

  return (
    <div className="relative min-h-screen bg-cyber-dark text-white overflow-hidden flex flex-col scanline">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 animate-grid-scroll pointer-events-none" />
      
      {/* Glowing Ambient Core Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyber-cyan/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full bg-cyber-purple/10 blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 select-none">
          <div className="relative w-6 h-6 border-2 border-cyber-cyan rounded flex items-center justify-center font-display font-black text-xs text-cyber-cyan shadow-[0_0_8px_rgba(0,255,255,0.4)]">
            N
            <span className="absolute -inset-0.5 border border-cyber-purple rounded opacity-40 animate-ping" />
          </div>
          <span className="font-display font-bold text-sm tracking-[0.25em] text-white">
            NEURON <span className="text-cyber-cyan">OS</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <CyberButton variant="ghost" size="sm">
              ACCESS CODE
            </CyberButton>
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <div className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer">
              <Github size={18} />
            </div>
          </a>
        </div>
      </header>

      {/* Main Section */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-12 justify-center">
        {/* Left column: Text */}
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan-dark/15 text-[10px] font-mono tracking-widest text-cyber-cyan uppercase font-bold"
          >
            <Activity size={10} className="animate-pulse" />
            PHASE 1 CORE ONLINE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none"
          >
            THE PERSONAL <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-pink-500">
              INTELLIGENCE LAYER
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm sm:text-base text-white/60 font-sans max-w-lg leading-relaxed self-center lg:self-start"
          >
            NEURON OS is a decentralized personal operating system. Activating a unified core of semantic memory indexing, autonomous agent scripting, and dynamic command control centers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2"
          >
            <Link href="/dashboard">
              <CyberButton variant="cyan" size="lg">
                LAUNCH COMMAND CENTER <ArrowRight size={16} className="ml-1" />
              </CyberButton>
            </Link>
            <Link href="/login">
              <CyberButton variant="ghost" size="lg">
                INITIALIZE ACCOUNT
              </CyberButton>
            </Link>
          </motion.div>
        </div>

        {/* Right column: Futuristic Boot console */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full lg:w-[480px] max-w-lg relative bg-black/60 rounded-2xl border border-white/5 p-6 backdrop-blur-md shadow-2xl overflow-hidden font-mono"
        >
          {/* Top bracket details */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-cyber-cyan/30" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-cyber-cyan/30" />
          <div className="flex items-center gap-2 mb-4 text-xs tracking-widest text-cyber-cyan/60 border-b border-white/5 pb-3">
            <Terminal size={14} />
            NEURON_BOOT_SEQUENCE.SH
          </div>

          <div className="flex flex-col gap-2 min-h-[220px] text-xs text-white/70">
            <AnimatePresence>
              {bootLog.map((log, idx) => {
                const isSystemOnline = log.includes("ONLINE AND SYNCHRONIZED");
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      isSystemOnline
                        ? "text-green-400 font-bold tracking-wider mt-2 border border-green-500/20 bg-green-500/5 p-2 rounded"
                        : log.includes("INITIALIZING")
                        ? "text-cyber-cyan"
                        : "text-white/60"
                    }
                  >
                    {isSystemOnline ? ">> " : "> "}
                    {log}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {currentLine < logs.length && (
              <span className="w-1.5 h-4 bg-cyber-cyan animate-pulse inline-block" />
            )}
          </div>

          {/* Matrix particles representation */}
          <div className="mt-6 flex justify-between items-center text-[10px] text-white/30 border-t border-white/5 pt-3">
            <span className="flex items-center gap-1.5">
              <Cpu size={10} /> CORE TEMP: 37°C
            </span>
            <span className="flex items-center gap-1.5">
              <Database size={10} /> SEGMENTS: 1,536
            </span>
            <span className="flex items-center gap-1.5">
              <Shield size={10} /> CRYPTO: AES-GCM
            </span>
          </div>
        </motion.div>
      </main>

      {/* Feature Section */}
      <section className="relative z-10 max-w-6xl w-full mx-auto px-6 py-12 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <Cpu className="text-cyber-cyan mb-4" size={24} />
            <h3 className="font-display font-bold text-sm uppercase tracking-wide mb-2">
              Neural Orchestrator
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Provides real-time streaming interfaces leveraging modern language models. Injects relevant personal context.
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <Database className="text-cyber-purple mb-4" size={24} />
            <h3 className="font-display font-bold text-sm uppercase tracking-wide mb-2">
              Semantic Memory Core
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Computes and queries mathematical vector embeddings in the background to capture user notes and conversation history.
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <Shield className="text-cyber-cyan mb-4" size={24} />
            <h3 className="font-display font-bold text-sm uppercase tracking-wide mb-2">
              Secure Auth Environment
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Maintains secure token sessions and local JWT credentials to safeguard sensitive life notes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="relative z-10 border-t border-white/5 bg-black/60 py-4 px-6 text-center text-[10px] font-mono text-white/30">
        NEURON OS v1.0.0-Beta | LICENSED UNDER THE MIT PROTOCOL | EST. 2026
      </footer>
    </div>
  );
}
