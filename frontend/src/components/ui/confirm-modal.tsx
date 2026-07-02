"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9990]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9991] pointer-events-none">
            <motion.div
              className="w-full max-w-sm rounded-xl border border-cyber-red/30 bg-cyber-glass/95 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.15)] overflow-hidden pointer-events-auto relative p-6"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 5 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-red/50" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-red/50" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-red/50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-red/50" />

              <div className="flex flex-col items-center gap-4 text-center">
                {/* Alert Icon */}
                <div className="w-10 h-10 rounded-full bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red animate-pulse">
                  <AlertTriangle size={18} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-mono uppercase tracking-wider text-sm text-cyber-red font-bold">
                    {title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed font-sans px-2">
                    {message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full mt-2">
                  <CyberButton
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-[10px]"
                    onClick={onCancel}
                  >
                    {cancelText}
                  </CyberButton>
                  <CyberButton
                    variant="danger"
                    size="sm"
                    className="flex-1 text-[10px]"
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </CyberButton>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
