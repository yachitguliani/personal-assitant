"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Command, MessageSquare, FolderOpen, Radio, Heart, BarChart3 } from "lucide-react";
import { clearAuthToken } from "@/utils/api";
import { useNeuronOs } from "@/context/neuron-os-context";
import { WeeklyWarningBanner } from "@/components/dashboard/weekly-warning-banner";
import { useBurnoutRisk } from "@/hooks/use-burnout-risk";

interface HudHeaderProps {
  userName?: string;
  onCommandPalette: () => void;
  activeRoute?: string;
}

export function HudHeader({ userName, onCommandPalette, activeRoute }: HudHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const route = activeRoute ?? pathname;
  const { activePanel, setActivePanel, orbState } = useNeuronOs();
  const { risk } = useBurnoutRisk();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const orbLabel = {
    idle: "STANDBY",
    awakening: "INIT",
    listening: "LISTENING",
    typing: "INPUT",
    thinking: "PROCESSING",
    speaking: "ACTIVE",
  }[orbState];

  const isMainDashboard = route === "/dashboard";
  const isLife = route?.startsWith("/dashboard/life");
  const isPatterns = route?.startsWith("/dashboard/patterns");

  return (
    <>
      {risk && (
        <WeeklyWarningBanner
          score={risk.risk_score}
          threshold={risk.threshold}
          dismissed={bannerDismissed}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

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

          {risk && risk.warning_triggered && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded border border-cyber-red/40 bg-cyber-red/10 text-[8px] font-mono text-cyber-red uppercase animate-pulse">
              ⚠ Risk {Math.round(risk.risk_score)}
            </div>
          )}

          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => {
                router.push("/dashboard");
                setActivePanel("chat");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider transition-all ${
                isMainDashboard && activePanel === "chat"
                  ? "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30"
                  : "text-white/40 hover:text-white border border-transparent"
              }`}
            >
              <MessageSquare size={10} /> Chat
            </button>
            <button
              onClick={() => {
                router.push("/dashboard");
                setActivePanel("files");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider transition-all ${
                isMainDashboard && activePanel === "files"
                  ? "bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30"
                  : "text-white/40 hover:text-white border border-transparent"
              }`}
            >
              <FolderOpen size={10} /> Files
            </button>
            <button
              onClick={() => router.push("/dashboard/life")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider transition-all ${
                isLife
                  ? "bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30"
                  : "text-white/40 hover:text-white border border-transparent"
              }`}
            >
              <Heart size={10} /> Life OS
              {risk && risk.warning_triggered && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-red" />
              )}
            </button>
            <button
              onClick={() => router.push("/dashboard/patterns")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-mono uppercase tracking-wider transition-all ${
                isPatterns
                  ? "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30"
                  : "text-white/40 hover:text-white border border-transparent"
              }`}
            >
              <BarChart3 size={10} /> Patterns
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {isMainDashboard && (
            <button
              onClick={onCommandPalette}
              className="flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 bg-white/5 text-[9px] font-mono text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
            >
              <Command size={10} />
              <span className="hidden sm:inline">Ctrl+K</span>
            </button>
          )}

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
    </>
  );
}
