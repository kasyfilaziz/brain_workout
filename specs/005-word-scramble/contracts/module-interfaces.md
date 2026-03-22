# Contracts: Word Scramble

**Feature**: 005-word-scramble
**Date**: 2026-03-21

## Overview

Word Scramble is a self-contained brain workout app with **no external interfaces**. All functionality operates within the browser using local storage.

---

## Internal Interfaces

Although there are no external contracts, the following internal interfaces define how components communicate:

### 1. App Registration Interface

```javascript
// src/apps/word-scramble/index.js
export default {
  id: string,           // 'wordScramble'
  name: string,          // 'Word Scramble'
  icon: string,          // 'scramble'
  description: string,  // 'Unscramble letters...'
  version: string,       // '1.0.0'
  componentLoader: Function // () => import('./App.svelte')
};
```

### 2. Store Interface (wordScramble.js)

```javascript
// Public exports
export const customLists;        // Writable<CustomList[]>
export const currentSession;     // Writable<Session | null>
export const dailyChallenge;     // Writable<DailyChallenge | null>

// Functions
export function loadCustomLists(): Promise<void>
export function saveCustomList(list: CustomList): Promise<number>
export function deleteCustomList(id: number): Promise<void>
export function recordSession(session: Session): Promise<void>
export function getDueWords(): Promise<Progress[]>
export function updateWordProgress(word: string, result: 'correct' | 'incorrect', usedHint: boolean): Promise<void>
```

### 3. IndexedDB Schema

```javascript
// Store names (via getStoreNames with 'word_scramble_' prefix)
'word_scramble_custom_lists'   // CustomList[]
'word_scramble_progress'       // Progress[]
'word_scramble_sessions'        // Session[]
'word_scramble_daily_challenges' // DailyChallenge[]
'word_scramble_settings'        // Settings key-value pairs
```

---

## UI State Machine

```
┌─────────────┐
│   HomeView   │
│ (Selection)  │
└──────┬──────┘
       │ Start
       ▼
┌─────────────┐
│   GameView  │
│  (Playing)  │
└──────┬──────┘
       │ Complete/End
       ▼
┌─────────────┐
│ ResultsView │
└─────────────┘
```

---

## No External Dependencies

Word Scramble does not:
- Call any external APIs
- Require network connectivity
- Depend on other brain workout apps
- Export data to external formats (only JSON export for custom lists)

---

## Constitutional Compliance

| Principle | Status |
|-----------|--------|
| I. Local-First Data | ✅ All data in IndexedDB |
| II. Static Deployment | ✅ Pure client-side |
| III. PWA | ✅ Uses existing PWA infrastructure |
| IV. Extensible | ✅ Follows app module pattern |
| V. Data Portability | ✅ Custom lists exportable as JSON |
