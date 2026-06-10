# [LEARN] Export Conversation as Markdown

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~2h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Download any chat thread as a .md file — useful for notes, sharing, and learning file download in browsers.

---

## Concepts You'll Learn

- **Blob URLs**
- **Client-side file generation**
- **Markdown formatting**
- **Download trigger**

---

## Read These Files First

- `frontend/src/components/dashboard/chat-panel.tsx`
- Message interface

---

## GPT / Cursor Walkthrough

Copy these prompts into ChatGPT, Claude, or Cursor Composer. Replace `[ISSUE]` with this issue title.

### Prompt 1 — Understand the codebase

```
I'm contributing to NEURON OS, a personal AI assistant (FastAPI + Next.js).
Issue: [ISSUE]

Explain how the existing code works for this area. What patterns must I follow?
List files I should read and any gotchas (JWT auth, sync SQLAlchemy, api.ts client).
```

### Prompt 2 — Plan the implementation

```
Add 'Export' button in chat header. Build markdown string from messages (## User / ## Assistant). Trigger download via Blob + anchor click.
```

### Prompt 3 — Implement

```
Implement exportConversationMd(messages, title) util. Button in chat panel toolbar. Filename: neuron-chat-{title}-{date}.md
```

### Prompt 4 — Test & open a PR

```
Export 5-message thread. Open file — valid markdown. Special characters escaped.
```

---

## Resources

- [Blob download MDN](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [Markdown basics](https://www.markdownguide.org/basic-syntax/)

---

## Acceptance Criteria

- [ ] Export button in chat panel
- [ ] Downloads valid .md file
- [ ] Includes conversation title and date header
- [ ] User/assistant messages clearly labeled

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/lib/export-conversation.ts` | Create |
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |

---

## Suggested Approach

Pure function builds markdown. No backend needed.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-export-conversation-md` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
