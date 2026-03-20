# Quickstart: Math Sprint App

**Feature**: 004-math-sprint
**Date**: 2026-03-20

## What This App Does

Math Sprint is a mental arithmetic trainer where users solve math problems as fast as possible. It tracks mastery per operation and difficulty using spaced repetition, and keeps session history for progress tracking.

## Quick Implementation Guide

### 1. DB Setup (src/lib/utils/db.js)

Add to `APP_PREFIXES`:
```javascript
mathSprint: 'math_sprint_'
```

Bump `DB_VERSION` from 5 to 6.

Add migration for `oldVersion < 6`:
- Create `math_sprint_mastery` store (keyPath: `key`)
- Create `math_sprint_sessions` store (keyPath: `id`, autoIncrement), with indexes `by-date` and `by-operation`
- Create `math_sprint_settings` store (keyPath: `key`)

### 2. App Registration (src/apps/math-sprint/index.js)

```javascript
const componentLoader = () => import('./App.svelte');

export default {
  id: 'math-sprint',
  name: 'Math Sprint',
  icon: 'calculator',
  description: 'Mental arithmetic trainer with timed challenges',
  version: '1.0.0',
  componentLoader
};
```

### 3. Problem Generation (src/apps/math-sprint/utils/problems.js)

Pure functions for generating math problems:
- `generateProblem(operation, difficulty)` → `{ operand1, operand2, operation, answer }`
- `getRandomOperation()` → random operation string (for mixed mode)
- Operand ranges: easy 1-9, medium 10-99, hard 100-999
- Division: generate answer × divisor = dividend (guarantees whole number)
- Subtraction: larger operand first (guarantees non-negative)

### 4. Stores (src/apps/math-sprint/stores/mathSprint.js)

Game state stores (in-memory, not persisted):
- `gameState`, `currentProblem`, `problemNumber`, `correctCount`, `incorrectCount`
- `startTime`, `elapsedTime`, `timeRemaining`
- `selectedOperation`, `selectedDifficulty`, `selectedMode`

Persistent stores:
- `mastery` - load/save via IndexedDB, update via SM-2
- `sessions` - save after each game
- `settings` - load on init, save on change

Game logic functions:
- `startGame()` - generate problems, set state to 'playing'
- `submitAnswer(answer)` - check answer, update counters, generate next problem
- `endGame()` - save session, update mastery, set state to 'results'
- `resetGame()` - clear state, return to 'home'

### 5. Components

| Component | Purpose |
|-----------|---------|
| App.svelte | Tab navigation (Play, Stats, Settings) |
| HomeView.svelte | Operation/difficulty/mode selection, mastery display |
| GameView.svelte | Problem display, answer input, timer |
| ResultsView.svelte | Score, accuracy, time, play again |
| StatsView.svelte | Session history list |
| SettingsView.svelte | Sound/vibration toggles, default mode |

### 6. SM-2 Integration

Reuse `calculateSM2` from `src/lib/utils/sm2.js`:

```javascript
// After session ends
const accuracy = (correct / total) * 100;
const rating = accuracyToSM2Rating(accuracy); // 0-5
const mastery = await getMastery(operation, difficulty);
const updated = calculateSM2(mastery, rating);
await saveMastery(updated);
```

### 7. Test Checklist

- [ ] Select each operation and play a game
- [ ] Verify correct answers increment score
- [ ] Verify incorrect answers show correct answer briefly
- [ ] Verify sprint mode ends after 30 problems
- [ ] Verify timed mode ends when timer reaches zero
- [ ] Verify results screen shows accurate stats
- [ ] Verify mastery updates after completing games
- [ ] Verify sessions persist in stats view
- [ ] Verify settings (sound, vibration, default mode) work
- [ ] Verify dark mode displays correctly
- [ ] Run `npm run build` to verify compilation
