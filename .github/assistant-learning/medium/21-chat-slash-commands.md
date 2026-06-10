# [LEARN] Chat Slash Commands (/remember, /recall, /brief)

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~4–5h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Type `/remember buy milk` to save memory, `/recall milk` to search — power-user assistant commands.

---

## Concepts You'll Learn

- **Command parsing**
- **Router pattern**
- **Chat-as-CLI**
- **Extensible handlers**

---

## Read These Files First

- `frontend/src/lib/command-engine.ts`
- `frontend/src/components/dashboard/chat-panel.tsx`

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
Parse input starting with /. Handlers: /remember {text}, /recall {query}, /brief, /help. Execute locally without LLM when matched.
```

### Prompt 3 — Implement

```
slashCommandParser in lib/slash-commands.ts. Register handlers map. Integrate in chat submit before API call. /help lists commands.
```

### Prompt 4 — Test & open a PR

```
/remember saves memory. /recall shows results inline. Unknown /command shows help. Normal messages unaffected.
```

---

## Resources

- [Discord slash commands UX inspo](https://discord.com/developers/docs/interactions/application-commands)
- [Command pattern](https://refactoring.guru/design-patterns/command)

---

## Acceptance Criteria

- [ ] At least 4 slash commands implemented
- [ ] /remember saves to memory API
- [ ] /recall searches and displays inline
- [ ] /brief triggers daily briefing
- [ ] /help lists available commands

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/lib/slash-commands.ts` | Create |
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |

---

## Suggested Approach

Parse first token. Handler returns {handled: true, response}. Else fall through to LLM.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-slash-commands` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
