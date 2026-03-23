# Data Model: Sequence Recall (N-Back)

## Entity Overview

| Entity | Purpose | Storage |
|--------|---------|---------|
| Session | Single training session record | `sequence_recall_sessions` |
| UserSettings | User preferences | `sequence_recall_settings` |
| PersonalBest | Best performance per level/task | Derived from Session |

## IndexedDB Schema

### Store: `sequence_recall_sessions`

**Key Path**: `id` (auto-increment)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | Yes | Auto-increment primary key |
| date | Integer (timestamp) | Yes | Session start time |
| nLevel | Integer | Yes | N-back level (1-5) |
| taskType | String | Yes | "position" \| "sound" \| "dual" |
| gridSize | String | Yes | "2x2" \| "3x3" \| "4x4" (ignored for sound-only, use null) |
| rounds | Integer | Yes | Total rounds in session (default 20) |
| matchProbability | Float | Yes | Match ratio (~0.33) |
| hits | Integer | Yes | Correct "match" responses (position stream for dual) |
| misses | Integer | Yes | Missed "match" stimuli (position stream for dual) |
| falseAlarms | Integer | Yes | Incorrect "match" responses (position stream for dual) |
| correctRejections | Integer | Yes | Correct "no-match" responses (position stream for dual) |
| soundHits | Integer | No | Correct "match" for sound stream (dual/sound mode) |
| soundMisses | Integer | No | Missed "match" for sound stream (dual/sound mode) |
| soundFalseAlarms | Integer | No | Incorrect "match" for sound stream (dual/sound mode) |
| soundCorrectRejections | Integer | No | Correct "no-match" for sound stream (dual/sound mode) |
| dScore | Float | Yes | Computed d' score (combined for dual, position-only for position) |
| soundDScore | Float | No | Computed d' score for sound stream (dual/sound mode) |
| avgReactionTimeMs | Integer | No | Average reaction time in milliseconds across all rounds |
| completed | Boolean | Yes | Session completed (true) or abandoned (false) |

**Indexes**:
- `date` (for chronological queries)
- `nLevel` (for level-specific queries)
- `taskType` (for task-specific queries)
- `[nLevel, taskType]` compound (for personal best queries)

**Note on Sound-Only Mode**: When `taskType = "sound"`, the sound-specific fields (soundHits, soundMisses, soundFalseAlarms, soundCorrectRejections, soundDScore) are required. The gridSize should be null or empty.

### Store: `sequence_recall_settings`

**Key Path**: `key`

| Field | Type | Required | Default |
|-------|------|----------|---------|
| key | String | Yes | Primary key (e.g., "user_settings") |
| defaultLevel | Integer | No | 1 |
| defaultTaskType | String | No | "position" |
| defaultGridSize | String | No | "3x3" |
| defaultRounds | Integer | No | 20 |
| soundEnabled | Boolean | No | true |
| vibrationEnabled | Boolean | No | true |
| roundTimeLimit | Integer | No | 3000 (ms) |

## Relationships

```
UserSettings (1) ──────< Session (many)
                              │
                              └───> PersonalBest (derived view)
```

PersonalBest is not stored separately - it's computed on-the-fly from Session records:
```javascript
// Pseudocode
PersonalBest = Session
  .filter(s => s.completed && s.nLevel === level && s.taskType === type)
  .sort((a, b) => b.dScore - a.dScore)[0]
```

**Derived Fields**:
- `date`: Inherited from Session as `dateAchieved`

## Validation Rules

| Field | Validation |
|-------|------------|
| nLevel | Must be 1, 2, 3, 4, or 5 |
| taskType | Must be "position", "sound", or "dual" |
| gridSize | Must be "2x2", "3x3", "4x4", or null (for sound-only) |
| rounds | Must be positive integer (recommended: 10-50) |
| dScore | Must be in range [-4, 4] (psychological bounds) |
| soundDScore | Must be in range [-4, 4] if present |
| avgReactionTimeMs | Must be non-negative if present |
| hits + misses + falseAlarms + correctRejections | Must equal rounds (position stream) |
| soundHits + soundMisses + soundFalseAlarms + soundCorrectRejections | Must equal rounds (sound stream, if taskType is "sound" or "dual") |
| completed | If false, session was abandoned (may have partial data) |

## State Transitions

### Session Lifecycle

```
┌─────────┐
│  (new)  │
└────┬────┘
     │ startSession()
     ▼
┌─────────┐
│  IDLE   │──────────────────┐
└────┬────┘                  │
     │ beginRound()         │ abandonSession()
     ▼                      ▼
┌─────────┐            ┌────────────┐
│ RUNNING │<──────────>│   PAUSED   │
└────┬────┘   resume() │            │
     │                └────┬───────┘
     │ completeRound()     │ pause()
     │                     │
     │ (rounds complete)   │
     ▼                     │
┌─────────┐                 │
│COMPLETED│                 │
└────┬────┘                 │
     │                     │
     │ (rounds incomplete) │
     │                     │
     └─────────────────────┘
              abandonSession()
```

### State Fields

| State | Description |
|-------|-------------|
| IDLE | No active session, showing home screen or tutorial |
| RUNNING | Stimulus displayed, awaiting user response |
| PAUSED | Session interrupted (app backgrounded or user paused) |
| COMPLETED | All rounds finished, showing results |
| ABANDONED | Session ended before completion |

## Stimulus Buffer

During a session, maintain a rolling buffer of stimuli:

```javascript
// For N-back level N, we need to track at least N+1 previous stimuli
stimulusBuffer = [] // FIFO queue, max length = N + 1

// On each round:
currentStimulus = generateStimulus()
stimulusBuffer.push(currentStimulus)
if (stimulusBuffer.length > N) {
  stimulusBuffer.shift()
}
// Now stimulusBuffer[0] is the N-back position's stimulus
```

**Mode-Specific Handling**:
- **Position-only**: Only position field is used in stimulus objects
- **Sound-only**: Only sound field is used (TONE_LETTERS array), position is null
- **Dual-task**: Both position and sound fields populated; maintain separate buffers for each stream

**Reaction Time Tracking**:
```javascript
// Track reaction time per round
stimulusTime = Date.now() // when stimulus presented
// ... user responds ...
reactionTimeMs = Date.now() - stimulusTime
// Accumulate for average calculation
```
