"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, CheckCircle, Loader2, XCircle } from "lucide-react";
import type { ProcessLog } from "@/lib/telemetry-generator";

interface ProcessTerminalProps {
  logs: ProcessLog[];
  onAdvance: (id: string) => void;
}

export function ProcessTerminal({ logs, onAdvance }: ProcessTerminalProps) {
  useEffect(() => {
    const running = logs.filter((l) => l.status === "running");
    if (running.length === 0) return;

    const interval = setInterval(() => {
      running.forEach((log) => onAdvance(log.id));
    }, 600);

    return () => clearInterval(interval);
  }, [logs, onAdvance]);

  const StatusIcon = ({ status }: { status: ProcessLog["status"] }) => {
    switch (status) {
      case "running": return <Loader2 size={10} className="text-cyber-cyan animate-spin" />;
      case "complete": return <CheckCircle size={10} className="text-green-400" />;
      case "error": return <XCircle size={10} className="text-cyber-red" />;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyber-cyan uppercase font-bold">
        <Terminal size={10} /> Process Execution
      </div>

      {logs.length === 0 ? (
        <div className="text-[9px] font-mono text-white/20 p-4 text-center border border-dashed border-white/5 rounded-lg">
          NO ACTIVE PROCESSES
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 border border-white/5 rounded-lg p-2.5"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <StatusIcon status={log.status} />
                  <span className="text-[9px] font-mono text-white/60 truncate max-w-[140px]">
                    {log.command}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-white/25">{log.timestamp}</span>
              </div>

              {log.status === "running" && (
                <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
                    style={{ width: `${log.progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                {log.output.slice(-3).map((line, i) => (
                  <span key={i} className="text-[8px] font-mono text-white/35 truncate">
                    {line}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
