"""Create GitHub labels, milestone, and Life OS issues via gh CLI."""
import os
import re
import subprocess
import sys

REPO = "yachitguliani/personal-assitant"
BASE = os.path.join(os.path.dirname(__file__), "..", ".github", "life-os")

LABELS = [
    ("life-os", "7B2FBE", "Life OS expansion — burnout detection, goals, metrics"),
    ("phase-1", "0E8A16", "Phase 1: Foundation"),
    ("phase-2", "1D76DB", "Phase 2: Intelligence"),
    ("phase-3", "FBCA04", "Phase 3: Integrations"),
    ("phase-4", "D93F0B", "Phase 4: Advanced"),
    ("feature", "A2EEEF", "New feature"),
    ("backend", "C5DEF5", "Python / FastAPI"),
    ("frontend", "F9D0C4", "Next.js / React"),
    ("integration", "BFDADC", "Third-party integrations"),
    ("algorithm", "D4C5F9", "Scoring / prediction logic"),
    ("implemented", "EDEDED", "Core already shipped — enhancement PRs welcome"),
    ("help wanted", "008672", "Great for community contributors"),
    ("mobile", "E99695", "Mobile / PWA work"),
    ("ai", "7057FF", "AI / LLM integration"),
]

ISSUE_CONFIG = [
    ("phase-1-foundation/01-daily-metrics-api.md", ["life-os", "phase-1", "feature", "backend", "implemented", "help wanted"]),
    ("phase-1-foundation/02-goals-crud-api.md", ["life-os", "phase-1", "feature", "backend", "implemented", "help wanted"]),
    ("phase-1-foundation/03-energy-log-ui.md", ["life-os", "phase-1", "feature", "frontend", "implemented", "help wanted"]),
    ("phase-1-foundation/04-goals-tracker-ui.md", ["life-os", "phase-1", "feature", "frontend", "implemented", "help wanted"]),
    ("phase-2-intelligence/05-burnout-engine.md", ["life-os", "phase-2", "feature", "backend", "algorithm", "implemented", "help wanted"]),
    ("phase-2-intelligence/06-burnout-gauge.md", ["life-os", "phase-2", "feature", "frontend", "implemented", "help wanted"]),
    ("phase-2-intelligence/07-pattern-charts.md", ["life-os", "phase-2", "feature", "frontend", "implemented", "help wanted"]),
    ("phase-2-intelligence/08-hud-warning-banner.md", ["life-os", "phase-2", "feature", "frontend", "implemented", "help wanted"]),
    ("phase-3-integrations/09-health-import.md", ["life-os", "phase-3", "feature", "backend", "integration", "help wanted"]),
    ("phase-3-integrations/10-screen-time-import.md", ["life-os", "phase-3", "feature", "backend", "integration", "help wanted"]),
    ("phase-3-integrations/11-ai-weekly-debrief.md", ["life-os", "phase-3", "feature", "backend", "ai", "help wanted"]),
    ("phase-3-integrations/12-goal-memory-bridge.md", ["life-os", "phase-3", "feature", "backend", "help wanted"]),
    ("phase-4-advanced/13-predictive-streaks.md", ["life-os", "phase-4", "feature", "backend", "algorithm", "help wanted"]),
    ("phase-4-advanced/14-push-email-alerts.md", ["life-os", "phase-4", "feature", "backend", "help wanted"]),
    ("phase-4-advanced/15-mobile-quick-log.md", ["life-os", "phase-4", "feature", "frontend", "mobile", "help wanted"]),
    ("phase-4-advanced/16-wearable-webhooks.md", ["life-os", "phase-4", "feature", "backend", "integration", "help wanted"]),
]


def gh(*args: str) -> subprocess.CompletedProcess:
    env = os.environ.copy()
    env.pop("GITHUB_TOKEN", None)
    return subprocess.run(
        ["gh", *args, "-R", REPO],
        capture_output=True,
        text=True,
        env=env,
    )


def ensure_label(name: str, color: str, description: str) -> None:
    r = gh("label", "create", name, "--color", color, "--description", description, "--force")
    if r.returncode == 0:
        print(f"  label: {name}")
    else:
        print(f"  label {name}: {r.stderr.strip() or r.stdout.strip()}")


def extract_title(body: str) -> str:
    for line in body.splitlines():
        if line.startswith("# [FEAT]"):
            return line.replace("# ", "").strip()
        if line.startswith("# "):
            return line.replace("# ", "").strip()
    return "Life OS Feature"


def main() -> int:
    print("Creating labels...")
    for name, color, desc in LABELS:
        ensure_label(name, color, desc)

    print("Creating milestone...")
    r = gh(
        "api", "repos/yachitguliani/personal-assitant/milestones",
        "-f", "title=Life OS Expansion",
        "-f", "description=Predictive burnout detection and Life OS features for NEURON OS contributors",
        "-f", "state=open",
    )
    milestone_num = "1"
    if r.returncode == 0:
        import json
        # gh api POST returns the created object
        try:
            data = json.loads(r.stdout)
            milestone_num = str(data.get("number", 1))
        except Exception:
            pass
        print(f"  milestone: Life OS Expansion (#{milestone_num})")
    else:
        # milestone may already exist — fetch it
        r2 = gh("api", "repos/yachitguliani/personal-assitant/milestones")
        if r2.returncode == 0:
            import json
            for m in json.loads(r2.stdout):
                if m.get("title") == "Life OS Expansion":
                    milestone_num = str(m["number"])
                    print(f"  milestone exists: #{milestone_num}")
                    break

    print("Creating issues...")
    created = []
    for rel_path, labels in ISSUE_CONFIG:
        path = os.path.join(BASE, rel_path)
        with open(path, encoding="utf-8") as f:
            body = f.read()
        title = extract_title(body)

        label_args = []
        for lb in labels:
            label_args.extend(["--label", lb])

        r = gh(
            "issue", "create",
            "--title", title,
            "--body-file", path,
            "--milestone", "Life OS Expansion",
            *label_args,
        )
        if r.returncode != 0:
            print(f"  FAILED {title}: {r.stderr.strip()}")
            continue
        url = r.stdout.strip()
        print(f"  created: {title} -> {url}")
        created.append(url)

    print(f"\nDone: {len(created)}/16 issues created")
    return 0 if len(created) == 16 else 1


if __name__ == "__main__":
    sys.exit(main())
