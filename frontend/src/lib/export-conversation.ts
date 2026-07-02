export interface MessageExport {
  sender: "user" | "assistant";
  content: string;
  created_at: string;
}

export function exportConversationMd(messages: MessageExport[], title: string) {
  let md = `# NEURON OS Cognitive Thread: ${title}\n`;
  md += `Exported on: ${new Date().toLocaleString()}\n\n`;
  md += `---\n\n`;

  messages.forEach((msg) => {
    const isUser = msg.sender === "user";
    const senderName = isUser ? "OPERATOR" : "NEURON OS";
    const dateStr = new Date(msg.created_at).toLocaleString();
    md += `### 📡 [${senderName}] — ${dateStr}\n\n`;
    md += `${msg.content}\n\n`;
    md += `---\n\n`;
  });

  const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  link.setAttribute("download", `neuron-thread-${cleanTitle || "chat"}-${Date.now()}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
