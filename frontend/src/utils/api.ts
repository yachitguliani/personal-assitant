const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("neuron_token");
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("neuron_token", token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("neuron_token");
    localStorage.removeItem("neuron_user");
  }
}

interface RequestOptions extends RequestInit {
  json?: any;
}

async function apiRequest(path: string, options: RequestOptions = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.json) {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(options.json);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    let errorDetail = "API Request failed";
    try {
      const parsed = JSON.parse(text);
      errorDetail = parsed.detail || errorDetail;
    } catch {
      errorDetail = text || errorDetail;
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (path: string, options?: RequestOptions) =>
    apiRequest(path, { ...options, method: "GET" }),
  post: (path: string, body?: any, options?: RequestOptions) =>
    apiRequest(path, { ...options, method: "POST", json: body }),
  patch: (path: string, body?: any, options?: RequestOptions) =>
    apiRequest(path, { ...options, method: "PATCH", json: body }),
  delete: (path: string, options?: RequestOptions) =>
    apiRequest(path, { ...options, method: "DELETE" }),
  
  // Custom fetch stream wrapper for SSE or chunk reading
  stream: async (
    path: string,
    body: any,
    onChunk: (text: string) => void,
    onDone?: () => void,
    onError?: (err: any) => void
  ) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP stream error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (!reader) {
        throw new Error("Response body is not readable");
      }

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
      
      if (onDone) onDone();
    } catch (err) {
      if (onError) onError(err);
    }
  },
};

// ─── Life OS Types & API ───────────────────────────────────────────────────

export interface LifeMetric {
  id: number;
  log_date: string;
  sleep_hours?: number;
  deep_work_minutes?: number;
  screen_time_minutes?: number;
  energy_level?: number;
  mood?: number;
}

export interface Goal {
  id: number;
  title: string;
  category: string;
  target_date?: string | null;
  progress: number;
  status: string;
  created_at: string;
}

export interface BurnoutRiskScore {
  risk_score: number;
  warning_triggered: boolean;
  threshold: number;
  week_of: string;
  factors: Record<string, unknown>;
  days_analyzed: number;
}

export interface WeeklyReport {
  current: BurnoutRiskScore;
  history: Array<{
    week_of: string;
    risk_score: number;
    warning_triggered: boolean;
    top_factor?: string;
  }>;
  recommendation: string;
}

export const lifeOsApi = {
  logMetric: (data: Partial<Omit<LifeMetric, "id" | "log_date">> & { log_date?: string }) =>
    api.post("/metrics/log", data),
  getMetricHistory: (days = 7) =>
    api.get(`/metrics/history?days=${days}`) as Promise<LifeMetric[]>,
  getMetricSummary: (days = 7) =>
    api.get(`/metrics/summary?days=${days}`),
  listGoals: () => api.get("/goals") as Promise<Goal[]>,
  createGoal: (data: { title: string; category: string; target_date?: string; progress?: number }) =>
    api.post("/goals", data) as Promise<Goal>,
  updateGoal: (id: number, data: Partial<Goal>) =>
    api.patch(`/goals/${id}`, data) as Promise<Goal>,
  checkinGoal: (id: number, data: { progress: number; note?: string }) =>
    api.post(`/goals/${id}/checkin`, data) as Promise<Goal>,
  deleteGoal: (id: number) => api.delete(`/goals/${id}`),
  getRiskScore: () => api.get("/burnout/risk-score") as Promise<BurnoutRiskScore>,
  getWeeklyReport: () => api.get("/burnout/weekly-report") as Promise<WeeklyReport>,
};
