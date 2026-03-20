# Implementation Plan: Memory Match Game

**Branch**: `[003-memory-match]` | **Date**: 2026-03-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-memory-match/spec.md`

## Summary

A memory card-matching game integrated into the Brain Workouts platform. Players flip cards to find matching pairs across 4 grid sizes (3x4 to 6x5), with built-in themes (Animals, Numbers, Shapes) and custom flashcard deck integration. Includes optional timer mode, high score tracking, and full offline support.

## Technical Context

**Language/Version**: JavaScript (ES Modules)
**Primary Dependencies**: Svelte 4.x, idb 8.x, TailwindCSS 3.x
**Storage**: IndexedDB (via idb library, shared `flashcard_db`)
**Testing**: N/A (no test framework configured)
**Target Platform**: Web browser (PWA, mobile-first)
**Project Type**: Svelte SPA (brain workout app module)
**Performance Goals**: Card flip animation < 300ms, game start < 1s
**Constraints**: Offline-first, mobile-first responsive, dark mode support
**Scale/Scope**: Single user, ~4 grid sizes, ~3 built-in themes + custom decks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Local-First Data | PASS | All game data stored in IndexedDB |
| II. Static Deployment | PASS | Client-side only, no server |
| III. PWA | PASS | Inherited from container |
| IV. Extensible Platform | PASS | Follows app module pattern (index.js + App.svelte) |
| V. Data Portability | PASS | No user-generated content unique to this app (uses flashcard decks) |

**Result**: All gates PASS. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-memory-match/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code

```text
src/apps/memory-match/
├── index.js                    # App registration (id, name, icon, version, componentLoader)
├── App.svelte                  # Main app component with tab navigation
├── components/
│   ├── HomeView.svelte         # Grid size + theme selection, high scores display
│   ├── GameBoard.svelte        # Card grid, flip logic, timer display
│   ├── Card.svelte             # Individual card with flip animation
│   ├── VictoryScreen.svelte    # Win screen with moves, time, high score
│   ├── TimerExpiredScreen.svelte # Time's up screen
│   └── icons/
│       ├── GameIcon.svelte     # Home tab icon
│       ├── StatsIcon.svelte    # Stats tab icon
│       └── SettingsIcon.svelte # Settings tab icon
├── stores/
│   └── memoryMatch.js          # Svelte stores for game state, scores, settings
└── utils/
    ├── cards.js                # Card generation (built-in themes, custom deck loading)
    └── shuffle.js              # Fisher-Yates shuffle algorithm
```

### Modified Existing Files

```text
src/lib/utils/db.js             # Bump DB_VERSION 4→5, add memory_match_ stores
src/lib/stores/apps.js          # No change needed (auto-discovers via glob)
```

**Structure Decision**: App module pattern matching pomodoro app. Self-contained in `src/apps/memory-match/` with shared DB utilities from `src/lib/utils/`.

## Architecture Decisions

### App Registration

Follow the same pattern as pomodoro (`src/apps/pomodoro/index.js`):
- Export default object with `id: 'memory-match'`, `name: 'Memory Match'`, `icon: 'puzzle'`, `description`, `version`, `componentLoader`
- Auto-discovered by `src/lib/stores/apps.js` via `import.meta.glob('../../apps/*/index.js')`

### Database

- Shared database: `flashcard_db`
- App prefix: `memory_match_`
- New stores: `memory_match_scores` (high scores), `memory_match_settings` (user preferences)
- DB version bump: 4 → 5
- Flashcard deck data read from `flashcard_decks` and `flashcard_cards` stores (cross-app access)

### Custom Deck Integration

- Memory match reads from `flashcard_cards` store using `db.getAllFromIndex('flashcard_cards', 'by-deckId', deckId)`
- Each flashcard becomes a pair: one card shows `front`, its match shows `back`
- Matching is by `card.id` association, not content equality
- Minimum cards required = grid pairs (e.g., 6 for 3x4, 8 for 4x4, 10 for 5x4, 15 for 6x5)
- If deck has more cards than needed, randomly select subset

### Built-in Themes

Three themes with emoji-based card content:
- **Animals**: 15 animal emoji pairs
- **Numbers**: 15 number pairs (1-15 displayed as text)
- **Shapes**: 15 shape/geometric emoji pairs

### Game State

In-memory Svelte store (not persisted to DB):
- `gameState`: 'home' | 'playing' | 'victory' | 'timer_expired'
- `cards`: Array of card objects with flip state
- `flippedCards`: Array of currently flipped card indices (max 2)
- `matchedPairs`: Set of matched pair IDs
- `moves`: Integer count
- `startTime`: Timestamp
- `elapsedTime`: Seconds
- `timerEnabled`: Boolean
- `timerDuration`: Seconds (60, 90, 120, 180)
- `timerRemaining`: Seconds

### High Score Persistence

Stored in `memory_match_scores` IndexedDB store:
- Key: grid size (e.g., '4x4')
- Value: `{ gridSize, bestMoves, bestTime, date }`
- One record per grid size (not per theme)
- Updated when current game beats personal best

## Complexity Tracking

No constitution violations. No complexity tracking needed.
