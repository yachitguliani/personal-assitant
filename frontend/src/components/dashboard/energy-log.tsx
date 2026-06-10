"use client";

import React, { useState } from "react";
import { Zap, Moon, Monitor, Heart } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { lifeOsApi } from "@/utils/api";

interface SliderFieldProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

function SliderField({ label, icon, value, min, max, step = 1, unit = "", onChange }: SliderFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 flex items-center gap-1">
          {icon} {label}
        </span>
        <span className="text-[10px] font-mono text-cyber-cyan">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cyber-cyan h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}

interface EnergyLogProps {
  onLogged?: () => void;
}

export function EnergyLog({ onLogged }: EnergyLogProps) {
  const [sleepHours, setSleepHours] = useState(7);
  const [deepWork, setDeepWork] = useState(120);
  const [screenTime, setScreenTime] = useState(180);
  const [energy, setEnergy] = useState(6);
  const [mood, setMood] = useState(6);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await lifeOsApi.logMetric({
        sleep_hours: sleepHours,
        deep_work_minutes: deepWork,
        screen_time_minutes: screenTime,
        energy_level: energy,
        mood,
      });
      setMessage("Daily log committed to neural index.");
      onLogged?.();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Log failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard glowColor="cyan" className="py-4">
      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 mb-4 block flex items-center gap-1">
        <Zap size={10} className="text-cyber-cyan" /> Daily Energy Log
      </span>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SliderField
          label="Sleep"
          icon={<Moon size={9} />}
          value={sleepHours}
          min={0}
          max={12}
          step={0.5}
          unit="h"
          onChange={setSleepHours}
        />
        <SliderField
          label="Deep Work"
          icon={<Zap size={9} />}
          value={deepWork}
          min={0}
          max={480}
          step={15}
          unit=" min"
          onChange={setDeepWork}
        />
        <SliderField
          label="Screen Time"
          icon={<Monitor size={9} />}
          value={screenTime}
          min={0}
          max={720}
          step={15}
          unit=" min"
          onChange={setScreenTime}
        />
        <SliderField
          label="Energy"
          icon={<Heart size={9} />}
          value={energy}
          min={1}
          max={10}
          onChange={setEnergy}
        />
        <SliderField
          label="Mood"
          icon={<Heart size={9} />}
          value={mood}
          min={1}
          max={10}
          onChange={setMood}
        />

        <CyberButton type="submit" variant="cyan" size="sm" className="w-full" disabled={loading}>
          {loading ? "Transmitting..." : "Commit Daily Log"}
        </CyberButton>

        {message && (
          <p className="text-[9px] font-mono text-cyber-cyan/70 text-center">{message}</p>
        )}
      </form>
    </GlassCard>
  );
}
