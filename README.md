# OpenCompete — Built By Hours

> A high-performance, monochromatic dark-themed academic collaboration platform designed to systematically replace Telegram study groups. It combines competitive study session tracking (stopwatch, pomodoro, streaks, daily/weekly leaderboards) with a native, Telegram-grade messaging and resource vault engine.

---

## ⚡ Design System & Aesthetics
- **Theme**: Monochromatic Linear-inspired dark UI.
  - Base Background: `#09090B` (Deep Matte Black)
  - Surface/Cards: `#121215` with fine borders (`1px solid #222226`)
  - Active/Hover States: `#1C1C21`
  - High-Contrast Typography: `#FAFAFA` with `#71717A` secondary text
  - Accents: Stark White `#FFFFFF` and status indicators
- **Iconography**: Strictly `lucide-react` outline SVGs (1.5px stroke width).

---

## 🏛️ Information Architecture
1. **Level 1: Community Hubs** (e.g. *JEE Advanced 2027*, *Algorithms & Systems Guild*, *Pre-Med & USMLE Cohort*)
2. **Level 2: Squads / Cohorts** (Cohorts created by community admins with real-time active studying indicators)
3. **Level 3: Group Tabs**:
   - 🏆 **Focus Leaderboard**: Daily, Weekly, and All-Time study rankings derived from verified session timers with podium highlights and live study status dots.
   - 💬 **Discussions (Telegram Replacement)**: Threaded replies, emoji reactions, message editing with `(edited)` indicators, soft deletion with placeholders, pinned announcements carousel, 1–4 image grids with lightboxes, HTML5 video player, auto-detected OpenGraph link previews, and real-time typing indicators.
   - 📁 **Resource Vault**: Organized, filterable library of PDFs, notes, cheatsheets, and links with search, tag filters, preview, and download actions.

---

## ⏱️ Focus Engine & Live Broadcasting
- **Dual Mode**: Customizable Pomodoro Interval & Open Stopwatch.
- **Categorization**: Tag sessions with `Theory`, `Practice`, `Revision`, `Deep Work`, `Lecture`, or `Problem Solving`.
- **Automatic Broadcast**: On session completion, broadcasts a verified session card directly into the squad's discussion feed and updates leaderboard tallies in real-time.
- **Audio Engine**: Procedural Web Audio API sound synthesizer for session starts, ticking, and completion chimes (zero external audio file dependencies).

---

## 🗄️ PostgreSQL & Prisma Schema
The project includes a production-grade relational Prisma schema in [`prisma/schema.prisma`](./prisma/schema.prisma) with full models for `User`, `Community`, `Group`, `GroupMember`, `StudySession`, `Message`, `Attachment`, `MessageReaction`, and `Resource`.

---

## 🔥 Firebase Integration
Configured with Firebase Realtime Database and Authentication for multi-user sync and offline resilience.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel
This repository is configured with [`vercel.json`](./vercel.json).
1. Import repository `meoponly/opencompete` in Vercel.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**!
