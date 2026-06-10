# [LEARN] Summarize Conversation On Demand

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~4h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Click 'Summarize' on any thread → TL;DR + optional save to memory — assistant distills long chats.

---

## Concepts You'll Learn

- **Summarization prompts**
- **Token limits**
- **Action buttons**
- **Memory persistence**

---

## Read These Files First

- `backend/app/api/chat.py`
- `backend/app/services/ai_orchestrator.py`

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
POST /chat/conversations/{id}/summarize returns {summary, key_points[]}. Button in chat header. Option to save summary as semantic memory.
```

### Prompt 3 — Implement

```
Gather all messages, build summarization prompt, call orchestrator. Frontend modal shows result. 'Save to memory' button.
```

### Prompt 4 — Test & open a PR

```
Summarize 10-message thread. Empty thread error. Save to memory works.
```

---

## Resources

- [Summarization strategies](https://platform.openai.com/docs/guides/summarization)

---

## Acceptance Criteria

- [ ] POST /chat/conversations/{id}/summarize endpoint
- [ ] Summarize button in chat panel
- [ ] Returns summary + bullet key points
- [ ] Optional save to semantic memory
- [ ] Loading state during generation

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/chat.py` | Modify |
| `backend/app/services/summary_service.py` | Create |
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |

---

## Suggested Approach

Concat messages → prompt → single LLM call. Truncate if > 8k tokens.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-summarize-conversation` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
