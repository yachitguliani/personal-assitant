"use client";

import React, { useEffect, useState } from "react";
import { Target, Plus, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { NeonInput } from "@/components/ui/neon-input";
import { lifeOsApi, type Goal } from "@/utils/api";

const CATEGORY_COLORS: Record<string, string> = {
  health: "text-green-400 border-green-400/30",
  work: "text-cyber-cyan border-cyber-cyan/30",
  learning: "text-cyber-purple border-cyber-purple/30",
  relationships: "text-pink-400 border-pink-400/30",
};

function ProgressRing({ progress, size = 48 }: { progress: number; size?: number }) {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(0,255,255,0.8)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GoalsTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("work");

  const loadGoals = async () => {
    try {
      const data = await lifeOsApi.listGoals();
      setGoals(data.filter((g) => g.status === "active"));
    } catch {
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await lifeOsApi.createGoal({ title: title.trim(), category });
    setTitle("");
    setShowForm(false);
    loadGoals();
  };

  const handleCheckin = async (goal: Goal, delta: number) => {
    const next = Math.min(100, Math.max(0, goal.progress + delta));
    await lifeOsApi.checkinGoal(goal.id, { progress: next });
    loadGoals();
  };

  const handleDelete = async (id: number) => {
    await lifeOsApi.deleteGoal(id);
    loadGoals();
  };

  return (
    <GlassCard glowColor="purple" className="py-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-1">
          <Target size={10} className="text-cyber-purple" /> Life Goals
        </span>
        <CyberButton size="sm" variant="ghost" onClick={() => setShowForm(!showForm)}>
          <Plus size={12} /> Add
        </CyberButton>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 space-y-2 border-b border-white/5 pb-4">
          <NeonInput label="Goal Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ship v1.0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-[10px] font-mono text-white/70"
          >
            <option value="health">Health</option>
            <option value="work">Work</option>
            <option value="learning">Learning</option>
            <option value="relationships">Relationships</option>
          </select>
          <CyberButton type="submit" size="sm" variant="purple">Create Goal</CyberButton>
        </form>
      )}

      {loading ? (
        <p className="text-[9px] font-mono text-white/30">Loading goals...</p>
      ) : goals.length === 0 ? (
        <p className="text-[9px] font-mono text-white/30">No active goals. Add one to start tracking.</p>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`flex items-center gap-3 p-2 rounded border bg-black/20 ${CATEGORY_COLORS[goal.category] || "border-white/10"}`}
            >
              <div className="relative">
                <ProgressRing progress={goal.progress} />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold rotate-90">
                  {goal.progress}%
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono font-bold truncate">{goal.title}</p>
                <p className="text-[8px] font-mono uppercase text-white/40">{goal.category}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleCheckin(goal, 10)}
                  className="text-[8px] font-mono px-1.5 py-0.5 border border-cyber-cyan/30 text-cyber-cyan rounded hover:bg-cyber-cyan/10"
                >
                  +10
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="p-1 text-white/30 hover:text-cyber-red"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
