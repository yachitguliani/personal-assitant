# [LEARN] RAG Transparency — Show Memories Used in Reply

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~5h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

After assistant replies, show which memories influenced the answer — trust + learning how RAG works.

---

## Concepts You'll Learn

- **RAG retrieval**
- **Embeddings & cosine similarity**
- **Streaming metadata**
- **Citation UI**

---

## Read These Files First

- `backend/app/services/memory_service.py` search_memories
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
Modify stream endpoint to return memory_ids used in context. Frontend shows 'Sources: 3 memories' expandable chip below assistant message.
```

### Prompt 3 — Implement

```
In generate_response, collect memory IDs passed to prompt. Send as JSON prefix or trailing chunk. Frontend parses and displays citation chips.
```

### Prompt 4 — Test & open a PR

```
Ask question matching a saved memory. Citations appear. No citations when none matched.
```

---

## Resources

- [RAG explained](https://docs.aws.amazon.com/sagemaker/latest/dg/jumpstart-foundation-models-customize-rag.html)
- [Cosine similarity](backend/app/services/memory_service.py)

---

## Acceptance Criteria

- [ ] Stream response includes memory source IDs
- [ ] UI shows expandable 'Sources' on assistant messages
- [ ] Clicking source highlights memory text
- [ ] Works with streaming without breaking existing chat

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/services/ai_orchestrator.py` | Modify |
| `backend/app/api/chat.py` | Modify stream |
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |
| `frontend/src/components/dashboard/memory-citation-chips.tsx` | Create |

---

## Suggested Approach

Prefix stream with `<!--MEMORIES:[1,2,3]-->` or separate SSE event type.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-rag-transparency` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
