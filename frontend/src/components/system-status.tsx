"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Database, Activity, HardDrive } from "lucide-react";

interface StatusMetrics {
  cpu_usage_pct: number;
  memory_usage_pct: number;
  active_threads: number;
  database_connected: boolean;
  latency_ms: number;
}

export function SystemStatus() {
  const [metrics, setMetrics] = useState<StatusMetrics>({
    cpu_usage_pct: 12.4,
    memory_usage_pct: 44.2,
    active_threads: 8,
    database_connected: true,
    latency_ms: 15,
  });

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/status");
        if (res.ok) {
          const data = await res.json();
          setMetrics({
            cpu_usage_pct: data.cpu_usage_pct,
            memory_usage_pct: data.memory_usage_pct,
            active_threads: data.active_threads,
            database_connected: data.database_connected,
            latency_ms: data.latency_ms,
          });
          setIsLive(true);
        }
      } catch (err) {
        // Fallback to dynamic mock updates if API is offline
        setIsLive(false);
        setMetrics((prev) => ({
          cpu_usage_pct: Math.max(3, Math.min(95, prev.cpu_usage_pct + (Math.random() - 0.5) * 4)),
          memory_usage_pct: Math.max(30, Math.min(85, prev.memory_usage_pct + (Math.random() - 0.5) * 1.5)),
          active_threads: prev.active_threads,
          database_connected: true,
          latency_ms: Math.max(8, Math.min(45, Math.floor(prev.latency_ms + (Math.random() - 0.5) * 5))),
        }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* CPU Usage Card */}
      <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider flex items-center gap-1">
            <Cpu size={10} className="text-cyber-cyan" />
            CORE COMPUTE
          </span>
          <span className="text-xs font-mono font-bold text-cyber-cyan">
            {metrics.cpu_usage_pct.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-cyber-cyan h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,255,255,0.5)]"
            style={{ width: `${metrics.cpu_usage_pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[8px] font-mono text-white/35 mt-1.5">
          <span>FREQ: 3.8 GHz</span>
          <span>LOAD: NORMAL</span>
        </div>
      </div>

      {/* Memory Usage Card */}
      <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider flex items-center gap-1">
            <HardDrive size={10} className="text-cyber-purple" />
            NEURAL MEM
          </span>
          <span className="text-xs font-mono font-bold text-cyber-purple">
            {metrics.memory_usage_pct.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-cyber-purple h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            style={{ width: `${metrics.memory_usage_pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[8px] font-mono text-white/35 mt-1.5">
          <span>ALLOC: 16.4 GB</span>
          <span>SWAP: 0.2 GB</span>
        </div>
      </div>

      {/* DB Connection Card */}
      <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 relative overflow-hidden col-span-1">
        <div className="flex items-center gap-2.5">
          <div className="bg-cyber-cyan-dark/20 p-1.5 rounded-md">
            <Database size={14} className="text-cyber-cyan" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">
              VECTOR BANK
            </span>
            <span className="text-xs font-mono font-bold text-white/80">
              {metrics.database_connected ? "SYNCHRONIZED" : "STANDALONE"}
            </span>
          </div>
        </div>
      </div>

      {/* Latency / Ping Card */}
      <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 relative overflow-hidden col-span-1">
        <div className="flex items-center gap-2.5">
          <div className="bg-cyber-purple-dark/20 p-1.5 rounded-md">
            <Activity size={14} className="text-cyber-purple" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">
              AI RESPONSE
            </span>
            <span className="text-xs font-mono font-bold text-white/80 flex items-center gap-1">
              {metrics.latency_ms} ms
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} title={isLive ? "Live link with backend" : "Offline fallback mode"} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
