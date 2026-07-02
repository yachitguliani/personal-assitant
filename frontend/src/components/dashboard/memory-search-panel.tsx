"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Trash2, Tag, BrainCircuit, Edit, CheckSquare, Square, Layers } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonInput } from "@/components/ui/neon-input";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { MemoryEditModal } from "@/components/dashboard/memory-edit-modal";
import { api } from "@/utils/api";
import { useNeuronOs } from "@/context/neuron-os-context";

interface Memory {
  id: number;
  text: string;
  category: string;
  tags: string[];
  created_at: string;
  similarity: number;
}

export function MemorySearchPanel() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  const { triggerMemoryPulse, setOrbMessage } = useNeuronOs();

  // Debounce query string inputs
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Load memories based on debounced search + active category selection filter
  const loadMemories = useCallback(async (q: string, category: string | null) => {
    setIsLoading(true);
    try {
      let url = "/memory";
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (category) params.append("category", category);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const data = await api.get(url);
      setMemories(data || []);
    } catch (err) {
      console.error("Failed to load memories:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMemories(debouncedQuery, activeCategory);
  }, [debouncedQuery, activeCategory, loadMemories]);

  // Reset selection states when select mode gets toggled
  useEffect(() => {
    setSelectedIds(new Set());
  }, [selectMode]);

  // Handle single memory deletion
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/memory/${id}`);
      setMemories((prev) => prev.filter((m) => m.id !== id));
      setOrbMessage("Memory Erased");
      triggerMemoryPulse();
    } catch (err) {
      console.error("Failed to delete memory:", err);
    }
  };

  // Toggle select-all check state
  const handleToggleSelectAll = () => {
    if (selectedIds.size === memories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(memories.map((m) => m.id)));
    }
  };

  // Toggle individual select state
  const handleToggleSelectRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Execute bulk deletion in parallel
  const handleBulkDelete = async () => {
    setDeleteConfirmOpen(false);
    setIsLoading(true);
    try {
      const ids = Array.from(selectedIds);
      await Promise.all(ids.map((id) => api.delete(`/memory/${id}`)));
      setMemories((prev) => prev.filter((m) => !selectedIds.has(m.id)));
      setSelectedIds(new Set());
      setSelectMode(false);
      setOrbMessage(`${ids.length} Memories Erased`);
      triggerMemoryPulse();
    } catch (err) {
      console.error("Bulk delete failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "semantic":
        return "text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5";
      case "episodic":
        return "text-cyber-purple border-cyber-purple/30 bg-cyber-purple/5";
      case "procedural":
        return "text-amber-400 border-amber-400/30 bg-amber-400/5";
      default:
        return "text-white/40 border-white/10 bg-white/5";
    }
  };

  return (
    <GlassCard glowColor="none" className="p-3.5 flex flex-col gap-3">
      {/* Header telemetry and controls */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/45 flex items-center gap-1.5">
          <BrainCircuit size={11} className="text-cyber-cyan" /> Memory Registry
        </span>
        <div className="flex items-center gap-2">
          {memories.length > 0 && (
            <button
              onClick={() => setSelectMode(!selectMode)}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase flex items-center gap-1 border transition-all ${
                selectMode
                  ? "border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan"
                  : "border-white/10 hover:border-cyber-cyan/30 text-white/45 hover:text-white"
              }`}
              title="Bulk selection"
            >
              <Layers size={9} /> Select
            </button>
          )}
          {isLoading && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
          )}
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-1 justify-between select-none shrink-0 border-b border-white/5 pb-2">
        {["all", "semantic", "episodic", "procedural"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === "all" ? null : cat)}
            className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border transition-all ${
              (cat === "all" && activeCategory === null) || activeCategory === cat
                ? "border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10"
                : "border-white/5 text-white/40 hover:bg-white/5 hover:text-white/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <NeonInput
        id="memory-search-input"
        type="text"
        placeholder="Query second brain..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        icon={<Search size={12} />}
        className="py-1.5 pl-9 text-[11px] placeholder-white/15"
      />

      {/* Select All Checkbox panel bar */}
      {selectMode && memories.length > 0 && (
        <div className="flex items-center justify-between px-2 py-1.5 rounded border border-white/5 bg-white/5 text-[9px] font-mono text-white/50 select-none shrink-0">
          <button
            onClick={handleToggleSelectAll}
            className="flex items-center gap-1.5 hover:text-cyber-cyan transition-colors"
          >
            {selectedIds.size === memories.length ? (
              <CheckSquare size={11} className="text-cyber-cyan" />
            ) : (
              <Square size={11} />
            )}
            <span>Select All ({selectedIds.size})</span>
          </button>

          {selectedIds.size > 0 && (
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="text-cyber-red hover:text-red-400 font-bold uppercase tracking-wider"
            >
              Erase
            </button>
          )}
        </div>
      )}

      {/* Memory listing grid rows */}
      <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
        {memories.length === 0 ? (
          <div className="text-[10px] font-mono text-center text-white/20 py-4">
            {query ? "No semantic match" : "Memory bank empty"}
          </div>
        ) : (
          memories.map((mem) => {
            const hasSimilarity = query.trim().length > 0 && mem.similarity < 1.0;
            return (
              <div
                key={mem.id}
                onClick={() => selectMode && handleToggleSelectRow(mem.id)}
                className={`group flex gap-2 p-2 rounded border transition-colors relative ${
                  selectMode ? "cursor-pointer" : ""
                } ${
                  selectedIds.has(mem.id)
                    ? "border-cyber-cyan/35 bg-cyber-cyan/5"
                    : "border-white/5 bg-white/5 hover:border-white/10"
                }`}
              >
                {/* Checkbox box indicators */}
                {selectMode && (
                  <div className="text-white/40 group-hover:text-cyber-cyan shrink-0 self-center">
                    {selectedIds.has(mem.id) ? (
                      <CheckSquare size={12} className="text-cyber-cyan" />
                    ) : (
                      <Square size={12} />
                    )}
                  </div>
                )}

                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <div className="text-[10px] text-white/70 leading-relaxed pr-8 break-words whitespace-pre-wrap">
                    {mem.text}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1 mt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-mono uppercase px-1 py-0.5 rounded border ${getCategoryColor(mem.category)}`}>
                        {mem.category}
                      </span>
                      {mem.tags && mem.tags.length > 0 && (
                        <span className="text-[8px] font-mono text-white/30 flex items-center gap-0.5">
                          <Tag size={7} /> {mem.tags.join(", ")}
                        </span>
                      )}
                    </div>

                    {hasSimilarity && (
                      <span className="text-[8px] font-mono text-cyber-cyan font-semibold">
                        {Math.round(mem.similarity * 100)}% Match
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit & Delete hover triggers */}
                {!selectMode && (
                  <div className="absolute top-2 right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-black/80 rounded border border-white/5 p-0.5 z-10 shadow-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingMemory(mem);
                      }}
                      className="p-1 text-white/40 hover:text-cyber-cyan transition-colors"
                      title="Edit tags"
                    >
                      <Edit size={10} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(mem.id);
                      }}
                      className="p-1 text-white/40 hover:text-cyber-red transition-colors"
                      title="Erase memory"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation overlay */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Erase Selected Memories"
        message={`Are you sure you want to permanently erase these ${selectedIds.size} memories from the cognitive index? This cannot be undone.`}
        confirmText="Erase All"
        onConfirm={handleBulkDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />

      {/* Editor Modal overlay */}
      <MemoryEditModal
        isOpen={editingMemory !== null}
        onClose={() => setEditingMemory(null)}
        memory={editingMemory}
        onSave={() => {
          loadMemories(debouncedQuery, activeCategory);
          setOrbMessage("Memory Updated");
        }}
      />
    </GlassCard>
  );
}
