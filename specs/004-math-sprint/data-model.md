# Data Model: Math Sprint App

**Feature**: 004-math-sprint
**Date**: 2026-03-20

## Entities

### Mastery Record

Represents learning progress for a specific operation and difficulty combination.

**IndexedDB Store**: `math_sprint_mastery`
**Key Path**: `key` (string)

| Field | Type | Description |
|-------|------|-------------|
| key | string | Composite key: `"{operation}_{difficulty}"` (e.g., `"add_easy"`) |
| operation | string | One of: `add`, `subtract`, `multiply`, `divide`, `mixed` |
| difficulty | string | One of: `easy`, `medium`, `hard` |
| interval | number | SM-2 interval in days (0 = not started) |
| easeFactor | number | SM-2 ease factor (default 2.5, min 1.3) |
| nextReview | number | Timestamp for next review (ms since epoch) |
| totalCorrect | number | Cumulative correct answers across all sessions |
| totalIncorrect | number | Cumulative incorrect answers across all sessions |
| lastSessionDate | number | Timestamp of last session (ms since epoch) |

**Total Records**: 15 (5 operations × 3 difficulties)

**Validation Rules**:
- `key` must match pattern `^[a-z]+_[a-z]+$`
- `operation` must be one of the 5 valid values
- `difficulty` must be one of the 3 valid values
- `easeFactor` must be >= 1.3
- `interval` must be >= 0

**State Transitions**:
- New record created on first game for a combo (interval=0, easeFactor=2.5)
- Updated after each completed session via SM-2 calculation
- Interval grows on high accuracy, resets on low accuracy

---

### Session Record

Represents a single completed game session.

**IndexedDB Store**: `math_sprint_sessions`
**Key Path**: `id` (autoIncrement)

| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-generated unique identifier |
| operation | string | Operation played: `add`, `subtract`, `multiply`, `divide`, `mixed` |
| difficulty | string | Difficulty played: `easy`, `medium`, `hard` |
| mode | string | Game mode: `sprint` or `timed` |
| totalProblems | number | Total problems attempted |
| correct | number | Correct answers |
| incorrect | number | Incorrect answers |
| accuracy | number | Percentage: (correct / totalProblems) × 100 |
| timeMs | number | Total elapsed time in milliseconds |
| date | number | Session timestamp (ms since epoch) |

**Validation Rules**:
- `correct + incorrect` must equal `totalProblems`
- `accuracy` must equal `(correct / totalProblems) * 100`
- `mode` must be `sprint` or `timed`
- `timeMs` must be > 0

**Indexes**:
- `by-date`: on `date` field (for sorting history)
- `by-operation`: on `operation` field (for stats filtering)

---

### User Settings

Represents user preferences for the Math Sprint app.

**IndexedDB Store**: `math_sprint_settings`
**Key Path**: `key` (string, always `"math_sprint_settings"`)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| key | string | `"math_sprint_settings"` | Fixed key for singleton record |
| soundEnabled | boolean | true | Whether sound effects play during gameplay |
| vibrationEnabled | boolean | false | Whether haptic feedback triggers on answers |
| defaultMode | string | `"sprint"` | Default game mode: `sprint` or `timed` |
| timedDuration | number | 60 | Default timed mode duration in seconds |

**Validation Rules**:
- `defaultMode` must be `sprint` or `timed`
- `timedDuration` must be one of: 30, 60, 90, 120

---

## Relationships

```
Mastery Record ←── Session Record (updates mastery via SM-2 after each session)
User Settings ──── HomeView (reads defaults for game setup)
```

## In-Memory Game State (Not Persisted)

These stores exist only during active gameplay and are reset on game exit.

| Store | Type | Description |
|-------|------|-------------|
| gameState | writable | `'home'` \| `'playing'` \| `'results'` |
| currentProblem | writable | `{ operand1, operation, operand2, answer }` |
| problemNumber | writable | Current problem index (1-based) |
| correctCount | writable | Number of correct answers |
| incorrectCount | writable | Number of incorrect answers |
| startTime | writable | Timestamp when game started |
| elapsedTime | writable | Elapsed seconds (count-up for sprint) |
| timeRemaining | writable | Remaining seconds (count-down for timed) |
| selectedOperation | writable | Selected operation type |
| selectedDifficulty | writable | Selected difficulty level |
| selectedMode | writable | Selected game mode |
| timedDuration | writable | Selected timed duration |
| lastAnswerCorrect | writable | null / true / false (for feedback display) |
