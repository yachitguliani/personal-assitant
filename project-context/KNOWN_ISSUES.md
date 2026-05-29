# Known Technical Issues & Warnings — NEURON OS

This document catalogs known build warnings and temporary workarounds inside the current Phase 1 codebase.

---

## ⚠️ Issue 1: Next.js Workspace Root Warning
* **Warning:** `Next.js inferred your workspace root, but it may not be correct...`
* **Cause:** Happens because Next.js detects multiple lockfiles in nested directories during Turbopack execution.
* **Workaround:** Can be safely ignored during development, or silenced by setting `turbopack.root` in `frontend/next.config.ts`.

---

## 🧠 Issue 2: Offline Fallback Simulators
* **Behavior:** When running without an `OPENAI_API_KEY`, the chat panel returns static simulated text streams.
* **Workaround:** Add a valid OpenAI key to `backend/.env` as `OPENAI_API_KEY=sk-...` to enable live LLM integration.

---

## 🎨 Issue 3: Canvas Particle Frame Rate
* **Behavior:** Very small display ports (e.g. mobile viewports under 375px) may experience slight jitter in connection mapping lines if the node density is too high.
* **Workaround:** The Vector Mapping component dynamically checks `canvas.width` and reduces the particle ceiling on smaller viewports.
