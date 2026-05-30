"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { FSNode, INITIAL_FILESYSTEM, cloneFilesystem } from "@/lib/mock-filesystem";
import { TelemetryEvent, ProcessLog, generateTelemetryEvent, createProcessLog, advanceProcessLog } from "@/lib/telemetry-generator";

export type OrbState = "idle" | "awakening" | "listening" | "typing" | "thinking" | "speaking";

interface NeuronOsContextValue {
  orbState: OrbState;
  setOrbState: (state: OrbState) => void;
  bootComplete: boolean;
  setBootComplete: (v: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  filesystem: FSNode;
  setFilesystem: (fs: FSNode) => void;
  currentPath: string[];
  setCurrentPath: (path: string[]) => void;
  telemetryEvents: TelemetryEvent[];
  processLogs: ProcessLog[];
  addProcessLog: (command: string) => string;
  advanceProcess: (id: string) => void;
  clearProcessLogs: () => void;
  systemLogs: string[];
  addSystemLog: (msg: string) => void;
  memoryActivity: number;
  triggerMemoryPulse: () => void;
  activePanel: "chat" | "files";
  setActivePanel: (panel: "chat" | "files") => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (v: boolean) => void;
}

const NeuronOsContext = createContext<NeuronOsContextValue | null>(null);

export function NeuronOsProvider({ children }: { children: React.ReactNode }) {
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [bootComplete, setBootComplete] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [filesystem, setFilesystem] = useState<FSNode>(() => cloneFilesystem(INITIAL_FILESYSTEM));
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>([]);
  const [processLogs, setProcessLogs] = useState<ProcessLog[]>([]);
  const [systemLogs, setSystemLogs] = useState<string[]>(["Core command link online."]);
  const [memoryActivity, setMemoryActivity] = useState(42);
  const [activePanel, setActivePanel] = useState<"chat" | "files">("chat");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const memoryDecayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addSystemLog = useCallback((msg: string) => {
    setSystemLogs((prev) => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const addProcessLog = useCallback((command: string) => {
    const log = createProcessLog(command);
    setProcessLogs((prev) => [log, ...prev].slice(0, 8));
    return log.id;
  }, []);

  const advanceProcess = useCallback((id: string) => {
    setProcessLogs((prev) =>
      prev.map((p) => (p.id === id ? advanceProcessLog(p) : p))
    );
  }, []);

  const clearProcessLogs = useCallback(() => setProcessLogs([]), []);

  const triggerMemoryPulse = useCallback(() => {
    setMemoryActivity((v) => Math.min(100, v + 15 + Math.random() * 20));
  }, []);

  useEffect(() => {
    if (!bootComplete) return;
    const initial = Array.from({ length: 6 }, () => generateTelemetryEvent());
    setTelemetryEvents(initial);

    const interval = setInterval(() => {
      setTelemetryEvents((prev) => [generateTelemetryEvent(), ...prev].slice(0, 30));
    }, 2200);

    return () => clearInterval(interval);
  }, [bootComplete]);

  useEffect(() => {
    memoryDecayRef.current = setInterval(() => {
      setMemoryActivity((v) => Math.max(20, v - 1.5));
    }, 3000);
    return () => {
      if (memoryDecayRef.current) clearInterval(memoryDecayRef.current);
    };
  }, []);

  return (
    <NeuronOsContext.Provider
      value={{
        orbState,
        setOrbState,
        bootComplete,
        setBootComplete,
        commandPaletteOpen,
        setCommandPaletteOpen,
        filesystem,
        setFilesystem,
        currentPath,
        setCurrentPath,
        telemetryEvents,
        processLogs,
        addProcessLog,
        advanceProcess,
        clearProcessLogs,
        systemLogs,
        addSystemLog,
        memoryActivity,
        triggerMemoryPulse,
        activePanel,
        setActivePanel,
        voiceEnabled,
        setVoiceEnabled,
      }}
    >
      {children}
    </NeuronOsContext.Provider>
  );
}

export function useNeuronOs() {
  const ctx = useContext(NeuronOsContext);
  if (!ctx) throw new Error("useNeuronOs must be used within NeuronOsProvider");
  return ctx;
}
