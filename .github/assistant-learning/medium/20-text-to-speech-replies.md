# [LEARN] Text-to-Speech for Assistant Replies

**Difficulty:** Medium  
**Track:** Personal Assistant  
**Effort:** ~3–4h  
**Labels:** learning, medium, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

Speaker icon on assistant messages reads reply aloud — voice assistant foundation (Phase 2 roadmap).

---

## Concepts You'll Learn

- **Web Speech Synthesis API**
- **Browser compatibility**
- **Progressive enhancement**
- **Accessibility**

---

## Read These Files First

- `frontend/src/hooks/use-voice-input.ts`
- `project-context/ROADMAP.md` Phase 2 voice

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
Create useSpeechOutput hook wrapping speechSynthesis. Speak button on assistant messages. Stop button while speaking. Set orbState to 'speaking'.
```

### Prompt 3 — Implement

```
Hook: speak(text), stop(), isSpeaking. Strip markdown before speak. Queue only one utterance at a time.
```

### Prompt 4 — Test & open a PR

```
Speak works Chrome/Edge. Stop mid-utterance. Unsupported browser hides button.
```

---

## Resources

- [SpeechSynthesis MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [NEURON voice hook](frontend/src/hooks/use-voice-input.ts)

---

## Acceptance Criteria

- [ ] Speak button on assistant messages
- [ ] Uses Web Speech Synthesis API
- [ ] Stop button while speaking
- [ ] Orb state reflects speaking
- [ ] Graceful hide when unsupported

---

## Files to Touch

| File | Action |
|------|--------|
| `frontend/src/hooks/use-speech-output.ts` | Create |
| `frontend/src/components/dashboard/chat-panel.tsx` | Modify |

---

## Suggested Approach

Mirror use-voice-input pattern. stripMarkdown util before speak.

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-tts-replies` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
