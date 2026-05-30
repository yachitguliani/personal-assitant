"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Shield, Wifi } from "lucide-react";
import { STARTUP_STATUS_MODULES } from "@/lib/startup-data";

interface StartupHudProps {
  bootProgress: number;
  activeModules: string[];
  timeDisplay: string;
  location: string;
  scanning: boolean;
}

export function StartupHud({ bootProgress, activeModules, timeDisplay, location, scanning }: StartupHudProps) {
  return (
    <>
      {/* Corner HUD — top left */}
      <div className="absolute top-6 left-6 z-20 font-mono text-[9px] space-y-2 select-none">
        <div className="flex items-center gap-2 text-cyber-cyan/60">
          <Wifi size={10} className={bootProgress > 50 ? "text-cyber-cyan" : "text-white/20"} />
          <span className="tracking-widest uppercase">Neural Link {bootProgress > 80 ? "Active" : "Establishing"}</span>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          <Clock size={10} />
          <span>{timeDisplay || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          <MapPin size={10} />
          <span className="max-w-[160px] truncate">{location || "Detecting..."}</span>
        </div>
      </div>

      {/* Corner HUD — top right */}
      <div className="absolute top-6 right-6 z-20 font-mono text-[9px] text-right space-y-1 select-none">
        <div className="flex items-center justify-end gap-2 text-white/30">
          <Shield size={10} className="text-cyber-cyan/50" />
          <span className="tracking-widest">SECURE BOOT</span>
        </div>
        <div className="text-cyber-cyan/50">{Math.round(bootProgress)}% INITIALIZED</div>
      </div>

      {/* Module status grid — bottom left */}
      <div className="absolute bottom-8 left-6 z-20 grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[8px] select-none">
        {STARTUP_STATUS_MODULES.map((mod) => {
          const online = activeModules.includes(mod.id);
          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: online ? 1 : 0.3, x: 0 }}
              className="flex items-center gap-2"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  online ? "bg-cyber-cyan shadow-[0_0_6px_rgba(0,255,255,0.6)]" : "bg-white/10"
                }`}
              />
              <span className={online ? "text-cyber-cyan/80" : "text-white/25"}>{mod.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Scanning overlay */}
      {scanning && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="absolute bottom-8 right-6 font-mono text-[8px] text-cyber-cyan/40 tracking-widest animate-pulse">
            SCANNING SUBSYSTEMS...
          </div>
        </motion.div>
      )}
    </>
  );
}
