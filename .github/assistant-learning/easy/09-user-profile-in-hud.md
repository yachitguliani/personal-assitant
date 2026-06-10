# [LEARN] User Profile Panel from /auth/me

**Difficulty:** Easy  
**Track:** Personal Assistant  
**Effort:** ~2h  
**Labels:** learning, easy, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Show operator email, join date, memory count in a profile dropdown — personal assistant knows who you are.

---

## Concepts You'll Learn

- **Auth API**
- **JWT user context**
- **Dropdown menus**
- **Aggregating stats**

---

## Read These Files First

- `backend/app/api/auth.py` GET /me
- `frontend/src/components/dashboard/hud-header.tsx`

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
Click operator name in HUD → dropdown with email, full_name, member since, memory count from /memory/stats.
```

### Prompt 3 — Implement

```
Fetch GET /auth/me and /memory/stats on dropdown open. ProfileDropdown component with GlassCard styling.
```

### Prompt 4 — Test & open a PR

```
Dropdown opens/closes. Shows correct user data. Logout still works.
```

---

## Resources

- [FastAPI dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/)
- [NEURON auth flow](frontend/src/app/login/page.tsx)

---

## Acceptance Criteria

- [ ] Dropdown on operator name click
- [ ] Shows email, full name, account created date
- [ ] Shows memory count from /memory/stats
- [ ] Logout accessible from dropdown

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/components/dashboard/profile-dropdown.tsx` | Create |
| `frontend/src/components/dashboard/hud-header.tsx` | Modify |

---

## Suggested Approach

Lazy-fetch on open. Cache in component state.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-user-profile-hud` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
