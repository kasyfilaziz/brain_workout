# Research: Word Scramble

**Feature**: 005-word-scramble
**Date**: 2026-03-21

## Technical Decisions

### 1. Word Bank Storage

**Decision**: Embed word bank as JavaScript module (static data)

**Rationale**: 
- Words are static, read-only content that doesn't change
- Embedding eliminates IndexedDB storage overhead for built-in words
- Fast initial load - no async fetching needed
- Simple file structure easy to maintain and expand

**Alternatives considered**:
- IndexedDB storage: Rejected - unnecessary complexity for read-only data
- JSON file: Would require async loading, same benefits as embedded

---

### 2. Scramble Algorithm

**Decision**: Fisher-Yates shuffle with validation

**Rationale**:
- Fisher-Yates provides truly random permutation
- Validation ensures scrambled result differs from original AND is not a simple reversal
- Efficient O(n) complexity

**Alternatives considered**:
- Simple reversal: Rejected - too predictable
- Random character swap: Could produce original word

---

### 3. SM-2 Rating Mapping

**Decision**: Map word scramble outcomes to SM-2 ratings:
- Correct (no hint) = Rating 4 (good recall)
- Correct (with hint) = Rating 2 (partial recall)
- Incorrect/Skipped = Rating 1 (failed recall)

**Rationale**: Aligns with SM-2's original 0-5 scale interpretation while being intuitive

---

### 4. Daily Challenge Seed

**Decision**: Use date string (YYYY-MM-DD) as seed for deterministic word selection

**Rationale**:
- Same date = same seed = same word for all users
- Simple to implement without server dependency
- Uses local timezone for midnight boundary

---

### 5. Custom Word List Storage

**Decision**: Store in IndexedDB with app-specific prefix

**Rationale**:
- Follows existing pattern (flashcard app uses same approach)
- Persists across sessions
- Isolated from built-in word bank

---

### 6. Score Calculation

**Decision**:
- Base points per correct word: 100
- Hint penalty: 50% reduction per hint used
- Time bonus in Blitz mode: None (time pressure IS the challenge)

**Rationale**: Simple scoring that's easy to understand and calculate

---

## Technology Stack Confirmation

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | Svelte 4.x | Per constitution |
| Storage | IndexedDB (idb) | Per constitution |
| Styling | TailwindCSS | Per constitution |
| Build | Vite 4.x | Per constitution |
| PWA | vite-plugin-pwa | Per constitution |
| SM-2 | Reuse lib/utils/sm2.js | Shared utility |

---

## Word Bank Categories

| Category | Example Words | Count Est. |
|----------|---------------|------------|
| Animals | tiger, elephant, dolphin | ~150 |
| Food | apple, chocolate, spaghetti | ~150 |
| Countries | canada, australia, brazil | ~150 |
| Sports | soccer, basketball, tennis | ~100 |
| Technology | computer, keyboard, software | ~100 |
| Nature | mountain, river, forest | ~100 |
| Common | table, window, happy | ~250 |
| **Total** | | **~1000** |

---

## Dependencies

- **No new external dependencies** - All functionality achievable with existing stack
- SM-2: Reuse `src/lib/utils/sm2.js`
- IndexedDB: Existing `db.js` pattern
- Theme: Shared `theme.js` store
