"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { LifeOsLayout } from "@/components/dashboard/life-os-layout";
import { PatternChart } from "@/components/dashboard/pattern-chart";
import { BurnoutGauge } from "@/components/dashboard/burnout-gauge";
import { GlassCard } from "@/components/ui/glass-card";
import { lifeOsApi, type LifeMetric, type WeeklyReport } from "@/utils/api";
import { useBurnoutRisk } from "@/hooks/use-burnout-risk";

export default function PatternsPage() {
  const [metrics, setMetrics] = useState<LifeMetric[]>([]);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const { risk } = useBurnoutRisk();

  useEffect(() => {
    Promise.all([
      lifeOsApi.getMetricHistory(7),
      lifeOsApi.getWeeklyReport(),
    ]).then(([history, weekly]) => {
      setMetrics(history);
      setReport(weekly);
    }).catch(() => {});
  }, []);

  const sleep = metrics.map((m) => m.sleep_hours ?? 0);
  const deepWork = metrics.map((m) => (m.deep_work_minutes ?? 0) / 60);
  const screen = metrics.map((m) => (m.screen_time_minutes ?? 0) / 60);
  const energy = metrics.map((m) => m.energy_level ?? 0);

  return (
    <LifeOsLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={16} className="text-cyber-cyan" />
          <h1 className="font-display text-lg font-black tracking-wider">
            PATTERN <span className="text-cyber-cyan">ANALYSIS</span>
          </h1>
        </div>
        <p className="text-[10px] font-mono text-white/40 max-w-xl">
          7-day signal window. NEURON tracks the rate of change — not just today&apos;s snapshot —
          to predict burnout a week ahead.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          {risk && <BurnoutGauge score={risk.risk_score} threshold={risk.threshold} label="Weekly Risk" />}
        </div>
        <div className="lg:col-span-2">
          {report && (
            <GlassCard glowColor="cyan" className="py-4 h-full">
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 mb-2 block">
                Weekly Debrief
              </span>
              <p className="text-[11px] font-mono text-white/70 leading-relaxed">
                {report.recommendation}
              </p>
              {report.history.length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {report.history.slice(-4).map((h) => (
                    <div
                      key={h.week_of}
                      className="px-2 py-1 rounded border border-white/10 bg-black/30 text-[8px] font-mono"
                    >
                      Wk {h.week_of.slice(5)}: {Math.round(h.risk_score)}
                      {h.warning_triggered && " ⚠"}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PatternChart label="Sleep (hours)" data={sleep} color="rgba(168, 85, 247, 0.85)" unit="h" />
        <PatternChart label="Deep Work (hours)" data={deepWork} unit="h" />
        <PatternChart label="Screen Time (hours)" data={screen} color="rgba(255, 100, 80, 0.85)" unit="h" />
        <PatternChart label="Energy Level" data={energy} color="rgba(100, 255, 150, 0.85)" />
      </div>
    </LifeOsLayout>
  );
}
