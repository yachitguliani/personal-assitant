import {
  FSNode,
  findNode,
  listDirectory,
  createFolder,
  createFile,
  renameNode,
  cloneFilesystem,
} from "./mock-filesystem";

export interface CommandResult {
  success: boolean;
  message: string;
  type: "system" | "file" | "action" | "chat";
  data?: unknown;
}

export interface CommandContext {
  filesystem: FSNode;
  currentPath: string[];
  setFilesystem: (fs: FSNode) => void;
  setCurrentPath: (path: string[]) => void;
  addLog: (msg: string) => void;
}

const HELP_TEXT = `**NEURON OS Command Reference**

\`help\` — Show available commands
\`status\` — System operational status
\`ls\` — List current directory
\`cd <folder>\` — Navigate to folder
\`open <file>\` — Open and read a file
\`mkdir <name>\` — Create folder
\`touch <name>\` — Create file
\`rename <old> <new>\` — Rename item
\`clear\` — Clear process logs
\`scan\` — Run neural system scan
\`sync\` — Synchronize memory bank`;

export function executeCommand(input: string, ctx: CommandContext): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { success: false, message: "", type: "system" };

  const parts = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
  const first = parts[0];
  if (!first) return { success: false, message: "", type: "system" };
  const cmd = first.toLowerCase().replace(/^\//, "");
  const args = parts.slice(1).map((a) => a.replace(/^"|"$/g, ""));

  const cwd = findNode(ctx.filesystem, ctx.currentPath) ?? ctx.filesystem;

  switch (cmd) {
    case "help":
    case "?":
      return { success: true, message: HELP_TEXT, type: "system" };

    case "status": {
      const uptime = Math.floor(performance.now() / 1000);
      return {
        success: true,
        message:
          `### NEURON OS — Operational Status\n` +
          `**Core:** Online & Synchronized\n` +
          `**Neural Latency:** ${12 + Math.floor(Math.random() * 8)}ms\n` +
          `**Memory Bank:** Active (${ctx.currentPath.join("/") || "root"})\n` +
          `**Uptime:** ${uptime}s\n` +
          `**Mode:** Phase 1 Command Center`,
        type: "system",
      };
    }

    case "ls":
    case "list": {
      const items = listDirectory(cwd);
      if (items.length === 0) {
        return { success: true, message: "*Directory is empty.*", type: "file" };
      }
      const listing = items
        .map((n) => `- ${n.type === "folder" ? "📁" : "📄"} **${n.name}**${n.size ? ` (${n.size})` : ""}`)
        .join("\n");
      return {
        success: true,
        message: `### ${ctx.currentPath.join("/") || "NEURON_OS"}\n${listing}`,
        type: "file",
      };
    }

    case "cd": {
      if (!args[0]) return { success: false, message: "Usage: `cd <folder>`", type: "file" };
      if (args[0] === "..") {
        if (ctx.currentPath.length > 0) {
          ctx.setCurrentPath(ctx.currentPath.slice(0, -1));
          return { success: true, message: `Navigated to \`${ctx.currentPath.join("/") || "NEURON_OS"}\``, type: "file" };
        }
        return { success: true, message: "Already at root.", type: "file" };
      }
      const target = findNode(cwd, [args[0]]);
      if (!target || target.type !== "folder") {
        return { success: false, message: `Folder "${args[0]}" not found.`, type: "file" };
      }
      ctx.setCurrentPath([...ctx.currentPath, target.name]);
      ctx.addLog(`Navigated to ${[...ctx.currentPath].join("/")}`);
      return { success: true, message: `Entered \`${target.name}\``, type: "file", data: { path: [...ctx.currentPath] } };
    }

    case "open":
    case "cat": {
      if (!args[0]) return { success: false, message: "Usage: `open <file>`", type: "file" };
      const file = findNode(cwd, [args[0]]);
      if (!file || file.type !== "file") {
        return { success: false, message: `File "${args[0]}" not found.`, type: "file" };
      }
      ctx.addLog(`Opened file: ${file.name}`);
      return {
        success: true,
        message: `### ${file.name}\n\`\`\`\n${file.content ?? "(empty)"}\n\`\`\``,
        type: "file",
        data: { file },
      };
    }

    case "mkdir":
    case "create": {
      const name = args[0] === "folder" ? args[1] : args[0];
      if (!name) return { success: false, message: "Usage: `mkdir <name>`", type: "file" };
      const fs = cloneFilesystem(ctx.filesystem);
      const targetDir = findNode(fs, ctx.currentPath) ?? fs;
      const result = createFolder(targetDir, name);
      if (typeof result === "string") return { success: false, message: result, type: "file" };
      ctx.setFilesystem(fs);
      ctx.addLog(`Created folder: ${name}`);
      return { success: true, message: `Folder **${name}** created.`, type: "file" };
    }

    case "touch": {
      if (!args[0]) return { success: false, message: "Usage: `touch <name>`", type: "file" };
      const fs = cloneFilesystem(ctx.filesystem);
      const targetDir = findNode(fs, ctx.currentPath) ?? fs;
      const result = createFile(targetDir, args[0]);
      if (typeof result === "string") return { success: false, message: result, type: "file" };
      ctx.setFilesystem(fs);
      ctx.addLog(`Created file: ${args[0]}`);
      return { success: true, message: `File **${args[0]}** created.`, type: "file" };
    }

    case "rename":
    case "mv": {
      if (args.length < 2) return { success: false, message: "Usage: `rename <old> <new>`", type: "file" };
      const fs = cloneFilesystem(ctx.filesystem);
      const targetDir = findNode(fs, ctx.currentPath) ?? fs;
      const result = renameNode(targetDir, args[0], args[1]);
      if (result.startsWith("Renamed")) {
        ctx.setFilesystem(fs);
        ctx.addLog(result);
        return { success: true, message: result, type: "file" };
      }
      return { success: false, message: result, type: "file" };
    }

    case "scan": {
      ctx.addLog("Neural system scan initiated...");
      return {
        success: true,
        message:
          `### Neural System Scan Complete\n` +
          `- **Core Integrity:** 99.7%\n` +
          `- **Memory Index:** ${Math.floor(80 + Math.random() * 20)} nodes active\n` +
          `- **Vector Clusters:** Synchronized\n` +
          `- **Anomalies:** None detected`,
        type: "action",
      };
    }

    case "sync": {
      ctx.addLog("Memory bank synchronization started...");
      return {
        success: true,
        message: "Memory bank synchronized. All semantic nodes indexed and operational.",
        type: "action",
      };
    }

    case "clear":
      return { success: true, message: "__CLEAR_LOGS__", type: "system" };

    default:
      return { success: false, message: "", type: "chat" };
  }
}

export const COMMAND_PALETTE_ITEMS = [
  { id: "new-chat", label: "New Conversation", shortcut: "Ctrl+N", category: "Chat" },
  { id: "command-help", label: "Show Commands", shortcut: "?", category: "System" },
  { id: "status", label: "System Status", category: "System" },
  { id: "scan", label: "Neural System Scan", category: "System" },
  { id: "sync", label: "Sync Memory Bank", category: "Memory" },
  { id: "ls", label: "List Files", category: "Files" },
  { id: "mkdir", label: "Create Folder", category: "Files" },
  { id: "touch", label: "Create File", category: "Files" },
  { id: "toggle-files", label: "Toggle File Explorer", category: "Navigation" },
  { id: "toggle-palette", label: "Command Palette", shortcut: "Ctrl+K", category: "Navigation" },
];
