"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IBM_Plex_Mono } from "next/font/google";
import { Terminal } from "lucide-react";
import { WAITLIST_API } from "@/lib/waitlist-api";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

function WaitlistContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [joined, setJoined] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [position, setPosition] = useState<number | null>(null);

  // Auto-focus the input on mount
  useEffect(() => {
    const input = document.getElementById("email-input");
    if (input) input.focus();
  }, []);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const targetEmail = email.trim();
    if (!targetEmail) {
      setErrorMsg("Email is required.");
      return;
    }

    if (!validateEmail(targetEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const isGithub = searchParams?.get("ref") === "github";
      const res = await fetch(WAITLIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, github_source: isGithub }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Something went wrong.");
      }

      setPosition(data.position);
      setAlreadyJoined(Boolean(data.exists));
      setJoined(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to join waitlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl w-full flex flex-col items-start text-left py-12 relative">
      <AnimatePresence mode="wait">
        {!joined ? (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-start gap-8"
          >
            {/* Terminal-inspired path tag */}
            <div className="flex items-center gap-2.5 text-zinc-500 font-mono text-xs select-none">
              <Terminal size={14} className="text-zinc-500" />
              <span>~/neuron/soon</span>
              <span className="w-1.5 h-3 bg-zinc-500 animate-pulse" />
            </div>

            {/* Header Title */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
                Building something worth waiting for.
              </h1>
              <p className="text-sm text-zinc-400 font-normal leading-relaxed max-w-lg">
                Neuron is an AI workspace designed for builders.
                We&apos;re taking our time to build it properly.
                Leave your email and you&apos;ll receive exactly one message: the day Neuron is ready.
              </p>
            </div>

            {/* Form Input fields */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-2">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  id="email-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  disabled={isSubmitting}
                  autoComplete="off"
                  spellCheck="false"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-xs outline-none focus:border-zinc-500 placeholder-zinc-700 text-white font-mono transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white hover:bg-zinc-200 text-black text-xs font-mono font-medium rounded px-6 py-3 transition-colors active:scale-98 disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  [ join the waitlist → ]
                </button>
              </div>

              {errorMsg && (
                <motion.span
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-red-500 font-mono"
                >
                  {errorMsg}
                </motion.span>
              )}
            </form>

            {/* Muted footer logs */}
            <div className="text-[10px] text-zinc-600 font-mono flex flex-col gap-0.5 leading-relaxed">
              <span>No newsletters.</span>
              <span>No spam.</span>
              <span>Only launch updates and early access.</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-start gap-8"
          >
            {/* Path tag */}
            <div className="flex items-center gap-2.5 text-zinc-500 font-mono text-xs select-none">
              <Terminal size={14} className="text-zinc-500" />
              <span>~/neuron/welcome.txt</span>
              <span className="w-1.5 h-3 bg-zinc-500 animate-pulse" />
            </div>

            {/* Confirmation text */}
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight">
                ✓ You&apos;re in.
              </h2>
              <div className="text-sm text-zinc-400 font-normal leading-relaxed flex flex-col gap-2 max-w-lg">
                <p>Welcome aboard.</p>
                <p>You&apos;re now one of the earliest people following Neuron.</p>
                {!alreadyJoined && (
                  <p className="text-zinc-500">
                    Check your inbox — we sent you a thank-you confirmation with your waitlist position.
                  </p>
                )}
              </div>
            </div>

            {/* Sequential waitlist number display */}
            {position !== null && (
              <div className="border border-zinc-800 bg-zinc-950/50 rounded p-4 font-mono w-full sm:w-auto">
                <div className="text-[10px] uppercase text-zinc-500 tracking-wider">
                  Waitlist Position
                </div>
                <div className="text-2xl font-semibold text-white mt-1">
                  #{position}
                </div>
              </div>
            )}

            <p className="text-xs text-zinc-500 font-mono leading-relaxed mt-2">
              {alreadyJoined
                ? "You're already on the list — we'll be in touch when it's ready."
                : "We'll contact you when it's ready."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WaitlistPage() {
  return (
    <div
      className={`${ibmPlexMono.className} min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-6 selection:bg-zinc-800 selection:text-zinc-100`}
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4 text-zinc-500 text-xs font-mono select-none">
            <div className="w-4 h-4 border border-zinc-500 border-t-transparent rounded-full animate-spin" />
            <span>Establishing connection port...</span>
          </div>
        }
      >
        <WaitlistContent />
      </Suspense>
    </div>
  );
}
