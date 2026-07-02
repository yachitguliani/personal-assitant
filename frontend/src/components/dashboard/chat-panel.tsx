"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Command, Plus, Trash2, Menu, Copy, Check, Bookmark, ChevronLeft, Download } from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { AiOrb } from "@/components/core/ai-orb";
import { useNeuronOs } from "@/context/neuron-os-context";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { api } from "@/utils/api";
import { executeCommand } from "@/lib/command-engine";
import { renderMarkdown } from "@/lib/markdown";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { StarterPrompts } from "@/components/dashboard/starter-prompts";
import { exportConversationMd } from "@/lib/export-conversation";

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

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return "just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  return date.toLocaleDateString();
}

export function ChatPanel({ onCommandPalette }: ChatPanelProps) {
  const {
    orbState, setOrbState, filesystem, setFilesystem, currentPath, setCurrentPath,
    addSystemLog, addProcessLog, triggerMemoryPulse, clearProcessLogs,
    activeConvId, setActiveConvId, setOrbMessage
  } = useNeuronOs();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [savedMessageIds, setSavedMessageIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [editingConvId, setEditingConvId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMountedRef = useRef(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleStartRename = (id: number, currentTitle: string) => {
    setEditingConvId(id);
    setEditingTitle(currentTitle);
  };

  const handleRenameSave = async (id: number) => {
    const trimmed = editingTitle.trim();
    if (!trimmed || trimmed.length > 100) {
      setEditingConvId(null);
      return;
    }

    const originalConversations = [...conversations];
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: trimmed } : c))
    );
    setEditingConvId(null);

    try {
      await api.patch(`/chat/conversations/${id}`, { title: trimmed });
      showToast("Thread renamed");
    } catch (err) {
      console.error("Failed to rename conversation:", err);
      showToast("Rename failed");
      setConversations(originalConversations);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRenameSave(id);
    } else if (e.key === "Escape") {
      setEditingConvId(null);
    }
  };

  const fetchConversations = useCallback(async () => {
    try {
      const data = await api.get("/chat/conversations");
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  }, []);

  // Fetch initial conversations list and autoselect latest
  useEffect(() => {
    api.get("/chat/conversations")
      .then((data) => {
        setConversations(data || []);
        if (!hasMountedRef.current) {
          hasMountedRef.current = true;
          if (data && data.length > 0) {
            setActiveConvId(data[0].id);
          }
        }
      })
      .catch(() => {});
  }, [setActiveConvId]);

  // Load message logs when active conversation switches
  useEffect(() => {
    if (activeConvId === null) {
      setMessages([]);
    } else {
      api.get(`/chat/conversations/${activeConvId}`)
        .then((data) => {
          setMessages(data.messages || []);
        })
        .catch(() => {});
    }
  }, [activeConvId]);

  const handleVoiceResult = useCallback((transcript: string) => {
    setInputText(transcript);
    setOrbState("idle");
  }, [setOrbState]);

  const { isListening, isSupported, toggleListening } = useVoiceInput({
    onStart: () => {
      setOrbState("listening");
      setOrbMessage("Voice link active", 0);
    },
    onEnd: () => {
      setOrbState("idle");
      setOrbMessage("");
    },
    onResult: (t) => {
      handleVoiceResult(t);
      setOrbMessage("Voice input captured");
    },
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

  const handleSend = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const userText = (overrideText || inputText).trim();
    if (!userText || isSubmitting) return;

    setInputText("");
    setIsSubmitting(true);
    setOrbState("thinking");
    setOrbMessage("Cognitive Query Active", 0);
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
          fetchConversations();
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
          setOrbMessage("Response complete");
          if (currentId) {
            api.get(`/chat/conversations/${currentId}`).then((data) => {
              setMessages(data.messages || []);
            }).catch(() => {});
          }
          triggerMemoryPulse();
          fetchConversations();
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

  const handleCopyText = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    showToast("Copied message to clipboard");
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSaveToMemory = async (id: number, text: string) => {
    try {
      await api.post("/memory", {
        text: text,
        category: "episodic",
        tags: ["chat"]
      });
      setSavedMessageIds((prev) => [...prev, id]);
      showToast("Saved to Memory Index");
      setOrbMessage("Wisdom Indexed");
      triggerMemoryPulse();
    } catch (err) {
      console.error("Failed to save memory:", err);
      showToast("Cognitive index failed");
      setOrbMessage("Index write error");
    }
  };

  const handleExportMarkdown = () => {
    if (!activeConvId) return;
    const activeConv = conversations.find((c) => c.id === activeConvId);
    const title = activeConv ? activeConv.title : "chat";
    exportConversationMd(messages, title);
    showToast("Markdown exported");
  };

  return (
    <div className="flex h-full flex-row overflow-hidden relative w-full">
      {/* Toast popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded border border-cyber-cyan/35 bg-cyber-glass text-[9px] font-mono text-cyber-cyan shadow-[0_0_15px_rgba(0,255,255,0.15)] z-50 uppercase tracking-[0.2em]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar background backdrop for mobile viewport overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-15 md:hidden"
        />
      )}

      {/* Sidebar Thread List */}
      <div
        className={`transition-all duration-300 border-r border-white/5 bg-cyber-dark md:bg-black/20 flex flex-col shrink-0 h-full absolute md:relative z-20 ${
          sidebarOpen ? "w-60 translate-x-0" : "w-0 -translate-x-full overflow-hidden border-r-0"
        }`}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
            Cognitive Threads
          </span>
          <button
            onClick={() => {
              setActiveConvId(null);
              addSystemLog("Switched to active standby chat");
            }}
            className="p-1 rounded hover:bg-white/5 border border-white/10 hover:border-cyber-cyan/30 text-cyber-cyan hover:text-cyber-cyan transition-all"
            title="Initialize New Chat"
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="flex-1 p-2 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {conversations.length === 0 ? (
            <div className="text-[9px] font-mono text-center text-white/20 py-8 uppercase tracking-widest">
              Awaiting First Link
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded text-xs transition-all cursor-pointer ${
                  activeConvId === conv.id
                    ? "bg-cyber-cyan/10 border-l-2 border-cyber-cyan text-cyber-cyan"
                    : "text-white/55 hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <div
                  className="flex flex-col gap-0.5 truncate pr-2 flex-1"
                  onDoubleClick={() => handleStartRename(conv.id, conv.title)}
                >
                  {editingConvId === conv.id ? (
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => handleRenameKeyDown(e, conv.id)}
                      onBlur={() => handleRenameSave(conv.id)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="bg-black/60 border border-cyber-cyan/40 rounded px-1.5 py-0.5 text-xs font-sans text-white focus:outline-none focus:border-cyber-cyan w-full"
                    />
                  ) : (
                    <span className="truncate font-sans text-xs font-semibold">{conv.title}</span>
                  )}
                  <span className="text-[8px] font-mono text-white/20">
                    {new Date(conv.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTargetId(conv.id);
                  }}
                  className="p-1 text-white/25 hover:text-cyber-red opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  title="Erase thread"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Frame */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Toggle sidebar tab log */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-black/15 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded hover:bg-white/5 border border-white/10 text-white/55 hover:text-cyber-cyan hover:border-cyber-cyan/20 transition-all"
              title="Toggle Sidebar history"
            >
              {sidebarOpen ? <ChevronLeft size={12} /> : <Menu size={12} />}
            </button>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/40 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${activeConvId ? "bg-cyber-cyan animate-pulse" : "bg-white/25"}`} />
              {activeConvId ? `Channel Link: Core-[${activeConvId}]` : "Channel: Direct Neural Port"}
            </span>
          </div>

          {activeConvId && messages.length > 0 && (
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1 px-2.5 py-1 rounded border border-white/10 bg-white/5 text-[9px] font-mono text-white/50 hover:text-cyber-cyan hover:border-cyber-cyan/35 transition-all"
              title="Export Conversation as Markdown"
            >
              <Download size={10} /> Export
            </button>
          )}
        </div>

        {/* Center Orb HUD centerpiece when no messages exist */}
        <div className="flex justify-center py-4 relative shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <AiOrb state={orbState} size={130} />
          </motion.div>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-4 min-h-0 py-2">
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
              <p className="text-xs text-white/40 max-w-sm leading-relaxed mb-4">
                Type messages to start a conversation, or execute command utilities like{" "}
                <code className="text-cyber-cyan bg-cyber-cyan/5 px-1 py-0.5 rounded border border-cyber-cyan/10">status</code>,{" "}
                <code className="text-cyber-cyan bg-cyber-cyan/5 px-1 py-0.5 rounded border border-cyber-cyan/10">help</code>, or{" "}
                <code className="text-cyber-cyan bg-cyber-cyan/5 px-1 py-0.5 rounded border border-cyber-cyan/10">scan</code>.
              </p>
              <StarterPrompts onSelect={(p) => handleSend(undefined, p)} />
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
                    className={`flex gap-3 max-w-2xl relative group ${isUser ? "self-end flex-row-reverse" : "self-start"}`}
                  >
                    <div className={`w-7 h-7 rounded flex items-center justify-center font-mono text-[9px] font-bold shrink-0 border ${
                      isUser
                        ? "bg-cyber-purple-dark/20 border-cyber-purple/40 text-cyber-purple"
                        : "bg-cyber-cyan-dark/20 border-cyber-cyan/40 text-cyber-cyan"
                    }`}>
                      {isUser ? "OP" : "NE"}
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <div className={`rounded-xl border p-4 shadow-sm relative ${
                        isUser
                          ? "bg-cyber-purple-dark/5 border-cyber-purple/20 text-white/95"
                          : "bg-white/5 border-white/5 text-white/90"
                      }`}>
                        {isUser ? (
                          <p className="text-xs leading-relaxed break-words whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="flex flex-col gap-1 text-xs break-words">{renderMarkdown(msg.content)}</div>
                        )}

                        {/* Message Toolbar Panel */}
                        <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity absolute -top-3.5 right-2 bg-cyber-dark/95 border border-white/10 rounded px-1 py-0.5 flex gap-1 z-10 shadow-lg">
                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="p-1 rounded text-white/40 hover:text-cyber-cyan transition-colors"
                            title="Copy text"
                          >
                            {copiedMessageId === msg.id ? <Check size={10} /> : <Copy size={10} />}
                          </button>

                          {!isUser && (
                            <button
                              onClick={() => handleSaveToMemory(msg.id, msg.content)}
                              disabled={savedMessageIds.includes(msg.id)}
                              className={`p-1 rounded transition-colors ${
                                savedMessageIds.includes(msg.id)
                                  ? "text-cyber-purple cursor-default"
                                  : "text-white/40 hover:text-cyber-purple"
                              }`}
                              title={savedMessageIds.includes(msg.id) ? "Saved to semantic brain" : "Save to Memory Index"}
                            >
                              <Bookmark size={10} className={savedMessageIds.includes(msg.id) ? "fill-cyber-purple/30" : ""} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Timestamps */}
                      <span className={`text-[8px] font-mono text-white/20 select-none ${isUser ? "self-end" : "self-start"}`}>
                        {formatRelativeTime(msg.created_at)}
                      </span>
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
                  <div className="w-7 h-7 rounded bg-cyber-cyan-dark/20 border border-cyber-cyan/40 text-cyber-cyan flex items-center justify-center font-mono text-[9px] font-bold shrink-0">
                    NE
                  </div>
                  <div className="rounded-xl border bg-white/5 border-white/5 p-4 flex flex-col gap-1">
                    <div className="text-xs break-words">{renderMarkdown(streamingText)}</div>
                    <span className="w-1.5 h-3 bg-cyber-cyan animate-pulse inline-block self-start mt-1" />
                  </div>
                </motion.div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input panel bar */}
        <div className="p-4 border-t border-white/5 bg-black/45 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2 max-w-3xl mx-auto items-center">
            <button
              type="button"
              onClick={onCommandPalette}
              className="p-2 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan/35 transition-all"
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

      {/* Confirmation modal for thread deletion */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Cognitive Thread"
        message="Are you sure you want to permanently erase this conversation history from memory database? All records will be removed."
        confirmText="Erase"
        cancelText="Cancel"
        onConfirm={async () => {
          if (deleteTargetId !== null) {
            try {
              await api.delete(`/chat/conversations/${deleteTargetId}`);
              if (activeConvId === deleteTargetId) {
                setActiveConvId(null);
              }
              setConversations((prev) => prev.filter((c) => c.id !== deleteTargetId));
              showToast("Thread erased successfully");
            } catch (err) {
              console.error("Failed to delete conversation:", err);
              showToast("Erase failed");
            } finally {
              setDeleteTargetId(null);
            }
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
