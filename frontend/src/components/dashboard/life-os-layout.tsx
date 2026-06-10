"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NeuronOsProvider } from "@/context/neuron-os-context";
import { BootSequence } from "@/components/core/boot-sequence";
import { AmbientParticles } from "@/components/core/ambient-particles";
import { HudHeader } from "@/components/dashboard/hud-header";
import { getAuthToken } from "@/utils/api";

interface LifeOsLayoutProps {
  children: React.ReactNode;
}

function LifeOsLayoutInner({ children }: LifeOsLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ full_name?: string } | null>(null);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }
    const cached = localStorage.getItem("neuron_user");
    if (cached) setUser(JSON.parse(cached));
    setBootComplete(true);
  }, [router]);

  if (!bootComplete) {
    return <BootSequence userName={user?.full_name} onComplete={() => setBootComplete(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-cyber-dark text-white flex flex-col overflow-hidden font-sans scanline">
      <AmbientParticles />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyber-purple/5 blur-[120px] pointer-events-none" />

      <HudHeader userName={user?.full_name} onCommandPalette={() => {}} activeRoute={pathname} />

      <main className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

export function LifeOsLayout({ children }: LifeOsLayoutProps) {
  return (
    <NeuronOsProvider>
      <LifeOsLayoutInner>{children}</LifeOsLayoutInner>
    </NeuronOsProvider>
  );
}
