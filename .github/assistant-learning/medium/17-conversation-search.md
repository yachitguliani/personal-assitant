# [LEARN] Search Across All Conversations

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~4h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Find that thing you said last week — full-text search across all chat history.

---

## Concepts You'll Learn

- **SQL LIKE / full-text search**
- **Cross-entity queries**
- **Search results UI**
- **SQLAlchemy joins**

---

## Read These Files First

- `backend/app/models/conversation.py` Message model
- `backend/app/api/chat.py`

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
Add GET /chat/search?q= searching message content across user's conversations. Return [{conversation_id, title, snippet, message_id}].
```

### Prompt 3 — Implement

```
Backend join query on messages + conversations filtered by user_id. Frontend search bar in command palette or chat sidebar.
```

### Prompt 4 — Test & open a PR

```
Search unique word in old thread. Case insensitive. No results state. SQL injection safe.
```

---

## Resources

- [SQLAlchemy joins](https://docs.sqlalchemy.org/en/20/orm/queryguide/select.html)
- [Full-text search concepts](https://www.postgresql.org/docs/current/textsearch-intro.html)

---

## Acceptance Criteria

- [ ] GET /chat/search?q= returns matching message snippets
- [ ] Results link to conversation + scroll to message
- [ ] User-scoped only
- [ ] Search UI in chat panel or command palette

---

## Files to Touch

| File | Action |
|------|--------|
| `backend/app/api/chat.py` | Modify |
| `frontend/src/components/dashboard/conversation-search.tsx` | Create |

---

## Suggested Approach

ILIKE on message content for SQLite/Postgres. Limit 20 results.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-conversation-search` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
