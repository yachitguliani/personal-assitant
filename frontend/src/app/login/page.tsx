"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Shield, Terminal, ArrowRight } from "lucide-react";
import { NeonInput } from "@/components/ui/neon-input";
import { CyberButton } from "@/components/ui/cyber-button";
import { GlassCard } from "@/components/ui/glass-card";
import { api, setAuthToken } from "@/utils/api";
import { warmUpSpeech } from "@/lib/speech-engine";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  // States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>(["AWAITING SIGNATURE KEY..."]);

  const logMessage = (msg: string) => {
    setLogs((prev) => [...prev.slice(-3), msg]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    warmUpSpeech();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill out all credentials.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        logMessage(`Transmitting token handshake for ${email}...`);
        const res = await api.post("/auth/login", { email, password });
        logMessage("Handshake verification: SUCCESS");
        setAuthToken(res.access_token);
        localStorage.setItem("neuron_user", JSON.stringify(res.user));
        
        router.push("/dashboard");
      } else {
        if (!fullName) {
          setError("Full name is required to initialize profile.");
          setLoading(false);
          return;
        }
        logMessage("Creating new synaptic core registration...");
        const res = await api.post("/auth/register", {
          email,
          password,
          full_name: fullName,
        });
        logMessage("Account registry committed successfully.");
        setAuthToken(res.access_token);
        localStorage.setItem("neuron_user", JSON.stringify(res.user));
        
        router.push("/dashboard");
      }
    } catch (err: any) {
      logMessage("Handshake error: EXPIRED OR INVALID");
      setError(err.message || "Credential handshake failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cyber-dark text-white overflow-hidden flex flex-col justify-center items-center px-4 scanline">
      {/* Grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-cyber-cyan/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full bg-cyber-purple/5 blur-[80px] pointer-events-none" />

      {/* Main Glassmorphic Wrapper */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Title logo banner */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <div className="relative w-10 h-10 border-2 border-cyber-cyan rounded-lg flex items-center justify-center font-display font-black text-lg text-cyber-cyan shadow-[0_0_12px_rgba(0,255,255,0.4)] cursor-pointer">
              N
            </div>
          </Link>
          <h2 className="font-display font-bold text-lg tracking-[0.2em] text-white mt-3">
            SECURE ACCESS GATEWAY
          </h2>
          <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest mt-1">
            NEURON OS CORE DECIPHER MODULE
          </p>
        </div>

        <GlassCard glowColor={isLogin ? "cyan" : "purple"}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Alert bar */}
            {error && (
              <div className="bg-red-500/10 border border-cyber-red/30 rounded-lg p-3 text-xs text-cyber-red/90 font-mono uppercase tracking-wide">
                WARNING: {error}
              </div>
            )}

            {!isLogin && (
              <NeonInput
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Agent Name"
                icon={<User size={16} />}
                glowColor="purple"
              />
            )}

            <NeonInput
              label="Secure Email ID"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@neuron.net"
              icon={<Mail size={16} />}
              glowColor={isLogin ? "cyan" : "purple"}
            />

            <NeonInput
              label="Encrypted Passkey"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock size={16} />}
              glowColor={isLogin ? "cyan" : "purple"}
            />

            <div className="mt-2 flex flex-col gap-3">
              <CyberButton
                type="submit"
                variant={isLogin ? "cyan" : "purple"}
                disabled={loading}
                className="w-full"
              >
                {loading ? "COMMITTING KEYS..." : isLogin ? "INITIALIZE GATEWAY" : "REGISTER CORE CORE"}
                <ArrowRight size={14} className="ml-1" />
              </CyberButton>

              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-wider text-center transition-colors duration-200 mt-1"
              >
                {isLogin ? "SWITCH CONSOLE TO REGISTRATION" : "SWITCH CONSOLE TO ACCESS ID"}
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Live system authorization logs console */}
        <div className="mt-4 bg-black/60 rounded-xl border border-white/5 p-3 font-mono text-[9px] text-white/50">
          <div className="flex items-center gap-1.5 text-cyber-cyan border-b border-white/5 pb-1.5 mb-1.5 uppercase font-bold">
            <Terminal size={10} /> SECURITY ACCESS LOGS
          </div>
          <div className="flex flex-col gap-1">
            {logs.map((log, i) => (
              <div key={i} className="truncate">
                &gt; {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
