"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, Database, Terminal, Shield, LogOut, Send, 
  Plus, Search, RefreshCw, Hash, Cpu, Settings, Trash2, Tag, BrainCircuit
} from "lucide-react";
import { CyberButton } from "@/components/ui/cyber-button";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonInput } from "@/components/ui/neon-input";
import { VectorViz } from "@/components/vector-viz";
import { SystemStatus } from "@/components/system-status";
import { api, clearAuthToken, getAuthToken } from "@/utils/api";

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

interface MemoryNode {
  id: number;
  text: string;
  category: string;
  tags: string[];
  created_at: string;
  similarity?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  
  // Auth state
  const [user, setUser] = useState<{ id: number; email: string; full_name: string } | null>(null);
  
  // Core UI states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  
  // Memory lists and timeline
  const [memories, setMemories] = useState<MemoryNode[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMemText, setNewMemText] = useState("");
  const [newMemCategory, setNewMemCategory] = useState("semantic");
  const [newMemTags, setNewMemTags] = useState("");

  // Loading & Stream states
  const [streamingText, setStreamingText] = useState("");
  const [loadingConv, setLoadingConv] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>(["Core command link online."]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addLog = (log: string) => {
    setSystemLogs((prev) => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  // Auth verification
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }
    const cachedUser = localStorage.getItem("neuron_user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
    
    // Initial loads
    fetchConversations();
    fetchMemories();
  }, [router]);

  // Autoscroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // API Callbacks
  const fetchConversations = async () => {
    try {
      const data = await api.get("/chat/conversations");
      setConversations(data);
      if (data.length > 0 && !activeConvId) {
        loadConversation(data[0].id);
      }
    } catch (err: any) {
      addLog("Failed to fetch session array.");
    }
  };

  const fetchMemories = async (query = "") => {
    try {
      const path = query ? `/memory?q=${encodeURIComponent(query)}` : "/memory";
      const data = await api.get(path);
      setMemories(data);
    } catch (err) {
      addLog("Failed to sync memory bank data.");
    }
  };

  const loadConversation = async (id: number) => {
    setLoadingConv(true);
    setActiveConvId(id);
    setStreamingText("");
    try {
      const data = await api.get(`/chat/conversations/${id}`);
      setMessages(data.messages || []);
      addLog(`Selected reasoning path #${id}.`);
    } catch (err) {
      addLog(`Error loading conversation #${id}.`);
    } finally {
      setLoadingConv(false);
    }
  };

  const startNewConversation = async () => {
    try {
      const res = await api.post("/chat/conversations", { title: "New Conversation" });
      setConversations((prev) => [res, ...prev]);
      setActiveConvId(res.id);
      setMessages([]);
      setStreamingText("");
      addLog("Initialized new reasoning instance.");
    } catch (err) {
      addLog("Failed to initialize session.");
    }
  };

  const handleDeleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      addLog(`Purged conversation path #${id}.`);
      if (activeConvId === id) {
        setActiveConvId(null);
        setMessages([]);
      }
    } catch (err) {
      addLog("Failed to purge session.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    let currentId = activeConvId;
    
    // Create new conversation automatically if list is empty
    if (!currentId) {
      try {
        const res = await api.post("/chat/conversations", { title: inputText.substring(0, 30) });
        setConversations([res]);
        currentId = res.id;
        setActiveConvId(res.id);
      } catch (err) {
        addLog("Autostart session failed.");
        return;
      }
    }

    const userText = inputText;
    setInputText("");
    setIsSubmitting(true);
    
    // Push user message to UI immediately
    const userMsgTemp: Message = {
      id: Date.now(),
      sender: "user",
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsgTemp]);
    
    addLog(`Transmitting prompt to core pipeline...`);
    setStreamingText("");

    try {
      await api.stream(
        `/chat/conversations/${currentId}/stream`,
        { content: userText },
        (chunk) => {
          setStreamingText((prev) => prev + chunk);
        },
        () => {
          // Stream completed successfully
          setIsSubmitting(false);
          // Reload conversation history to fetch proper saved database entities
          if (currentId) {
            loadConversation(currentId);
            fetchConversations();
            fetchMemories(); // Refresh memory timeline stats
          }
          addLog("Pipeline response synthesized.");
        },
        (err) => {
          setIsSubmitting(false);
          addLog("Response streaming failed.");
        }
      );
    } catch (err) {
      setIsSubmitting(false);
      addLog("Failed to trigger streaming api.");
    }
  };

  const handleCommitMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemText.trim()) return;

    try {
      const tagsList = newMemTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await api.post("/memory", {
        text: newMemText,
        category: newMemCategory,
        tags: tagsList,
      });

      setNewMemText("");
      setNewMemTags("");
      fetchMemories();
      addLog("Memory node registered in vector database.");
    } catch (err) {
      addLog("Synapse commitment failed.");
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    router.push("/login");
  };

  // Custom text parse formatter for sci-fi markdown render
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Check for titles
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-sm font-display font-bold text-cyber-cyan mt-3 mb-1.5 uppercase tracking-wide">
            {line.replace("### ", "")}
          </h4>
        );
      }
      
      // Check for code blocks
      if (line.startsWith("```")) {
        return null; // hide fences
      }
      
      // Check for lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-white/80 pl-2 py-0.5">
            <span className="text-cyber-cyan text-[10px]">•</span>
            <span>{line.substring(2)}</span>
          </div>
        );
      }
      
      // Check for alert boxes / tags
      if (line.startsWith("> [!NOTE]")) {
        return (
          <div key={idx} className="bg-cyber-cyan-dark/10 border border-cyber-cyan/20 rounded-lg p-2.5 my-2 text-[10px] font-mono text-cyber-cyan">
            [RECALLED SEMANTIC BLOCK]
          </div>
        );
      }
      
      if (line.startsWith(">")) {
        return (
          <blockquote key={idx} className="border-l-2 border-cyber-cyan/30 pl-3 py-1 text-white/50 italic text-[11px] my-1">
            {line.substring(1).trim()}
          </blockquote>
        );
      }

      // Simple inline bolding replace helper
      const parts = line.split("**");
      if (parts.length > 1) {
        return (
          <p key={idx} className="text-xs text-white/80 leading-relaxed py-0.5">
            {parts.map((part, pIdx) => 
              pIdx % 2 === 1 ? <strong key={pIdx} className="text-cyber-cyan font-bold">{part}</strong> : part
            )}
          </p>
        );
      }

      return (
        <p key={idx} className="text-xs text-white/80 leading-relaxed py-0.5 min-h-[1rem]">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="relative min-h-screen bg-cyber-dark text-white flex flex-col overflow-hidden font-sans scanline">
      {/* Network Grids */}
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />

      {/* Top HUD bar */}
      <header className="relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-5 h-5 border-2 border-cyber-cyan rounded flex items-center justify-center font-display font-black text-[10px] text-cyber-cyan">
              N
            </div>
            <span className="font-display font-bold text-xs tracking-[0.2em]">
              NEURON <span className="text-cyber-cyan">OS</span>
            </span>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-cyber-cyan/20 bg-cyber-cyan-dark/10 text-[9px] font-mono text-cyber-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
            SECURE LINK INITIALIZED
          </div>
        </div>

        {/* User signature details */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex flex-col text-right font-mono">
            <span className="text-[10px] text-white/40">AGENT IDENTITY</span>
            <span className="text-white/80 font-bold">{user?.full_name || "Guest Agent"}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg border border-white/5 bg-white/5 hover:bg-cyber-red/10 hover:border-cyber-red/40 hover:text-cyber-red transition-all duration-300"
            title="Terminate Core Session"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Main workspace layout */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row h-[calc(100vh-49px)] overflow-hidden">
        
        {/* Column 1: Navigation Sidebar */}
        <aside className="w-full md:w-64 border-r border-white/5 bg-black/35 flex flex-col">
          
          {/* Create conversation button */}
          <div className="p-4 border-b border-white/5 flex gap-2">
            <CyberButton variant="cyan" size="sm" className="flex-1" onClick={startNewConversation}>
              <Plus size={14} className="mr-1" /> NEW CORE PATH
            </CyberButton>
          </div>

          {/* Conversations session logs list */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 px-2 mb-1 block">
              Reasoning Pathways
            </span>
            
            {conversations.length === 0 ? (
              <div className="text-[10px] font-mono text-white/20 p-4 text-center">
                NO PATHWAYS CONFIGURED
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg border font-mono text-xs cursor-pointer transition-all duration-300 select-none ${
                      isActive
                        ? "bg-cyber-cyan-dark/15 border-cyber-cyan/40 text-cyber-cyan"
                        : "bg-white/5 border-transparent text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare size={12} className={isActive ? "text-cyber-cyan" : "text-white/40"} />
                      <span className="truncate">{conv.title}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-cyber-red p-0.5 rounded transition-all"
                      style={{ opacity: isActive ? 1 : 0.4 }}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Telemetry log terminal drawer */}
          <div className="bg-black/60 border-t border-white/5 p-3.5 font-mono text-[8px] text-white/45">
            <span className="text-cyber-cyan font-bold uppercase block mb-1.5 flex items-center gap-1">
              <Terminal size={10} /> TELEMETRY LOGS
            </span>
            <div className="flex flex-col gap-1 select-none">
              {systemLogs.map((log, i) => (
                <div key={i} className="truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Column 2: Chat Assistant Module */}
        <section className="flex-1 flex flex-col bg-black/10 relative">
          
          {/* Conversation viewport */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {loadingConv ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/30 font-mono text-xs">
                <RefreshCw className="animate-spin text-cyber-cyan" size={18} />
                DECRYPTING SYSTEM TRANSCRIPT...
              </div>
            ) : messages.length === 0 && !streamingText ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
                <BrainCircuit className="text-cyber-cyan/20 mb-4 animate-float" size={54} />
                <h3 className="font-display font-bold text-sm tracking-widest text-white/90 uppercase">
                  NEURON COGNITIVE MODULE
                </h3>
                <p className="text-[11px] font-sans text-white/40 leading-relaxed mt-2 uppercase tracking-wide">
                  Standing by to process query trees. Injects context nodes from vector files. Try requesting operational status.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-2xl ${isUser ? "self-end flex-row-reverse" : "self-start"}`}
                    >
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded flex items-center justify-center font-mono text-[9px] font-bold select-none shrink-0 ${
                        isUser 
                          ? "bg-cyber-purple-dark/20 border border-cyber-purple text-cyber-purple" 
                          : "bg-cyber-cyan-dark/20 border border-cyber-cyan text-cyber-cyan"
                      }`}>
                        {isUser ? "US" : "NE"}
                      </div>
                      
                      {/* Message card */}
                      <div className={`rounded-xl border p-4 shadow-sm ${
                        isUser
                          ? "bg-cyber-purple-dark/5 border-cyber-purple/20 text-white"
                          : "bg-white/5 border-white/5 text-white/90"
                      }`}>
                        {isUser ? (
                          <p className="text-xs leading-relaxed">{msg.content}</p>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {renderMarkdown(msg.content)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Streaming Assistant bubble */}
                {streamingText && (
                  <div className="flex gap-3 max-w-2xl self-start">
                    <div className="w-7 h-7 rounded bg-cyber-cyan-dark/20 border border-cyber-cyan text-cyber-cyan flex items-center justify-center font-mono text-[9px] font-bold select-none shrink-0">
                      NE
                    </div>
                    <div className="rounded-xl border bg-white/5 border-white/5 p-4 text-white/90 shadow-sm flex flex-col gap-1">
                      {renderMarkdown(streamingText)}
                      <span className="w-1.5 h-3 bg-cyber-cyan animate-pulse inline-block self-start mt-1" />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form message input */}
          <div className="p-4 border-t border-white/5 bg-black/45">
            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-3xl mx-auto">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Instruct NEURON OS..."
                disabled={isSubmitting}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 text-xs font-sans placeholder-white/20 text-white outline-none focus:border-cyber-cyan focus:shadow-[0_0_12px_rgba(0,255,255,0.1)] transition-all duration-300 disabled:opacity-50"
              />
              <CyberButton type="submit" variant="cyan" size="sm" disabled={isSubmitting || !inputText.trim()}>
                <Send size={12} />
              </CyberButton>
            </form>
          </div>
        </section>

        {/* Column 3: Cyber Telemetry & Memory Dashboard */}
        <aside className="w-full md:w-80 border-l border-white/5 bg-black/35 flex flex-col overflow-y-auto p-4 gap-5">
          
          {/* Vector Canvas mapping */}
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-2 block flex items-center gap-1">
              <BrainCircuit size={10} className="text-cyber-cyan" /> COGNITIVE SYNERGY MAP
            </span>
            <div className="h-[230px]">
              <VectorViz />
            </div>
          </div>

          {/* Core System Telemetry */}
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-2 block flex items-center gap-1">
              <Cpu size={10} className="text-cyber-purple" /> SYSTEM PERFORMANCE TELEMETRY
            </span>
            <SystemStatus />
          </div>

          {/* Vector Memory Registrar Form */}
          <GlassCard glowColor="purple" className="py-4">
            <span className="text-[9px] font-mono uppercase tracking-widest text-cyber-purple font-bold mb-3 block flex items-center gap-1">
              <Database size={10} /> Register Memory Node
            </span>
            <form onSubmit={handleCommitMemory} className="flex flex-col gap-3">
              <textarea
                value={newMemText}
                onChange={(e) => setNewMemText(e.target.value)}
                placeholder="Commit text (e.g. Server API secret is xyz)"
                rows={2}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-[10px] font-sans placeholder-white/25 text-white outline-none focus:border-cyber-purple focus:shadow-[0_0_10px_rgba(168,85,247,0.1)] transition-all duration-300"
              />
              <div className="flex gap-2">
                <select
                  value={newMemCategory}
                  onChange={(e) => setNewMemCategory(e.target.value)}
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-[9px] font-mono text-white/60 outline-none"
                >
                  <option value="semantic">Semantic</option>
                  <option value="episodic">Episodic</option>
                  <option value="procedural">Procedural</option>
                </select>
                <input
                  type="text"
                  value={newMemTags}
                  onChange={(e) => setNewMemTags(e.target.value)}
                  placeholder="tags (comma separated)"
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-[9px] font-sans placeholder-white/25 text-white outline-none"
                />
              </div>
              <CyberButton type="submit" variant="purple" size="sm" className="w-full" disabled={!newMemText.trim()}>
                COMMIT TO SYNERGY
              </CyberButton>
            </form>
          </GlassCard>

          {/* Semantic memory logs checklist */}
          <div className="flex-1 flex flex-col gap-2 min-h-[160px]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-1">
                <Hash size={10} className="text-cyber-cyan" /> Vector Memory Timeline
              </span>
              <div className="relative w-28 flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchMemories(e.target.value);
                  }}
                  placeholder="Semantic query..."
                  className="w-full bg-black/40 border border-white/10 rounded-md py-1 pl-6 pr-2 text-[9px] font-sans placeholder-white/20 text-white outline-none"
                />
                <Search className="absolute left-2 text-white/30" size={9} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[220px] flex flex-col gap-2">
              {memories.length === 0 ? (
                <div className="text-[9px] font-mono text-white/20 p-6 text-center border border-dashed border-white/5 rounded-xl">
                  MEMORY TIMELINE EMPTY
                </div>
              ) : (
                memories.map((mem) => (
                  <div key={mem.id} className="bg-black/30 border border-white/5 rounded-xl p-2.5 text-[10px] flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[8px] font-mono text-white/30 border-b border-white/5 pb-1">
                      <span className="uppercase text-cyber-cyan">[{mem.category}]</span>
                      <span>
                        {mem.similarity !== undefined && mem.similarity < 1.0
                          ? `MATCH: ${(mem.similarity * 100).toFixed(0)}%`
                          : new Date(mem.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/70 font-sans leading-relaxed break-words">{mem.text}</p>
                    {mem.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Tag size={8} className="text-cyber-purple" />
                        {mem.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="bg-cyber-purple-dark/15 border border-cyber-purple/20 text-[7px] font-mono px-1 rounded text-cyber-purple uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
