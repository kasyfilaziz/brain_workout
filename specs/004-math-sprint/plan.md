# Implementation Plan: Math Sprint

**Branch**: `004-math-sprint` | **Date**: 2026-03-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-math-sprint/spec.md`

## Summary

A mental arithmetic trainer app for the Brain Workouts platform. Users select an operation (addition, subtraction, multiplication, division, or mixed), difficulty level (easy/medium/hard), and game mode (sprint: 30 problems, timed: 30-120s countdown). The app generates problems algorithmically, tracks mastery per operation+difficulty using SM-2, and persists session history.

## Technical Context

**Language/Version**: JavaScript (ES Modules)
**Primary Dependencies**: Svelte 4.x, idb 8.x, TailwindCSS 3.x
**Storage**: IndexedDB via idb library, shared `flashcard_db`
**Testing**: N/A (no test framework configured)
**Target Platform**: Web browser (PWA, mobile-first)
**Project Type**: Svelte SPA (brain workout app module)
**Performance Goals**: Problem display < 500ms, game start < 5s, results appear < 1s
**Constraints**: Offline-first, mobile-first responsive, dark mode support
**Scale/Scope**: Single user, 5 operations × 3 difficulties, ~15 mastery records, unlimited sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Local-First Data | PASS | All data stored in IndexedDB |
| II. Static Deployment | PASS | Client-side only, no server |
| III. PWA | PASS | Inherited from container |
| IV. Extensible Platform | PASS | Follows app module pattern (index.js + App.svelte) |
| V. Data Portability | PASS | No user-generated content (problems are algorithmically generated) |

**Result**: All gates PASS. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-math-sprint/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── module-interfaces.md  # Phase 1 output
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code

```text
src/apps/math-sprint/
├── index.js                    # App registration (id, name, icon, version, componentLoader)
├── App.svelte                  # Main app component with tab navigation
├── components/
│   ├── HomeView.svelte         # Operation/difficulty/mode selection, mastery display
│   ├── GameView.svelte         # Problem display, answer input, timer, feedback
│   ├── ResultsView.svelte      # Session summary with score, accuracy, time
│   ├── StatsView.svelte        # Session history list
│   ├── SettingsView.svelte     # Sound/vibration toggles, default mode
│   └── icons/
│       ├── PlayIcon.svelte     # Play tab icon
│       ├── StatsIcon.svelte    # Stats tab icon
│       └── SettingsIcon.svelte # Settings tab icon
├── stores/
│   └── mathSprint.js           # Svelte stores for game state, mastery, sessions
└── utils/
    └── problems.js             # Problem generation logic (operand ranges, constraints)
```

### Modified Existing Files

```text
src/lib/utils/db.js             # Bump DB_VERSION 5→6, add mathSprint prefix, add 3 stores
```

**Structure Decision**: App module pattern matching pomodoro and memory-match apps. Self-contained in `src/apps/math-sprint/` with shared DB utilities and SM-2 algorithm from `src/lib/utils/`.

## Architecture Decisions

### App Registration

Follow the same pattern as memory-match (`src/apps/memory-match/index.js`):
- Export default object with `id: 'math-sprint'`, `name: 'Math Sprint'`, `icon: 'calculator'`, `description`, `version`, `componentLoader`
- Auto-discovered by `src/lib/stores/apps.js` via `import.meta.glob('../../apps/*/index.js')`

### Database

- Shared database: `flashcard_db`
- App prefix: `math_sprint_`
- New stores: `math_sprint_mastery` (key: composite string), `math_sprint_sessions` (autoIncrement), `math_sprint_settings` (singleton)
- DB version bump: 5 → 6

### Problem Generation

Algorithmic generation with constraints:
- **Addition/Multiplication**: Random operands within difficulty range
- **Subtraction**: Larger operand first (ensures non-negative result)
- **Division**: Generate answer × divisor = dividend (ensures whole number result)
- **Mixed mode**: Random operation selection per problem

### SM-2 Mastery Integration

Each operation+difficulty combination (15 total) has a mastery record. Session accuracy maps to SM-2 rating (0-5), then `calculateSM2` from `src/lib/utils/sm2.js` updates the record.

### Game State

In-memory Svelte store (not persisted to DB):
- `gameState`: 'home' | 'playing' | 'results'
- `currentProblem`: { operand1, operation, operand2, answer }
- `problemNumber`: 1-based index
- `correctCount`, `incorrectCount`: Running tallies
- `startTime`, `elapsedTime`, `timeRemaining`: Timer state

### UI Pattern

Tab-based navigation (Play, Stats, Settings) matching the Pomodoro app pattern in `src/apps/pomodoro/App.svelte`.

## Complexity Tracking

No constitution violations. No complexity tracking needed.
