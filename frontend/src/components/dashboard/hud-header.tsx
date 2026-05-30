"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut, Command, MessageSquare, FolderOpen, Radio } from "lucide-react";
import { clearAuthToken } from "@/utils/api";
import { useNeuronOs } from "@/context/neuron-os-context";

interface HudHeaderProps {
  userName?: string;
  onCommandPalette: () => void;
}

export function HudHeader({ userName, onCommandPalette }: HudHeaderProps) {
  const router = useRouter();
  const { activePanel, setActivePanel, orbState } = useNeuronOs();

  const orbLabel = {
    idle: "STANDBY",
    awakening: "INIT",
    listening: "LISTENING",
    typing: "INPUT",
    thinking: "PROCESSING",
    speaking: "ACTIVE",
  }[orbState];

  return (
    <header className="relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-md px-4 md:px-6 py-2.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-5 h-5 border-2 border-cyber-cyan rounded flex items-center justify-center font-display font-black text-[10px] text-cyber-cyan">
            N
          </div>
          <span className="font-display font-bold text-xs tracking-[0.2em] hidden sm:inline">
            NEURON <span className="text-cyber-cyan">OS</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-cyber-cyan/20 bg-cyber-cyan-dark/10 text-[9px] font-mono text-cyber-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
          <Radio size={9} />
          <span className="hidden sm:inline">CORE {orbLabel}</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActivePanel("chat")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider transition-all ${
              activePanel === "chat"
                ? "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30"
                : "text-white/40 hover:text-white border border-transparent"
            }`}
          >
            <MessageSquare size={10} /> Chat
          </button>
          <button
            onClick={() => setActivePanel("files")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider transition-all ${
              activePanel === "files"
                ? "bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30"
                : "text-white/40 hover:text-white border border-transparent"
            }`}
          >
            <FolderOpen size={10} /> Files
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onCommandPalette}
          className="flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 bg-white/5 text-[9px] font-mono text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
        >
          <Command size={10} />
          <span className="hidden sm:inline">Ctrl+K</span>
        </button>

        <div className="hidden md:flex flex-col text-right font-mono">
          <span className="text-[8px] text-white/40">OPERATOR</span>
          <span className="text-[10px] text-white/80 font-bold">{userName || "Agent"}</span>
        </div>

        <button
          onClick={() => { clearAuthToken(); router.push("/login"); }}
          className="p-2 rounded-lg border border-white/5 bg-white/5 hover:bg-cyber-red/10 hover:border-cyber-red/40 hover:text-cyber-red transition-all"
          title="Terminate Session"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
