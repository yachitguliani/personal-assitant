# [LEARN] Chat Empty State with Starter Prompts

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~1–2h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

When chat is empty, show clickable prompts like 'Summarize my week' or 'What do you remember about me?' — guides new users.

---

## Concepts You'll Learn

- **Empty states**
- **Onboarding UX**
- **Prompt engineering basics**
- **Click-to-fill input**

---

## Read These Files First

- `frontend/src/components/dashboard/chat-panel.tsx`
- Landing page copy for tone reference

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
When messages.length === 0, show 4 starter prompt chips. Clicking one fills the input and submits. Prompts should feel like a personal assistant.
```

### Prompt 3 — Implement

```
Create StarterPrompts component with cyber-styled chips. Prompts: 'What do you remember?', 'Help me plan today', 'Summarize my goals', 'System status'.
```

### Prompt 4 — Test & open a PR

```
Empty chat shows prompts. Click submits message. Prompts disappear after first message.
```

---

## Resources

- [Empty state UX](https://www.nngroup.com/articles/empty-state-interfaces/)
- [ChatGPT starter prompts reference](https://openai.com/chatgpt)

---

## Acceptance Criteria

- [ ] Shows when no messages in active conversation
- [ ] At least 4 assistant-themed starter prompts
- [ ] Click fills input and sends
- [ ] Matches NEURON cyber aesthetic

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/starter-prompts.tsx` | Create |
| `frontend/src/components/dashboard/chat-panel.tsx` | Integrate |

---

## Suggested Approach

Grid of CyberButton ghost variants. onClick sets inputText and calls submit.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-chat-starter-prompts` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
