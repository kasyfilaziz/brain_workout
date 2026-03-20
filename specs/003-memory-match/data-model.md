# Data Model: Memory Match Game

**Feature**: `003-memory-match`
**Based on**: [spec.md](./spec.md)

---

## Entity Definitions

### HighScore (Persisted)

Represents the best performance for a specific grid size.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| gridSize | String | Primary key | Grid identifier (e.g., '3x4', '4x4', '5x4', '6x5') |
| bestMoves | Integer | >= 0 | Fewest moves (pair attempts) to complete |
| bestTime | Integer | >= 0 | Fastest time in seconds |
| date | Timestamp | Required | When the best score was achieved |

**Validation Rules:**
- `gridSize` must be one of: '3x4', '4x4', '5x4', '6x5'
- `bestMoves` is the primary comparison (fewer is better)
- `bestTime` is the tiebreaker when moves are equal (faster is better)
- One record per grid size (upsert on new best)

---

### GameSettings (Persisted)

User preferences for game behavior.

| Field | Type | Default | Constraints | Description |
|-------|------|---------|-------------|-------------|
| soundEnabled | Boolean | true | - | Play sound on match/timer |
| vibrationEnabled | Boolean | false | - | Haptic feedback on match/timer |
| timerDuration | Integer | 120 | 60, 90, 120, 180 | Default timer countdown in seconds |

**Validation Rules:**
- `timerDuration` must be one of: 60, 90, 120, 180
- Settings always stored as single record with key='memory_match_settings'

---

### GameState (In-Memory Only - Not Persisted)

Represents the current active game session.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| gameState | Enum | 'home' | Current screen: 'home' | 'playing' | 'victory' | 'timer_expired' |
| gridSize | String | null | Selected grid dimensions (e.g., '4x4') |
| theme | String | null | Selected theme name or 'custom' |
| cards | Array | [] | Card objects with flip state |
| flippedIndices | Array | [] | Currently flipped card indices (max 2) |
| matchedPairIds | Set | Set() | IDs of matched pairs |
| moves | Integer | 0 | Total pair attempts made |
| startTime | Number | null | Unix timestamp when game started |
| elapsedSeconds | Integer | 0 | Elapsed time in seconds |
| timerEnabled | Boolean | false | Whether countdown timer is active |
| timerDuration | Integer | 120 | Countdown duration in seconds |
| timerRemaining | Integer | 0 | Seconds remaining on countdown |
| isPaused | Boolean | false | Whether interaction is blocked (during flip animation) |
| selectedDeckId | Number | null | Flashcard deck ID (only when theme='custom') |

**State Transitions:**

```
┌──────┐  Start Game  ┌──────────┐  All Matched  ┌──────────┐
│ HOME │ ───────────► │ PLAYING  │ ────────────► │ VICTORY  │
└──────┘              └──────────┘               └──────────┘
                          │                            │
                          │ Timer Expires              │ Play Again
                          ▼                            │
                      ┌──────────────┐                 │
                      │TIMER_EXPIRED │                 │
                      └──────────────┘                 │
                          │                            │
                          │ Play Again                 │
                          ▼                            │
                      ┌──────┐◄───────────────────────┘
                      │ HOME │
                      └──────┘
```

---

### Card (In-Memory Only - Not Persisted)

Represents a single card in the game board.

| Field | Type | Description |
|-------|------|-------------|
| index | Integer | Position on the grid (0-based) |
| pairId | String | Unique identifier for the pair (for matching) |
| displayContent | String | Text or emoji shown when flipped |
| isFlipped | Boolean | Currently face-up |
| isMatched | Boolean | Has been matched |
| side | String | 'front' or 'back' (custom decks only) |
| flashcardId | Number | Original flashcard ID (custom decks only) |

**For Built-in Themes:**
- `pairId` = `${theme}-${pairNumber}` (e.g., 'animals-0', 'numbers-3')
- `displayContent` = emoji or number from theme array
- `side` = undefined (both cards in a pair show same content)

**For Custom Decks:**
- `pairId` = `flashcard-${flashcardId}` (e.g., 'flashcard-42')
- Two cards per flashcard: one with `side: 'front'`, one with `side: 'back'`
- `displayContent` = `card.front` or `card.back`
- `flashcardId` = original flashcard ID from `flashcard_cards` store

---

## IndexedDB Schema

**Database**: `flashcard_db` (shared with other apps)
**Prefix**: `memory_match_`
**Version Bump**: 4 → 5

### New Object Stores

```javascript
// Store: memory_match_scores
{
  keyPath: 'gridSize',
  data: [
    { gridSize: '3x4', bestMoves: 8, bestTime: 45, date: 1710892800000 },
    { gridSize: '4x4', bestMoves: 12, bestTime: 72, date: 1710892800000 },
    { gridSize: '5x4', bestMoves: 15, bestTime: 90, date: 1710892800000 },
    { gridSize: '6x5', bestMoves: 22, bestTime: 150, date: 1710892800000 }
  ]
}

// Store: memory_match_settings
{
  keyPath: 'key',
  data: { key: 'memory_match_settings', soundEnabled: true, vibrationEnabled: false, timerDuration: 120 }
}
```

### DB Version 5 Migration

```javascript
if (oldVersion < 5) {
  const memoryMatchStores = getStoreNames(APP_PREFIXES.memoryMatch);

  if (!db.objectStoreNames.contains(memoryMatchStores.scores)) {
    db.createObjectStore(memoryMatchStores.scores, { keyPath: 'gridSize' });
  }

  if (!db.objectStoreNames.contains(memoryMatchStores.settings)) {
    db.createObjectStore(memoryMatchStores.settings, { keyPath: 'key' });
  }
}
```

---

## Cross-App Data Access

The Memory Match app reads from flashcard stores for custom deck integration:

| Source Store | Access Method | Usage |
|--------------|---------------|-------|
| `flashcard_decks` | `db.getAll('flashcard_decks')` | List eligible decks in theme selector |
| `flashcard_cards` | `db.getAllFromIndex('flashcard_cards', 'by-deckId', deckId)` | Load cards for selected deck |

**No writes** to flashcard stores from memory match app.

---

## Relationships

```
HighScore (persisted)
    └── keyed by: gridSize (1 per grid size)
    
GameSettings (persisted)
    └── single record, keyed by 'memory_match_settings'

GameState (in-memory)
    └── contains: Card[] (grid)
    └── references: HighScore.gridSize (for comparison)
    └── reads: flashcard_cards (for custom theme)

Card (in-memory)
    └── pairId links two cards as a matching pair
    └── flashcardId links to original flashcard (custom theme only)
```

---

## Assumptions

1. All timestamps stored as Unix milliseconds
2. Game state is purely in-memory (lost on navigation away, per spec)
3. High scores are per grid size, not per theme (themes are cosmetic)
4. Custom deck cards are read-only from flashcard stores
5. One settings record per app (singleton pattern)
