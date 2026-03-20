# Quickstart: Memory Match Game

**Feature**: `003-memory-match`
**Date**: 2026-03-20

---

## Implementation Sequence

### Phase 1: Setup & Database
1. Update `src/lib/utils/db.js`:
   - Add `memoryMatch: 'memory_match_'` to `APP_PREFIXES`
   - Bump `DB_VERSION` from 4 to 5
   - Add version 5 migration for `memory_match_scores` and `memory_match_settings` stores

2. Create app registration file `src/apps/memory-match/index.js`:
   - Export id, name, icon, description, version, componentLoader
   - Export migrate function (empty for v1)

### Phase 2: Utilities
3. Create `src/apps/memory-match/utils/shuffle.js`:
   - Fisher-Yates shuffle function

4. Create `src/apps/memory-match/utils/cards.js`:
   - Built-in theme definitions (Animals, Numbers, Shapes) with 15 pairs each
   - Function to generate card array for a given grid size + theme
   - Function to load custom deck cards from IndexedDB

### Phase 3: Stores
5. Create `src/apps/memory-match/stores/memoryMatch.js`:
   - Game state store (gameState, cards, flippedIndices, matchedPairIds, moves, elapsedSeconds, timer state)
   - High scores store (load, save, check if new best)
   - Settings store (sound, vibration, timer duration)
   - Game logic functions (startGame, flipCard, checkMatch, resetGame)

### Phase 4: Components
6. Create `src/apps/memory-match/components/Card.svelte`:
   - Card face with 3D flip animation
   - Props: card data, isFlipped, isMatched, onFlip callback
   - TailwindCSS styling with dark mode

7. Create `src/apps/memory-match/components/GameBoard.svelte`:
   - CSS Grid layout with dynamic columns
   - Timer display (countdown mode)
   - Move counter
   - Renders Card components

8. Create `src/apps/memory-match/components/HomeView.svelte`:
   - Grid size selector (4 options with difficulty labels)
   - Theme selector (3 built-in + custom decks)
   - Timer mode toggle with duration selector
   - High scores display per grid size

9. Create `src/apps/memory-match/components/VictoryScreen.svelte`:
   - Displays moves, time, "New Best!" indicator
   - Play Again button
   - Back to Home button

10. Create `src/apps/memory-match/components/TimerExpiredScreen.svelte`:
    - Displays "Time's Up" message
    - Shows matched pairs count out of total
    - Play Again button
    - Back to Home button

### Phase 5: Main App
11. Create `src/apps/memory-match/App.svelte`:
    - Tab navigation (Home, Stats placeholder)
    - Conditional rendering based on gameState
    - Initialize stores on mount

---

## Integration Testing Scenarios

### Scenario 1: Play a Built-in Theme Game
1. Open app from Hub
2. Select "4x4" grid size
3. Select "Animals" theme
4. Start game
5. Flip cards, verify matching works
6. Complete game, verify victory screen

### Scenario 2: Timer Mode
1. Enable timer mode with 60s duration
2. Start game
3. Verify countdown starts on first card flip
4. Let timer expire, verify "Time's Up" screen

### Scenario 3: High Score Tracking
1. Complete a game on 3x4
2. Verify score recorded
3. Complete another game with fewer moves
4. Verify "New Best!" indicator
5. Verify high score persists after app restart

### Scenario 4: Custom Deck Integration
1. Create a flashcard deck with 10 cards (via flashcard app)
2. Open Memory Match
3. Select "Custom" theme
4. Verify deck appears in list
5. Select the deck, start game
6. Verify cards show front/back of flashcards
7. Verify matching works by pair association

### Scenario 5: Edge Cases
1. Tap same card twice rapidly (should not count as move)
2. Navigate away mid-game (game resets)
3. Select custom deck with fewer cards than grid pairs (should show error message)

---

## File Creation Order

```
src/lib/utils/db.js (modify)
src/apps/memory-match/index.js
src/apps/memory-match/utils/shuffle.js
src/apps/memory-match/utils/cards.js
src/apps/memory-match/stores/memoryMatch.js
src/apps/memory-match/components/Card.svelte
src/apps/memory-match/components/GameBoard.svelte
src/apps/memory-match/components/HomeView.svelte
src/apps/memory-match/components/VictoryScreen.svelte
src/apps/memory-match/components/TimerExpiredScreen.svelte
src/apps/memory-match/App.svelte
```
