# Implementation Plan: Hub View Toggle

**Branch**: `008-hub-view-toggle` | **Date**: 2026-03-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-hub-view-toggle/spec.md`

## Summary

Implement a view toggle for the Hub home screen that allows users to switch between grid and list layouts. Grid view displays apps alphabetically by name. List view supports drag-and-drop reordering (mouse + keyboard) with persistent custom order. Both view mode and custom order are persisted in IndexedDB.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Svelte 4.x  
**Primary Dependencies**: Svelte 4.2.x, TailwindCSS 3.4.x, idb 8.x, vite-plugin-pwa 0.21.x  
**Storage**: IndexedDB (via idb library)  
**Testing**: No test framework currently configured (per AGENTS.md)  
**Target Platform**: PWA (mobile + desktop browsers), offline-capable  
**Project Type**: Modular web application (brain workout platform)  
**Performance Goals**: Drag-drop visual update <500ms, instant view toggle  
**Constraints**: Client-side only, static deployment, PWA installability, mobile-first responsive  
**Scale/Scope**: 7 current apps, single user per device

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Local-First Data Architecture | ✅ PASS | Hub settings stored in IndexedDB (same pattern as existing settings store) |
| II. Static Deployment Only | ✅ PASS | No server-side processing required |
| III. Progressive Web App (PWA) | ✅ PASS | No impact on PWA functionality |
| IV. Extensible Brain Workout Platform | ✅ PASS | Feature applies to Hub container only, doesn't modify app module contracts |
| V. Data Portability | ✅ PASS | View preferences are usage statistics (not user-generated content), not subject to export requirement |

**Technology Constraints Verification**:
- ✅ Svelte 4.x: Component updates use Svelte reactivity
- ✅ IndexedDB via idb: Settings stored in existing `settings` store
- ✅ TailwindCSS: Styling via existing Tailwind classes
- ✅ Vite 4.x: No build changes needed
- ✅ No External APIs: All client-side

## Project Structure

### Documentation (this feature)

```text
specs/008-hub-view-toggle/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Requirements checklist
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── components/
│   │   ├── Hub.svelte           # MODIFY: Add view toggle, conditional rendering
│   │   ├── AppCard.svelte       # EXISTING: Used in grid view (no changes)
│   │   └── AppListItem.svelte   # NEW: Compact list row with drag handle
│   ├── stores/
│   │   ├── settings.js          # MODIFY: Add hubViewMode, hubAppOrder keys
│   │   └── apps.js              # MODIFY: Add getOrderedApps() helper
│   └── utils/
│       └── (no changes needed)
└── apps/
    └── (no changes - Hub is platform-level)
```

**Structure Decision**: Single project structure. Hub is a platform-level feature in `src/lib/`. Only modifications to existing stores (`settings.js`, `apps.js`) and components (`Hub.svelte`), plus one new component (`AppListItem.svelte`).

## Complexity Tracking

> **No violations** - Feature follows all constitution principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Implementation Considerations

### Haptic Feedback (Constitution Requirement)

Per Constitution Component Guidelines: "All interactive elements MUST have haptic feedback on mobile devices."

**Required haptic implementations:**
- View toggle button tap → short vibration (50ms)
- Drag start (list item picked up) → short vibration (50ms)
- Drop confirmation (item placed) → success vibration pattern

**Implementation**: Create shared haptic utility at `src/lib/utils/haptics.js` (follows pattern from stroop-test app).

### Touch/Mobile Drag Support

HTML5 Drag API doesn't work on mobile touch devices. Need additional touch event handlers:

**Desktop**: `dragstart`, `dragend`, `dragover`, `drop`
**Mobile**: `touchstart`, `touchmove`, `touchend` + position calculation

**Implementation approach**:
- Use touch events for mobile, detect device capability
- Calculate drop position based on touch Y coordinate
- Long-press to initiate drag on mobile (300ms threshold)

### Empty State Handling

If `$apps.length === 0`, show existing "No Apps Available" message regardless of view mode.

### Store Communication Pattern

`Hub.svelte` will compute ordered apps directly:
```javascript
$: orderedApps = getOrderedApps($settings.hubViewMode, $apps, $settings.hubAppOrder || null);
```

No changes to `apps.js` store needed - ordering logic is a pure function imported by Hub.

---

## Phase 0: Research

**Status**: Complete (see research.md)

No external dependencies or unknowns. Pattern is well-established:
- Settings persistence: Follow existing `settings.js` pattern
- Drag-and-drop: Native HTML5 Drag API (no library needed for simple reordering)
- Keyboard ordering: Standard focus + arrow key pattern

---

## Phase 1: Design & Contracts

### Data Model

**ViewPreference** (stored in IndexedDB `settings` store):
```text
hubViewMode: 'grid' | 'list'     // Current view preference
hubAppOrder: string[]            // Ordered array of app IDs (for list view)
```

See `data-model.md` for full entity definitions.

### Component Contracts

**Hub.svelte** (modified):
- Input: `$settings.hubViewMode`, `$settings.hubAppOrder`, `$apps`
- Output: Renders grid or list view
- Events: `toggleView()`, `reorderApp(fromIndex, toIndex)`

**AppListItem.svelte** (new):
- Input: `app` (App object), `isDragging` (boolean)
- Output: Compact list row with drag handle icon
- Events: `dragstart`, `dragend`, `dragover`, `drop`, keyboard events for accessibility

### Quickstart Guide

See `quickstart.md` for implementation steps.

---

## Implementation Phases

Phase 2 (tasks generation) will be handled by `/speckit.tasks` command.

### Estimated Scope

| Item | Files Changed | Complexity |
|------|---------------|------------|
| Haptic utility | 1 file (new) | Low |
| Settings store extension | 1 file | Low |
| Apps store ordering helper | 1 file | Low |
| Hub.svelte view toggle | 1 file | Medium |
| AppListItem.svelte component | 1 file (new) | Medium |
| **Total** | **5 files** | **~250-350 LOC** |