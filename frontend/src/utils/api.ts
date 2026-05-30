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
