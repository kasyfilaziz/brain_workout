# Task Breakdown: Sequence Recall (N-Back)

**Feature**: 006-sequence-recall | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)
**Total Tasks**: 48 | **User Stories**: 5

## Phase 1: Setup

### Goal: Create app skeleton and register with Hub

- [ ] T001 Create directory structure `src/apps/sequence-recall/` with components/, stores/, utils/ subdirectories

- [ ] T002 [P] Create `src/apps/sequence-recall/index.js` with app definition: id='sequence-recall', name='Sequence Recall', version='1.0.0', componentLoader pointing to App.svelte

- [ ] T003 [P] Create `src/apps/sequence-recall/App.svelte` root component with routing to HomeView, GameView, ResultsView, StatsView based on gameState status

- [ ] T004 Verify app appears in Hub navigation by checking apps store loads sequence-recall

- [ ] T005 [P] Create `src/apps/sequence-recall/utils/db.js` with IndexedDB operations:
  - initDB() creating sequence_recall_sessions and sequence_recall_settings stores
  - Sessions store with auto-increment id, indexes on date, nLevel, taskType
  - Settings store with key='user_settings'
  - CRUD functions: saveSession, getSessions, getSession, updateSettings, getSettings
  - **IMPORTANT**: Check existing DB version in upgrade callback, do not reset existing stores

- [ ] T006 [P] Create `src/apps/sequence-recall/utils/nback.js` with core N-back logic:
  - generateStimulusSequence(nLevel, taskType, gridSize, totalRounds, matchProbability)
  - For position-only: generates position stimuli only
  - For sound-only: generates sound stimuli only (position is null)
  - For dual: generates both position and sound together
  - checkMatch(roundIndex, nLevel, sequence, response, stream) returning {isMatch, correct, type}
  - parseGridSize(gridSize) returning position count (4, 9, or 16)

- [ ] T007 [P] Create `src/apps/sequence-recall/utils/dprime.js` with d' calculation:
  - calculateDPrime(hits, misses, falseAlarms, correctRejections)
  - calculateSoundDPrime(soundHits, soundMisses, soundFalseAlarms, soundCorrectRejections)
  - Standard normal CDF approximation
  - Returns clamped d' score in range [-4, 4]

- [ ] T008 [P] Create `src/apps/sequence-recall/utils/audio.js` with audio utilities:
  - TONE_LETTERS array ['A','B','C','D','E','F','G','H']
  - generateRandomSound() returning random letter
  - playSound(letter) using Web Speech API
  - checkAudioAvailable() returning boolean

- [ ] T009 [P] Create `src/apps/sequence-recall/stores/gameState.js` with Svelte writable store:
  - State: status (IDLE|RUNNING|PAUSED|COMPLETED|ABANDONED), nLevel, taskType, gridSize, rounds, currentRound, sequence, stimulusBuffer, responses, startTime, stimulusStartTime, reactionTimes[]
  - Methods: startSession(config), nextRound(), recordResponse(response, reactionTimeMs), complete(), pause(), resume(), abandon(), reset()
  - Track stimulusStartTime when showing stimulus, calculate reactionTimeMs on response

- [ ] T010 [P] Create `src/apps/sequence-recall/stores/settings.js` extending shared settings:
  - Load/save from IndexedDB sequence_recall_settings
  - Fields: defaultLevel (1), defaultTaskType ('position'), defaultGridSize ('3x3'), defaultRounds (20), soundEnabled, vibrationEnabled, roundTimeLimit (3000)

- [ ] T011 [P] Implement session data validation:
  - validateSession(session) checking: hits+misses+falseAlarms+correctRejections === rounds
  - For sound/dual: also validate sound metrics
  - Returns {valid: boolean, errors: string[]}

## Phase 2: Tutorial & First-Launch Detection (Moved Earlier)

### Goal: Handle first-time user onboarding before main app flow

**Note**: Tutorial detection moved earlier because first-launch UX depends on this.

- [ ] T018 [US6] Create `src/apps/sequence-recall/components/Tutorial.svelte`:
  - Animated 1-back example showing match detection
  - Step-by-step explanation of N-back concept
  - Practice round (optional, uses 1-back only)
  - "Got it" button to dismiss and mark tutorial seen

- [ ] T019 [US6] Implement first-launch detection:
  - Check if any sessions exist in IndexedDB (getSessions().then(s => s.length > 0))
  - If no sessions: show Tutorial before HomeView
  - If sessions exist: skip to HomeView
  - Store tutorialSeen flag in settings after first viewing

- [ ] T020 [US6] Integrate tutorial with app routing:
  - App.svelte checks tutorialSeen on mount
  - If first launch: route to Tutorial first
  - After tutorial dismissed: route to HomeView
  - "Learn More" button on HomeView for returning users to access tutorial

## Phase 3: User Story 1 - Single N-Back Training Session

### Goal: Core N-back training with position stimuli (includes sound-only mode)

**Independent Test**: Start session at 2-back, complete 20 rounds, verify d' score displays

- [ ] T021 [US1] [P] Create `src/apps/sequence-recall/components/Grid.svelte`:
  - Props: gridSize ('2x2'|'3x3'|'4x4'), activePosition
  - Renders responsive grid with highlighted active cell
  - Emits position on tap
  - Hidden/collapsed when taskType is 'sound-only'

- [ ] T022 [US1] [P] Create `src/apps/sequence-recall/components/StimulusDisplay.svelte`:
  - For position-only: shows position highlight with countdown timer
  - For sound-only: shows audio icon/visual with countdown timer, plays tone letter
  - For dual: shows both position AND plays sound simultaneously
  - Handles timeout by auto-advancing

- [ ] T023 [US1] [P] Create `src/apps/sequence-recall/components/MatchButtons.svelte`:
  - Position mode: single "Match"/"No Match" button pair
  - Sound mode: single "Match"/"No Match" button pair (responding to sound)
  - Dual mode: two independent button pairs (Position Match/No Match, Sound Match/No Match)
  - Haptic feedback on tap (if enabled)
  - Visual feedback on press

- [ ] T024 [US1] Create `src/apps/sequence-recall/components/HomeView.svelte`:
  - Start button with level selector (1-back to 5-back)
  - Task type selector (Position, Sound, Dual)
  - Grid size selector (2x2, 3x3, 4x4) - disabled when Sound mode selected
  - Quick start using saved settings
  - Link to Tutorial
  - Link to Statistics

- [ ] T025 [US1] Create `src/apps/sequence-recall/components/GameView.svelte`:
  - Integrates Grid (or sound indicator), StimulusDisplay, MatchButtons
  - Manages game loop: show stimulus → wait for response → record → next round
  - Tracks reactionTimeMs per round (stimulusStartTime to responseTime)
  - Shows current round number and total (e.g., "Round 5/20")
  - Pause button in header
  - Abandon session option

- [ ] T026 [US1] Create `src/apps/sequence-recall/components/ResultsView.svelte`:
  - Displays d' score prominently
  - Shows HIT/MISS/FA/CR breakdown
  - Accuracy percentage
  - Average reaction time display
  - Level up/down suggestion based on accuracy (>80% up, <50% down)
  - "Play Again" and "Home" buttons

- [ ] T027 [US1] Integrate gameState with db.js:
  - On session complete: saveSession() to IndexedDB with avgReactionTimeMs
  - Calculate avgReactionTimeMs from reactionTimes array
  - On app load: restore incomplete sessions if any
  - Mark abandoned sessions with completed: false

- [ ] T028 [US1] Implement 3-second timeout:
  - If no response within 3000ms, record as MISS with reactionTimeMs = 3000
  - Auto-advance to next round

## Phase 4: User Story 2 - Dual N-Back Training Session

### Goal: Simultaneous position + sound tracking

**Independent Test**: Start dual session, verify both streams tracked independently

**Note**: Most dual-task functionality is already covered in Phase 3 (Sound and Dual modes). This phase handles additional dual-specific features.

- [X] T029 [US2] Update GameView for dual mode:
  - Collect position and sound responses independently
  - Update gameState to track both streams separately
  - Calculate combined d' score at session end

- [X] T030 [US2] Update ResultsView for dual mode:
  - Show separate HIT/MISS/FA/CR for position and sound streams
  - Show separate d' scores for position and sound
  - Show combined/overall d' score

## Phase 5: User Story 3 - Adaptive Difficulty Progression

### Goal: Auto-suggest level adjustments based on performance

**Independent Test**: Complete session with >80% accuracy, verify "Level Up!" shown

**Note**: Level suggestions are already part of ResultsView in Phase 3 (T026).

- [X] T031 [US3] Enhance ResultsView level suggestions:
  - For dual mode: use combined accuracy or position accuracy for suggestion
  - "Try Sound only" suggestion if user is doing well on dual but sound is weak
  - Store suggested level in session result for analytics

- [X] T032 [US3] Add achievement indicators:
  - "Perfect Score!" when 100% accuracy achieved
  - Special celebration animation
  - Auto-suggest level up

## Phase 6: User Story 4 - Progress Tracking and Statistics

### Goal: Historical session data and personal bests

**Independent Test**: Complete 2+ sessions, verify StatsView shows trend chart

- [X] T033 [US4] [P] Create `src/apps/sequence-recall/components/StatsView.svelte`:
  - Personal bests section: best d' per level and task type combination
  - Historical trend chart (d' over time) using SVG
  - Total sessions count
  - Total training time (sum of all session durations)
  - Average reaction time across all sessions

- [X] T034 [US4] [P] Implement personal best computation:
  - Query sessions by level and taskType where completed = true
  - Find session with highest d' score
  - Display with date achieved (using date field)

- [X] T035 [US4] Implement trend chart:
  - Query last 30 sessions ordered by date where completed = true
  - Plot d' scores on simple SVG line chart
  - X-axis: session date, Y-axis: d' score
  - No external chart library

- [X] T036 [US4] Handle empty state:
  - If no sessions completed: show "Complete your first session to see progress"
  - Show encouraging message to start first session

## Phase 7: User Story 5 - Custom Session Configuration

### Goal: Persistent user preferences for session setup

**Independent Test**: Change settings, restart app, verify defaults restored

**Note**: HomeView already includes level/task/grid selectors from Phase 3.

- [X] T037 [US5] [P] Update `src/apps/sequence-recall/stores/settings.js`:
  - saveSettings() persists to IndexedDB
  - loadSettings() restores on app load
  - Default values on first launch
  - Validate settings before saving

- [X] T038 [US5] [P] Create `src/apps/sequence-recall/components/SettingsView.svelte` (modal or inline panel):
  - Default N-level (1-5) dropdown
  - Default task type (Position, Sound, Dual) dropdown
  - Default grid size (2x2, 3x3, 4x4) dropdown (hidden when Sound mode)
  - Default rounds (10-50) input
  - Sound enabled toggle
  - Vibration enabled toggle
  - Save button

- [X] T039 [US5] Integrate settings with HomeView:
  - Quick start uses saved defaults
  - Settings changes save immediately on toggle change
  - "Reset to Defaults" option

## Phase 8: Sound-Only Mode Enhancements

### Goal: Complete sound-only mode with audio feedback

**Note**: Sound-only mode is partially implemented in Phase 3. This phase adds audio-specific polish.

- [X] T040 [P] Implement audio playback fallback:
  - Detect if speechSynthesis is unavailable
  - Show visual notification "Audio not available, continuing without sound"
  - Allow session to continue in visual-only mode

- [X] T041 [P] Add sound-only visual indicator:
  - When in sound-only mode, show animated speaker/audio icon
  - Display current tone letter visually as text (e.g., "Was that the SAME letter as 2 ago?")
  - No grid shown in sound-only mode

## Final Phase: Polish & Cross-Cutting Concerns

### Goal: Ensure quality, consistency, and edge case handling

- [X] T042 [P] Implement app lifecycle:
  - Handle app visibility change (pause when backgrounded)
  - Resume session on return
  - Save partial session state to IndexedDB

- [X] T043 [P] Haptic feedback integration:
  - Use Vibration API on response recording
  - Respects soundEnabled/vibrationEnabled settings

- [X] T044 [P] Edge case: Abandoned sessions:
  - If session is abandoned (user exits mid-session), mark as completed: false
  - On app resume, detect incomplete sessions
  - Prompt user: "Continue previous session?" or "Start fresh"
  - Clean up very old abandoned sessions (>7 days) on app start

- [X] T045 [P] Verify offline functionality:
  - Test app works without network after initial load
  - Service worker caches all assets
  - All IndexedDB operations work offline

- [X] T046 [P] Dark mode styling:
  - Apply dark: classes to all components
  - Use shared theme store
  - Test all views in dark mode

- [X] T047 [P] Accessibility basics:
  - Semantic HTML buttons
  - Focus states
  - Sufficient color contrast
  - Touch targets minimum 44x44px

- [X] T048 [P] Final build verification:
  - Run `npm run build`
  - Verify no console errors
  - PWA manifest correct
  - Test on mobile device if possible

## Post-Review Bug Fixes

### Fixed Issues (from code review):
- **saveIncompleteSession()**: Now recalculates d' from tallied responses instead of using stale state values
- **Dual suggestion logic**: Now triggers "down" when either position or sound accuracy < 50%
- **audioWarningShown**: Now resets to false each time a new stimulus is shown

## Dependency Graph

```
Phase 1 (Setup + Foundational)
    │
    ├── T001-T004: App skeleton
    └── T005-T017: Core utils, stores, validation
    │
    ▼
Phase 2 (Tutorial - Early)
    │
    └── T018-T020: Tutorial and first-launch detection
    │
    ▼
Phase 3 (US1: Single N-Back)
    │
    └── T021-T028: Position + Sound modes
    │
    ├───────────────────────────────────────┐
    ▼                                       ▼
Phase 4 (US2: Dual N-Back)        Phase 5 (US3: Adaptive)
    └── T029-T030                         └── T031-T032
    │
    ├───────────────────────────────────────┐
    ▼                                       ▼
Phase 6 (US4: Statistics)           Phase 7 (US5: Config)
    └── T033-T036                         └── T037-T039
    │
    ▼
Phase 8 (Sound-Only Enhancements)
    └── T040-T041
    │
    ▼
Final Phase (Polish)
    └── T042-T048
```

## Parallel Execution Examples

**Parallel Set 1 (Different files, Phase 1)**:
- T002, T003: index.js and App.svelte
- T005, T006, T007, T008, T009, T010, T011: All foundational utils/stores/validation

**Parallel Set 2 (UI Components, Phase 3)**:
- T021, T022, T023: Grid, StimulusDisplay, MatchButtons

**Sequential (Dependent)**:
- T004 after T002 (verify registration)
- T017 (validation) before T027 (session save uses validation)
- T027 after T005 (save session needs db)
- T028 after T021-T023 (game view needs components)
- T029 after T021-T023 (dual game needs components from Phase 3)
- T030 after T029 (results need dual data)
- T031 after T027 (needs results data)
- T036 after T033-T035 (empty state needs stats)
- T039 after T037-T038 (home uses settings)
- T048 after all previous (final verification)

## MVP Scope

**Recommended MVP: Phase 3 (User Story 1) only**

Single N-Back Training Session with:
- Position-only stimuli (1-back to 5-back)
- 3x3 grid (fixed initially)
- 20 rounds per session
- 3-second response window
- d' score display
- Basic results view

This delivers a complete, usable brain workout app. Subsequent phases add:
- Configurable grid sizes
- Sound/dual task modes
- Statistics
- Settings
- Tutorial

## Task Summary

| Phase | Description | Tasks |
|-------|-------------|-------|
| Phase 1 | Setup + Foundational | 11 (T001-T011) |
| Phase 2 | Tutorial (Early) | 3 (T018-T020) |
| Phase 3 | US1: Single N-Back | 8 (T021-T028) |
| Phase 4 | US2: Dual N-Back | 2 (T029-T030) |
| Phase 5 | US3: Adaptive | 2 (T031-T032) |
| Phase 6 | US4: Statistics | 4 (T033-T036) |
| Phase 7 | US5: Configuration | 3 (T037-T039) |
| Phase 8 | Sound-Only Enhancements | 2 (T040-T041) |
| Final | Polish | 7 (T042-T048) |
| **Total** | | **48** |

**Note**: Task numbers are sequential across all phases. Gaps in numbering (T012-T017, T014-T017) indicate phases that were restructured during review.
