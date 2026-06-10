# Personal Assistant — Learn & Build Issues

> **24 issues** to learn full-stack + AI skills while making NEURON a smarter **personal assistant** (chat, memory, voice, commands).

Full guide: [`ASSISTANT_LEARNING.md`](../../ASSISTANT_LEARNING.md)

---

## Easy (~1–3h) — Start Here

| # | Issue | Skills | Concepts |
|---|-------|--------|----------|
| 01 | [Conversation Sidebar](./easy/01-conversation-sidebar.md) | React, REST | Lists, active state, chat UX |
| 02 | [Memory Search Panel](./easy/02-memory-search-ui.md) | React, search | Debounce, semantic search |
| 03 | [Save to Memory Button](./easy/03-save-to-memory-button.md) | React, API | Memory loop, POST requests |
| 04 | [Command Palette Actions](./easy/04-command-palette-assistant-commands.md) | React, UX | Command pattern, keyboard |
| 05 | [Copy & Timestamps](./easy/05-chat-copy-and-timestamps.md) | React, browser APIs | Clipboard, date formatting |
| 06 | [Delete Conversation](./easy/06-delete-conversation-confirm.md) | React, API | DELETE, modals |
| 07 | [Memory Category Tabs](./easy/07-memory-category-filter-tabs.md) | React, filters | Taxonomy, query params |
| 08 | [Chat Starter Prompts](./easy/08-chat-starter-prompts.md) | React, UX | Empty states, onboarding |
| 09 | [User Profile HUD](./easy/09-user-profile-in-hud.md) | React, auth | JWT, /auth/me |
| 10 | [Export as Markdown](./easy/10-export-conversation-markdown.md) | React, files | Blob download |
| 11 | [Bulk Delete Memories](./easy/11-memory-bulk-delete-ui.md) | React, async | Batch operations |
| 12 | [AI Orb Status Messages](./easy/12-ai-orb-status-messages.md) | React, context | Global state, feedback |

---

## Medium (~3–6h) — Level Up

| # | Issue | Skills | Concepts |
|---|-------|--------|----------|
| 13 | [Rename Conversation API](./medium/13-rename-conversation-api-ui.md) | Full-stack | PATCH, inline edit |
| 14 | [Memory Tags Editor](./medium/14-memory-tags-editor.md) | Full-stack | CRUD, tag UX |
| 15 | [Daily Briefing AI](./medium/15-daily-briefing-endpoint.md) | Backend, AI | Prompts, context aggregation |
| 16 | [RAG Transparency](./medium/16-rag-memory-transparency.md) | Full-stack, AI | Embeddings, citations |
| 17 | [Conversation Search](./medium/17-conversation-search.md) | Full-stack | SQL search, joins |
| 18 | [Pin Memories](./medium/18-pin-important-memories.md) | Full-stack | Schema, context injection |
| 19 | [Stream Error Retry](./medium/19-streaming-error-retry.md) | Frontend | Streaming, error UX |
| 20 | [Text-to-Speech](./medium/20-text-to-speech-replies.md) | Frontend | Web Speech API |
| 21 | [Slash Commands](./medium/21-chat-slash-commands.md) | Frontend | Command parsing, CLI UX |
| 22 | [Auto-Title Threads](./medium/22-auto-title-conversations.md) | Backend, AI | Summarization |
| 23 | [Quick Notes Capture](./medium/23-quick-notes-capture.md) | Full-stack | Notes workflow |
| 24 | [Summarize Conversation](./medium/24-summarize-conversation-on-demand.md) | Backend, AI | TL;DR, memory save |

---

## Labels

| Label | Meaning |
|-------|---------|
| `learning` | Educational issue with GPT guide |
| `easy` | ~1–3 hours |
| `medium` | ~3–6 hours |
| `personal-assistant` | Chat, memory, voice, commands |
| `help wanted` | Open for contributors |

---

## How to Claim

1. Find the issue on [GitHub Issues](https://github.com/yachitguliani/personal-assitant/issues?q=label%3Alearning)
2. Comment: **"I'd like to work on this"**
3. Branch: `feature/learn-{short-name}`
4. Follow the **GPT Walkthrough** in the issue body
5. Submit PR — describe **what you learned** in the PR text

---

## Create Issues on GitHub

Maintainers:

```bash
python scripts/create_assistant_learning_issues.py
```

---

## Related Tracks

- **Life OS metrics/burnout:** [`.github/life-os/README.md`](../life-os/README.md) (issues #1–16)
- **General contributor setup:** [`project-context/CONTRIBUTOR_GUIDE.md`](../../project-context/CONTRIBUTOR_GUIDE.md)
