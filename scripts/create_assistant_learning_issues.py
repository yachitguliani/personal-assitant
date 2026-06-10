"""Create GitHub labels, milestone, and Personal Assistant learning issues."""
import json
import os
import subprocess
import sys

REPO = "yachitguliani/personal-assitant"
BASE = os.path.join(os.path.dirname(__file__), "..", ".github", "assistant-learning")

NEW_LABELS = [
    ("learning", "FEF2C0", "Educational issue — learn skills while contributing"),
    ("easy", "C2E0C6", "Easy difficulty (~1-3h)"),
    ("medium", "F9D0C4", "Medium difficulty (~3-6h)"),
    ("personal-assistant", "1D76DB", "Chat, memory, voice, commands — core assistant"),
]

EASY = [
    f"easy/{f:02d}-{name}.md"
    for f, name in [
        (1, "conversation-sidebar"),
        (2, "memory-search-ui"),
        (3, "save-to-memory-button"),
        (4, "command-palette-assistant-commands"),
        (5, "chat-copy-and-timestamps"),
        (6, "delete-conversation-confirm"),
        (7, "memory-category-filter-tabs"),
        (8, "chat-starter-prompts"),
        (9, "user-profile-in-hud"),
        (10, "export-conversation-markdown"),
        (11, "memory-bulk-delete-ui"),
        (12, "ai-orb-status-messages"),
    ]
]

# filenames from generator
EASY_FILES = [
    "easy/01-conversation-sidebar.md",
    "easy/02-memory-search-ui.md",
    "easy/03-save-to-memory-button.md",
    "easy/04-command-palette-assistant-commands.md",
    "easy/05-chat-copy-and-timestamps.md",
    "easy/06-delete-conversation-confirm.md",
    "easy/07-memory-category-filter-tabs.md",
    "easy/08-chat-starter-prompts.md",
    "easy/09-user-profile-in-hud.md",
    "easy/10-export-conversation-markdown.md",
    "easy/11-memory-bulk-delete-ui.md",
    "easy/12-ai-orb-status-messages.md",
]

MEDIUM_FILES = [
    "medium/13-rename-conversation-api-ui.md",
    "medium/14-memory-tags-editor.md",
    "medium/15-daily-briefing-endpoint.md",
    "medium/16-rag-memory-transparency.md",
    "medium/17-conversation-search.md",
    "medium/18-pin-important-memories.md",
    "medium/19-streaming-error-retry.md",
    "medium/20-text-to-speech-replies.md",
    "medium/21-chat-slash-commands.md",
    "medium/22-auto-title-conversations.md",
    "medium/23-quick-notes-capture.md",
    "medium/24-summarize-conversation-on-demand.md",
]

ISSUE_CONFIG = (
    [(f, ["learning", "easy", "personal-assistant", "help wanted", "frontend" if "api" not in f else "frontend"]) for f in EASY_FILES]
    + [(f, ["learning", "medium", "personal-assistant", "help wanted"]) for f in MEDIUM_FILES]
)

# Fix labels per file - backend vs frontend
BACKEND_MEDIUM = {"13", "14", "15", "16", "17", "18", "22", "23", "24"}
ISSUE_CONFIG = []
for f in EASY_FILES:
    labels = ["learning", "easy", "personal-assistant", "help wanted", "frontend"]
    ISSUE_CONFIG.append((f, labels))
for f in MEDIUM_FILES:
    labels = ["learning", "medium", "personal-assistant", "help wanted"]
    num = f.split("/")[1][:2]
    if num in BACKEND_MEDIUM:
        labels.append("backend")
    else:
        labels.append("frontend")
    if num in ("15", "16", "22", "24"):
        labels.append("ai")
    ISSUE_CONFIG.append((f, labels))


def gh(*args: str) -> subprocess.CompletedProcess:
    env = os.environ.copy()
    env.pop("GITHUB_TOKEN", None)
    return subprocess.run(
        ["gh", *args, "-R", REPO],
        capture_output=True,
        text=True,
        env=env,
    )


def extract_title(body: str) -> str:
    for line in body.splitlines():
        if line.startswith("# [LEARN]"):
            return line.replace("# ", "").strip()
    return "Learning Issue"


def ensure_milestone(title: str, description: str) -> None:
    r = subprocess.run(
        ["gh", "api", f"repos/{REPO}/milestones",
         "-f", f"title={title}", "-f", f"description={description}", "-f", "state=open"],
        capture_output=True, text=True,
        env={k: v for k, v in os.environ.items() if k != "GITHUB_TOKEN"},
    )
    if r.returncode != 0 and "already exists" not in r.stderr.lower():
        print(f"  milestone note: {r.stderr.strip() or 'may already exist'}")


def main() -> int:
    print("Creating labels...")
    for name, color, desc in NEW_LABELS:
        gh("label", "create", name, "--color", color, "--description", desc, "--force")
        print(f"  label: {name}")

    print("Ensuring milestone...")
    ensure_milestone(
        "Personal Assistant Learning",
        "Learn by building — 24 educational issues for chat, memory, voice, and AI assistant features",
    )

    print("Creating issues...")
    created = []
    for rel_path, labels in ISSUE_CONFIG:
        path = os.path.join(BASE, rel_path)
        if not os.path.exists(path):
            print(f"  MISSING {path}")
            continue
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
            "--milestone", "Personal Assistant Learning",
            *label_args,
        )
        if r.returncode != 0:
            print(f"  FAILED {title}: {r.stderr.strip()}")
            continue
        url = r.stdout.strip()
        print(f"  created: {title}")
        created.append(url)

    print(f"\nDone: {len(created)}/{len(ISSUE_CONFIG)} issues created")
    return 0 if len(created) == len(ISSUE_CONFIG) else 1


if __name__ == "__main__":
    sys.exit(main())
