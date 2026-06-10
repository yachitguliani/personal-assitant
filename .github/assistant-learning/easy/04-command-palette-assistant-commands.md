# [LEARN] Command Palette — Assistant Quick Actions

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~2h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Power-user shortcuts: `/new-chat`, `/search-memory`, `/daily-brief` from Ctrl+K — feels like a real assistant OS.

---

## Concepts You'll Learn

- **Command pattern**
- **Keyboard UX**
- **Centralized command registry**
- **Action routing**

---

## Read These Files First

- `frontend/src/lib/command-engine.ts`
- `frontend/src/components/core/command-palette.tsx`

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
Add 5 new commands to COMMAND_PALETTE_ITEMS: New Chat, Search Memory, Open Life OS, System Status, Clear Terminal. Wire onSelect in dashboard-shell.
```

### Prompt 3 — Implement

```
Extend command-engine.ts and command-palette. Each command has id, label, category, shortcut hint. Handle in dashboard-shell handlePaletteSelect.
```

### Prompt 4 — Test & open a PR

```
Ctrl+K → type 'memory' → selects Search Memory. Verify each command does the right action.
```

---

## Resources

- [Command palette UX](https://tailwindui.com/components/application-ui/navigation/command-palettes)
- [NEURON command engine](frontend/src/lib/command-engine.ts)

---

## Acceptance Criteria

- [ ] At least 5 new assistant-focused commands
- [ ] Fuzzy search by label works
- [ ] Keyboard navigation (arrows + enter) still works
- [ ] Commands documented in command palette footer

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/lib/command-engine.ts` | Modify |
| `frontend/src/components/dashboard/dashboard-shell.tsx` | Modify |

---

## Suggested Approach

Extend existing COMMAND_PALETTE_ITEMS array. Add handlers in switch statement.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-command-palette-commands` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
