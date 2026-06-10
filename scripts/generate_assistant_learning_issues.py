"""Generate Personal Assistant learning-track GitHub issue markdown files."""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", ".github", "assistant-learning")


def block(issue: dict) -> str:
    concepts = "\n".join(f"- **{c}**" for c in issue["concepts"])
    criteria = "\n".join(f"- [ ] {c}" for c in issue["criteria"])
    files = "\n".join(f"| `{f}` | {a} |" for f, a in issue["files"])
    resources = "\n".join(f"- [{r[0]}]({r[1]})" for r in issue["resources"])
    prompts = issue["prompts"]

    return f"""# [LEARN] {issue["title"]}

**Difficulty:** {issue["difficulty"]}  
**Track:** Personal Assistant  
**Effort:** {issue["effort"]}  
**Labels:** learning, {issue["difficulty_label"]}, personal-assistant, help wanted  

---

## Vision

NEURON OS is your **personal AI assistant** — a second brain that remembers, reasons, and acts on your behalf. This issue teaches real skills while making the assistant smarter.

---

## What You'll Build (Project Impact)

{issue["impact"]}

---

## Concepts You'll Learn

{concepts}

---

## Read These Files First

{issue["read_first"]}

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
{prompts["plan"]}
```

### Prompt 3 — Implement

```
{prompts["implement"]}
```

### Prompt 4 — Test & open a PR

```
{prompts["test"]}
```

---

## Resources

{resources}

---

## Acceptance Criteria

{criteria}

---

## Files to Touch

| File | Action |
|------|--------|
{files}

---

## Suggested Approach

{issue["approach"]}

---

## How to Claim

1. Comment **"I'd like to work on this"** on the GitHub issue
2. Branch: `feature/learn-{issue["slug"]}` off `main`
3. Submit PR linking the issue + include screenshots for UI changes

---

*Learn by building. Ship a PR. Grow NEURON.*
"""


ISSUES = [
    # ─── EASY (12) ───────────────────────────────────────────────────────────
    {
        "slug": "conversation-sidebar",
        "file": "easy/01-conversation-sidebar.md",
        "title": "Conversation Sidebar in Chat Panel",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~2–3h",
        "impact": "Add a left sidebar listing all chat conversations so users can switch threads like ChatGPT — core personal assistant UX.",
        "concepts": ["React lists & keys", "REST GET endpoints", "Active state UI", "Responsive layout"],
        "read_first": "- `frontend/src/components/dashboard/chat-panel.tsx`\n- `backend/app/api/chat.py` → `GET /chat/conversations`",
        "prompts": {
            "plan": "Design a conversation sidebar for chat-panel.tsx that fetches GET /api/chat/conversations on mount. No new backend work. Output component tree and state variables.",
            "implement": "Implement the conversation sidebar in chat-panel.tsx. Use existing api.get('/chat/conversations'). Match cyber glassmorphic style from GlassCard. Clicking a conversation loads GET /chat/conversations/{id}.",
            "test": "Write a manual test checklist: create 2 conversations, switch between them, verify messages load. What edge cases (empty list, loading, error)?",
        },
        "resources": [
            ("React lists docs", "https://react.dev/learn/rendering-lists"),
            ("FastAPI path params", "https://fastapi.tiangolo.com/tutorial/path-params/"),
            ("NEURON chat API", "project-context/API_REFERENCE.md"),
        ],
        "criteria": [
            "Sidebar lists all user conversations with title + date",
            "Clicking a conversation loads its messages",
            "Active conversation is visually highlighted",
            "New conversation button creates via POST /chat/conversations",
            "Works on desktop; collapses gracefully on mobile",
        ],
        "files": [
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
            ("frontend/src/utils/api.ts", "Use existing client"),
        ],
        "approach": "Fetch conversations on mount. Store `activeConvId`. Re-use existing message load logic when selection changes.",
    },
    {
        "slug": "memory-search-ui",
        "file": "easy/02-memory-search-ui.md",
        "title": "Memory Search Panel in Dashboard",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~2–3h",
        "impact": "Let users search their second brain from the HUD — type a query and see semantic memory matches.",
        "concepts": ["Debounced input", "Search APIs", "Empty/loading states", "Semantic search UX"],
        "read_first": "- `backend/app/api/memory.py` → GET with `?q=` param\n- `frontend/src/components/dashboard/memory-indicator.tsx`",
        "prompts": {
            "plan": "Design a MemorySearchPanel component: search input with 300ms debounce, calls GET /api/memory?q=. Show results with text, category, similarity score.",
            "implement": "Build MemorySearchPanel using NeonInput, GlassCard, api.get('/memory?q=...'). Add to dashboard right panel or new tab. Handle empty query vs no results.",
            "test": "Test: empty query returns list, search query returns ranked results, error state when offline.",
        },
        "resources": [
            ("useDebouncedValue pattern", "https://www.developerway.com/posts/debouncing-in-react"),
            ("NEURON memory service", "backend/app/services/memory_service.py"),
        ],
        "criteria": [
            "Search input with debounce (~300ms)",
            "Results show memory text, category, and similarity",
            "Empty state when no memories match",
            "Delete memory action from result row",
        ],
        "files": [
            ("frontend/src/components/dashboard/memory-search-panel.tsx", "Create"),
            ("frontend/src/components/dashboard/dashboard-shell.tsx", "Integrate"),
        ],
        "approach": "New component + debounce hook. Wire into dashboard aside below MemoryIndicator.",
    },
    {
        "slug": "save-to-memory",
        "file": "easy/03-save-to-memory-button.md",
        "title": "Save to Memory Button on Chat Messages",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~1–2h",
        "impact": "One-click save any assistant reply into long-term memory — the core loop of a personal assistant.",
        "concepts": ["Event handlers", "POST requests", "Memory categories (episodic vs semantic)", "Toast feedback"],
        "read_first": "- `backend/app/api/memory.py` POST\n- `frontend/src/components/dashboard/chat-panel.tsx`",
        "prompts": {
            "plan": "Add a bookmark icon on each assistant message. On click POST /api/memory with text=message.content, category=episodic, tags=[chat]. Show brief success toast.",
            "implement": "Implement save button on assistant messages in chat-panel.tsx. Use api.post('/memory', {...}). Disable button after save. Pulse memory indicator on success.",
            "test": "Save a message, verify it appears in GET /memory. Try saving twice — should not duplicate or should show 'already saved'.",
        },
        "resources": [
            ("NEURON memory categories", "project-context/DATABASE_SCHEMA.md"),
            ("Lucide icons", "https://lucide.dev/icons/"),
        ],
        "criteria": [
            "Bookmark/save icon on assistant messages only",
            "POSTs to /api/memory with episodic category",
            "Visual feedback on success (toast or icon change)",
            "Triggers memory pulse in HUD",
        ],
        "files": [
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
            ("frontend/src/utils/api.ts", "Use existing post"),
        ],
        "approach": "Small hover-reveal button per message bubble. Track saved message IDs in local state.",
    },
    {
        "slug": "command-palette-commands",
        "file": "easy/04-command-palette-assistant-commands.md",
        "title": "Command Palette — Assistant Quick Actions",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~2h",
        "impact": "Power-user shortcuts: `/new-chat`, `/search-memory`, `/daily-brief` from Ctrl+K — feels like a real assistant OS.",
        "concepts": ["Command pattern", "Keyboard UX", "Centralized command registry", "Action routing"],
        "read_first": "- `frontend/src/lib/command-engine.ts`\n- `frontend/src/components/core/command-palette.tsx`",
        "prompts": {
            "plan": "Add 5 new commands to COMMAND_PALETTE_ITEMS: New Chat, Search Memory, Open Life OS, System Status, Clear Terminal. Wire onSelect in dashboard-shell.",
            "implement": "Extend command-engine.ts and command-palette. Each command has id, label, category, shortcut hint. Handle in dashboard-shell handlePaletteSelect.",
            "test": "Ctrl+K → type 'memory' → selects Search Memory. Verify each command does the right action.",
        },
        "resources": [
            ("Command palette UX", "https://tailwindui.com/components/application-ui/navigation/command-palettes"),
            ("NEURON command engine", "frontend/src/lib/command-engine.ts"),
        ],
        "criteria": [
            "At least 5 new assistant-focused commands",
            "Fuzzy search by label works",
            "Keyboard navigation (arrows + enter) still works",
            "Commands documented in command palette footer",
        ],
        "files": [
            ("frontend/src/lib/command-engine.ts", "Modify"),
            ("frontend/src/components/dashboard/dashboard-shell.tsx", "Modify"),
        ],
        "approach": "Extend existing COMMAND_PALETTE_ITEMS array. Add handlers in switch statement.",
    },
    {
        "slug": "chat-copy-timestamps",
        "file": "easy/05-chat-copy-and-timestamps.md",
        "title": "Chat Message Copy Button & Timestamps",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~1–2h",
        "impact": "Polish the chat panel — copy assistant wisdom to clipboard, see when messages were sent.",
        "concepts": ["Clipboard API", "Date formatting (Intl)", "Micro-interactions", "Accessibility"],
        "read_first": "- `frontend/src/components/dashboard/chat-panel.tsx`\n- `frontend/src/lib/markdown.ts`",
        "prompts": {
            "plan": "Add relative timestamps (e.g. '2m ago') under each message and a copy icon that uses navigator.clipboard.writeText.",
            "implement": "Add formatRelativeTime helper. Copy button on hover for all messages. Show 'Copied!' feedback for 2s.",
            "test": "Copy works on Chrome/Firefox. Timestamps update correctly. Screen reader can access copy button.",
        },
        "resources": [
            ("Clipboard API MDN", "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API"),
            ("Intl.RelativeTimeFormat", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat"),
        ],
        "criteria": [
            "Relative timestamp on each message",
            "Copy button copies raw message text",
            "Copied confirmation feedback",
            "Works for both user and assistant messages",
        ],
        "files": [
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
            ("frontend/src/lib/format-time.ts", "Create (optional)"),
        ],
        "approach": "Extract small formatRelativeTime util. Hover toolbar on message bubbles.",
    },
    {
        "slug": "delete-conversation",
        "file": "easy/06-delete-conversation-confirm.md",
        "title": "Delete Conversation with Confirmation Modal",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~2h",
        "impact": "Let users clean up old threads — essential for a personal assistant with history.",
        "concepts": ["DELETE requests", "Confirmation modals", "Optimistic UI", "State cleanup"],
        "read_first": "- `backend/app/api/chat.py` DELETE /conversations/{id}\n- `frontend/src/components/dashboard/chat-panel.tsx`",
        "prompts": {
            "plan": "Add trash icon on conversation sidebar items. Click opens confirm modal. On confirm: DELETE /api/chat/conversations/{id}, remove from list, clear if active.",
            "implement": "Implement confirm modal with GlassCard styling. Use api.delete(). Handle deleting the active conversation gracefully.",
            "test": "Delete non-active conv, delete active conv, cancel modal, API error handling.",
        },
        "resources": [
            ("FastAPI DELETE", "https://fastapi.tiangolo.com/tutorial/path-params/"),
            ("React modal patterns", "https://react.dev/learn/escape-hatches"),
        ],
        "criteria": [
            "Delete button on each conversation in sidebar",
            "Confirmation modal before delete",
            "Calls DELETE /chat/conversations/{id}",
            "UI updates without page reload",
        ],
        "files": [
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
            ("frontend/src/components/ui/confirm-modal.tsx", "Create"),
        ],
        "approach": "Reusable ConfirmModal component. Pass onConfirm callback.",
    },
    {
        "slug": "memory-category-tabs",
        "file": "easy/07-memory-category-filter-tabs.md",
        "title": "Memory Category Filter Tabs",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~2h",
        "impact": "Filter memories by semantic / episodic / procedural — teaches how personal assistants categorize knowledge.",
        "concepts": ["Tab UI", "Query parameters", "Filtered API calls", "Category taxonomy"],
        "read_first": "- `backend/app/api/memory.py` GET ?category=\n- Memory model categories in DATABASE_SCHEMA.md",
        "prompts": {
            "plan": "Add tabs above memory search: All | Semantic | Episodic | Procedural. Pass category param to GET /memory.",
            "implement": "Build MemoryCategoryTabs component. Integrate with memory search panel. Active tab uses cyber-cyan highlight.",
            "test": "Each tab filters correctly. All tab shows everything. Count badge optional.",
        },
        "resources": [
            ("NEURON memory types", "LIFE_OS_GUIDE.md — mental model section"),
            ("Headless tab pattern", "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/"),
        ],
        "criteria": [
            "4 tabs: All, Semantic, Episodic, Procedural",
            "Filters GET /memory?category=X",
            "Active tab styled per design system",
            "Integrates with memory search panel",
        ],
        "files": [
            ("frontend/src/components/dashboard/memory-search-panel.tsx", "Modify/create"),
        ],
        "approach": "State: activeCategory. Refetch on tab change.",
    },
    {
        "slug": "chat-starter-prompts",
        "file": "easy/08-chat-starter-prompts.md",
        "title": "Chat Empty State with Starter Prompts",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~1–2h",
        "impact": "When chat is empty, show clickable prompts like 'Summarize my week' or 'What do you remember about me?' — guides new users.",
        "concepts": ["Empty states", "Onboarding UX", "Prompt engineering basics", "Click-to-fill input"],
        "read_first": "- `frontend/src/components/dashboard/chat-panel.tsx`\n- Landing page copy for tone reference",
        "prompts": {
            "plan": "When messages.length === 0, show 4 starter prompt chips. Clicking one fills the input and submits. Prompts should feel like a personal assistant.",
            "implement": "Create StarterPrompts component with cyber-styled chips. Prompts: 'What do you remember?', 'Help me plan today', 'Summarize my goals', 'System status'.",
            "test": "Empty chat shows prompts. Click submits message. Prompts disappear after first message.",
        },
        "resources": [
            ("Empty state UX", "https://www.nngroup.com/articles/empty-state-interfaces/"),
            ("ChatGPT starter prompts reference", "https://openai.com/chatgpt"),
        ],
        "criteria": [
            "Shows when no messages in active conversation",
            "At least 4 assistant-themed starter prompts",
            "Click fills input and sends",
            "Matches NEURON cyber aesthetic",
        ],
        "files": [
            ("frontend/src/components/dashboard/starter-prompts.tsx", "Create"),
            ("frontend/src/components/dashboard/chat-panel.tsx", "Integrate"),
        ],
        "approach": "Grid of CyberButton ghost variants. onClick sets inputText and calls submit.",
    },
    {
        "slug": "user-profile-hud",
        "file": "easy/09-user-profile-in-hud.md",
        "title": "User Profile Panel from /auth/me",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~2h",
        "impact": "Show operator email, join date, memory count in a profile dropdown — personal assistant knows who you are.",
        "concepts": ["Auth API", "JWT user context", "Dropdown menus", "Aggregating stats"],
        "read_first": "- `backend/app/api/auth.py` GET /me\n- `frontend/src/components/dashboard/hud-header.tsx`",
        "prompts": {
            "plan": "Click operator name in HUD → dropdown with email, full_name, member since, memory count from /memory/stats.",
            "implement": "Fetch GET /auth/me and /memory/stats on dropdown open. ProfileDropdown component with GlassCard styling.",
            "test": "Dropdown opens/closes. Shows correct user data. Logout still works.",
        },
        "resources": [
            ("FastAPI dependencies", "https://fastapi.tiangolo.com/tutorial/dependencies/"),
            ("NEURON auth flow", "frontend/src/app/login/page.tsx"),
        ],
        "criteria": [
            "Dropdown on operator name click",
            "Shows email, full name, account created date",
            "Shows memory count from /memory/stats",
            "Logout accessible from dropdown",
        ],
        "files": [
            ("frontend/src/components/dashboard/profile-dropdown.tsx", "Create"),
            ("frontend/src/components/dashboard/hud-header.tsx", "Modify"),
        ],
        "approach": "Lazy-fetch on open. Cache in component state.",
    },
    {
        "slug": "export-conversation-md",
        "file": "easy/10-export-conversation-markdown.md",
        "title": "Export Conversation as Markdown",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~2h",
        "impact": "Download any chat thread as a .md file — useful for notes, sharing, and learning file download in browsers.",
        "concepts": ["Blob URLs", "Client-side file generation", "Markdown formatting", "Download trigger"],
        "read_first": "- `frontend/src/components/dashboard/chat-panel.tsx`\n- Message interface",
        "prompts": {
            "plan": "Add 'Export' button in chat header. Build markdown string from messages (## User / ## Assistant). Trigger download via Blob + anchor click.",
            "implement": "Implement exportConversationMd(messages, title) util. Button in chat panel toolbar. Filename: neuron-chat-{title}-{date}.md",
            "test": "Export 5-message thread. Open file — valid markdown. Special characters escaped.",
        },
        "resources": [
            ("Blob download MDN", "https://developer.mozilla.org/en-US/docs/Web/API/Blob"),
            ("Markdown basics", "https://www.markdownguide.org/basic-syntax/"),
        ],
        "criteria": [
            "Export button in chat panel",
            "Downloads valid .md file",
            "Includes conversation title and date header",
            "User/assistant messages clearly labeled",
        ],
        "files": [
            ("frontend/src/lib/export-conversation.ts", "Create"),
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
        ],
        "approach": "Pure function builds markdown. No backend needed.",
    },
    {
        "slug": "memory-delete-bulk",
        "file": "easy/11-memory-bulk-delete-ui.md",
        "title": "Memory Bulk Select & Delete UI",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~2–3h",
        "impact": "Select multiple memories and delete — managing your second brain at scale.",
        "concepts": ["Checkbox state", "Batch API calls", "Selection UX", "Async parallel requests"],
        "read_first": "- `backend/app/api/memory.py` DELETE /{id}\n- Memory search panel (from issue 02)",
        "prompts": {
            "plan": "Add checkbox mode to memory list. Select all / delete selected calls DELETE for each id in parallel with Promise.all.",
            "implement": "Toggle 'Select mode' button. Checkboxes on rows. Delete selected with confirmation. Show count of selected.",
            "test": "Select 3, delete all, verify gone. Select all. Cancel delete.",
        },
        "resources": [
            ("Promise.all MDN", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all"),
        ],
        "criteria": [
            "Toggle select mode on memory panel",
            "Multi-select with checkboxes",
            "Bulk delete with confirmation",
            "Loading state during delete",
        ],
        "files": [
            ("frontend/src/components/dashboard/memory-search-panel.tsx", "Modify"),
        ],
        "approach": "Set<number> for selected IDs. Parallel DELETE calls.",
    },
    {
        "slug": "orb-state-feedback",
        "file": "easy/12-ai-orb-status-messages.md",
        "title": "AI Orb Contextual Status Messages",
        "difficulty": "Easy",
        "difficulty_label": "easy",
        "effort": "~1–2h",
        "impact": "Orb shows helpful hints ('Try /help', 'Listening...', 'Memory saved') — makes the assistant feel alive.",
        "concepts": ["Global state (Context)", "UI feedback loops", "Animation states", "UX microcopy"],
        "read_first": "- `frontend/src/context/neuron-os-context.tsx`\n- `frontend/src/components/core/ai-orb.tsx`",
        "prompts": {
            "plan": "Add orbMessage string to NeuronOsContext. Orb displays it below the animation. Helper setOrbMessage(msg, autoClearMs) used across chat/memory.",
            "implement": "Extend context with orbMessage. Display in AiOrb or chat panel. Wire to save-memory, voice input, stream complete events.",
            "test": "Messages appear and auto-clear. Don't overlap with orbState labels.",
        },
        "resources": [
            ("React Context", "https://react.dev/learn/passing-data-deeply-with-context"),
            ("Microcopy tips", "https://www.nngroup.com/articles/microcopy/"),
        ],
        "criteria": [
            "orbMessage in NeuronOsContext",
            "Displayed near AI orb during actions",
            "Auto-clears after 3 seconds",
            "Used in at least 3 flows (chat, memory, voice)",
        ],
        "files": [
            ("frontend/src/context/neuron-os-context.tsx", "Modify"),
            ("frontend/src/components/core/ai-orb.tsx", "Modify"),
        ],
        "approach": "setOrbMessage with setTimeout clear. Keep messages short.",
    },
    # ─── MEDIUM (12) ─────────────────────────────────────────────────────────
    {
        "slug": "rename-conversation-api",
        "file": "medium/13-rename-conversation-api-ui.md",
        "title": "Rename Conversation — API + Inline Edit UI",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~3–4h",
        "impact": "PATCH endpoint + double-click to rename threads — standard assistant feature.",
        "concepts": ["PATCH endpoints", "Inline editing", "Pydantic partial updates", "Optimistic UI"],
        "read_first": "- `backend/app/api/chat.py`\n- `backend/app/api/life_goals.py` PATCH pattern",
        "prompts": {
            "plan": "Add PATCH /chat/conversations/{id} with {title}. Frontend: double-click title in sidebar → inline input → save on Enter.",
            "implement": "Backend PATCH route with title validation. Frontend inline edit with api.patch(). Rollback on error.",
            "test": "Rename via UI. Empty title rejected. 404 for wrong id. Non-owner blocked.",
        },
        "resources": [
            ("FastAPI body updates", "https://fastapi.tiangolo.com/tutorial/body-updates/"),
            ("Inline edit pattern", "https://react.dev/reference/react/useOptimistic"),
        ],
        "criteria": [
            "PATCH /chat/conversations/{id} accepts title",
            "Inline rename in conversation sidebar",
            "Validates title length (1–100 chars)",
            "User-scoped — cannot rename others' conversations",
        ],
        "files": [
            ("backend/app/api/chat.py", "Modify"),
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
            ("frontend/src/utils/api.ts", "Add patch if missing"),
            ("project-context/API_REFERENCE.md", "Document"),
        ],
        "approach": "Copy PATCH pattern from life_goals.py. Inline input replaces title span on double-click.",
    },
    {
        "slug": "memory-tags-editor",
        "file": "medium/14-memory-tags-editor.md",
        "title": "Memory Tags Editor — API + UI",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~4h",
        "impact": "Edit memory text and tags after saving — organizing your assistant's knowledge base.",
        "concepts": ["PATCH API design", "Tag input UX", "String ↔ array parsing", "Form validation"],
        "read_first": "- `backend/app/models/memory.py` tags field\n- `backend/app/services/memory_service.py`",
        "prompts": {
            "plan": "Add PATCH /memory/{id} for text and tags[]. Build edit modal with NeonInput + tag chips. Re-embed on text change optional stretch goal.",
            "implement": "Backend PATCH route. Frontend edit modal from memory search row. Parse comma tags to array on submit.",
            "test": "Edit text and tags. Invalid id 404. Empty text rejected.",
        },
        "resources": [
            ("Tag input UX patterns", "https://carbondesignsystem.com/patterns/forms"),
            ("OpenAI embeddings overview", "https://platform.openai.com/docs/guides/embeddings"),
        ],
        "criteria": [
            "PATCH /memory/{id} updates text and tags",
            "Edit modal accessible from memory panel",
            "Tags displayed as editable chips",
            "API documented in API_REFERENCE.md",
        ],
        "files": [
            ("backend/app/api/memory.py", "Modify"),
            ("frontend/src/components/dashboard/memory-edit-modal.tsx", "Create"),
            ("frontend/src/components/dashboard/memory-search-panel.tsx", "Modify"),
        ],
        "approach": "PATCH with MemoryUpdate schema. Modal reuses GlassCard + CyberButton.",
    },
    {
        "slug": "daily-briefing",
        "file": "medium/15-daily-briefing-endpoint.md",
        "title": "Daily Briefing — AI Morning Summary",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~4–5h",
        "impact": "GET /assistant/briefing returns personalized summary from memories, goals, recent chats — flagship assistant feature.",
        "concepts": ["Prompt engineering", "Context aggregation", "LLM API integration", "Graceful fallbacks"],
        "read_first": "- `backend/app/services/ai_orchestrator.py`\n- `backend/app/services/memory_service.py`",
        "prompts": {
            "plan": "Create GET /assistant/briefing. Gather: top 5 memories, active goals, last conversation summary. Pass to AIOrchestrator. Fallback template if no API key.",
            "implement": "New router assistant.py. BriefingService aggregates context. Return {greeting, priorities, memory_highlight, suggestion}. Frontend card on dashboard.",
            "test": "Works with API key. Works offline with template fallback. Respects user scope.",
        },
        "resources": [
            ("Prompt engineering guide", "https://platform.openai.com/docs/guides/prompt-engineering"),
            ("NEURON AI orchestrator", "backend/app/services/ai_orchestrator.py"),
            ("Cursor prompt doc", "CURSOR_LIFE_OS_PROMPT.md"),
        ],
        "criteria": [
            "GET /assistant/briefing returns structured briefing",
            "Uses memories + goals + recent chat as context",
            "LLM-generated when API key present",
            "Template fallback when offline",
            "Briefing card on dashboard home",
        ],
        "files": [
            ("backend/app/api/assistant.py", "Create"),
            ("backend/app/services/briefing_service.py", "Create"),
            ("backend/app/main.py", "Register router"),
            ("frontend/src/components/dashboard/daily-briefing-card.tsx", "Create"),
        ],
        "approach": "Aggregate → build prompt → stream or single response. Keep prompt under 2k tokens.",
    },
    {
        "slug": "rag-transparency",
        "file": "medium/16-rag-memory-transparency.md",
        "title": "RAG Transparency — Show Memories Used in Reply",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~5h",
        "impact": "After assistant replies, show which memories influenced the answer — trust + learning how RAG works.",
        "concepts": ["RAG retrieval", "Embeddings & cosine similarity", "Streaming metadata", "Citation UI"],
        "read_first": "- `backend/app/services/memory_service.py` search_memories\n- `backend/app/services/ai_orchestrator.py`",
        "prompts": {
            "plan": "Modify stream endpoint to return memory_ids used in context. Frontend shows 'Sources: 3 memories' expandable chip below assistant message.",
            "implement": "In generate_response, collect memory IDs passed to prompt. Send as JSON prefix or trailing chunk. Frontend parses and displays citation chips.",
            "test": "Ask question matching a saved memory. Citations appear. No citations when none matched.",
        },
        "resources": [
            ("RAG explained", "https://docs.aws.amazon.com/sagemaker/latest/dg/jumpstart-foundation-models-customize-rag.html"),
            ("Cosine similarity", "backend/app/services/memory_service.py"),
        ],
        "criteria": [
            "Stream response includes memory source IDs",
            "UI shows expandable 'Sources' on assistant messages",
            "Clicking source highlights memory text",
            "Works with streaming without breaking existing chat",
        ],
        "files": [
            ("backend/app/services/ai_orchestrator.py", "Modify"),
            ("backend/app/api/chat.py", "Modify stream"),
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
            ("frontend/src/components/dashboard/memory-citation-chips.tsx", "Create"),
        ],
        "approach": "Prefix stream with `<!--MEMORIES:[1,2,3]-->` or separate SSE event type.",
    },
    {
        "slug": "conversation-search",
        "file": "medium/17-conversation-search.md",
        "title": "Search Across All Conversations",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~4h",
        "impact": "Find that thing you said last week — full-text search across all chat history.",
        "concepts": ["SQL LIKE / full-text search", "Cross-entity queries", "Search results UI", "SQLAlchemy joins"],
        "read_first": "- `backend/app/models/conversation.py` Message model\n- `backend/app/api/chat.py`",
        "prompts": {
            "plan": "Add GET /chat/search?q= searching message content across user's conversations. Return [{conversation_id, title, snippet, message_id}].",
            "implement": "Backend join query on messages + conversations filtered by user_id. Frontend search bar in command palette or chat sidebar.",
            "test": "Search unique word in old thread. Case insensitive. No results state. SQL injection safe.",
        },
        "resources": [
            ("SQLAlchemy joins", "https://docs.sqlalchemy.org/en/20/orm/queryguide/select.html"),
            ("Full-text search concepts", "https://www.postgresql.org/docs/current/textsearch-intro.html"),
        ],
        "criteria": [
            "GET /chat/search?q= returns matching message snippets",
            "Results link to conversation + scroll to message",
            "User-scoped only",
            "Search UI in chat panel or command palette",
        ],
        "files": [
            ("backend/app/api/chat.py", "Modify"),
            ("frontend/src/components/dashboard/conversation-search.tsx", "Create"),
        ],
        "approach": "ILIKE on message content for SQLite/Postgres. Limit 20 results.",
    },
    {
        "slug": "pin-memories",
        "file": "medium/18-pin-important-memories.md",
        "title": "Pin Important Memories",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~3–4h",
        "impact": "Pin critical facts so they always appear in assistant context — like pinned notes.",
        "concepts": ["Schema migration pattern", "Boolean flags", "Priority sorting", "Context injection"],
        "read_first": "- `backend/app/models/memory.py`\n- `backend/app/services/ai_orchestrator.py`",
        "prompts": {
            "plan": "Add is_pinned boolean to MemoryNode. PATCH /memory/{id}/pin. Always include pinned memories in AI context. UI star icon toggle.",
            "implement": "Model field + migration via create_all on new DBs (document manual ALTER for existing). Pin toggle in memory panel. Orchestrator prepends pinned to context.",
            "test": "Pin memory, ask unrelated question — pinned still in context. Unpin removes.",
        },
        "resources": [
            ("SQLAlchemy column defaults", "https://docs.sqlalchemy.org/en/20/core/defaults.html"),
        ],
        "criteria": [
            "is_pinned field on memories",
            "Toggle pin from memory UI",
            "Pinned memories always injected into chat context",
            "Pinned section at top of memory panel",
        ],
        "files": [
            ("backend/app/models/memory.py", "Modify"),
            ("backend/app/api/memory.py", "Add pin endpoint"),
            ("backend/app/services/ai_orchestrator.py", "Modify"),
            ("frontend/src/components/dashboard/memory-search-panel.tsx", "Modify"),
        ],
        "approach": "POST /memory/{id}/pin and /unpin. Sort pinned first in list.",
    },
    {
        "slug": "stream-retry",
        "file": "medium/19-streaming-error-retry.md",
        "title": "Chat Streaming Error Handling & Retry",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~3h",
        "impact": "When LLM stream fails, show error + Retry button — production-quality assistant UX.",
        "concepts": ["Error boundaries", "Fetch streaming", "Retry patterns", "User-facing error copy"],
        "read_first": "- `frontend/src/components/dashboard/chat-panel.tsx` api.stream\n- `frontend/src/utils/api.ts` stream wrapper",
        "prompts": {
            "plan": "Wrap api.stream in try/catch. On error show red banner on message with Retry. Retry re-sends last user message. Add offline detection.",
            "implement": "StreamError state per message. Retry button calls stream again. Show 'NEURON offline — using local mode' when API unreachable.",
            "test": "Kill backend mid-stream. Invalid token. Retry succeeds. Multiple retries.",
        },
        "resources": [
            ("Fetch streams MDN", "https://developer.mozilla.org/en-US/docs/Web/API/Streams_API"),
            ("Error UX patterns", "https://www.nngroup.com/articles/error-message-guidelines/"),
        ],
        "criteria": [
            "Stream errors show inline error state",
            "Retry button re-attempts last message",
            "Does not duplicate user message on retry",
            "Offline banner when backend unreachable",
        ],
        "files": [
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
            ("frontend/src/utils/api.ts", "Improve stream error propagation"),
        ],
        "approach": "Store lastFailedUserMsg. onError sets failed state. Retry clears and re-streams.",
    },
    {
        "slug": "tts-replies",
        "file": "medium/20-text-to-speech-replies.md",
        "title": "Text-to-Speech for Assistant Replies",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~3–4h",
        "impact": "Speaker icon on assistant messages reads reply aloud — voice assistant foundation (Phase 2 roadmap).",
        "concepts": ["Web Speech Synthesis API", "Browser compatibility", "Progressive enhancement", "Accessibility"],
        "read_first": "- `frontend/src/hooks/use-voice-input.ts`\n- `project-context/ROADMAP.md` Phase 2 voice",
        "prompts": {
            "plan": "Create useSpeechOutput hook wrapping speechSynthesis. Speak button on assistant messages. Stop button while speaking. Set orbState to 'speaking'.",
            "implement": "Hook: speak(text), stop(), isSpeaking. Strip markdown before speak. Queue only one utterance at a time.",
            "test": "Speak works Chrome/Edge. Stop mid-utterance. Unsupported browser hides button.",
        },
        "resources": [
            ("SpeechSynthesis MDN", "https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis"),
            ("NEURON voice hook", "frontend/src/hooks/use-voice-input.ts"),
        ],
        "criteria": [
            "Speak button on assistant messages",
            "Uses Web Speech Synthesis API",
            "Stop button while speaking",
            "Orb state reflects speaking",
            "Graceful hide when unsupported",
        ],
        "files": [
            ("frontend/src/hooks/use-speech-output.ts", "Create"),
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
        ],
        "approach": "Mirror use-voice-input pattern. stripMarkdown util before speak.",
    },
    {
        "slug": "slash-commands",
        "file": "medium/21-chat-slash-commands.md",
        "title": "Chat Slash Commands (/remember, /recall, /brief)",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~4–5h",
        "impact": "Type `/remember buy milk` to save memory, `/recall milk` to search — power-user assistant commands.",
        "concepts": ["Command parsing", "Router pattern", "Chat-as-CLI", "Extensible handlers"],
        "read_first": "- `frontend/src/lib/command-engine.ts`\n- `frontend/src/components/dashboard/chat-panel.tsx`",
        "prompts": {
            "plan": "Parse input starting with /. Handlers: /remember {text}, /recall {query}, /brief, /help. Execute locally without LLM when matched.",
            "implement": "slashCommandParser in lib/slash-commands.ts. Register handlers map. Integrate in chat submit before API call. /help lists commands.",
            "test": "/remember saves memory. /recall shows results inline. Unknown /command shows help. Normal messages unaffected.",
        },
        "resources": [
            ("Discord slash commands UX inspo", "https://discord.com/developers/docs/interactions/application-commands"),
            ("Command pattern", "https://refactoring.guru/design-patterns/command"),
        ],
        "criteria": [
            "At least 4 slash commands implemented",
            "/remember saves to memory API",
            "/recall searches and displays inline",
            "/brief triggers daily briefing",
            "/help lists available commands",
        ],
        "files": [
            ("frontend/src/lib/slash-commands.ts", "Create"),
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
        ],
        "approach": "Parse first token. Handler returns {handled: true, response}. Else fall through to LLM.",
    },
    {
        "slug": "auto-title",
        "file": "medium/22-auto-title-conversations.md",
        "title": "Auto-Title Conversations from First Message",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~4h",
        "impact": "New threads auto-name themselves from the first user message — no more 'New Conversation' clutter.",
        "concepts": ["LLM summarization", "Background jobs", "Title truncation", "Hook after first exchange"],
        "read_first": "- `backend/app/api/chat.py` stream endpoint\n- `backend/app/services/ai_orchestrator.py`",
        "prompts": {
            "plan": "After first user+assistant exchange, if title is default, call LLM with 'Generate a 5-word title for: {first message}'. PATCH title. Fallback: truncate first message to 40 chars.",
            "implement": "In stream endpoint after first reply, check conversation.title. If generic, generate title async. Use AIOrchestrator or simple truncate fallback.",
            "test": "New conv gets titled. Custom title not overwritten. Long message truncates cleanly.",
        },
        "resources": [
            ("OpenAI chat completions", "https://platform.openai.com/docs/api-reference/chat"),
        ],
        "criteria": [
            "Default-titled conversations auto-renamed after first exchange",
            "Title ≤ 50 characters",
            "LLM title when API key available",
            "Truncation fallback offline",
            "Sidebar updates without refresh",
        ],
        "files": [
            ("backend/app/api/chat.py", "Modify"),
            ("backend/app/services/title_service.py", "Create"),
        ],
        "approach": "title_service.generate_title(first_message) → PATCH. Fire after stream completes.",
    },
    {
        "slug": "quick-notes-api",
        "file": "medium/23-quick-notes-capture.md",
        "title": "Quick Notes Capture API + Chat Integration",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~4–5h",
        "impact": "Scribble quick notes the assistant remembers — `/note pick up dry cleaning` → saved as procedural memory.",
        "concepts": ["CRUD API design", "Memory categories", "Natural language capture", "Assistant workflows"],
        "read_first": "- `backend/app/api/memory.py`\n- `backend/app/services/memory_service.py`",
        "prompts": {
            "plan": "POST /assistant/notes {text} saves as procedural memory with tag 'note' and today's date. Integrate with /note slash command. List GET /assistant/notes.",
            "implement": "New notes routes wrapping MemoryService.add_memory(category=procedural). Frontend notes list in sidebar. Optional due_date field stretch.",
            "test": "Create note via API and slash command. List shows today notes. Delete note.",
        },
        "resources": [
            ("Building a second brain", "https://www.buildingasecondbrain.com/"),
        ],
        "criteria": [
            "POST /assistant/notes creates procedural memory",
            "GET /assistant/notes lists recent notes",
            "DELETE /assistant/notes/{id}",
            "/note slash command wired up",
            "Notes panel in dashboard",
        ],
        "files": [
            ("backend/app/api/assistant.py", "Create/extend"),
            ("frontend/src/components/dashboard/notes-panel.tsx", "Create"),
            ("frontend/src/lib/slash-commands.ts", "Integrate"),
        ],
        "approach": "Thin wrapper over memory API with category=procedural, tags=note.",
    },
    {
        "slug": "summarize-conversation",
        "file": "medium/24-summarize-conversation-on-demand.md",
        "title": "Summarize Conversation On Demand",
        "difficulty": "Medium",
        "difficulty_label": "medium",
        "effort": "~4h",
        "impact": "Click 'Summarize' on any thread → TL;DR + optional save to memory — assistant distills long chats.",
        "concepts": ["Summarization prompts", "Token limits", "Action buttons", "Memory persistence"],
        "read_first": "- `backend/app/api/chat.py`\n- `backend/app/services/ai_orchestrator.py`",
        "prompts": {
            "plan": "POST /chat/conversations/{id}/summarize returns {summary, key_points[]}. Button in chat header. Option to save summary as semantic memory.",
            "implement": "Gather all messages, build summarization prompt, call orchestrator. Frontend modal shows result. 'Save to memory' button.",
            "test": "Summarize 10-message thread. Empty thread error. Save to memory works.",
        },
        "resources": [
            ("Summarization strategies", "https://platform.openai.com/docs/guides/summarization"),
        ],
        "criteria": [
            "POST /chat/conversations/{id}/summarize endpoint",
            "Summarize button in chat panel",
            "Returns summary + bullet key points",
            "Optional save to semantic memory",
            "Loading state during generation",
        ],
        "files": [
            ("backend/app/api/chat.py", "Modify"),
            ("backend/app/services/summary_service.py", "Create"),
            ("frontend/src/components/dashboard/chat-panel.tsx", "Modify"),
        ],
        "approach": "Concat messages → prompt → single LLM call. Truncate if > 8k tokens.",
    },
]


def main():
    os.makedirs(os.path.join(OUT, "easy"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "medium"), exist_ok=True)
    for issue in ISSUES:
        path = os.path.join(OUT, issue["file"])
        with open(path, "w", encoding="utf-8") as f:
            f.write(block(issue))
        print(f"Wrote {issue['file']}")


if __name__ == "__main__":
    main()
