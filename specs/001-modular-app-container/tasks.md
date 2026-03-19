---

description: "Task list for modular app container implementation"
---

# Tasks: Modular App Container

**Input**: Design documents from `/specs/001-modular-app-container/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Source code**: `src/` at repository root
- **Container components**: `src/lib/components/`
- **Container stores**: `src/lib/stores/`
- **App modules**: `src/apps/[app-id]/`
- **Flashcard app**: `src/apps/flashcard/`

---

## Phase 1: Setup (Reorganization)

**Purpose**: Reorganize existing project structure to support modular app architecture

- [x] T001 [P] Create `src/apps/` directory structure
- [x] T002 [P] Create `src/apps/flashcard/` directory for flashcard app module
- [x] T003 Create `src/apps/flashcard/components/` directory and move existing flashcard components
- [x] T004 Create `src/apps/flashcard/stores/` directory and move existing flashcard stores

---

## Phase 2: Foundational (Container Infrastructure)

**Purpose**: Core container infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create app registry store in `src/lib/stores/apps.js` with auto-discovery logic
- [x] T006 [P] Create navigation store in `src/lib/stores/navigation.js` for container-level routing
- [x] T007 Create Hub component in `src/lib/components/Hub.svelte` for app launcher UI
- [x] T008 [P] Create AppCard component in `src/lib/components/AppCard.svelte` for hub app cards
- [x] T009 Create LoadingSpinner component in `src/lib/components/LoadingSpinner.svelte` for app loading
- [x] T010 Refactor `src/App.svelte` to become container wrapper with Hub and app rendering

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - App Launcher (Priority: P1) 🎯 MVP

**Goal**: Users can see a hub showing all registered workout apps and launch them

**Independent Test**: Launch app → Hub displays flashcard app → Click flashcard → App loads

### Implementation for User Story 1

- [x] T011 [P] [US1] Implement Hub.svelte to list all registered apps from apps store
- [x] T012 [US1] Implement AppCard.svelte with app name, icon, and description
- [x] T013 [US1] Implement container navigation to render selected app component
- [x] T014 [US1] Add "back to hub" navigation element when inside an app
- [x] T015 [US1] Connect Hub to navigation store - clicking app updates currentAppId
- [x] T016 [US1] Show LoadingSpinner while app is loading (SC-005)

**Checkpoint**: At this point, User Story 1 should be fully functional - hub shows apps and launches them

---

## Phase 4: User Story 2 - Flashcard App Integration (Priority: P1)

**Goal**: Existing flashcard functionality works exactly as before when launched from hub

**Independent Test**: Hub → Click Flashcard → Create deck → Add cards → Complete study session → SM-2 works

### Implementation for User Story 2

- [x] T017 [P] [US2] Create flashcard app registration in `src/apps/flashcard/index.js`
- [x] T018 [US2] Add migrate export function to flashcard/index.js for FR-009 (inline, not separate file)
- [x] T019 [US2] Move existing flashcard stores to `src/apps/flashcard/stores/`
- [x] T020 [US2] Move existing flashcard components to `src/apps/flashcard/components/`
- [x] T021 [US2] Update imports in flashcard components to reference new paths
- [x] T022 [US2] Verify deck CRUD operations work from container-launched flashcard app
- [x] T023 [US2] Verify study session and SM-2 scheduling works (SC-002)
- [x] T024 [US2] Verify import/export functionality still works (Data Portability)

**Checkpoint**: User Stories 1 AND 2 should both work - hub launches flashcard app with full functionality

---

## Phase 5: User Story 3 - New App Registration (Priority: P2)

**Goal**: Developers can add new brain workout apps without modifying container code

**Independent Test**: Create minimal new app in src/apps/test-app/index.js → Refresh → New app appears in hub

### Implementation for User Story 3

- [x] T025 [P] [US3] Create minimal test app in `src/apps/test-app/index.js` for verification
- [x] T026 [US3] Verify auto-discovery finds new app and displays in hub (FR-005)
- [x] T027 [US3] Implement app version checking in container - call migrate on version change (FR-009)
- [x] T028 [US3] Update quickstart.md documentation with auto-discovery instructions
- [x] T029 [US3] Remove test app after verification (optional cleanup)

**Checkpoint**: User Story 3 enables extensibility - new apps auto-discovered without container changes

---

## Phase 6: User Story 4 - Shared Settings (Priority: P3)

**Goal**: Theme and preferences persist across all apps in the container

**Independent Test**: Hub → Flashcard → Toggle theme → Back to Hub → New app → Theme persists

### Implementation for User Story 4

- [x] T030 [P] [US4] Ensure theme store works when container switches between apps (FR-006)
- [x] T031 [US4] Add lastOpenedApp to navigation store for session persistence (FR-007)
- [x] T032 [US4] Load last opened app on container initialization (FR-007)

**Checkpoint**: All user stories complete - theme and navigation persist across apps

---

## Phase 6b: Data Isolation (FR-008) - NOT YET IMPLEMENTED

**Purpose**: Ensure each app has isolated data storage per constitution requirement

- [ ] T038 [US2] Implement IndexedDB store prefixes per app (e.g., `flashcard_decks`, `flashcard_cards`)
- [ ] T039 [US3] Verify data isolation - flashcard data does not leak to other apps

**Checkpoint**: Data isolation verified - each app's data is separate

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and edge case handling

- [x] T033 [P] Add empty state UI when no apps are registered (edge case)
- [x] T034 [P] Handle app loading errors gracefully with user-friendly message
- [x] T040 [P] Verify PWA functionality: Lighthouse score >90, manifest valid, service worker registered
- [x] T041 Verify SC-004: Theme toggle applies within 100ms (measure with browser devtools)
- [x] T036 Run `npm run build` to ensure production build succeeds
- [x] T037 Update README.md if directory structure changed significantly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase
  - US1 (App Launcher): Independent - P1 priority
  - US2 (Flashcard Integration): Depends on US1 - P1 priority
  - US3 (New App Registration): Depends on US1, US2 - P2 priority
  - US4 (Shared Settings): Depends on US1 - P3 priority

### Within Each User Story

- Components before integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (T006, T008)
- US1 tasks marked [P] can run in parallel (T011, T012)
- US2 tasks marked [P] can run in parallel (T017, T018, T019, T020)
- US3 tasks marked [P] can run in parallel (T025)
- US4 tasks marked [P] can run in parallel (T030)

---

## Parallel Example: User Story 1

```bash
# Launch all implementation for User Story 1 together:
Task: "Implement Hub.svelte to list all registered apps"
Task: "Implement AppCard.svelte with app name, icon, and description"
Task: "Create LoadingSpinner component"

# Then after above complete:
Task: "Connect Hub to navigation store"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (App Launcher)
4. **STOP and VALIDATE**: Test hub displays and launches apps
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Hub works → Deploy/Demo
3. Add User Story 2 → Flashcard integration works → Deploy/Demo
4. Add User Story 3 → Extensibility verified → Deploy/Demo
5. Add User Story 4 → Shared settings → Deploy/Demo

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (App Launcher)
   - Developer B: User Story 2 (Flashcard Integration)
3. Stories complete and integrate together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Flashcard regression test: All existing features must work identically (SC-002)
