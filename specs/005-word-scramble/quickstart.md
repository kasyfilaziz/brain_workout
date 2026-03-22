# Quickstart: Word Scramble

**Feature**: 005-word-scramble
**Date**: 2026-03-21

## Implementation Overview

This quickstart guides you through implementing the Word Scramble brain workout app. Follow the phases in order.

---

## Prerequisites

- Node.js 18+
- npm
- Working knowledge of Svelte 4
- Access to `src/apps/` directory

---

## Phase 0: Project Setup

### 0.1 Create Directory Structure

```
src/apps/word-scramble/
├── index.js              # App registration
├── App.svelte            # Main app container
├── components/
│   ├── HomeView.svelte   # Word selection, mode selection
│   ├── GameView.svelte   # Main gameplay
│   ├── ResultsView.svelte# Post-game results
│   ├── StatsView.svelte  # Statistics screen
│   ├── ListEditor.svelte # Custom list management
│   └── LetterTile.svelte # Letter display tile
├── stores/
│   └── wordScramble.js   # State management
├── utils/
│   ├── wordBank.js       # Built-in 1000+ words
│   └── scramble.js       # Scramble algorithm
└── data/
    └── words.js          # Word data organized by category
```

### 0.2 Register App Prefix

Add to `src/lib/utils/db.js`:

```javascript
const APP_PREFIXES = {
  // ... existing ...
  wordScramble: 'word_scramble_'
};
```

### 0.3 Add IndexedDB Migration

Add version 7 migration in `db.js` following existing patterns.

---

## Phase 1: Core Components

### 1.1 Word Bank (wordBank.js)

Create `src/apps/word-scramble/utils/wordBank.js`:

```javascript
export const CATEGORIES = ['Animals', 'Food', 'Countries', 'Sports', 'Technology', 'Nature', 'Common'];

export const DIFFICULTY = {
  EASY: 'easy',     // 4-5 letters
  MEDIUM: 'medium', // 6-7 letters
  HARD: 'hard'      // 8+ letters
};

// Import word data
export function getWordsByCategory(category) { /* ... */ }
export function getWordsByDifficulty(difficulty) { /* ... */ }
export function getRandomWord(dateSeed) { /* ... */ }
```

### 1.2 Scramble Algorithm (scramble.js)

```javascript
export function scrambleWord(word) {
  // Fisher-Yates shuffle with validation
  // Returns scrambled version that differs from original
}

export function isValidScramble(original, scrambled) {
  // Ensures scrambled differs and isn't simple reversal
}
```

### 1.3 Store (wordScramble.js)

Create Svelte store following `flashcards.js` pattern:

```javascript
// Stores
export const customLists = writable([]);
export const sessionStats = writable({});
export const dailyChallenge = writable(null);

// Functions
export async function loadCustomLists() { /* ... */ }
export async function saveCustomList(list) { /* ... */ }
export async function recordSession(session) { /* ... */ }
export async function getDueWords() { /* ... */ }
export async function updateWordProgress(word, result) { /* ... */ }
```

---

## Phase 2: UI Components

### 2.1 App Registration (index.js)

```javascript
const componentLoader = () => import('./App.svelte');

export default {
  id: 'wordScramble',
  name: 'Word Scramble',
  icon: 'scramble',  // or 'abc'
  description: 'Unscramble letters to form words',
  version: '1.0.0',
  componentLoader
};

export const migrate = async (oldVersion) => {
  // Future migration logic
};
```

### 2.2 HomeView

- Category selector (radio buttons)
- "All Categories" option
- Mode selector (Zen | Blitz | Mastery)
- Daily Challenge card
- Custom Lists button
- Start button

### 2.3 GameView

- Display scrambled letters as tiles
- Text input for typing answer
- Submit button
- Shuffle button (free)
- Hint button (50% penalty)
- Skip button (counts as incorrect)
- Timer (Blitz mode only)
- Progress indicator

### 2.4 ResultsView

- Words attempted / correct
- Score breakdown
- Accuracy percentage
- Streak update
- Play Again / Home buttons

---

## Phase 3: Game Logic

### 3.1 Session Flow

```
START → Load words by category/difficulty
      → Display scrambled word
      → User types answer
      → Validate (correct/incorrect)
      → Update progress (Mastery mode)
      → Next word or END
```

### 3.2 SM-2 Integration

Reuse `src/lib/utils/sm2.js`:

```javascript
import { calculateSM2 } from '../../lib/utils/sm2';

// Map word scramble result to SM-2 rating
function toSM2Rating(result, usedHint) {
  if (result === 'correct') {
    return usedHint ? 2 : 4;  // partial vs full recall
  }
  return 1; // failed
}

// Update word progress
const updated = calculateSM2(wordProgress, rating);
```

### 3.3 Daily Challenge Seed

```javascript
function getDailyWord() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = hashString(today);
  // Use seed to deterministically select word
  return selectWord(seed);
}

function hashString(str) {
  // Simple hash for deterministic selection
  return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}
```

---

## Phase 4: Statistics

### 4.1 Tracked Metrics

| Metric | Source |
|--------|--------|
| Total words practiced | Sessions.sum |
| Overall accuracy | Sessions.correct / Sessions.wordsAttempted |
| Current streak | Daily challenge consecutive completions |
| Words mastered | Progress where interval > 21 days |

### 4.2 Statistics View

- Total sessions count
- Total words attempted
- Average accuracy
- Current streak
- Words by mastery level (New, Learning, Mastered)

---

## Phase 5: Polish

### 5.1 Animations

- Letter tile flip/shuffle animation
- Correct answer celebration
- Timer urgency effect (last 10 seconds)

### 5.2 Haptic Feedback

```javascript
if ('vibrate' in navigator) {
  navigator.vibrate(50); // short buzz
}
```

### 5.3 Sound Effects (optional)

- Correct answer: positive chime
- Wrong answer: gentle buzz
- Timer warning: tick sound

---

## Testing Checklist

- [ ] Zen mode completes without errors
- [ ] Blitz timer counts down correctly
- [ ] Mastery mode schedules words properly
- [ ] Daily challenge shows same word for date
- [ ] Custom list CRUD operations work
- [ ] Statistics accumulate correctly
- [ ] Dark mode renders properly
- [ ] Offline functionality works
- [ ] PWA install works

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/apps/word-scramble/index.js` | App registration |
| `src/apps/word-scramble/App.svelte` | Main container |
| `src/apps/word-scramble/utils/wordBank.js` | 1000+ word dictionary |
| `src/apps/word-scramble/utils/scramble.js` | Scramble algorithm |
| `src/apps/word-scramble/stores/wordScramble.js` | State management |
| `src/lib/utils/sm2.js` | SM-2 algorithm (reused) |
| `src/lib/utils/db.js` | IndexedDB setup |
| `src/lib/stores/theme.js` | Theme (reused) |
