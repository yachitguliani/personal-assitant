# UI Design System — NEURON OS

NEURON OS employs a futuristic, cinematic HUD aesthetic inspired by cyberpunk controls and digital assistants.

## 🎨 Color Palette

| HSL Definition | Tailwind Color | Application |
| :--- | :--- | :--- |
| `hsl(225, 25%, 5%)` | `bg-cyber-dark` | Base background backdrop |
| `hsl(180, 100%, 50%)` | `text-cyber-cyan` | Active glow indicators, borders, core buttons |
| `hsl(270, 100%, 60%)` | `text-cyber-purple` | Memory registries, secondary buttons, visualizations |
| `hsl(0, 100%, 60%)` | `text-cyber-red` | System alerts, warning banners, logout triggers |
| `rgba(6, 10, 20, 0.75)`| `bg-cyber-glass` | Card panels with backdrop-blur |

## 🔤 Typography
* **Primary HUD Header:** Orbitron Google Font. Used for uppercase stats, title banners, and active widgets.
* **Dialogue / Chat text:** Inter Google Font. Used for paragraphs, forms, and message bubbles.
* **Code Streams / Console Log:** Share Tech Mono Google Font. Used for terminal output boxes and coordinates text.

## 🌌 Core Components
1. **Glassmorphic Card (`components/ui/glass-card.tsx`):** Renders border bracket outlines in corners, features dynamic neon cyan/purple glows on demand.
2. **Neon Input (`components/ui/neon-input.tsx`):** Adds left inline glyph support, focuses with active neon light rings.
3. **Cyber Button (`components/ui/cyber-button.tsx`):** Features sliding laser flare animations on hover and corner bracket frames.
