# Tasks: Memory Match Game

**Input**: Design documents from `/specs/003-memory-match/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested. No test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema and app registration - blocking prerequisites for all stories

- [X] T001 Add `memoryMatch: 'memory_match_'` to APP_PREFIXES in src/lib/utils/db.js
- [X] T002 Bump DB_VERSION from 4 to 5 in src/lib/utils/db.js
- [X] T003 Add version 5 migration for memory_match_scores and memory_match_settings stores in src/lib/utils/db.js
- [X] T004 Create app registration file src/apps/memory-match/index.js with id, name, icon, description, version, componentLoader

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and stores that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Create Fisher-Yates shuffle function in src/apps/memory-match/utils/shuffle.js
- [X] T006 [P] Create built-in theme definitions (Animals, Numbers, Shapes - 15 pairs each) in src/apps/memory-match/utils/cards.js
- [X] T007 [P] Create card generation function (grid size + theme → card array) in src/apps/memory-match/utils/cards.js
- [X] T008 Create Svelte stores for game state (gameState, cards, flippedIndices, matchedPairIds, moves, elapsedSeconds) in src/apps/memory-match/stores/memoryMatch.js
- [X] T009 Create high scores store (loadScores, saveScore, isNewBest) in src/apps/memory-match/stores/memoryMatch.js
- [X] T010 Create settings store (loadSettings, saveSettings) in src/apps/memory-match/stores/memoryMatch.js
- [X] T011 Create game logic functions (startGame, flipCard, checkMatch, resetGame) in src/apps/memory-match/stores/memoryMatch.js

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Play a Memory Match Game (Priority: P1) 🎯 MVP

**Goal**: Core gameplay - select grid/theme, flip cards, match pairs, see victory screen

**Independent Test**: Open app, select 4x4 Animals, play complete game, verify victory screen shows moves and time

### Implementation for User Story 1

- [X] T012 [P] [US1] Create Card component with 3D flip animation in src/apps/memory-match/components/Card.svelte
- [X] T013 [P] [US1] Create GameBoard component with CSS Grid layout, move counter, and card rendering in src/apps/memory-match/components/GameBoard.svelte
- [X] T014 [US1] Create HomeView component with grid size selector (3x4, 4x4, 5x4, 6x5) and theme selector in src/apps/memory-match/components/HomeView.svelte
- [X] T015 [US1] Create VictoryScreen component with moves, time, and Play Again button in src/apps/memory-match/components/VictoryScreen.svelte
- [X] T016 [US1] Create main App.svelte with game state routing (home/playing/victory) and tab navigation in src/apps/memory-match/App.svelte

**Checkpoint**: User can play a complete memory match game with built-in themes

---

## Phase 4: User Story 2 - Track High Scores (Priority: P2)

**Goal**: Personal best scores per grid size persist across sessions

**Independent Test**: Complete game on 4x4, verify score recorded, complete another with fewer moves, verify "New Best!" indicator

### Implementation for User Story 2

- [X] T017 [US2] Display high scores per grid size on HomeView in src/apps/memory-match/components/HomeView.svelte
- [X] T018 [US2] Add high score comparison and "New Best!" indicator to VictoryScreen in src/apps/memory-match/components/VictoryScreen.svelte
- [X] T019 [US2] Integrate score persistence with game completion in src/apps/memory-match/stores/memoryMatch.js

**Checkpoint**: High scores persist and display correctly

---

## Phase 5: User Story 3 - Use Custom Flashcard Deck Content (Priority: P3)

**Goal**: Play memory match with flashcard deck content (front/back pair matching)

**Independent Test**: Create flashcard deck with 10 cards, select Custom theme, verify front/back cards appear and match by pair

### Implementation for User Story 3

- [X] T020 [US3] Create custom deck loading function (read from flashcard_cards store) in src/apps/memory-match/utils/cards.js
- [X] T021 [US3] Add custom deck selector to HomeView (list eligible decks, filter by minimum card count) in src/apps/memory-match/components/HomeView.svelte
- [X] T022 [US3] Update GameBoard to handle custom deck cards (front/back display, pair matching by ID) in src/apps/memory-match/components/GameBoard.svelte
- [X] T023 [US3] Add "no eligible decks" message and fallback to built-in themes in src/apps/memory-match/components/HomeView.svelte

**Checkpoint**: Custom deck integration works with front/back pair matching

---

## Phase 6: User Story 4 - Enable Timer Mode (Priority: P4)

**Goal**: Optional countdown timer adds time pressure to games

**Independent Test**: Enable timer with 60s, play game, verify countdown starts on first flip, timer expires shows "Time's Up"

### Implementation for User Story 4

- [X] T024 [US4] Add timer toggle and duration selector (60s, 90s, 120s, 180s) to HomeView in src/apps/memory-match/components/HomeView.svelte
- [X] T025 [US4] Add countdown timer display to GameBoard (starts on first card flip) in src/apps/memory-match/components/GameBoard.svelte
- [X] T026 [US4] Create TimerExpiredScreen component with matched pairs count and Play Again in src/apps/memory-match/components/TimerExpiredScreen.svelte
- [X] T027 [US4] Add timer state management (start, pause, expire) to game stores in src/apps/memory-match/stores/memoryMatch.js

**Checkpoint**: Timer mode works with countdown and expiration

---

## Phase 7: User Story 5 - Adjust Difficulty (Priority: P5)

**Goal**: Grid sizes labeled with difficulty levels (Easy/Medium/Hard/Expert)

**Independent Test**: View grid options, verify each shows dimensions, difficulty label, and card count

### Implementation for User Story 5

- [X] T028 [US5] Add difficulty labels and card counts to grid size selector in HomeView in src/apps/memory-match/components/HomeView.svelte

**Checkpoint**: Difficulty scaling is clear and accessible

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and consistency improvements

- [X] T029 [P] Create GameIcon component in src/apps/memory-match/components/icons/GameIcon.svelte
- [X] T030 [P] Create StatsIcon component in src/apps/memory-match/components/icons/StatsIcon.svelte
- [X] T031 [P] Create SettingsIcon component in src/apps/memory-match/components/icons/SettingsIcon.svelte
- [X] T032 Add haptic feedback on card flip and match (navigator.vibrate) in src/apps/memory-match/stores/memoryMatch.js
- [X] T033 Add sound effects for match and timer (optional, settings-controlled) in src/apps/memory-match/stores/memoryMatch.js
- [X] T034 Verify dark mode support across all components in src/apps/memory-match/components/
- [X] T035 Run npm run build to verify compilation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (P1) → US2 (P2) → US3 (P3) → US4 (P4) → US5 (P5) in priority order
  - Each story should be independently testable after completion
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Core Gameplay)**: No dependencies on other stories - MVP
- **US2 (High Scores)**: Integrates with US1 victory screen, but independently testable
- **US3 (Custom Decks)**: Uses US1 grid/board, but independently testable with built-in themes as baseline
- **US4 (Timer)**: Adds to US1 game board, but independently testable
- **US5 (Difficulty)**: UI-only change in US1 HomeView, minimal dependency

### Parallel Opportunities

- Phase 1 tasks (T001-T004): Sequential (same file modifications)
- Phase 2 tasks (T005-T007): Can run in parallel [P] (different files)
- Phase 3 tasks (T012-T013): Can run in parallel [P] (different files)
- Phase 8 icon tasks (T029-T031): Can run in parallel [P] (different files)

---

## Parallel Example: Phase 2 Utilities

```bash
# Launch all utility creation tasks together:
Task: "Create Fisher-Yates shuffle function in src/apps/memory-match/utils/shuffle.js"
Task: "Create built-in theme definitions in src/apps/memory-match/utils/cards.js"
Task: "Create card generation function in src/apps/memory-match/utils/cards.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (DB + registration)
2. Complete Phase 2: Foundational (utils + stores)
3. Complete Phase 3: User Story 1 (core gameplay)
4. **STOP and VALIDATE**: Play a complete game with built-in themes
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → Play a game → MVP!
3. US2 → Scores persist → Enhanced experience
4. US3 → Custom decks → Personal relevance
5. US4 → Timer mode → Challenge mode
6. US5 → Difficulty labels → Accessibility
7. Polish → Final touches

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 + US2 (core + scores)
   - Developer B: US3 (custom decks)
   - Developer C: US4 + US5 (timer + difficulty)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total tasks: 35
