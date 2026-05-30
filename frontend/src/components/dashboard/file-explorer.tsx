"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Folder, File, ChevronRight, FolderPlus, FilePlus, Pencil,
  ArrowUp, RefreshCw, FolderOpen,
} from "lucide-react";
import { FSNode, findNode, listDirectory, createFolder, createFile, renameNode, cloneFilesystem } from "@/lib/mock-filesystem";
import { useNeuronOs } from "@/context/neuron-os-context";

interface FileExplorerProps {
  onOpenFile: (file: FSNode) => void;
}

export function FileExplorer({ onOpenFile }: FileExplorerProps) {
  const { filesystem, setFilesystem, currentPath, setCurrentPath, addSystemLog, addProcessLog } = useNeuronOs();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<FSNode | null>(null);

  const cwd = findNode(filesystem, currentPath) ?? filesystem;
  const items = listDirectory(cwd);

  const navigateUp = () => {
    if (currentPath.length > 0) setCurrentPath(currentPath.slice(0, -1));
  };

  const navigateInto = (node: FSNode) => {
    if (node.type === "folder") {
      setCurrentPath([...currentPath, node.name]);
      setSelectedFile(null);
    } else {
      setSelectedFile(node);
      onOpenFile(node);
      addSystemLog(`Opened: ${node.name}`);
    }
  };

  const handleCreateFolder = () => {
    const name = `folder_${Date.now().toString(36).slice(-4)}`;
    const fs = cloneFilesystem(filesystem);
    const dir = findNode(fs, currentPath) ?? fs;
    createFolder(dir, name);
    setFilesystem(fs);
    addProcessLog(`mkdir ${name}`);
    addSystemLog(`Created folder: ${name}`);
  };

  const handleCreateFile = () => {
    const name = `untitled_${Date.now().toString(36).slice(-4)}.txt`;
    const fs = cloneFilesystem(filesystem);
    const dir = findNode(fs, currentPath) ?? fs;
    createFile(dir, name, "# New file\n");
    setFilesystem(fs);
    addProcessLog(`touch ${name}`);
    addSystemLog(`Created file: ${name}`);
  };

  const handleRename = (oldName: string) => {
    if (!renameValue.trim()) {
      setRenaming(null);
      return;
    }
    const fs = cloneFilesystem(filesystem);
    const dir = findNode(fs, currentPath) ?? fs;
    const result = renameNode(dir, oldName, renameValue.trim());
    if (result.startsWith("Renamed")) {
      setFilesystem(fs);
      addProcessLog(`rename ${oldName} ${renameValue.trim()}`);
      addSystemLog(result);
    }
    setRenaming(null);
    setRenameValue("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-1 text-[9px] font-mono text-white/40 truncate">
          <FolderOpen size={10} className="text-cyber-cyan shrink-0" />
          <span className="truncate">/{currentPath.join("/") || "NEURON_OS"}</span>
        </div>
        <div className="flex items-center gap-1">
          {currentPath.length > 0 && (
            <button onClick={navigateUp} className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-cyber-cyan transition-colors" title="Go up">
              <ArrowUp size={11} />
            </button>
          )}
          <button onClick={handleCreateFolder} className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-cyber-cyan transition-colors" title="New folder">
            <FolderPlus size={11} />
          </button>
          <button onClick={handleCreateFile} className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-cyber-purple transition-colors" title="New file">
            <FilePlus size={11} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
        {items.length === 0 ? (
          <div className="text-[9px] font-mono text-white/20 p-6 text-center">EMPTY DIRECTORY</div>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 2 }}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors group ${
                selectedFile?.id === item.id
                  ? "bg-cyber-cyan/10 border border-cyber-cyan/20"
                  : "hover:bg-white/5 border border-transparent"
              }`}
              onClick={() => renaming !== item.name && navigateInto(item)}
              onDoubleClick={() => {
                if (item.type === "file") {
                  setRenaming(item.name);
                  setRenameValue(item.name);
                }
              }}
            >
              {item.type === "folder" ? (
                <Folder size={13} className="text-cyber-cyan shrink-0" />
              ) : (
                <File size={13} className="text-cyber-purple shrink-0" />
              )}

              {renaming === item.name ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(item.name);
                    if (e.key === "Escape") setRenaming(null);
                  }}
                  onBlur={() => handleRename(item.name)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-black/50 border border-cyber-cyan/30 rounded px-1.5 py-0.5 text-[10px] font-mono text-white outline-none"
                />
              ) : (
                <span className="text-[10px] font-mono text-white/70 truncate flex-1">{item.name}</span>
              )}

              {item.type === "folder" && <ChevronRight size={10} className="text-white/20" />}
              {item.size && <span className="text-[8px] font-mono text-white/20">{item.size}</span>}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRenaming(item.name);
                  setRenameValue(item.name);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-white/30 hover:text-cyber-cyan transition-all"
              >
                <Pencil size={9} />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {selectedFile && selectedFile.type === "file" && (
        <div className="border-t border-white/5 p-3 max-h-[120px] overflow-y-auto">
          <div className="text-[8px] font-mono text-cyber-cyan mb-1 uppercase">{selectedFile.name}</div>
          <pre className="text-[9px] font-mono text-white/50 whitespace-pre-wrap">{selectedFile.content}</pre>
        </div>
      )}
    </div>
  );
}
