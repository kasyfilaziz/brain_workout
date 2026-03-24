# Tasks: Hub View Toggle

**Input**: Design documents from `/specs/008-hub-view-toggle/`
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md, research.md

**Tests**: No test framework configured (per AGENTS.md). Manual validation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared utilities that all interactive features depend on

- [x] T001 [P] Create haptic feedback utility at src/lib/utils/haptics.js with vibrateTap(), vibrateDragStart(), vibrateDrop() functions following existing pattern from src/apps/stroop-test/utils/haptics.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer that MUST be complete before any user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Extend settings store in src/lib/stores/settings.js - add hubViewMode ('grid'|'list') and hubAppOrder (string[]) to defaultSettings, load(), save(), setHubViewMode(), setHubAppOrder()

- [x] T003 [P] Add getOrderedApps() helper to src/lib/stores/apps.js - pure function that takes (viewMode, apps, storedOrder) and returns apps sorted alphabetically for grid view or in custom order for list view

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Toggle Between Grid and List View (Priority: P1) - MVP 🎯

**Goal**: User can switch between grid and list views with view mode persisted

**Independent Test**: Toggle button switches layout immediately; refresh page shows same view

### Implementation for User Story 1

- [x] T004 [US1] Modify src/lib/components/Hub.svelte - add view toggle button with grid/list icons in header, haptic feedback on tap, async toggleView() function that calls settings.setHubViewMode()

- [x] T005 [US1] Modify src/lib/components/Hub.svelte - add $: orderedApps reactive declaration using getOrderedApps($settings.hubViewMode, $apps, $settings.hubAppOrder || null)

- [x] T006 [US1] Modify src/lib/components/Hub.svelte - add {#if $settings.hubViewMode === 'grid'} grid view with {#each orderedApps as app (app.id)} AppCard, {:else} list view placeholder div

**Checkpoint**: US1 fully functional - toggle works, preference persists

---

## Phase 4: User Story 2 - Alphabetical Sorting in Grid View (Priority: P2)

**Goal**: Apps in grid view always sorted A-Z by name regardless of custom order

**Independent Test**: Switch to grid view, verify apps are alphabetical; reorder in list, switch to grid, still alphabetical

### Implementation for User Story 2

- [x] T007 [US2] [P] Review getOrderedApps() in src/lib/stores/apps.js - verify grid mode returns [...apps].sort((a, b) => a.name.localeCompare(b.name))

**Checkpoint**: US2 verified - alphabetical sorting works in grid view

---

## Phase 5: User Story 3 - Custom Ordering in List View via Drag and Drop (Priority: P2)

**Goal**: User can drag apps to reorder in list view with persistence and keyboard accessibility

**Independent Test**: Switch to list, drag app to new position, refresh page, order preserved

### Implementation for User Story 3

- [x] T008 [US3] Create new src/lib/components/AppListItem.svelte - compact list row with drag handle icon (grip dots), app icon, name, description; props: app, index; include iconMap from AppCard for rendering app icons

- [x] T009 [US3] Add HTML5 drag-drop handlers to src/lib/components/AppListItem.svelte - draggable="true", on:dragstart, on:dragend, on:dragover, on:drop; isDragging class for opacity feedback; call reorderApps() on drop

- [x] T010 [US3] Add drop position indicator to src/lib/components/AppListItem.svelte - visual placeholder/line showing where item will be placed during dragover (e.g., a blue line above or below the item at dragOverIndex)

- [x] T011 [US3] Add touch event handlers to src/lib/components/AppListItem.svelte - on:touchstart (start long-press timer 300ms), on:touchmove, on:touchend; calculate drop index from Y coordinate; trigger haptic feedback (vibrateDragStart on start, vibrateDrop on end)

- [x] T012 [US3] Add keyboard accessibility to src/lib/components/AppListItem.svelte - tabindex="0", on:keydown handler for Enter (enter reorder mode), ArrowUp/Down (move position), Enter/Escape (confirm/cancel); visual focus ring

- [x] T013 [US3] Add reorderApps() function to src/lib/components/AppListItem.svelte - compute new order array (handle hubAppOrder being null for first reorder), call settings.setHubAppOrder(); handle both mouse drag and keyboard reorder

- [x] T014 [US3] Modify src/lib/components/Hub.svelte - replace placeholder {:else} block with {#each orderedApps as app, index (app.id)} rendering AppListItem component

**Checkpoint**: US3 fully functional - drag-drop works on desktop and mobile, keyboard accessible, order persists

---

## Phase 6: User Story 4 - Toggle Control Visual Design (Priority: P3)

**Goal**: Toggle button is visible, intuitive, and works in both dark and light themes

**Independent Test**: Observe toggle button in header area, hover feedback visible, works in dark mode

### Implementation for User Story 4

- [x] T015 [US4] Style view toggle button in src/lib/components/Hub.svelte - add Tailwind classes for hover state (bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700), rounded-xl, p-2, transition-colors

- [x] T016 [US4] Add SVG grid and list icons to toggle button in src/lib/components/Hub.svelte - use Heroicons outline style, 5x5 w/h, stroke-current

**Checkpoint**: US4 verified - toggle button visually polished and responsive

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases and final refinements

- [x] T017 [P] Add empty state handling in src/lib/components/Hub.svelte - if $apps.length === 0, show "No Apps Available" message regardless of view mode

- [x] T018 [P] Verify dark mode support - ensure toggle button, AppListItem, and grid cards work in dark: Tailwind classes per constitution requirement

- [x] T019 Run npm run build to verify project compiles without errors

- [x] T020 [P] Validate quickstart.md implementation steps match generated code

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - US1 (Phase 3) must complete before US3 (Phase 5) can fully test drag-drop
  - US2 (Phase 4) is independent after foundational
  - US4 (Phase 6) can run after US1 (Phase 3)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational - No dependencies on other stories - MVP
- **US2 (P2)**: Can start after Foundational - No dependencies on US1 (but tests US1's implementation)
- **US3 (P2)**: Can start after Foundational - Depends on US1 for AppListItem integration
- **US4 (P3)**: Can start after US1 - Depends on toggle button existing

### Within Each User Story

- Core functionality before polish
- Haptic feedback after basic interaction works
- Visual refinements last

---

## Parallel Opportunities

- **Phase 1**: T001 runs alone (no parallel - single file)
- **Phase 2**: T002 and T003 run in parallel (different files)
- **Phase 3**: T004, T005, T006 are sequential (same file)
- **Phase 4**: T007 runs alone (review task)
- **Phase 5**: T008, T009, T010, T011, T012 can be parallel (different sub-features), T013 and T014 are sequential (integration into Hub)
- **Phase 6**: T015 and T016 can be parallel (different styling aspects)
- **Phase 7**: T017, T018, T020 can be parallel (different verifications), T019 is sequential (build)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002, T003)
3. Complete Phase 3: User Story 1 (T004, T005, T006)
4. **STOP and VALIDATE**: Test toggle functionality and persistence
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 → Test independently → Deploy/Demo (MVP!)
3. Add US2 → Test independently → Deploy/Demo
4. Add US3 → Test independently → Deploy/Demo (drag-drop reordering)
5. Add US4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Haptic feedback is mandatory per Constitution Component Guidelines

---

## Task Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | T001 | Haptic utility |
| Phase 2 | T002, T003 | Settings store, apps ordering helper |
| Phase 3 | T004-T006 | US1: View toggle (MVP) |
| Phase 4 | T007 | US2: Alphabetical sorting review |
| Phase 5 | T008-T014 | US3: Drag-drop reordering |
| Phase 6 | T015-T016 | US4: Toggle visual design |
| Phase 7 | T017-T020 | Polish & validation |
| **Total** | **20 tasks** | All complete |

| User Story | Tasks | Priority | Status |
|------------|-------|----------|--------|
| US1 | T004-T006 | P1 (MVP) | Complete |
| US2 | T007 | P2 | Complete |
| US3 | T008-T014 | P2 | Complete |
| US4 | T015-T016 | P3 | Complete |

---

## Implementation Complete

**Build Status**: ✅ Passed (`npm run build`)

**Files Created**:
- `src/lib/utils/haptics.js` - Haptic feedback utility
- `src/lib/components/AppListItem.svelte` - Draggable list item component

**Files Modified**:
- `src/lib/stores/settings.js` - Added hubViewMode, hubAppOrder persistence
- `src/lib/stores/apps.js` - Added getOrderedApps() helper
- `src/lib/components/Hub.svelte` - Added view toggle, list view rendering

**Suggested Next Command**:

None - analysis complete. Implementation ready for testing/deployment.