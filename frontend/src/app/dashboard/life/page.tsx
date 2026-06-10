"use client";

import { useCallback } from "react";
import { Activity, Heart } from "lucide-react";
import { LifeOsLayout } from "@/components/dashboard/life-os-layout";
import { EnergyLog } from "@/components/dashboard/energy-log";
import { GoalsTracker } from "@/components/dashboard/goals-tracker";
import { BurnoutGauge } from "@/components/dashboard/burnout-gauge";
import { useBurnoutRisk } from "@/hooks/use-burnout-risk";

export default function LifeDashboardPage() {
  const { risk, loading, refetch } = useBurnoutRisk();

  const handleLogged = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <LifeOsLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Heart size={16} className="text-cyber-purple" />
          <h1 className="font-display text-lg font-black tracking-wider">
            LIFE <span className="text-cyber-purple">OS</span>
          </h1>
        </div>
        <p className="text-[10px] font-mono text-white/40 max-w-xl">
          One system that treats your personal life with the same seriousness you give your startup.
          Goals, energy, deep work — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          {!loading && risk ? (
            <BurnoutGauge score={risk.risk_score} threshold={risk.threshold} />
          ) : (
            <BurnoutGauge score={0} />
          )}
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <EnergyLog onLogged={handleLogged} />
          <GoalsTracker />
        </div>
      </div>

      {risk && risk.warning_triggered && (
        <div className="mt-4 p-3 rounded border border-cyber-red/30 bg-cyber-red/5 flex items-start gap-2">
          <Activity size={14} className="text-cyber-red mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-mono font-bold text-cyber-red uppercase">
              Predictive Warning Active
            </p>
            <p className="text-[9px] font-mono text-white/50 mt-1">
              Your patterns suggest elevated burnout risk this week. NEURON reads sleep, output,
              and screen time to warn you <em>before</em> you crash — not after.
            </p>
          </div>
        </div>
      )}
    </LifeOsLayout>
  );
}
