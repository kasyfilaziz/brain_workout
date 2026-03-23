# Implementation Plan: Sequence Recall (N-Back)

**Branch**: `006-sequence-recall` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-sequence-recall/spec.md`

## Summary

A standalone brain workout app implementing the N-Back cognitive training paradigm. Users perform working memory exercises by indicating whether the current stimulus matches one from N positions ago. Supports single-task (position or sound only) and dual-task (position + sound simultaneously) modes with adaptive difficulty based on performance.

## Technical Context

**Language/Version**: JavaScript (ES Modules) - Svelte 4.x  
**Primary Dependencies**: Svelte 4.x, idb 8.x (IndexedDB), vite-plugin-pwa  
**Storage**: IndexedDB via idb library (per-app prefix `sequence_recall_*`)  
**Testing**: No test framework configured (manual testing per spec acceptance criteria)  
**Target Platform**: Browser/PWA (mobile-first)  
**Project Type**: Modular brain workout PWA (following existing app pattern)  
**Performance Goals**: Session completes in under 5 minutes (20 rounds × ~15 seconds)  
**Constraints**: Offline-capable, 3-second response window per round, ~33% match probability  
**Scale/Scope**: Single user, local IndexedDB storage, up to thousands of sessions

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Local-First Data | ✅ PASS | IndexedDB via idb library, fully offline |
| II. Static Deployment | ✅ PASS | Static site, client-side only, no server |
| III. PWA | ✅ PASS | vite-plugin-pwa, service worker, manifest |
| IV. Extensible Platform | ✅ PASS | Follows modular app pattern in `src/apps/sequence-recall/` |
| V. Data Portability | ✅ PASS | No user-generated content (built-in stimuli only); no export needed per clarification |

**Gate**: ✅ All principles satisfied - no violations

## Project Structure

### Documentation (this feature)

```
specs/006-sequence-recall/
├── plan.md              # This file
├── research.md          # N/A - no external research needed (well-established N-Back protocol)
├── data-model.md        # Phase 1 output (entities, relationships)
├── quickstart.md        # Phase 1 output (implementation guide)
├── contracts/           # N/A - no external interfaces
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

Following the established modular brain workout pattern:

```
src/
└── apps/
    └── sequence-recall/           # New app module
        ├── index.js               # App definition & component loader
        ├── App.svelte             # Root component (HomeView, GameView, ResultsView, StatsView)
        ├── components/
        │   ├── Grid.svelte        # 3x3/4x4/2x2 position grid
        │   ├── StimulusDisplay.svelte  # Shows current stimulus
        │   ├── MatchButtons.svelte # Match/No Match buttons
        │   └── Tutorial.svelte    # First-time instruction screen
        ├── stores/
        │   ├── gameState.js       # Current session state (currentRound, stimulusHistory, etc.)
        │   └── settings.js        # User preferences (extends shared settings)
        └── utils/
            ├── nback.js           # Core N-Back logic (match detection, sequence generation)
            ├── dprime.js          # d' score calculation
            ├── audio.js           # Tone letter audio generation/playback
            └── db.js              # IndexedDB operations for sequence-recall
```

**Structure Decision**: Follows identical pattern to existing apps (pomodoro, memory-match, math-sprint, word-scramble) in `src/apps/`. Reuses shared components from `src/lib/components/`.

## Phase 0: Research

**Status**: N/A - N-Back is a well-established cognitive paradigm with standard implementation guidelines documented in the spec itself. No external research needed.

Key technical decisions already resolved in spec clarifications:
- 3-second response window per round
- ~33% match probability
- Tone letters (A, B, C, D, etc.) for sound stimuli
- Auto-increment integer IDs for sessions
- Configurable grid sizes (2x2, 3x3, 4x4)
- IndexedDB via idb library

## Phase 1: Design

### Entities (from spec)

| Entity | Attributes | Relationships |
|--------|-----------|---------------|
| Session | id, date, nLevel, taskType, gridSize, rounds, matchProbability, hits, misses, falseAlarms, correctRejections, dScore, completed | References UserSettings |
| PersonalBest | level, taskType, dScore, dateAchieved | Derived from Session |
| UserSettings | defaultLevel, defaultTaskType, defaultGridSize, defaultRounds, soundEnabled, vibrationEnabled, roundTimeLimit | Singleton per app |
| StimulusRound | roundNumber, stimulusShown, expectedResponse, userResponse, isCorrect, reactionTimeMs | Part of Session |

### State Machine

**Session States**:
```
IDLE → RUNNING → PAUSED → RUNNING → COMPLETED
                ↓
              ABANDONED
```

**Transitions**:
- `IDLE`: No active session, showing home/tutorial
- `RUNNING`: Active stimulus presentation and response collection
- `PAUSED`: Session interrupted (app backgrounded, user pause)
- `COMPLETED`: All rounds finished, showing results
- `ABANDONED`: Session ended early without completion

### Key Algorithms

**Match Detection** (nback.js):
```
For round R with N-back level N:
  currentStimulus = stimuli[R]
  targetStimulus = stimuli[R - N]
  return currentStimulus === targetStimulus
```

**d' Score Calculation** (dprime.js):
```
hitRate = hits / (hits + misses)
falseAlarmRate = falseAlarms / (falseAlarms + correctRejections)
dPrime = normalCDF(hitRate) - normalCDF(falseAlarmRate)
```

**Sequence Generation** (nback.js):
```
For each round:
  - Determine if this round is a "match" (~33% probability)
  - If match: set current = stimulus[N-back-position]
  - If non-match: select random stimulus != stimulus[N-back-position]
```

### Quickstart

1. Create `src/apps/sequence-recall/index.js` following existing app pattern
2. Implement IndexedDB store with `sequence_recall_sessions` and `sequence_recall_settings` object stores
3. Build GameView component with grid display and response buttons
4. Implement N-back logic with stimulus history buffer
5. Add Tutorial component with animated example
6. Integrate with Hub navigation and theme store

## Complexity Tracking

**No violations requiring justification**

All constitutional principles satisfied. Implementation follows established patterns from previous brain workout apps.
