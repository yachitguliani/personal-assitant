export interface StartupContext {
  firstName: string;
  greeting: string;
  timeDisplay: string;
  location: string;
  lines: string[];
}

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good evening";
}

function formatTimeDisplay(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function extractFirstName(fullName?: string): string {
  if (!fullName?.trim()) return "Operator";
  return fullName.trim().split(/\s+/)[0];
}

async function detectLocation(): Promise<string> {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      const parts = [data.city, data.region, data.country_name].filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    }
  } catch {
    /* fallback below */
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const region = tz.split("/").pop()?.replace(/_/g, " ");
    if (region) return region;
  } catch {
    /* ignore */
  }

  return "Location unavailable";
}

export async function buildStartupContext(fullName?: string): Promise<StartupContext> {
  const now = new Date();
  const firstName = extractFirstName(fullName);
  const greeting = getGreeting(now.getHours());
  const timeDisplay = formatTimeDisplay(now);
  const location = await detectLocation();

  const lines = [
    `${greeting}, ${firstName}.`,
    "NEURON is online.",
    "All core modules are operational.",
    `The current time is ${timeDisplay}.`,
    `I've detected your location as ${location}.`,
    "How may I assist you today?",
  ];

  return { firstName, greeting, timeDisplay, location, lines };
}

export const BOOT_KERNEL_LINES = [
  { text: "NEURON OS KERNEL v1.0.0-BETA", delay: 0 },
  { text: "Initializing neural reasoning matrix...", delay: 350 },
  { text: "Loading vector embedding indices [dim: 1536]", delay: 700 },
  { text: "Mounting semantic memory bank...", delay: 1050 },
  { text: "Establishing synapse routers...", delay: 1400 },
  { text: "Auth subsystem: ENCRYPTED", delay: 1750 },
  { text: "Telemetry daemon: ONLINE", delay: 2100 },
  { text: "Cognitive core: SYNCHRONIZED", delay: 2450 },
  { text: "Neural interface: STANDBY", delay: 2800 },
];

export const STARTUP_STATUS_MODULES = [
  { id: "core", label: "CORE ENGINE", delay: 600 },
  { id: "memory", label: "MEMORY BANK", delay: 1100 },
  { id: "vector", label: "VECTOR INDEX", delay: 1600 },
  { id: "auth", label: "AUTH LAYER", delay: 2100 },
  { id: "telemetry", label: "TELEMETRY", delay: 2600 },
  { id: "orb", label: "AI ORB", delay: 3100 },
];
