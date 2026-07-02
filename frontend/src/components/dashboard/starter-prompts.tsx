"use client";

import React from "react";
import { MessageSquare, Calendar, Target, Activity } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

interface StarterPromptsProps {
  onSelect: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    text: "What do you remember about me?",
    icon: <MessageSquare size={13} className="text-cyber-cyan" />,
    desc: "Query semantic memory indexes",
  },
  {
    text: "Help me plan today's agenda",
    icon: <Calendar size={13} className="text-cyber-purple" />,
    desc: "Coordinate schedule operations",
  },
  {
    text: "Summarize my active goals",
    icon: <Target size={13} className="text-amber-400" />,
    desc: "Review life metrics telemetry",
  },
  {
    text: "Perform neural status scan",
    icon: <Activity size={13} className="text-emerald-400" />,
    desc: "Run system diagnostics checks",
  },
];

export function StarterPrompts({ onSelect }: StarterPromptsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full mx-auto p-4 mt-2">
      {STARTER_PROMPTS.map((prompt, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(prompt.text)}
          className="group flex flex-col items-start gap-1.5 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-cyber-cyan/5 hover:border-cyber-cyan/30 text-left transition-all duration-300 active:scale-98 relative overflow-hidden"
        >
          {/* Subtle grid background hover effect */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,255,255,0.01)_1px,transparent_1px)] bg-[size:12px_12px] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-2">
            {prompt.icon}
            <span className="text-[11px] font-sans font-semibold text-white/80 group-hover:text-cyber-cyan transition-colors">
              {prompt.text}
            </span>
          </div>
          <span className="text-[8px] font-mono uppercase tracking-wider text-white/30 ml-5 group-hover:text-white/40">
            {prompt.desc}
          </span>
        </button>
      ))}
    </div>
  );
}
