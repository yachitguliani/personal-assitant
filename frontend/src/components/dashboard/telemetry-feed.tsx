"use client";

import React from "react";
import { motion } from "framer-motion";
import type { TelemetryEvent } from "@/lib/telemetry-generator";

const SEVERITY_STYLES: Record<TelemetryEvent["severity"], string> = {
  info: "text-white/50 border-white/5",
  success: "text-green-400/80 border-green-400/20",
  warn: "text-yellow-400/80 border-yellow-400/20",
  active: "text-cyber-cyan border-cyber-cyan/20",
};

export function TelemetryFeed({ events }: { events: TelemetryEvent[] }) {
  return (
    <div className="flex flex-col gap-1 max-h-[180px] overflow-hidden">
      {events.slice(0, 8).map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
          className={`flex items-start gap-2 px-2 py-1.5 rounded border bg-black/20 text-[9px] font-mono ${SEVERITY_STYLES[event.severity]}`}
        >
          <span className="text-white/25 shrink-0">{event.timestamp}</span>
          <span className="text-cyber-purple/60 shrink-0">[{event.subsystem}]</span>
          <span className="truncate flex-1">{event.message}</span>
          {event.value !== undefined && (
            <span className="text-cyber-cyan/50 shrink-0">{event.value}%</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
