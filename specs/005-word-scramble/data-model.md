# Data Model: Word Scramble

**Feature**: 005-word-scramble
**Date**: 2026-03-21

## Entity Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Built-in Word Bank                      │
│  (Static JS module - no persistence needed)                 │
├─────────────────────────────────────────────────────────────┤
│  Word { text, category, difficulty }                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    IndexedDB Storage                        │
│  (word_scramble_* prefixes)                                │
├─────────────────────────────────────────────────────────────┤
│  CustomList { id, name, words[], createdAt }                │
│  Progress { wordText, attempts, correct, easeFactor,        │
│             interval, nextReview }                          │
│  Session { id, mode, timestamp, wordsAttempted, correct,    │
│            score, hintsUsed }                               │
│  DailyChallenge { date, wordText, completed, score }       │
│  Settings { key, value }                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Entity Definitions

### 1. Word (Built-in, Static)

| Field | Type | Description |
|-------|------|-------------|
| text | string | The word itself (e.g., "elephant") |
| category | enum | Animals, Food, Countries, Sports, Technology, Nature, Common |
| difficulty | enum | Easy (4-5 letters), Medium (6-7), Hard (8+) |

**Source**: Static JavaScript module (`wordBank.js`)

---

### 2. CustomList (IndexedDB)

| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-incremented primary key |
| name | string | User-defined list name (e.g., "SAT Words") |
| words | string[] | Array of word strings |
| createdAt | timestamp | When the list was created |

**Store**: `word_scramble_custom_lists`
**Index**: `by-name` for sorting

---

### 3. Progress (IndexedDB)

| Field | Type | Description |
|-------|------|-------------|
| wordText | string | Primary key (the word being tracked) |
| attempts | number | Total attempts made |
| correct | number | Total correct answers |
| easeFactor | number | SM-2 ease factor (default 2.5) |
| interval | number | SM-2 interval in days |
| nextReview | timestamp | When word is next due for review |
| timesCorrectWithHint | number | Count of correct answers given hints |
| timesIncorrect | number | Count of failures |

**Store**: `word_scramble_progress`
**Index**: `by-nextReview` for finding due words

---

### 4. Session (IndexedDB)

| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-incremented primary key |
| mode | enum | 'zen', 'blitz', 'mastery' |
| timestamp | timestamp | Session start time |
| wordsAttempted | number | Total words presented |
| correct | number | Correctly answered |
| score | number | Total points earned |
| hintsUsed | number | Total hints used in session |
| category | string \| null | Category practiced (null for "All") |

**Store**: `word_scramble_sessions`
**Index**: `by-date` for stats aggregation

---

### 5. DailyChallenge (IndexedDB)

| Field | Type | Description |
|-------|------|-------------|
| date | string | Primary key (YYYY-MM-DD format) |
| wordText | string | The challenge word for this date |
| completed | boolean | Whether user finished the challenge |
| score | number | Points earned (0 if incomplete) |
| completedAt | timestamp \| null | When challenge was completed |

**Store**: `word_scramble_daily_challenges`

---

### 6. Settings (IndexedDB)

| Field | Type | Description |
|-------|------|-------------|
| key | string | Primary key |
| value | any | Setting value |

**Store**: `word_scramble_settings`
**Reserved Keys**:
- `soundEnabled`: boolean
- `vibrationEnabled`: boolean
- `lastPlayedDate`: string (YYYY-MM-DD, for streak tracking)

---

## State Transitions

### Session States

```
IDLE → PLAYING → COMPLETED
         ↓
      (time up in Blitz)
         ↓
      COMPLETED
```

### Word Progress States

```
NEW → DUE → LEARNING → MASTERED
         ↓
      (incorrect)
         ↓
      DUE
```

### Daily Challenge States

```
NOT_STARTED → IN_PROGRESS → COMPLETED
                              ↓
                         (next day)
                              ↓
                         NOT_STARTED
```

---

## Validation Rules

| Entity | Rule |
|--------|------|
| CustomList.words | Minimum 4 characters per word |
| CustomList.words | Alphabetic only (stripped on import) |
| CustomList.words | Duplicates removed on save |
| Progress.easeFactor | Minimum 1.3 |
| Session.score | Cannot exceed wordsAttempted × 100 |
| DailyChallenge.date | ISO format YYYY-MM-DD |

---

## IndexedDB Schema Version

**Version**: 7 (next available after math-sprint at 6)

```javascript
// In db.js upgrade function:
if (oldVersion < 7) {
  const wordScrambleStores = getStoreNames(APP_PREFIXES.wordScramble);
  
  // custom_lists: id (autoIncrement), name, words[], createdAt
  if (!db.objectStoreNames.contains(wordScrambleStores.customLists)) {
    const store = db.createObjectStore(wordScrambleStores.customLists, { keyPath: 'id', autoIncrement: true });
    store.createIndex('by-name', 'name');
  }
  
  // progress: wordText (keyPath), attempts, correct, easeFactor, interval, nextReview, timesCorrectWithHint, timesIncorrect
  if (!db.objectStoreNames.contains(wordScrambleStores.progress)) {
    const store = db.createObjectStore(wordScrambleStores.progress, { keyPath: 'wordText' });
    store.createIndex('by-nextReview', 'nextReview');
  }
  
  // sessions: id (autoIncrement), mode, timestamp, wordsAttempted, correct, score, hintsUsed, category
  if (!db.objectStoreNames.contains(wordScrambleStores.sessions)) {
    const store = db.createObjectStore(wordScrambleStores.sessions, { keyPath: 'id', autoIncrement: true });
    store.createIndex('by-date', 'timestamp');
  }
  
  // daily_challenges: date (keyPath), wordText, completed, score, completedAt
  if (!db.objectStoreNames.contains(wordScrambleStores.dailyChallenges)) {
    db.createObjectStore(wordScrambleStores.dailyChallenges, { keyPath: 'date' });
  }
  
  // settings: key (keyPath), value
  if (!db.objectStoreNames.contains(wordScrambleStores.settings)) {
    db.createObjectStore(wordScrambleStores.settings, { keyPath: 'key' });
  }
}
```
