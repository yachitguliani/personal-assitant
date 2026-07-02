"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Calendar, Brain, LogOut, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { api } from "@/utils/api";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

interface UserInfo {
  email: string;
  full_name: string;
  created_at: string;
}

interface MemoryStats {
  total_count: number;
  category_distribution: Record<string, number>;
}

export function ProfileDropdown({ isOpen, onClose, onLogout }: ProfileDropdownProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const [userRes, statsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/memory/stats")
        ]);
        setUserInfo(userRes);
        setStats(statsRes);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent click away area */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-14 right-4 w-72 z-50 pointer-events-auto"
          >
            <GlassCard glowColor="cyan" className="p-4 flex flex-col gap-4 text-left">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyber-cyan">
                  Operator Identity
                </span>
                <button
                  onClick={onClose}
                  className="p-1 rounded text-white/30 hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </div>

              {isLoading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2">
                  <div className="w-4 h-4 border border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">
                    Retrieving credentials...
                  </span>
                </div>
              ) : (
                <>
                  {/* Account Metadata */}
                  <div className="flex flex-col gap-2.5">
                    {userInfo && (
                      <>
                        <div className="flex items-center gap-2.5 text-xs text-white/70">
                          <User size={13} className="text-white/35 shrink-0" />
                          <span className="truncate font-sans font-semibold">{userInfo.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-white/60">
                          <Mail size={13} className="text-white/35 shrink-0" />
                          <span className="truncate font-mono text-[11px] text-white/50">{userInfo.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-white/60">
                          <Calendar size={13} className="text-white/35 shrink-0" />
                          <span className="font-mono text-[10px] text-white/50">
                            LINKED: {new Date(userInfo.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Cognitive Memory Stats */}
                  <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-1">
                      <Brain size={10} className="text-cyber-purple" /> Second Brain Indices
                    </span>

                    {stats ? (
                      <div className="grid grid-cols-2 gap-2 bg-black/20 rounded border border-white/5 p-2.5">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-mono text-cyber-cyan font-bold leading-none">
                            {stats.total_count}
                          </span>
                          <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider mt-1">
                            Total Nodes
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 text-[8px] font-mono text-white/50 border-l border-white/5 pl-2.5 justify-center">
                          <div className="flex justify-between">
                            <span>SEM:</span>
                            <span className="text-cyber-cyan">{stats.category_distribution.semantic || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>EPI:</span>
                            <span className="text-cyber-purple">{stats.category_distribution.episodic || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PRO:</span>
                            <span className="text-amber-400">{stats.category_distribution.procedural || 0}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                        Telemetry Offline
                      </span>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-white/5 pt-3">
                    <CyberButton
                      variant="danger"
                      size="sm"
                      className="w-full text-[10px] py-2"
                      onClick={onLogout}
                    >
                      <LogOut size={11} className="mr-1.5" /> Terminate Link
                    </CyberButton>
                  </div>
                </>
              )}
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
