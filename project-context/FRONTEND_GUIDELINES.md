# Frontend Coding Guidelines — NEURON OS

The frontend is built using Next.js (App Router), TypeScript, Framer Motion, and Tailwind CSS v4.

## 🛠️ Stack & Dependencies
* **Core:** Next.js 16 (App Router), React 19.
* **Styling:** Tailwind CSS v4.
* **Animations:** Framer Motion (for premium HUD movement).
* **Icons:** Lucide React (for standard UI glyphs). Brand icons must be written as inline SVGs.

## 📂 Folder Layout
```
frontend/src/
├── app/               # Page layouts, styles, and page endpoints
│   ├── dashboard/     # Command Center core HUD
│   ├── login/         # Encrypted access gateways
│   ├── globals.css    # Cyber themes and animations keyframes
│   └── layout.tsx     # Shell, metadata, and fonts
├── components/        # UI modules
│   ├── ui/            # GlassCard, CyberButton, NeonInput
│   ├── system-status  # Telemetry indicator monitors
│   └── vector-viz     # Canvas particles synergy charts
└── utils/
    └── api.ts         # Axios/Fetch client with local JWT checks
```

## 💅 Styling and Aesthetic Principles
1. **Glassmorphism:** Use Backdrop Blur (`backdrop-blur-md`), semi-transparent obsidian backings (`bg-cyber-glass`), and glowing cyan/purple borders.
2. **Typography:** Orbitron for primary uppercase status metrics, Share Tech Mono for code streams and terminal widgets, and Inter for dialogues.
3. **Animations:** All interactive elements (buttons, inputs) must react to mouse hover states with glow enhancements. Add floating movements to static badges.
