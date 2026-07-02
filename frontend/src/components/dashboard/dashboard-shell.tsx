"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, Activity, Hash, Heart, BarChart3 } from "lucide-react";
import { NeuronOsProvider, useNeuronOs } from "@/context/neuron-os-context";
import { BootSequence } from "@/components/core/boot-sequence";
import { AmbientParticles } from "@/components/core/ambient-particles";
import { CommandPalette } from "@/components/core/command-palette";
import { HudHeader } from "@/components/dashboard/hud-header";
import { ChatPanel } from "@/components/dashboard/chat-panel";
import { FileExplorer } from "@/components/dashboard/file-explorer";
import { TelemetryFeed } from "@/components/dashboard/telemetry-feed";
import { ProcessTerminal } from "@/components/dashboard/process-terminal";
import { MemoryIndicator } from "@/components/dashboard/memory-indicator";
import { MemorySearchPanel } from "@/components/dashboard/memory-search-panel";
import { SystemStatus } from "@/components/system-status";
import { VectorViz } from "@/components/vector-viz";
import { GlassCard } from "@/components/ui/glass-card";
import { getAuthToken } from "@/utils/api";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useBurnoutRisk } from "@/hooks/use-burnout-risk";
import Link from "next/link";
import type { FSNode } from "@/lib/mock-filesystem";

function DashboardInner() {
  const router = useRouter();
  const {
    bootComplete, setBootComplete, commandPaletteOpen, setCommandPaletteOpen,
    telemetryEvents, processLogs, advanceProcess, systemLogs,
    memoryActivity, activePanel, setActivePanel,
    addSystemLog, addProcessLog, triggerMemoryPulse,
    activeConvId, setActiveConvId, clearProcessLogs,
  } = useNeuronOs();

  const [user, setUser] = useState<{ full_name?: string } | null>(null);
  const [openedFile, setOpenedFile] = useState<FSNode | null>(null);
  const { risk } = useBurnoutRisk();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }
    const cached = localStorage.getItem("neuron_user");
    if (cached) setUser(JSON.parse(cached));
  }, [router]);

  useKeyboardShortcut("k", () => setCommandPaletteOpen(!commandPaletteOpen), { ctrl: true });

  const handlePaletteSelect = useCallback((id: string) => {
    switch (id) {
      case "toggle-files":
        setActivePanel(activePanel === "files" ? "chat" : "files");
        break;
      case "toggle-palette":
        setCommandPaletteOpen(true);
        break;
      case "command-help":
      case "scan":
      case "sync":
      case "ls":
        addProcessLog(id === "command-help" ? "help" : id);
        triggerMemoryPulse();
        break;
      case "system-status":
        addProcessLog("status");
        triggerMemoryPulse();
        break;
      case "mkdir":
        setActivePanel("files");
        addSystemLog("Navigate to Files panel to create folders");
        break;
      case "touch":
        setActivePanel("files");
        addSystemLog("Navigate to Files panel to create files");
        break;
      case "new-chat":
        setActiveConvId(null);
        setActivePanel("chat");
        addSystemLog("New chat initialized");
        break;
      case "search-memory":
        setTimeout(() => {
          document.getElementById("memory-search-input")?.focus();
        }, 100);
        addSystemLog("Memory search panel focused");
        break;
      case "open-life-os":
        router.push("/dashboard/life");
        addSystemLog("Redirecting to Life OS panel");
        break;
      case "clear-terminal":
        clearProcessLogs();
        addSystemLog("Terminal logs cleared");
        break;
      default:
        break;
    }
  }, [activePanel, setActivePanel, setCommandPaletteOpen, addProcessLog, addSystemLog, triggerMemoryPulse, setActiveConvId, router, clearProcessLogs]);

  if (!bootComplete) {
    return <BootSequence userName={user?.full_name} onComplete={() => setBootComplete(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-cyber-dark text-white flex flex-col overflow-hidden font-sans scanline">
      <AmbientParticles />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyber-cyan/3 blur-[120px] pointer-events-none" />

      <HudHeader userName={user?.full_name} onCommandPalette={() => setCommandPaletteOpen(true)} />

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row h-[calc(100vh-45px)] overflow-hidden">
        {/* Left sidebar — file explorer or system logs */}
        <aside className="w-full lg:w-56 border-r border-white/5 bg-black/35 flex flex-col shrink-0 hidden lg:flex">
          <div className="p-3 border-b border-white/5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">
              {activePanel === "files" ? "File System" : "System Console"}
            </span>
          </div>

          {activePanel === "files" ? (
            <div className="flex-1 overflow-hidden">
              <FileExplorer onOpenFile={setOpenedFile} />
            </div>
          ) : (
            <div className="flex-1 p-3 font-mono text-[8px] text-white/45 overflow-y-auto">
              <div className="flex items-center gap-1.5 text-cyber-cyan border-b border-white/5 pb-1.5 mb-2 uppercase font-bold text-[9px]">
                <Terminal size={10} /> Telemetry Logs
              </div>
              {systemLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="truncate py-0.5"
                >
                  &gt; {log}
                </motion.div>
              ))}

              <div className="mt-4 pt-3 border-t border-white/5">
                <span className="text-[8px] font-mono uppercase tracking-widest text-white/30 mb-2 block">
                  Life OS
                </span>
                <Link
                  href="/dashboard/life"
                  className="flex items-center gap-1.5 py-1.5 px-2 rounded text-[9px] font-mono text-cyber-purple hover:bg-cyber-purple/10 transition-all"
                >
                  <Heart size={10} />
                  Life Panel
                  {risk?.warning_triggered && (
                    <span className="ml-auto text-cyber-red text-[8px]">⚠ {Math.round(risk.risk_score)}</span>
                  )}
                </Link>
                <Link
                  href="/dashboard/patterns"
                  className="flex items-center gap-1.5 py-1.5 px-2 rounded text-[9px] font-mono text-cyber-cyan hover:bg-cyber-cyan/10 transition-all mt-1"
                >
                  <BarChart3 size={10} />
                  Patterns
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* Center — chat or mobile file view */}
        <section className="flex-1 flex flex-col bg-black/10 relative min-w-0">
          {activePanel === "chat" ? (
            <ChatPanel onCommandPalette={() => setCommandPaletteOpen(true)} />
          ) : (
            <div className="flex-1 lg:hidden">
              <FileExplorer onOpenFile={setOpenedFile} />
            </div>
          )}
        </section>

        {/* Right panel — telemetry & intelligence */}
        <aside className="w-full lg:w-72 border-l border-white/5 bg-black/35 flex flex-col overflow-y-auto p-3 gap-4 shrink-0 max-h-[40vh] lg:max-h-none">
          <MemoryIndicator activity={memoryActivity} />
          <MemorySearchPanel />

          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-2 block flex items-center gap-1">
              <Activity size={10} className="text-cyber-cyan" /> Live Telemetry
            </span>
            <TelemetryFeed events={telemetryEvents} />
          </div>

          <div className="h-[160px] hidden lg:block">
            <VectorViz />
          </div>

          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-2 block">
              System Performance
            </span>
            <SystemStatus />
          </div>

          <ProcessTerminal logs={processLogs} onAdvance={advanceProcess} />

          {openedFile && (
            <GlassCard glowColor="purple" className="py-3">
              <span className="text-[9px] font-mono text-cyber-purple uppercase mb-2 block flex items-center gap-1">
                <Hash size={10} /> Open File
              </span>
              <pre className="text-[9px] font-mono text-white/50 whitespace-pre-wrap max-h-[80px] overflow-y-auto">
                {openedFile.content}
              </pre>
            </GlassCard>
          )}
        </aside>
      </div>

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelect={handlePaletteSelect}
      />
    </div>
  );
}

export function DashboardShell() {
  return (
    <NeuronOsProvider>
      <DashboardInner />
    </NeuronOsProvider>
  );
}
