# Research: Memory Match Game

**Feature**: `003-memory-match`
**Date**: 2026-03-20

---

## Research Findings

### 1. Card Shuffle Algorithm

**Decision**: Fisher-Yates shuffle
**Rationale**: O(n) time complexity, uniform distribution, simple to implement. Industry standard for randomized card layouts.
**Alternatives considered**:
- Math.random() sort (biased distribution, not suitable)
- Custom weighted shuffle (unnecessary complexity)

### 2. Card Flip Animation

**Decision**: CSS 3D transform with TailwindCSS classes
**Rationale**: Hardware-accelerated, smooth 60fps animation, no JavaScript animation library needed. Already used in flashcard app.
**Alternatives considered**:
- JavaScript animation (heavier, less performant)
- Svelte transition (limited 3D support)
- Framer Motion (external dependency, not in constitution)

### 3. Custom Deck Data Access

**Decision**: Direct IndexedDB access to `flashcard_cards` store using `db.getAllFromIndex()`
**Rationale**: Cross-app data sharing is already supported by the architecture. The flashcard app's `by-deckId` index provides efficient lookup.
**Alternatives considered**:
- Importing flashcard stores directly (creates tight coupling)
- Shared Svelte store (unnecessary indirection)
- Duplicating card data (waste of storage, data sync issues)

### 4. Grid Size Layout

**Decision**: CSS Grid with dynamic columns based on grid size
**Rationale**: CSS Grid is the native solution for 2D layouts. Dynamic `grid-template-columns` adapts to any grid size.
**Alternatives considered**:
- Flexbox wrap (unpredictable wrapping behavior)
- Absolute positioning (complex, not responsive)
- Table layout (semantic misuse)

### 5. Timer Implementation

**Decision**: `setInterval` with `Date.now()` correction for drift
**Rationale**: `setInterval` alone drifts due to JavaScript event loop. Using `Date.now()` to calculate actual elapsed time ensures accuracy.
**Alternatives considered**:
- Pure `setInterval` (drifts over time)
- `requestAnimationFrame` (unnecessary for non-visual updates)
- Web Workers (overkill for a countdown timer)

### 6. High Score Storage

**Decision**: One record per grid size in `memory_match_scores` store
**Rationale**: Matches the spec (personal best per grid size). Simple key-based lookup. Not per-theme since themes are cosmetic and don't affect difficulty.
**Alternatives considered**:
- Per grid size per theme (excessive granularity, 4 grid × N themes)
- All game sessions with computed best (slow queries, storage waste)

### 7. Built-in Theme Content

**Decision**: Hardcoded emoji arrays in `utils/cards.js`
**Rationale**: Simple, no external assets needed, works offline. Emoji are universally supported and visually distinct.
**Alternatives considered**:
- SVG images (more visual control but requires assets)
- Image sprites (requires download, breaks offline-first)
- Unicode symbols (less visually appealing)

### 8. Game State Persistence

**Decision**: No mid-game persistence. Game resets on navigation away.
**Rationale**: Per spec (FR-008 acceptance scenario 8), game state is discarded on navigation. Simpler implementation, no data migration concerns.
**Alternatives considered**:
- Save game state to IndexedDB (complex, edge cases with stale state)
- Session storage (lost on page reload anyway)

---

## Technology Validation

All technical context resolved. No NEEDS CLARIFICATION markers remain.

| Item | Resolution |
|------|------------|
| Language/Version | JavaScript ES Modules (project standard) |
| Dependencies | Svelte 4.x, idb 8.x, TailwindCSS 3.x (all existing) |
| Storage | IndexedDB via idb (existing `flashcard_db`) |
| Testing | No test framework (project has none) |
| Target Platform | Web browser, PWA, mobile-first |
| Performance | < 300ms card flip, < 1s game start |
| Constraints | Offline-first, dark mode, haptic feedback |
| Scale | Single user, 4 grid sizes, 3+ themes |
