import React from "react";

export function renderMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return (
        <h4 key={idx} className="text-sm font-display font-bold text-cyber-cyan mt-3 mb-1.5 uppercase tracking-wide">
          {line.replace("### ", "")}
        </h4>
      );
    }
    if (line.startsWith("```")) return null;
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <div key={idx} className="flex items-start gap-2 text-xs text-white/80 pl-2 py-0.5">
          <span className="text-cyber-cyan text-[10px]">•</span>
          <span>{line.substring(2)}</span>
        </div>
      );
    }
    if (line.startsWith("> [!NOTE]")) {
      return (
        <div key={idx} className="bg-cyber-cyan-dark/10 border border-cyber-cyan/20 rounded-lg p-2.5 my-2 text-[10px] font-mono text-cyber-cyan">
          [RECALLED SEMANTIC BLOCK]
        </div>
      );
    }
    if (line.startsWith(">")) {
      return (
        <blockquote key={idx} className="border-l-2 border-cyber-cyan/30 pl-3 py-1 text-white/50 italic text-[11px] my-1">
          {line.substring(1).trim()}
        </blockquote>
      );
    }
    const parts = line.split("**");
    if (parts.length > 1) {
      return (
        <p key={idx} className="text-xs text-white/80 leading-relaxed py-0.5">
          {parts.map((part, pIdx) =>
            pIdx % 2 === 1 ? (
              <strong key={pIdx} className="text-cyber-cyan font-bold">{part}</strong>
            ) : (
              part
            )
          )}
        </p>
      );
    }
    if (line.startsWith("`") && line.endsWith("`")) {
      return (
        <code key={idx} className="text-[10px] font-mono text-cyber-purple bg-cyber-purple/10 px-1.5 py-0.5 rounded">
          {line.slice(1, -1)}
        </code>
      );
    }
    return (
      <p key={idx} className="text-xs text-white/80 leading-relaxed py-0.5 min-h-[1rem]">
        {line}
      </p>
    );
  });
}
