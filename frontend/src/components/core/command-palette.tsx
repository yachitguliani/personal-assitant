"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, Command } from "lucide-react";
import { COMMAND_PALETTE_ITEMS } from "@/lib/command-engine";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export function CommandPalette({ open, onClose, onSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = COMMAND_PALETTE_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[selectedIdx]) {
        onSelect(filtered[selectedIdx].id);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selectedIdx, onClose, onSelect]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[9001]"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="mx-4 rounded-xl border border-cyber-cyan/30 bg-cyber-glass/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.1)] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Command size={14} className="text-cyber-cyan" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIdx(0);
                  }}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none font-sans"
                />
                <kbd className="text-[9px] font-mono text-white/30 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
              </div>

              <div className="max-h-64 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-white/30 font-mono">No commands found</div>
                ) : (
                  filtered.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIdx(i)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                        i === selectedIdx ? "bg-cyber-cyan/10 text-cyber-cyan" : "text-white/60 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Terminal size={12} className={i === selectedIdx ? "text-cyber-cyan" : "text-white/30"} />
                        <div>
                          <span className="text-xs font-sans">{item.label}</span>
                          <span className="text-[9px] font-mono text-white/25 ml-2">{item.category}</span>
                        </div>
                      </div>
                      {item.shortcut && (
                        <kbd className="text-[8px] font-mono text-white/25 border border-white/10 rounded px-1.5 py-0.5">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-white/5 flex items-center gap-2 text-[9px] font-mono text-white/25">
                <Search size={10} />
                NEURON Command Interface — Phase 1
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
