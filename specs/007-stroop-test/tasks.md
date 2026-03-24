# Implementation Tasks: Stroop Test (Inhibitory Control)

**Feature**: Stroop Test
**Branch**: `007-stroop-test`

## Implementation Strategy
- **MVP (User Story 1)**: Core Stroop interference task, reaction time tracking, and result persistence.
- **Incremental Delivery**: Subsequent stories add baseline calibration (P2) and longitudinal analytics (P3).
- **Parallelization**: Component UI and utility logic are parallelized where possible.

## Phase 1: Setup
- [X] T001 Create module directory structure in `src/apps/stroop-test/`
- [X] T002 Register `stroop-test` in `src/lib/stores/apps.js`
- [X] T003 Implement IndexedDB migrations in `src/lib/utils/db.js` for `stroop_sessions` and `stroop_profiles`

## Phase 2: Foundational
- [X] T004 [P] Implement `src/apps/stroop-test/utils/colorEngine.js` for stimulus generation
- [X] T005 [P] Implement `src/apps/stroop-test/utils/metrics.js` for RT and IG calculation
- [X] T006 Implement `src/apps/stroop-test/stores/session.js` for state management

## Phase 3: [US1] Basic Stroop Assessment (Priority: P1)
- [X] T007 [P] [US1] Implement `src/apps/stroop-test/components/StimulusDisplay.svelte`
- [X] T008 [P] [US1] Implement `src/apps/stroop-test/components/ControlPanel.svelte` with 100ms debounce
- [X] T009 [US1] Integrate store and components in `src/apps/stroop-test/App.svelte`

## Phase 4: [US2] Baseline Processing (Priority: P2)
- [X] T010 [P] [US2] Update `src/apps/stroop-test/stores/session.js` to handle mode switching (W/C/CW)
- [X] T011 [US2] Update `src/apps/stroop-test/App.svelte` to implement baseline mode selection

## Phase 5: [US3] Progress & Analytics (Priority: P3)
- [X] T012 [P] [US3] Implement `src/apps/stroop-test/components/ResultSummary.svelte`
- [X] T013 [US3] Update `src/apps/stroop-test/stores/session.js` to save session history to IndexedDB

## Phase 6: Polish
- [X] T014 Implement high-contrast color palette settings in `src/apps/stroop-test/stores/settings.js`
- [X] T015 PWA verification: Chrome Desktop (Lighthouse >90), Chrome Android, Safari iOS. Verify service worker, manifest, and offline functionality.

## Phase 7: Post-Implementation Enhancements (Tech Debt)
- [X] T016 [P] [FR-005] Implement haptic feedback utility in `src/apps/stroop-test/utils/haptics.js`
- [X] T017 [P] [FR-005] Integrate haptic feedback into session response flow in `App.svelte`
- [X] T018 [FR-007] Add Timed mode support with timer interval in `src/apps/stroop-test/stores/session.js`
- [X] T019 [FR-007] Add Timed/Fixed mode selection UI in `src/apps/stroop-test/App.svelte`
