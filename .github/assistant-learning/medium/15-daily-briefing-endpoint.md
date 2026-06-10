# [LEARN] Daily Briefing — AI Morning Summary

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~4–5h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

GET /assistant/briefing returns personalized summary from memories, goals, recent chats — flagship assistant feature.

---

## Concepts You'll Learn

- **Prompt engineering**
- **Context aggregation**
- **LLM API integration**
- **Graceful fallbacks**

---

## Read These Files First

- `backend/app/services/ai_orchestrator.py`
- `backend/app/services/memory_service.py`

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
Create GET /assistant/briefing. Gather: top 5 memories, active goals, last conversation summary. Pass to AIOrchestrator. Fallback template if no API key.
```

### Prompt 3 — Implement

```
New router assistant.py. BriefingService aggregates context. Return {greeting, priorities, memory_highlight, suggestion}. Frontend card on dashboard.
```

### Prompt 4 — Test & open a PR

```
Works with API key. Works offline with template fallback. Respects user scope.
```

---

## Resources

- [Prompt engineering guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [NEURON AI orchestrator](backend/app/services/ai_orchestrator.py)
- [Cursor prompt doc](CURSOR_LIFE_OS_PROMPT.md)

---

## Acceptance Criteria

- [ ] GET /assistant/briefing returns structured briefing
- [ ] Uses memories + goals + recent chat as context
- [ ] LLM-generated when API key present
- [ ] Template fallback when offline
- [ ] Briefing card on dashboard home

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/assistant.py` | Create |
| `backend/app/services/briefing_service.py` | Create |
| `backend/app/main.py` | Register router |
| `frontend/src/components/dashboard/daily-briefing-card.tsx` | Create |

---

## Suggested Approach

Aggregate → build prompt → stream or single response. Keep prompt under 2k tokens.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-daily-briefing` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
