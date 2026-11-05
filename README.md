# Brain Workouts

A modular web application platform for cognitive training and productivity. Built as a local-first Progressive Web App (PWA) with a focus on privacy, offline accessibility, and performance.

## Featured Apps

This platform hosts several "workout" modules designed to improve various cognitive functions:

- **Flashcards**: Advanced memorization tool using the **SM-2 Spaced Repetition** algorithm.
- **Pomodoro Timer**: Focus and productivity tool with session naming, wake lock, and detailed statistics.
- **Memory Match**: Visual-spatial memory training via grid-based card matching.
- **Math Sprint**: Fast-paced mental arithmetic challenges to improve calculation speed.
- **Word Scramble**: Vocabulary and pattern recognition training.
- **Sequence Recall**: Working memory training focusing on pattern and sequence reproduction.
- **Stroop Test**: Attention and inhibitory-control training using word and color interference.

---

## Core Features

### Platform-wide Features
- **PWA (Progressive Web App)**: Installable on mobile (Android/iOS) and desktop for a native-like experience.
- **Offline First**: App data is stored locally via **IndexedDB**, with selected UI preferences in `localStorage`; the app works without an internet connection.
- **Dark Mode**: Support for dark and light themes with system-aware automatic switching.
- **Haptic Feedback**: Tactile vibration feedback on mobile devices for interactions and errors.
- **Modular Architecture**: A container-based system that allows new workout modules to be added easily.

### Flashcard Module (Advanced SRS)
- **SM-2 Algorithm**: Automatically schedules cards for review based on your recall performance.
- **Due Cards System**: Only review what is necessary today based on mathematical scheduling.
- **Study Streaks**: Tracks consecutive days of learning to build long-term habits.
- **Import & Export**: Support for CSV and JSON formats to backup or migrate your data.
- **Quick Study**: Practice due cards from all decks simultaneously.

---

## Tech Stack

- **Framework**: Svelte 4 (Stable)
- **Styling**: Tailwind CSS 3
- **Build Tool**: Vite 4
- **Storage**: IndexedDB (via `idb` library)
- **PWA**: `vite-plugin-pwa`
- **Deployment**: GitHub Pages via GitHub Actions

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd brain-workout

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Deployment

The production app is deployed to GitHub Pages at:

https://kasyfilaziz.github.io/brain_workout/

Pushes to `master` and manual workflow runs trigger `.github/workflows/deploy.yml`.
The workflow installs dependencies, runs `npm run build`, and publishes `dist/`.

Because this is a project site, keep the Vite `base`, PWA `start_url`, and PWA
`scope` set to `/brain_workout/`. Changing one without the others can break
assets, navigation, or service-worker updates after deployment.

---

## Project Structure

```
/src
  /apps
    /flashcard         # Flashcard module
    /pomodoro          # Focus timer module
    /memory-match      # Memory game module
    /math-sprint       # Arithmetic module
    /word-scramble     # Vocabulary module
    /sequence-recall   # Working memory module
    /stroop-test       # Attention and inhibition module
  /lib
    /components        # Shared UI components (Hub, Loading, etc.)
    /stores            # Global state (theme, navigation, apps)
    /utils             # Shared utilities (DB, SM-2, Haptics)
  App.svelte           # Root App Container (Modular Loader)
  main.js              # Platform Entry Point
/public                # PWA icons and static assets
/specs                 # Feature specifications and implementation plans
```

---

## SM-2 Algorithm (Used in Flashcards)

The implementation of the SuperMemo SM-2 algorithm for spaced repetition:

```
Initial:
  - Ease Factor (EF) = 2.5
  - Interval = 0

After Review:
  - Rating < 3: Reset interval to 0, EF stays same.
  - Rating >= 3:
    - EF = EF + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
    - EF minimum = 1.3
    - Interval = Previous Interval × EF
```

**Ratings (1-5):**
- 1-2: Failed to remember → Reset interval.
- 3-5: Successfully remembered → Increase interval based on Ease Factor.

---

## Roadmap & Progress

- [x] Phase 1: Core Modular Infrastructure (Hub, Routing, Theme)
- [x] Phase 2: Local-First Data Layer (IndexedDB Schema versioning)
- [x] Phase 3: PWA & Offline Support
- [x] Phase 4: Core Apps (Flashcards, Pomodoro, Memory Match, Math Sprint)
- [x] Phase 5: Advanced Apps (Word Scramble, Sequence Recall)
- [ ] Phase 6: Global Analytics & Mastery Heatmap
- [ ] Phase 7: Data Syncing (Optional/Local-only backups)

---

## PWA Installation

### Android (Chrome)
1. Open the app in Chrome.
2. Tap the three-dot menu → "Install App" or "Add to Home Screen".

### iOS (Safari)
1. Open the app in Safari.
2. Tap the **Share** button.
3. Scroll down and select **"Add to Home Screen"**.

The Android status bar color comes from the `theme-color` meta tags in
`index.html`. `src/lib/stores/theme.js` updates those tags whenever the in-app
light/dark theme changes. Keep the manifest `theme_color` in `vite.config.js`
aligned with the light theme fallback.

---

## License
MIT
