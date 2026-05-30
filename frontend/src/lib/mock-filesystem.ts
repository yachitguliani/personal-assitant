export interface FSNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FSNode[];
  content?: string;
  modified: string;
  size?: string;
}

const now = () => new Date().toISOString();

function createId() {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const INITIAL_FILESYSTEM: FSNode = {
  id: "root",
  name: "NEURON_OS",
  type: "folder",
  modified: now(),
  children: [
    {
      id: "sys",
      name: "system",
      type: "folder",
      modified: now(),
      children: [
        {
          id: "sys-config",
          name: "core.config",
          type: "file",
          content: "# NEURON OS Core Configuration\nversion: 1.0.0-beta\nmode: operational\nneural_latency_ms: 14",
          modified: now(),
          size: "1.2 KB",
        },
        {
          id: "sys-logs",
          name: "boot.log",
          type: "file",
          content: "[BOOT] Neural matrix initialized\n[BOOT] Vector embeddings online\n[BOOT] Auth subsystem synchronized",
          modified: now(),
          size: "4.8 KB",
        },
      ],
    },
    {
      id: "mem",
      name: "memory_bank",
      type: "folder",
      modified: now(),
      children: [
        {
          id: "mem-1",
          name: "user_context.md",
          type: "file",
          content: "# User Context\nPrimary operator profile loaded.\nPreferences: cinematic UI, proactive assistance.",
          modified: now(),
          size: "2.1 KB",
        },
        {
          id: "mem-2",
          name: "active_goals.txt",
          type: "file",
          content: "1. Complete NEURON OS Phase 1\n2. Build semantic memory index\n3. Deploy command center",
          modified: now(),
          size: "0.8 KB",
        },
      ],
    },
    {
      id: "proj",
      name: "projects",
      type: "folder",
      modified: now(),
      children: [
        {
          id: "proj-neuron",
          name: "neuron_os",
          type: "folder",
          modified: now(),
          children: [
            {
              id: "proj-readme",
              name: "README.md",
              type: "file",
              content: "# NEURON OS\nNeural Engine for Unified Reasoning and Operational Networks.",
              modified: now(),
              size: "3.4 KB",
            },
          ],
        },
      ],
    },
    {
      id: "inbox",
      name: "inbox",
      type: "folder",
      modified: now(),
      children: [],
    },
  ],
};

export function findNode(root: FSNode, path: string[]): FSNode | null {
  if (path.length === 0) return root;
  const [head, ...rest] = path;
  if (!root.children) return null;
  const child = root.children.find((c) => c.name.toLowerCase() === head.toLowerCase());
  if (!child) return null;
  return rest.length === 0 ? child : findNode(child, rest);
}

export function listDirectory(node: FSNode): FSNode[] {
  return node.children ?? [];
}

export function createFolder(parent: FSNode, name: string): FSNode | string {
  if (parent.type !== "folder") return "Target is not a directory.";
  if (!parent.children) parent.children = [];
  if (parent.children.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    return `Folder "${name}" already exists.`;
  }
  const folder: FSNode = { id: createId(), name, type: "folder", modified: now(), children: [] };
  parent.children.push(folder);
  return folder;
}

export function createFile(parent: FSNode, name: string, content = ""): FSNode | string {
  if (parent.type !== "folder") return "Target is not a directory.";
  if (!parent.children) parent.children = [];
  if (parent.children.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    return `File "${name}" already exists.`;
  }
  const file: FSNode = {
    id: createId(),
    name,
    type: "file",
    content,
    modified: now(),
    size: `${Math.max(0.1, content.length / 1024).toFixed(1)} KB`,
  };
  parent.children.push(file);
  return file;
}

export function renameNode(parent: FSNode, oldName: string, newName: string): string {
  if (!parent.children) return "Directory is empty.";
  const node = parent.children.find((c) => c.name.toLowerCase() === oldName.toLowerCase());
  if (!node) return `Item "${oldName}" not found.`;
  if (parent.children.some((c) => c.name.toLowerCase() === newName.toLowerCase() && c.id !== node.id)) {
    return `Item "${newName}" already exists.`;
  }
  node.name = newName;
  node.modified = now();
  return `Renamed "${oldName}" → "${newName}"`;
}

export function cloneFilesystem(root: FSNode): FSNode {
  return JSON.parse(JSON.stringify(root));
}
