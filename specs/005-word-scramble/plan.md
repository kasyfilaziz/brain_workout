# Implementation Plan: Word Scramble

**Branch**: `005-word-scramble` | **Date**: 2026-03-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-word-scramble/spec.md`

## Summary

A vocabulary brain workout app where users unscramble letters to form words. Features 1000+ built-in words categorized by topic/difficulty, custom user word lists, three game modes (Zen, Blitz, Mastery), daily challenge with SM-2 scheduling, and streak tracking. Fully offline, PWA-installable.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Svelte 4.x  
**Primary Dependencies**: Svelte 4, TailwindCSS 3, idb 8.x, vite-plugin-pwa  
**Storage**: IndexedDB (idb library) - local persistence  
**Testing**: No test framework configured (manual testing)  
**Target Platform**: Browser (mobile-first PWA)  
**Project Type**: Modular brain workout app (container pattern)  
**Performance Goals**: 60fps animations, <500ms answer validation, instant word loading  
**Constraints**: Fully offline capable, no external APIs, PWA installable  
**Scale/Scope**: Single user, ~1000 built-in words, custom lists unlimited  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Local-First Data | ✅ PASS | All data stored in IndexedDB |
| II. Static Deployment | ✅ PASS | Pure client-side, no server |
| III. PWA | ✅ PASS | Uses shared vite-plugin-pwa |
| IV. Extensible | ✅ PASS | Follows container app pattern |
| V. Data Portability | ✅ PASS | Custom lists exportable as JSON |

**No violations detected. Proceed with implementation.**

## Project Structure

### Documentation (this feature)

```
specs/005-word-scramble/
├── plan.md              # This file
├── research.md           # Technical decisions
├── data-model.md        # Entity definitions
├── quickstart.md         # Implementation guide
├── contracts/           # Internal interfaces
│   └── module-interfaces.md
├── spec.md              # Feature specification
└── tasks.md             # Task breakdown (Phase 2)
```

### Source Code

```
src/apps/word-scramble/
├── index.js              # App registration (loader pattern)
├── App.svelte            # Main container
├── stores/
│   └── wordScramble.js   # State management
├── components/
│   ├── HomeView.svelte   # Category/mode selection
│   ├── GameView.svelte   # Main gameplay
│   ├── ResultsView.svelte# Session results
│   ├── StatsView.svelte  # Statistics
│   ├── ListEditor.svelte # Custom list CRUD
│   └── LetterTile.svelte # Letter display
└── utils/
    ├── wordBank.js       # 1000+ word dictionary
    ├── scramble.js       # Scramble algorithm
    └── wordData.js       # Categorized word lists
```

**Structure Decision**: Follow existing app module pattern (pomodoro, memory-match, math-sprint)

## Complexity Tracking

> No constitutional violations. No complexity tracking needed.

## Implementation Phases

### Phase 1: Setup & Foundation

- [ ] Create directory structure under `src/apps/word-scramble/`
- [ ] Add `wordScramble` to APP_PREFIXES in `db.js`
- [ ] Add IndexedDB migration for version 7
- [ ] Create `index.js` app registration
- [ ] Create basic `App.svelte` shell

### Phase 2: Data Layer

- [ ] Create `wordBank.js` with 1000+ words across 7 categories
- [ ] Create `scramble.js` with Fisher-Yates shuffle algorithm
- [ ] Create `wordScramble.js` store with CRUD operations
- [ ] Implement custom list persistence
- [ ] Implement progress tracking with SM-2

### Phase 3: Core Gameplay

- [ ] Build `HomeView.svelte` with category/mode selection
- [ ] Build `GameView.svelte` with letter tiles and input
- [ ] Implement answer validation logic
- [ ] Implement shuffle (free) and hint (50% penalty)
- [ ] Implement skip (counts as incorrect)
- [ ] Add timer for Blitz mode

### Phase 4: Game Modes

- [ ] Zen mode (no timer, practice at pace)
- [ ] Blitz mode (60-second sprint)
- [ ] Mastery mode (SM-2 weighted word selection)
- [ ] Daily Challenge (deterministic date-based word)

### Phase 5: UI & Polish

- [ ] Build `ResultsView.svelte` with stats
- [ ] Build `StatsView.svelte` with lifetime stats
- [ ] Build `ListEditor.svelte` for custom lists
- [ ] Add dark mode support via shared theme store
- [ ] Add haptic feedback
- [ ] Add animations (letter tiles, transitions)

### Phase 6: Integration & Testing

- [ ] Verify offline functionality
- [ ] Verify PWA installability
- [ ] Test all game modes
- [ ] Test custom list CRUD
- [ ] Verify statistics accuracy

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Word bank as static JS | No async loading, fast access, simple maintenance |
| Fisher-Yates scramble | Truly random, validated output |
| SM-2 rating mapping | correct=4, hint-correct=2, incorrect=1 |
| Date seed for daily | Deterministic selection without server |
| Skip = incorrect | Honest stats, fair leaderboard-less scoring |

## Dependencies

**No new external dependencies required.**

Existing dependencies used:
- `svelte` - UI framework
- `tailwindcss` - Styling
- `idb` - IndexedDB wrapper
- `vite-plugin-pwa` - PWA support

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Word bank size < 1000 | Low | Can easily add more words |
| Scramble produces original | Low | Validation re-scrambles if same |
| Custom list corruption | Medium | Input validation before save |
| Performance with large lists | Low | Virtual scrolling if needed |

## Next Steps

1. Execute `/speckit.tasks` to generate task breakdown
2. Implement Phase 1 (Setup)
3. Verify build passes after each phase
4. Commit after each logical phase completion
