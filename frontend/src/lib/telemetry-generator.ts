const PROCESS_NAMES = [
  "neural_inference",
  "vector_indexer",
  "synapse_router",
  "memory_commit",
  "auth_validator",
  "embedding_encoder",
  "context_merger",
  "telemetry_daemon",
];

const SUBSYSTEMS = ["CORE", "MEMORY", "NLP", "AUTH", "VECTOR", "SYNC"];

const MESSAGES = [
  "Synaptic pathway optimized",
  "Vector cluster rebalanced",
  "Context window refreshed",
  "Embedding cache warmed",
  "Neural latency nominal",
  "Memory node indexed",
  "Auth token validated",
  "Pipeline stage complete",
  "Semantic query resolved",
  "Cognitive load stable",
];

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  subsystem: string;
  process: string;
  message: string;
  severity: "info" | "success" | "warn" | "active";
  value?: number;
}

export interface ProcessLog {
  id: string;
  timestamp: string;
  command: string;
  status: "running" | "complete" | "error";
  output: string[];
  progress: number;
}

let eventCounter = 0;

export function generateTelemetryEvent(): TelemetryEvent {
  eventCounter++;
  const severities: TelemetryEvent["severity"][] = ["info", "info", "success", "active", "warn"];
  return {
    id: `tel-${eventCounter}`,
    timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    subsystem: SUBSYSTEMS[Math.floor(Math.random() * SUBSYSTEMS.length)],
    process: PROCESS_NAMES[Math.floor(Math.random() * PROCESS_NAMES.length)],
    message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    value: Math.floor(Math.random() * 100),
  };
}

export function createProcessLog(command: string): ProcessLog {
  return {
    id: `proc-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    command,
    status: "running",
    output: [`> Executing: ${command}`, "> Allocating neural resources..."],
    progress: 0,
  };
}

export function advanceProcessLog(log: ProcessLog): ProcessLog {
  const steps = [
    "> Parsing command parameters...",
    "> Routing to subsystem handler...",
    "> Synchronizing with memory bank...",
    "> Committing operation...",
    "> Operation complete.",
  ];
  const nextProgress = Math.min(100, log.progress + 25 + Math.floor(Math.random() * 15));
  const stepIdx = Math.min(steps.length - 1, Math.floor(nextProgress / 25));
  const newOutput = [...log.output];
  if (!newOutput.includes(steps[stepIdx])) newOutput.push(steps[stepIdx]);
  return {
    ...log,
    progress: nextProgress,
    output: newOutput,
    status: nextProgress >= 100 ? "complete" : "running",
  };
}
