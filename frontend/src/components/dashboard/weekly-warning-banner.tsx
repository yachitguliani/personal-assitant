"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WeeklyWarningBannerProps {
  score: number;
  threshold?: number;
  recommendation?: string;
  onDismiss?: () => void;
  dismissed?: boolean;
}

export function WeeklyWarningBanner({
  score,
  threshold = 65,
  recommendation,
  onDismiss,
  dismissed = false,
}: WeeklyWarningBannerProps) {
  const show = score > threshold && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          className="relative z-20 border-b border-cyber-red/30 bg-cyber-red/10 backdrop-blur-md px-4 py-2 flex items-center gap-3"
        >
          <AlertTriangle size={14} className="text-cyber-red shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono font-bold text-cyber-red uppercase tracking-wider">
              Burnout Risk Elevated — {Math.round(score)}/100
            </p>
            <p className="text-[9px] font-mono text-white/60 truncate">
              {recommendation || "Reduce load this week. Protect sleep and deep work blocks."}
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 text-white/40 hover:text-white shrink-0"
              title="Dismiss for this session"
            >
              <X size={12} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
