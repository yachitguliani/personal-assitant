"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Mic, MicOff, Command } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { AiOrb } from "@/components/core/ai-orb";
import { useNeuronOs } from "@/context/neuron-os-context";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { api } from "@/utils/api";
import { executeCommand } from "@/lib/command-engine";
import { renderMarkdown } from "@/lib/markdown";

interface Message {
  id: number;
  sender: "user" | "assistant";
  content: string;
  created_at: string;
}

interface Conversation {
  id: number;
  title: string;
  created_at: string;
}

interface ChatPanelProps {
  onCommandPalette: () => void;
}

async function simulateLocalResponse(userText: string): Promise<string> {
  const query = userText.toLowerCase();
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

  if (query.startsWith("/") || ["help", "status", "ls", "scan", "sync"].some((c) => query.startsWith(c))) {
    return "";
  }

  if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
    return "### NEURON OS Online\nGood to see you, Operator. All cognitive subsystems are synchronized and standing by.\n\nHow may I assist you today?";
  }
  if (query.includes("who are you") || query.includes("what are you")) {
    return "### Identity Confirmed\nI am **NEURON** — your Neural Engine for Unified Reasoning and Operational Networks.\n\nI function as your digital chief-of-staff, second brain, and command center interface.";
  }

  return (
    `### Processing Complete\nI've analyzed your query: *"${userText}"*\n\n` +
    "My reasoning pipeline has processed this through the unified neural network. " +
    "Try commands like `status`, `ls`, `scan`, or `help` for system operations.\n\n" +
    "Press **Ctrl+K** to open the command palette."
  );
}

export function ChatPanel({ onCommandPalette }: ChatPanelProps) {
  const {
    orbState, setOrbState, filesystem, setFilesystem, currentPath, setCurrentPath,
    addSystemLog, addProcessLog, triggerMemoryPulse, clearProcessLogs,
  } = useNeuronOs();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleVoiceResult = useCallback((transcript: string) => {
    setInputText(transcript);
    setOrbState("idle");
  }, [setOrbState]);

  const { isListening, isSupported, toggleListening } = useVoiceInput({
    onStart: () => setOrbState("listening"),
    onEnd: () => setOrbState("idle"),
    onResult: handleVoiceResult,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleInputChange = (value: string) => {
    setInputText(value);
    setOrbState("typing");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setOrbState("idle"), 1500);
  };

  const processCommand = async (text: string): Promise<string | null> => {
    const result = executeCommand(text, {
      filesystem,
      currentPath,
      setFilesystem,
      setCurrentPath,
      addLog: addSystemLog,
    });

    if (result.type === "chat" && !result.message) return null;

    if (result.message === "__CLEAR_LOGS__") {
      clearProcessLogs();
      return "Process logs cleared.";
    }

    if (result.success || result.message) {
      addProcessLog(text);
      triggerMemoryPulse();
    }

    return result.message;
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    const userText = inputText.trim();
    setInputText("");
    setIsSubmitting(true);
    setOrbState("thinking");
    triggerMemoryPulse();

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    addSystemLog(`Query: ${userText.substring(0, 40)}...`);

    const cmdResponse = await processCommand(userText);

    if (cmdResponse) {
      setOrbState("speaking");
      const words = cmdResponse.split(" ");
      let accumulated = "";
      for (const word of words) {
        accumulated += word + " ";
        setStreamingText(accumulated);
        await new Promise((r) => setTimeout(r, 25));
      }
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "assistant", content: cmdResponse, created_at: new Date().toISOString() },
      ]);
      setStreamingText("");
      setIsSubmitting(false);
      setOrbState("idle");
      return;
    }

    setStreamingText("");
    setOrbState("speaking");

    try {
      let currentId = activeConvId;
      if (!currentId) {
        try {
          const res = await api.post("/chat/conversations", { title: userText.substring(0, 30) });
          currentId = res.id;
          setActiveConvId(res.id);
        } catch {
          const localResponse = await simulateLocalResponse(userText);
          const words = localResponse.split(" ");
          let acc = "";
          for (const w of words) {
            acc += w + " ";
            setStreamingText(acc);
            await new Promise((r) => setTimeout(r, 30));
          }
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, sender: "assistant", content: localResponse, created_at: new Date().toISOString() },
          ]);
          setStreamingText("");
          setIsSubmitting(false);
          setOrbState("idle");
          return;
        }
      }

      await api.stream(
        `/chat/conversations/${currentId}/stream`,
        { content: userText },
        (chunk) => setStreamingText((prev) => prev + chunk),
        () => {
          setIsSubmitting(false);
          setOrbState("idle");
          if (currentId) {
            api.get(`/chat/conversations/${currentId}`).then((data) => {
              setMessages(data.messages || []);
            }).catch(() => {});
          }
          triggerMemoryPulse();
        },
        async () => {
          const localResponse = await simulateLocalResponse(userText);
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, sender: "assistant", content: localResponse, created_at: new Date().toISOString() },
          ]);
          setStreamingText("");
          setIsSubmitting(false);
          setOrbState("idle");
        }
      );
    } catch {
      const localResponse = await simulateLocalResponse(userText);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "assistant", content: localResponse, created_at: new Date().toISOString() },
      ]);
      setStreamingText("");
      setIsSubmitting(false);
      setOrbState("idle");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* AI Orb centerpiece */}
      <div className="flex justify-center py-4 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <AiOrb state={orbState} size={160} />
        </motion.div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-4 min-h-0">
        {messages.length === 0 && !streamingText ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center text-center p-8 flex-1"
          >
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mb-2">
              Awaiting Instruction
            </p>
            <p className="text-xs text-white/40 max-w-sm leading-relaxed">
              Speak or type to interact with NEURON. Try <code className="text-cyber-cyan">status</code>,{" "}
              <code className="text-cyber-cyan">help</code>, or <code className="text-cyber-cyan">scan</code>.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-2xl ${isUser ? "self-end flex-row-reverse" : "self-start"}`}
                >
                  <div className={`w-7 h-7 rounded flex items-center justify-center font-mono text-[9px] font-bold shrink-0 ${
                    isUser
                      ? "bg-cyber-purple-dark/20 border border-cyber-purple text-cyber-purple"
                      : "bg-cyber-cyan-dark/20 border border-cyber-cyan text-cyber-cyan"
                  }`}>
                    {isUser ? "OP" : "NE"}
                  </div>
                  <div className={`rounded-xl border p-4 shadow-sm ${
                    isUser
                      ? "bg-cyber-purple-dark/5 border-cyber-purple/20"
                      : "bg-white/5 border-white/5"
                  }`}>
                    {isUser ? (
                      <p className="text-xs leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="flex flex-col gap-1">{renderMarkdown(msg.content)}</div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {streamingText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 max-w-2xl self-start"
              >
                <div className="w-7 h-7 rounded bg-cyber-cyan-dark/20 border border-cyber-cyan text-cyber-cyan flex items-center justify-center font-mono text-[9px] font-bold shrink-0">
                  NE
                </div>
                <div className="rounded-xl border bg-white/5 border-white/5 p-4 flex flex-col gap-1">
                  {renderMarkdown(streamingText)}
                  <span className="w-1.5 h-3 bg-cyber-cyan animate-pulse inline-block self-start mt-1" />
                </div>
              </motion.div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-white/5 bg-black/45">
        <form onSubmit={handleSend} className="flex gap-2 max-w-3xl mx-auto items-center">
          <button
            type="button"
            onClick={onCommandPalette}
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
            title="Command Palette (Ctrl+K)"
          >
            <Command size={14} />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Instruct NEURON OS..."
            disabled={isSubmitting}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-xs font-sans placeholder-white/20 text-white outline-none focus:border-cyber-cyan focus:shadow-[0_0_12px_rgba(0,255,255,0.1)] transition-all duration-300 disabled:opacity-50"
          />

          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-lg border transition-all duration-300 ${
              isListening
                ? "border-cyber-cyan bg-cyber-cyan/20 text-cyber-cyan shadow-[0_0_15px_rgba(0,255,255,0.3)] animate-pulse"
                : "border-white/10 bg-white/5 text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan/30"
            }`}
            title={isSupported ? "Voice input" : "Voice input (simulated UI)"}
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
          </button>

          <CyberButton type="submit" variant="cyan" size="sm" disabled={isSubmitting || !inputText.trim()}>
            <Send size={12} />
          </CyberButton>
        </form>

        {isListening && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[9px] font-mono text-cyber-cyan mt-2 animate-pulse"
          >
            NEURAL VOICE INTERFACE ACTIVE — SPEAK NOW
          </motion.p>
        )}
      </div>
    </div>
  );
}
