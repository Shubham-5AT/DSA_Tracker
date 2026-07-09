# Ascent — DSA & CS Mastery Tracker

Ascent is a premium, typography-led personal progress tracker built for Computer Science engineering students. Designed with a clean, calm "Notion meets build-log" aesthetic, it avoids standard SaaS clichés in favor of desaturated paper tones, hairlines, and purposeful layout structures.

## ⚡ Core Features

1. **Interview-Prioritized DSA Curriculum**
   - 18 core coding patterns ordered by conceptual impact (Trees, Graphs, Dynamic Programming first).
   - 130+ selected interview questions.
   
2. **Spaced Repetition Engine**
   - Spaced repetition scheduler that groups problems by recall grades: *Mastered*, *Passable*, or *Struggled*.
   - Dynamically calculates the next optimal review date based on performance multipliers.

3. **Feynman Concept Log**
   - Checkbox completion modal that prompts the user to summarize the core concept in plain English (Feynman technique) and log the exact time taken.

4. **Bilingual Pattern Templates**
   - Monospace code templates for the 18 patterns, toggleable between **Python** and **C++** with a global language switcher.

5. **"Git Rebase" Streak Protection**
   - Automatically tracks your daily consistency streak (`⚡`).
   - If a day is missed, a "Rebase warning" triggers, transferring yesterday's targets into today's workload and doubling the requirements to preserve the streak.

6. **Desaturated Sparkline Analytics**
   - Zero-dependency SVG progress sparkline situated quietly at the bottom of the Dashboard to review weekly solved counts.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (custom desaturated warm light/dark color variables)
- **State Management**: Zustand (with LocalStorage versioned persistence)
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
Converts code and styles into static, production-optimized assets inside the `dist/` directory.
