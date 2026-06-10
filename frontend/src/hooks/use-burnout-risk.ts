"use client";

import { useEffect, useState, useCallback } from "react";
import { lifeOsApi, type BurnoutRiskScore } from "@/utils/api";

export function useBurnoutRisk(pollMs = 60000) {
  const [risk, setRisk] = useState<BurnoutRiskScore | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await lifeOsApi.getRiskScore();
      setRisk(data);
    } catch {
      setRisk(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, pollMs);
    return () => clearInterval(interval);
  }, [load, pollMs]);

  return { risk, loading, refetch: load };
}
