"""Close implemented GitHub issues with summary comments."""
import subprocess
import sys

REPO = "yachitguliani/personal-assitant"

CLOSE_MAP = {
    range(1, 9): "Life OS Phase 1–2 core shipped in commit bede944.",
    range(9, 12): "Community backlog — spec in .github/life-os/phase-3-integrations/.",
    12: "Goal → Memory bridge implemented in life_goals checkin endpoint.",
    range(13, 17): "Community backlog — spec in .github/life-os/phase-4-advanced/.",
    range(17, 31): "Personal Assistant features shipped in commits 80c44f5+.",
    range(31, 41): "Community backlog — spec in .github/assistant-learning/medium/.",
}


def gh(*args):
    env = {k: v for k, v in __import__("os").environ.items() if k != "GITHUB_TOKEN"}
    return subprocess.run(["gh", *args, "-R", REPO], capture_output=True, text=True, env=env)


def main():
    closed = 0
    for key, comment in CLOSE_MAP.items():
        nums = [key] if isinstance(key, int) else list(key)
        for n in nums:
            r = gh("issue", "close", str(n), "-c", comment)
            if r.returncode == 0:
                print(f"Closed #{n}")
                closed += 1
            elif "already closed" in (r.stderr + r.stdout).lower():
                print(f"Already closed #{n}")
            else:
                print(f"Failed #{n}: {r.stderr.strip()}")
    print(f"\nDone: {closed} issues closed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
