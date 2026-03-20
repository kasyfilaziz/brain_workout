# Tasks: Math Sprint

**Input**: Design documents from `/specs/004-math-sprint/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/module-interfaces.md

**Tests**: Not requested. No test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema and app registration - blocking prerequisites for all stories

- [X] T001 Add `mathSprint: 'math_sprint_'` to APP_PREFIXES in src/lib/utils/db.js
- [X] T002 Bump DB_VERSION from 5 to 6 in src/lib/utils/db.js
- [X] T003 Add version 6 migration for math_sprint_mastery, math_sprint_sessions, and math_sprint_settings stores in src/lib/utils/db.js
- [X] T004 Create app registration file src/apps/math-sprint/index.js with id, name, icon, description, version, componentLoader

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and stores that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Create problem generation functions (generateProblem, getRandomOperation, getOperationSymbol, getOperandRange) in src/apps/math-sprint/utils/problems.js
- [X] T006 Create core Svelte stores (gameState, currentProblem, problemNumber, correctCount, incorrectCount, startTime, elapsedTime, timeRemaining, selectedOperation, selectedDifficulty, selectedMode, timedDuration, lastAnswerCorrect) in src/apps/math-sprint/stores/mathSprint.js
- [X] T007 Create game logic functions (startGame, submitAnswer, endGame, resetGame) with timer management in src/apps/math-sprint/stores/mathSprint.js

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Play a Math Sprint Game (Priority: P1) 🎯 MVP

**Goal**: Core gameplay - select operation/difficulty/mode, solve problems, see results

**Independent Test**: Open app, select Addition + Easy + Sprint, play complete game, verify results screen shows correct/incorrect counts and elapsed time

### Implementation for User Story 1

- [X] T008 [P] [US1] Create HomeView component with operation selector (5 options), difficulty selector (3 options), mode selector (Sprint/Timed), timed duration selector, and Start button in src/apps/math-sprint/components/HomeView.svelte
- [X] T009 [P] [US1] Create GameView component with problem display (operand1 operator operand2 = ?), numeric answer input, submit button, correct/incorrect feedback (green/red highlight), move counter, and timer display in src/apps/math-sprint/components/GameView.svelte
- [X] T010 [US1] Create ResultsView component showing total problems, correct count, incorrect count, accuracy percentage, elapsed time, Play Again button, and Home button in src/apps/math-sprint/components/ResultsView.svelte
- [X] T011 [US1] Create main App.svelte with tab navigation (Play, Stats, Settings), game state routing (home/playing/results), and bottom nav bar in src/apps/math-sprint/App.svelte

**Checkpoint**: User can play a complete math sprint game with all 5 operations and both modes

---

## Phase 4: User Story 2 - Track Mastery Per Operation and Difficulty (Priority: P2)

**Goal**: SM-2 mastery tracking with color-coded indicators per operation/difficulty combo

**Independent Test**: Complete several games on different combos, check mastery levels update with color indicators (red/yellow/green/neutral)

### Implementation for User Story 2

- [X] T012 [US2] Add mastery store, loadMastery, updateMastery (accuracy to SM-2 rating mapping), getMasteryColor, and SM-2 integration using calculateSM2 from src/lib/utils/sm2.js in src/apps/math-sprint/stores/mathSprint.js
- [X] T013 [US2] Add mastery grid display to HomeView showing each operation/difficulty combo with color indicator (red/yellow/green) and "New" label for unplayed combos in src/apps/math-sprint/components/HomeView.svelte

**Checkpoint**: Mastery levels persist and display correctly with color coding

---

## Phase 5: User Story 3 - View Session History and Statistics (Priority: P3)

**Goal**: Session history list with operation, difficulty, mode, score, time, date

**Independent Test**: Complete several games, navigate to Stats view, verify session records appear sorted by most recent

### Implementation for User Story 3

- [X] T014 [US3] Add session persistence functions (loadSessions, saveSession) with IndexedDB storage and date-based sorting in src/apps/math-sprint/stores/mathSprint.js
- [X] T015 [US3] Create StatsView component with session list showing operation, difficulty, mode, correct/incorrect counts, time, and date in src/apps/math-sprint/components/StatsView.svelte
- [X] T016 [US3] Add "no sessions yet" empty state message with play prompt in src/apps/math-sprint/components/StatsView.svelte

**Checkpoint**: Session history persists and displays correctly

---

## Phase 6: User Story 4 - Configure Settings (Priority: P4)

**Goal**: Sound/vibration toggles and default mode preference

**Independent Test**: Toggle settings, play game, verify behavior matches settings

### Implementation for User Story 4

- [X] T017 [US4] Add settings store, loadSettings, saveSettings with IndexedDB persistence in src/apps/math-sprint/stores/mathSprint.js
- [X] T018 [US4] Create SettingsView component with sound toggle, vibration toggle, and default mode selector (Sprint/Timed) in src/apps/math-sprint/components/SettingsView.svelte
- [X] T019 [US4] Integrate settings into GameView - sound on correct/incorrect, vibration on answers in src/apps/math-sprint/components/GameView.svelte
- [X] T020 [US4] Apply default mode from settings to HomeView on load in src/apps/math-sprint/components/HomeView.svelte

**Checkpoint**: Settings persist and control game behavior

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and consistency improvements

- [X] T021 [P] Create PlayIcon component in src/apps/math-sprint/components/icons/PlayIcon.svelte
- [X] T022 [P] Create StatsIcon component in src/apps/math-sprint/components/icons/StatsIcon.svelte
- [X] T023 [P] Create SettingsIcon component in src/apps/math-sprint/components/icons/SettingsIcon.svelte
- [X] T024 Verify dark mode support across all components (HomeView, GameView, ResultsView, StatsView, SettingsView)
- [X] T025 Run npm run build to verify compilation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1) → US2 (P2) → US3 (P3) → US4 (P4) in priority order
  - Each story should be independently testable after completion
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Core Gameplay)**: No dependencies on other stories - MVP
- **US2 (Mastery)**: Adds to US1 HomeView, but independently testable
- **US3 (Session History)**: Uses US1 game completion, but independently testable
- **US4 (Settings)**: Integrates with US1 GameView and HomeView, but independently testable

### Parallel Opportunities

- Phase 1 tasks (T001-T004): Sequential (same file modifications)
- Phase 2 tasks (T005): Can run in parallel [P] (different file from T006-T007)
- Phase 3 tasks (T008-T009): Can run in parallel [P] (different files)
- Phase 7 icon tasks (T021-T023): Can run in parallel [P] (different files)

---

## Parallel Example: Phase 3 User Story 1

```bash
# Launch HomeView and GameView creation together (different files):
Task: "Create HomeView with selectors in src/apps/math-sprint/components/HomeView.svelte"
Task: "Create GameView with problem display in src/apps/math-sprint/components/GameView.svelte"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (DB + registration)
2. Complete Phase 2: Foundational (utils + stores)
3. Complete Phase 3: User Story 1 (core gameplay)
4. **STOP and VALIDATE**: Play a complete game with built-in operations
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → Play a game → MVP!
3. US2 → Mastery persists → Enhanced experience
4. US3 → Session history → Progress tracking
5. US4 → Settings → Personalization
6. Polish → Final touches

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 + US2 (core + mastery)
   - Developer B: US3 (session history)
   - Developer C: US4 (settings)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total tasks: 25
