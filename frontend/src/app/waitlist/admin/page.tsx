"use client";

import React, { useState, useEffect } from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { Search, Download, Trash2, Mail, Check, AlertCircle, ShieldAlert, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

import { WAITLIST_API } from "@/lib/waitlist-api";

interface User {
  id: string;
  email: string;
  position: number;
  created_at: string;
  beta_invited: boolean;
  launch_notified: boolean;
  github_source: boolean;
}

interface Stats {
  total: number;
  github: number;
  beta_invited: number;
  launch_notified: number;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, github: 0, beta_invited: 0, launch_notified: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Authenticate admin locally
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${WAITLIST_API}/admin?q=test`, {
        headers: { "X-Admin-Password": password },
      });

      if (res.status === 401) {
        throw new Error("Incorrect authorization password.");
      }
      if (!res.ok) {
        throw new Error("Unable to authenticate.");
      }

      localStorage.setItem("waitlist_admin_key", password);
      setIsAuthenticated(true);
      fetchDashboardData(password);
    } catch (err: any) {
      setAuthError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch admin telemetry lists
  const fetchDashboardData = async (key: string, search = searchQuery) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${WAITLIST_API}/admin?q=${encodeURIComponent(search)}`, {
        headers: { "X-Admin-Password": key },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data.users || []);
      setStats(data.stats || { total: 0, github: 0, beta_invited: 0, launch_notified: 0 });
    } catch (err) {
      console.error("Failed to load dashboard metrics");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle auto login on mount
  useEffect(() => {
    const cached = localStorage.getItem("waitlist_admin_key");
    if (cached) {
      setPassword(cached);
      setIsAuthenticated(true);
      fetchDashboardData(cached);
    }
  }, []);

  // Handle CSV exports
  const handleExportCSV = async () => {
    const key = localStorage.getItem("waitlist_admin_key") || "";
    try {
      const res = await fetch(`${WAITLIST_API}/admin?export=csv&q=${encodeURIComponent(searchQuery)}`, {
        headers: { "X-Admin-Password": key },
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "neuron_waitlist.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Failed to export waitlist CSV.");
    }
  };

  // Trigger admin actions (beta/launch invites and delete)
  const handleAction = async (action: string, user: User) => {
    const key = localStorage.getItem("waitlist_admin_key") || "";
    if (action === "delete" && !window.confirm(`Erase ${user.email} from the waitlist registry?`)) {
      return;
    }

    try {
      const res = await fetch(`${WAITLIST_API}/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": key,
        },
        body: JSON.stringify({ action, userId: Number(user.id), email: user.email }),
      });

      if (!res.ok) throw new Error();
      fetchDashboardData(key);
    } catch (err) {
      alert(`Action '${action}' failed.`);
    }
  };

  return (
    <div
      className={`${ibmPlexMono.className} min-h-screen bg-black text-zinc-100 flex flex-col p-6 selection:bg-zinc-800 selection:text-zinc-100`}
    >
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* Password login gate */
          <motion.div
            key="login-gate"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex flex-col items-center justify-center py-20"
          >
            <div className="max-w-md w-full flex flex-col items-start gap-6 border border-zinc-850 bg-zinc-950/65 rounded-lg p-8 relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700" />

              <div className="flex items-center gap-2.5 text-zinc-500 font-mono text-xs select-none">
                <Key size={14} className="text-zinc-500" />
                <span>~/neuron/auth</span>
              </div>

              <div>
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  Dashboard Authorization
                </h1>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                  Authentication is required to query cognitive waitlist indices.
                </p>
              </div>

              <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-xs outline-none focus:border-zinc-500 placeholder-zinc-700 text-white font-mono transition-colors disabled:opacity-50"
                />

                {authError && (
                  <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-mono mt-0.5">
                    <ShieldAlert size={12} />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="bg-white hover:bg-zinc-200 text-black text-xs font-mono font-medium rounded px-6 py-3 transition-colors disabled:opacity-50 mt-1 cursor-pointer w-full text-center"
                >
                  [ verify credentials ]
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* Main Dashboard layout */
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl w-full mx-auto flex flex-col gap-8 py-8"
          >
            {/* Header path */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2.5 text-zinc-500 font-mono text-xs select-none">
                <Key size={14} />
                <span>~/neuron/admin</span>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("waitlist_admin_key");
                  setIsAuthenticated(false);
                  setPassword("");
                }}
                className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors uppercase"
              >
                [ lock portal ]
              </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Total Waitlist", count: stats.total },
                { title: "GitHub Referrals", count: stats.github },
                { title: "Beta Invitees", count: stats.beta_invited },
                { title: "Launch Notified", count: stats.launch_notified },
              ].map((stat, i) => (
                <div key={i} className="border border-zinc-850 bg-zinc-950/50 rounded p-4 flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">{stat.title}</span>
                  <span className="text-xl font-semibold text-white mt-1">#{stat.count}</span>
                </div>
              ))}
            </div>

            {/* Toolbar search and actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mt-2">
              <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-3 flex items-center text-zinc-600">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Filter by email address..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    const key = localStorage.getItem("waitlist_admin_key") || "";
                    fetchDashboardData(key, e.target.value);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded py-2.5 pl-9 pr-4 text-xs font-mono placeholder-zinc-700 focus:border-zinc-600 outline-none text-white transition-colors"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 rounded text-xs font-mono text-zinc-300 hover:text-white px-5 py-2.5 transition-colors cursor-pointer"
              >
                <Download size={13} /> Export Waitlist CSV
              </button>
            </div>

            {/* Data rows grid list */}
            <div className="border border-zinc-850 rounded-lg overflow-hidden bg-zinc-950/20">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-950 border-b border-zinc-850 text-zinc-400 select-none text-[9px] uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Waitlist Pos</th>
                      <th className="px-5 py-3.5">Email Address</th>
                      <th className="px-5 py-3.5">Joined Date</th>
                      <th className="px-5 py-3.5">Referral Source</th>
                      <th className="px-5 py-3.5">Status Check</th>
                      <th className="px-5 py-3.5 text-right">Actions Panel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-zinc-600 font-mono italic">
                          No waitlist records match search credentials.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-zinc-950/60 transition-colors">
                          <td className="px-5 py-4 font-semibold text-zinc-400">#{user.position}</td>
                          <td className="px-5 py-4 text-white truncate max-w-[200px]" title={user.email}>
                            {user.email}
                          </td>
                          <td className="px-5 py-4 text-zinc-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4">
                            {user.github_source ? (
                              <span className="text-zinc-400 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[8.5px] uppercase">
                                GitHub
                              </span>
                            ) : (
                              <span className="text-zinc-600">Organic</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-1">
                              {user.beta_invited && (
                                <span className="text-emerald-500 flex items-center gap-1 text-[9px] uppercase">
                                  <Check size={10} /> Beta Invited
                                </span>
                              )}
                              {user.launch_notified && (
                                <span className="text-blue-500 flex items-center gap-1 text-[9px] uppercase">
                                  <Check size={10} /> Launch Notified
                                </span>
                              )}
                              {!user.beta_invited && !user.launch_notified && (
                                <span className="text-zinc-500 text-[9px] uppercase">Waitlisted</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleAction("invite_beta", user)}
                                disabled={user.beta_invited}
                                className={`px-2 py-1 rounded text-[9.5px] border font-mono transition-all uppercase cursor-pointer ${
                                  user.beta_invited
                                    ? "border-zinc-850 text-zinc-600 cursor-default"
                                    : "border-emerald-900/60 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/45 hover:border-emerald-600/40"
                                }`}
                                title="Send Beta Invite Email"
                              >
                                {user.beta_invited ? "Invited" : "Invite Beta"}
                              </button>

                              <button
                                onClick={() => handleAction("invite_launch", user)}
                                disabled={user.launch_notified}
                                className={`px-2 py-1 rounded text-[9.5px] border font-mono transition-all uppercase cursor-pointer ${
                                  user.launch_notified
                                    ? "border-zinc-850 text-zinc-600 cursor-default"
                                    : "border-blue-900/60 bg-blue-950/20 text-blue-400 hover:bg-blue-950/45 hover:border-blue-600/40"
                                }`}
                                title="Send Launch Email"
                              >
                                {user.launch_notified ? "Sent" : "Invite Launch"}
                              </button>

                              <button
                                onClick={() => handleAction("mark_invited", user)}
                                disabled={user.beta_invited}
                                className={`px-2 py-1 rounded text-[9.5px] border font-mono transition-all uppercase cursor-pointer ${
                                  user.beta_invited
                                    ? "border-zinc-850 text-zinc-600 cursor-default"
                                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                }`}
                                title="Mark Invited Manually"
                              >
                                Mark
                              </button>

                              <button
                                onClick={() => handleAction("delete", user)}
                                className="p-1.5 rounded border border-zinc-850 hover:border-red-900 bg-transparent text-zinc-500 hover:bg-red-950/20 hover:text-red-500 transition-all cursor-pointer"
                                title="Erase Record"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
