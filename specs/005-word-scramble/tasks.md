# Tasks: Word Scramble

**Input**: Design documents from `/specs/005-word-scramble/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create directory structure `src/apps/word-scramble/` with subdirectories `components/`, `stores/`, `utils/`
- [X] T002 [P] Add `wordScramble: 'word_scramble_'` to APP_PREFIXES in `src/lib/utils/db.js`
- [X] T003 [P] Add IndexedDB migration for version 7 in `src/lib/utils/db.js` (customLists, progress, sessions, dailyChallenges, settings stores)
- [X] T004 Create app registration in `src/apps/word-scramble/index.js` with id, name, icon, description, version, componentLoader

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Create `src/apps/word-scramble/utils/wordBank.js` with 1000+ words across 7 categories (Animals, Food, Countries, Sports, Technology, Nature, Common)
- [X] T006 [P] Create `src/apps/word-scramble/utils/scramble.js` with Fisher-Yates shuffle algorithm and validation
- [X] T007 [P] Create `src/apps/word-scramble/stores/wordScramble.js` with Svelte stores (customLists, currentSession, dailyChallenge) and CRUD functions
- [X] T008 [P] Create `src/apps/word-scramble/App.svelte` shell with basic structure and theme integration
- [X] T009 Create `src/apps/word-scramble/components/LetterTile.svelte` reusable letter display component

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Zen Mode (Priority: P1) 🎯 MVP

**Goal**: Users can practice unscrambling words at their own pace without time pressure

**Independent Test**: Launch app, select Zen Mode, select category, unscramble 5 words, verify completion message with stats

- [X] T010 [P] [US1] Create `src/apps/word-scramble/components/HomeView.svelte` with category selector and Zen mode button
- [X] T011 [P] [US1] Create `src/apps/word-scramble/components/GameView.svelte` with letter tiles display and keyboard input
- [X] T012 [US1] Implement answer validation logic in GameView (correct/incorrect detection)
- [X] T013 [US1] Implement shuffle button (free reshuffle of letters) in GameView
- [X] T014 [US1] Implement hint button (reveals 1 letter, 50% score penalty) in GameView
- [X] T015 [US1] Implement skip button (counts as incorrect in stats) in GameView
- [X] T016 [US1] Create `src/apps/word-scramble/components/ResultsView.svelte` with session stats display
- [X] T017 [US1] Wire up session recording to IndexedDB via wordScramble store

**Checkpoint**: Zen Mode fully functional and testable independently

---

## Phase 4: User Story 2 - Blitz Mode (Priority: P1)

**Goal**: Users can race against the clock in a 60-second sprint

**Independent Test**: Select Blitz mode, complete 60-second session, verify score calculation and results

- [X] T018 [P] [US2] Add timer functionality to GameView (60-second countdown)
- [X] T019 [US2] Implement score calculation: 100 points per correct word, 50% per hint used
- [X] T020 [US2] Add timer expiry handling (end session when time runs out)
- [X] T021 [US2] Add visual timer urgency indication (last 10 seconds styling)

**Checkpoint**: Blitz Mode fully functional and testable

---

## Phase 5: User Story 3 - Mastery Mode (Priority: P2)

**Goal**: Game prioritizes difficult words using SM-2 spaced repetition

**Independent Test**: Complete multiple Mastery sessions, verify difficult words appear more frequently

- [X] T022 [P] [US3] Integrate SM-2 algorithm from `src/lib/utils/sm2.js` in wordScramble store
- [X] T023 [US3] Implement SM-2 rating mapping: correct(no hint)=4, correct(hint)=2, incorrect=1
- [X] T024 [US3] Implement word prioritization: incorrect words 3x frequency, hint-correct 2x, mastered 50% frequency
- [X] T025 [US3] Add "due words" query to wordScramble store using nextReview index

**Checkpoint**: Mastery Mode fully functional with SM-2 scheduling

---

## Phase 6: User Story 4 - Daily Challenge (Priority: P2)

**Goal**: Users get a deterministic daily word challenge

**Independent Test**: Complete daily challenge on two different days, verify different words appear

- [X] T026 [P] [US4] Implement date-based seed function for deterministic word selection
- [X] T027 [US4] Add Daily Challenge UI in HomeView with completion status display
- [X] T028 [US4] Implement daily challenge persistence in IndexedDB (date, word, completed, score)
- [X] T029 [US4] Add "next challenge countdown" display when already completed today

**Checkpoint**: Daily Challenge fully functional

---

## Phase 7: User Story 5 - Custom Word Lists (Priority: P2)

**Goal**: Users can create, edit, and delete custom word lists

**Independent Test**: Create custom list with 5 words, select it, unscramble those exact words

- [X] T030 [P] [US5] Create `src/apps/word-scramble/components/ListEditor.svelte` with name input and word textarea
- [X] T031 [US5] Implement bulk paste parsing (comma/newline separated words) with validation
- [X] T032 [US5] Implement individual word add/remove in ListEditor
- [X] T033 [US5] Implement custom list CRUD operations in wordScramble store
- [X] T034 [US5] Add validation: reject words < 4 chars, strip non-alphabetic, remove duplicates
- [X] T035 [US5] Add custom list selection to HomeView

**Checkpoint**: Custom Word Lists fully functional

---

## Phase 8: User Story 6 - Track Progress and Statistics (Priority: P3)

**Goal**: Users can view their learning progress and statistics

**Independent Test**: Complete several sessions, verify Statistics screen shows accurate data

- [X] T036 [P] [US6] Create `src/apps/word-scramble/components/StatsView.svelte` with lifetime stats display
- [X] T037 [US6] Implement stats aggregation: total words practiced, accuracy %, current streak
- [X] T038 [US6] Implement streak tracking (consecutive days with completed sessions)
- [X] T039 [US6] Add mastery levels breakdown (New, Learning, Mastered words)

**Checkpoint**: Statistics fully functional and accurate

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T040 [P] Add dark mode support using shared `src/lib/stores/theme.js`
- [X] T041 [P] Add haptic feedback on correct answers and button presses using navigator.vibrate
- [X] T042 Add letter tile shuffle animation using Svelte transitions
- [X] T043 Add results celebration animation for high scores
- [X] T044 Verify offline functionality (service worker already handled by PWA plugin)
- [X] T045 Verify PWA installability (manifest already configured)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Setup completion - BLOCKS all user stories
- **Phase 3-8 (User Stories)**: All depend on Foundational phase completion
  - US1, US2, US3 can proceed in parallel after foundational
  - US4, US5, US6, US7 can proceed in parallel after foundational
- **Phase 9 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Zen Mode)**: Foundational only - no dependencies on other stories - **MVP**
- **US2 (Blitz Mode)**: Foundational only - no dependencies on other stories
- **US3 (Mastery Mode)**: Foundational + SM-2 integration
- **US4 (Daily Challenge)**: Foundational + date seed function
- **US5 (Custom Lists)**: Foundational + ListEditor component
- **US6 (Statistics)**: Foundational + session recording

### Within Each User Story

- Setup tasks marked [P] can run in parallel
- Models/stores before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T001, T002, T003, T004 can run in parallel (Setup)
- T005, T006, T007, T008, T009 can run in parallel (Foundational)
- US1 tasks (T010-T017) should run sequentially within the story
- US2, US3, US4, US5 can all start after Phase 2 in parallel

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 45 |
| MVP Tasks (US1) | 8 |
| Parallel Tasks | 14 |

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | 4 | Setup |
| Phase 2 | 5 | Foundational |
| Phase 3 | 8 | US1: Zen Mode (MVP) |
| Phase 4 | 4 | US2: Blitz Mode |
| Phase 5 | 4 | US3: Mastery Mode |
| Phase 6 | 4 | US4: Daily Challenge |
| Phase 7 | 6 | US5: Custom Lists |
| Phase 8 | 4 | US6: Statistics |
| Phase 9 | 6 | Polish |

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Zen Mode)
4. **STOP and VALIDATE**: Test Zen Mode independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Continue with remaining stories

---

## Notes

- [P] tasks = different files, no dependencies
- [US1], [US2], etc. = User story assignment for traceability
- Each user story should be independently completable and testable
- Commit after each logical phase completion
- Stop at any checkpoint to validate story independently
