"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, BrainCircuit } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { NeonInput } from "@/components/ui/neon-input";
import { api } from "@/utils/api";

interface Memory {
  id: number;
  text: string;
  category: string;
  tags: string[];
}

interface MemoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: Memory | null;
  onSave: () => void;
}

export function MemoryEditModal({ isOpen, onClose, memory, onSave }: MemoryEditModalProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("semantic");
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (memory) {
      setText(memory.text);
      setCategory(memory.category);
      setTags(memory.tags || []);
      setNewTagInput("");
    }
  }, [memory, isOpen]);

  const handleAddTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    const tag = newTagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!memory || !text.trim()) return;
    setIsSaving(true);
    try {
      await api.patch(`/memory/${memory.id}`, {
        text: text.trim(),
        category: category,
        tags: tags,
      });
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to update memory:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && memory && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9992]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9993] pointer-events-none">
            <motion.div
              className="w-full max-w-md rounded-xl border border-cyber-cyan/30 bg-cyber-glass/95 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.15)] overflow-hidden pointer-events-auto relative p-6 flex flex-col gap-4 text-left"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 5 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-cyan/50" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan/50" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-cyan/50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-cyan/50" />

              {/* Title Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyber-cyan flex items-center gap-1.5 font-bold">
                  <BrainCircuit size={12} /> Edit Memory Index
                </span>
                <button
                  onClick={onClose}
                  className="p-1 rounded text-white/30 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Text Area Input */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                  Memory Text Content
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter memory registry details..."
                  className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-sans placeholder-white/20 text-white outline-none focus:border-cyber-cyan focus:shadow-[0_0_12px_rgba(0,255,255,0.1)] transition-all duration-300 resize-none"
                />
              </div>

              {/* Category Select Radio Groups */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                  Category Taxonomy
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["semantic", "episodic", "procedural"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-3 border rounded-lg text-[10px] font-mono uppercase transition-all duration-300 ${
                        category === cat
                          ? cat === "semantic"
                            ? "border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan"
                            : cat === "episodic"
                            ? "border-cyber-purple bg-cyber-purple/10 text-cyber-purple"
                            : "border-amber-400 bg-amber-400/10 text-amber-400"
                          : "border-white/5 bg-white/5 text-white/40 hover:bg-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Input & Chips */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                  Tags Editor
                </label>
                <form onSubmit={handleAddTag} className="flex gap-2 items-center">
                  <NeonInput
                    type="text"
                    placeholder="Add tag and press Enter..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="py-1.5 text-xs placeholder-white/15"
                  />
                  <CyberButton
                    type="button"
                    variant="cyan"
                    size="sm"
                    className="py-2.5 px-3"
                    onClick={() => handleAddTag()}
                  >
                    <Plus size={12} />
                  </CyberButton>
                </form>

                {/* Tag Chips list */}
                <div className="flex flex-wrap gap-1.5 mt-2 bg-black/20 rounded border border-white/5 p-2 min-h-[40px] max-h-[80px] overflow-y-auto">
                  {tags.length === 0 ? (
                    <span className="text-[9px] font-mono text-white/20 italic self-center mx-auto">
                      No tags configured
                    </span>
                  ) : (
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 text-[9px] font-mono text-white/60 bg-white/5 border border-white/10 rounded px-1.5 py-0.5"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-white/25 hover:text-cyber-red"
                        >
                          <X size={8} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 w-full border-t border-white/5 pt-4">
                <CyberButton
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-[10px]"
                  onClick={onClose}
                  disabled={isSaving}
                >
                  Cancel
                </CyberButton>
                <CyberButton
                  variant="cyan"
                  size="sm"
                  className="flex-1 text-[10px]"
                  onClick={handleSave}
                  disabled={isSaving || !text.trim()}
                >
                  Save Changes
                </CyberButton>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
