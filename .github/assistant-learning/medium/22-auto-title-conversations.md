# [LEARN] Auto-Title Conversations from First Message

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~4h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

New threads auto-name themselves from the first user message — no more 'New Conversation' clutter.

---

## Concepts You'll Learn

- **LLM summarization**
- **Background jobs**
- **Title truncation**
- **Hook after first exchange**

---

## Read These Files First

- `backend/app/api/chat.py` stream endpoint
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
After first user+assistant exchange, if title is default, call LLM with 'Generate a 5-word title for: {first message}'. PATCH title. Fallback: truncate first message to 40 chars.
```

### Prompt 3 — Implement

```
In stream endpoint after first reply, check conversation.title. If generic, generate title async. Use AIOrchestrator or simple truncate fallback.
```

### Prompt 4 — Test & open a PR

```
New conv gets titled. Custom title not overwritten. Long message truncates cleanly.
```

---

## Resources

- [OpenAI chat completions](https://platform.openai.com/docs/api-reference/chat)

---

## Acceptance Criteria

- [ ] Default-titled conversations auto-renamed after first exchange
- [ ] Title ≤ 50 characters
- [ ] LLM title when API key available
- [ ] Truncation fallback offline
- [ ] Sidebar updates without refresh

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/chat.py` | Modify |
| `backend/app/services/title_service.py` | Create |

---

## Suggested Approach

title_service.generate_title(first_message) → PATCH. Fire after stream completes.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-auto-title` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
