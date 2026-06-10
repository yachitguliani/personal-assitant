# NEURON OS — Personal Assistant Learning Track

> **Learn by building.** Pick an issue, use GPT/Cursor to guide you, ship a PR, and grow NEURON into a smarter personal assistant.

NEURON OS is a **personal AI assistant** — chat, memory, voice, commands, and daily intelligence. This track has **24 learning issues** (12 easy + 12 medium) designed for students, bootcamp grads, and career switchers.

---

## How This Track Works

Each issue includes:

| Section | What you get |
|---------|--------------|
| **What you'll build** | Real feature that helps the project |
| **Concepts you'll learn** | Skills for your portfolio |
| **GPT walkthrough** | 4 copy-paste prompts (understand → plan → implement → PR) |
| **Resources** | Docs, tutorials, repo files to read |
| **Acceptance criteria** | Clear definition of done |

---

## Quick Start

1. Browse [`.github/assistant-learning/README.md`](.github/assistant-learning/README.md)
2. Pick an **Easy** issue if you're new to the stack
3. Read the listed files **before** asking GPT to implement
4. Use prompts from the issue (or [`CURSOR_LIFE_OS_PROMPT.md`](CURSOR_LIFE_OS_PROMPT.md) adapted for chat/memory)
5. Branch: `feature/learn-{issue-name}` → PR → link the GitHub issue

---

## Recommended Path

```
Beginner path:
  08 Starter Prompts → 03 Save to Memory → 05 Copy & Timestamps → 01 Conversation Sidebar

Intermediate path:
  02 Memory Search → 14 Tags Editor → 21 Slash Commands → 15 Daily Briefing

AI-curious path:
  16 RAG Transparency → 22 Auto Title → 24 Summarize → 15 Daily Briefing
```

---

## Stack You'll Learn

| Layer | Tech | Issues touching it |
|-------|------|-------------------|
| Backend | FastAPI, SQLAlchemy, JWT | 13, 14, 15, 17, 18, 22, 23, 24 |
| Frontend | Next.js, React, Tailwind | 01–12, 19–21 |
| AI / LLM | OpenAI, prompts, RAG | 15, 16, 22, 24 |
| Browser APIs | Speech, Clipboard, Blob | 05, 10, 20 |
| UX | Command palette, empty states | 04, 08, 12 |

---

## Using GPT Without Cheating Yourself

1. **Always run Prompt 1 first** — understand existing code before generating
2. **Make GPT explain** trade-offs, not just dump code
3. **Type or adapt** generated code — don't blind copy-paste
4. **Write the test checklist yourself** before asking GPT to verify
5. **Document what you learned** in your PR description

---

## External Resources

- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [React Learn](https://react.dev/learn)
- [OpenAI Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Building a Second Brain (Tiago Forte)](https://www.buildingasecondbrain.com/)
- [NEURON Contributor Guide](project-context/CONTRIBUTOR_GUIDE.md)

---

## All Issues

See the full index: [`.github/assistant-learning/README.md`](.github/assistant-learning/README.md)

**Easy (12):** conversation sidebar, memory search, save to memory, command palette, copy/timestamps, delete conv, category tabs, starter prompts, user profile, export markdown, bulk delete, orb messages

**Medium (12):** rename API, tags editor, daily briefing, RAG transparency, conversation search, pin memories, stream retry, TTS, slash commands, auto title, quick notes, summarize

---

*Ship code. Learn concepts. Help NEURON become the assistant you wish you had.*
