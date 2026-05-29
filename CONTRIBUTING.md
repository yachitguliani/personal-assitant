# Contributing to NEURON OS

First off, thank you for taking the time to contribute! NEURON OS is built by and for the community, and we appreciate your support.

The following guidelines cover coding style, repository structures, branching practices, and how to submit bug reports and features.

---

## 🗺️ Git Branch Strategy

We maintain a clean and structured git workflow:

* **`main`**: Production-ready release branch. Stable, tested code only.
* **`dev`**: Integration branch for current-phase features. All pull requests should target `dev`.
* **`feature/*`**: Dedicated branches for new features, modules, or tasks (e.g. `feature/voice-synthesis`).
* **`experimental/*`**: Playgrounds for bleeding-edge concepts.

---

## 📌 Commit Message Format

We follow semantic commit message conventions. This keeps history legible and helps generate automated changelogs:

```text
type(scope): description
```

* **`feat`**: A new feature (e.g. `feat(memory): integrate semantic similarity scoring`).
* **`fix`**: A bug fix (e.g. `fix(ui): repair glassmorphic button glow overflow`).
* **`docs`**: Documentation changes (e.g. `docs(readme): expand quickstart commands`).
* **`style`**: Formats, semi-colons, alignments (no functional logic modifications).
* **`refactor`**: Code changes that neither fix bugs nor add features (e.g. splitting a module).
* **`test`**: Creating or updating test suites.
* **`chore`**: Maintenance, package dependencies, build scripts (e.g. `chore(deps): bump framer-motion`).

---

## 💻 Developer Setup

1. Fork the repository on GitHub and clone your fork locally.
2. Initialize and test the environment:
   * Next.js in `/frontend` via `npm install && npm run dev`
   * FastAPI in `/backend` using a Python 3.10 virtual environment
3. Develop your improvements on a specific feature branch branched off `dev` (e.g. `git checkout -b feature/chat-clear-history`).

---

## 🛠️ Code Standards

* **TypeScript & React**: Keep components modular. Use clean tailwind structures. Prefer descriptive component titles.
* **Python (FastAPI)**: Utilize Pydantic models for validation. Keep routes thin and delegate calculations to services.
* **Imports**: Group imports by standard libraries, third-party packages, and internal absolute/relative modules.
