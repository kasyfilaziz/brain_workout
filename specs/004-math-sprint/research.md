# Research: Math Sprint App

**Feature**: 004-math-sprint
**Date**: 2026-03-20

## Key Decisions

### Problem Generation Algorithm

**Decision**: Algorithmic generation with random operands within difficulty-specific ranges.

**Rationale**:
- No pre-authored content needed (unlike flashcards)
- Problems generated on-the-fly, infinite variety
- Constraints enforced algorithmically (non-negative subtraction, whole-number division)
- Matches spec assumption: "Problem generation is algorithmic"

**Operand Ranges**:
| Difficulty | Range | Example |
|------------|-------|---------|
| Easy | 1-9 | 7 + 3 = ? |
| Medium | 10-99 | 45 + 28 = ? |
| Hard | 100-999 | 437 + 281 = ? |

**Division Generation Strategy**: Generate answer first (1-12 easy, 1-20 medium, 1-50 hard), then divisor (2-12), then multiply to get dividend. This guarantees whole-number results.

**Subtraction Strategy**: Generate larger operand first, smaller second. Ensures non-negative results.

**Alternatives considered**:
- Pre-authored problem bank: Rejected - requires content authoring, limited variety
- Generate from answer backward: Adopted for division only, simpler forward generation for other ops

---

### SM-2 Mastery Mapping

**Decision**: Map session accuracy percentage to SM-2 rating (0-5), then use existing `calculateSM2` function.

**Rationale**:
- Reuses existing SM-2 utility from `src/lib/utils/sm2.js`
- Consistent with flashcard app's approach
- Each operation+difficulty combo is treated as a "card" in SM-2 terms

**Accuracy to Rating Mapping**:
| Accuracy | SM-2 Rating |
|----------|-------------|
| 0-20% | 0 (complete blackout) |
| 21-40% | 1 (incorrect, recognized) |
| 41-60% | 2 (incorrect, easy recall) |
| 61-75% | 3 (correct with difficulty) |
| 76-90% | 4 (correct after hesitation) |
| 91-100% | 5 (perfect recall) |

**Alternatives considered**:
- Custom mastery algorithm: Rejected - unnecessary complexity, SM-2 is proven
- Track per-problem mastery: Rejected - too granular, session-level is appropriate

---

### Game Timer Implementation

**Decision**: Use `setInterval` with 1-second ticks for both sprint (count-up) and timed (count-down) modes.

**Rationale**:
- Consistent with existing Pomodoro timer pattern in `src/apps/pomodoro/stores/pomodoro.js`
- Simple, reliable for 1-second precision (SC-007, SC-008 require within 1 second accuracy)
- No need for sub-second precision for arithmetic games

**Alternatives considered**:
- `requestAnimationFrame`: Overkill for 1-second precision, more CPU overhead
- Web Workers: Unnecessary complexity for simple countdown

---

### App Registration Pattern

**Decision**: Follow exact pattern from memory-match and pomodoro apps.

**Rationale**:
- Auto-discovered by `src/lib/stores/apps.js` via `import.meta.glob('../../apps/*/index.js')`
- Requires: `id`, `name`, `icon`, `description`, `version`, `componentLoader`
- DB prefix: `math_sprint_` via `APP_PREFIXES`

**Reference**: `src/apps/memory-match/index.js`, `src/apps/pomodoro/index.js`

---

### DB Schema Changes

**Decision**: Bump `DB_VERSION` from 5 to 6, add 3 new stores.

**Stores to add**:
1. `math_sprint_mastery` - keyPath: `key` (string like `"add_easy"`)
2. `math_sprint_sessions` - keyPath: `id`, autoIncrement
3. `math_sprint_settings` - keyPath: `key`

**Rationale**:
- Follows existing pattern in `src/lib/utils/db.js`
- Versioned migrations ensure data integrity
- App prefix isolation via `APP_PREFIXES.mathSprint = 'math_sprint_'`

---

### Sound/Haptic Feedback

**Decision**: Use `navigator.vibrate()` for haptics, simple Audio API for sound.

**Rationale**:
- Haptic: Already used in memory-match (`navigator.vibrate`)
- Sound: Web Audio API or simple `<audio>` elements for beep/buzz
- Settings-controlled via FR-015, FR-016

**Alternatives considered**:
- External sound files: Adds complexity, inline/generated tones sufficient for simple feedback

---

## Architecture Summary

The Math Sprint app follows the established modular app container pattern:
- Self-contained in `src/apps/math-sprint/`
- Registers via `index.js` with `componentLoader`
- Shares SM-2 utility from `src/lib/utils/sm2.js`
- Own IndexedDB stores with `math_sprint_` prefix
- Tab-based navigation (Play, Stats, Settings) like pomodoro
- Tailwind CSS with dark mode support
