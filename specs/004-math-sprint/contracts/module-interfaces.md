# Module Contracts: Math Sprint App

**Feature**: 004-math-sprint
**Date**: 2026-03-20

This document defines the internal module interfaces for the Math Sprint app. Since this is a client-side app with no external APIs, these contracts govern the interfaces between components, stores, and utilities.

## Problem Generation Contract

**Module**: `src/apps/math-sprint/utils/problems.js`

### Exported Functions

```javascript
/**
 * Generate a single math problem
 * @param {string} operation - One of: 'add', 'subtract', 'multiply', 'divide'
 * @param {string} difficulty - One of: 'easy', 'medium', 'hard'
 * @returns {{ operand1: number, operand2: number, operation: string, answer: number, display: string }}
 */
function generateProblem(operation, difficulty)

/**
 * Get a random operation (for mixed mode)
 * @returns {string} One of: 'add', 'subtract', 'multiply', 'divide'
 */
function getRandomOperation()

/**
 * Get the display symbol for an operation
 * @param {string} operation - Operation identifier
 * @returns {string} Display symbol (+, -, ×, ÷)
 */
function getOperationSymbol(operation)

/**
 * Get operand ranges for a difficulty level
 * @param {string} difficulty - One of: 'easy', 'medium', 'hard'
 * @returns {{ min: number, max: number }}
 */
function getOperandRange(difficulty)
```

### Constraints

- Division MUST always produce whole number results
- Subtraction MUST always produce non-negative results
- Operands MUST be within the difficulty range (easy: 1-9, medium: 10-99, hard: 100-999)

---

## Store Contract

**Module**: `src/apps/math-sprint/stores/mathSprint.js`

### Exported Stores (Svelte Writables)

| Store | Type | Description |
|-------|------|-------------|
| gameState | writable<'home' \| 'playing' \| 'results'> | Current game state |
| currentProblem | writable<object \| null> | Active problem object |
| problemNumber | writable<number> | Current problem index (1-based) |
| correctCount | writable<number> | Correct answer count |
| incorrectCount | writable<number> | Incorrect answer count |
| startTime | writable<number \| null> | Game start timestamp |
| elapsedTime | writable<number> | Elapsed seconds (sprint mode) |
| timeRemaining | writable<number> | Remaining seconds (timed mode) |
| selectedOperation | writable<string> | Selected operation |
| selectedDifficulty | writable<string> | Selected difficulty |
| selectedMode | writable<string> | Selected mode |
| timedDuration | writable<number> | Timed mode duration |
| lastAnswerCorrect | writable<boolean \| null> | Feedback state |
| mastery | writable<object> | All mastery records keyed by combo |
| sessions | writable<Array> | Session history |
| settings | writable<object> | User settings |

### Exported Functions

```javascript
// Initialization
async function initMathSprintStores()

// Game lifecycle
function startGame()
function submitAnswer(answer)
function endGame()
function resetGame()

// Mastery
async function loadMastery()
async function updateMastery(operation, difficulty, accuracy)
function getMasteryColor(interval) // returns 'red' | 'yellow' | 'green' | 'neutral'

// Sessions
async function loadSessions()
async function saveSession(sessionData)

// Settings
async function loadSettings()
async function saveSettings(newSettings)
```

---

## App Registration Contract

**Module**: `src/apps/math-sprint/index.js`

```javascript
export default {
  id: 'math-sprint',           // Unique app identifier
  name: 'Math Sprint',         // Display name
  icon: 'calculator',          // Icon identifier
  description: 'Mental arithmetic trainer with timed challenges',
  version: '1.0.0',            // App version
  componentLoader: () => import('./App.svelte')  // Lazy-loaded component
};
```

---

## Component Props Contract

### HomeView

| Prop | Type | Description |
|------|------|-------------|
| (none) | - | Reads from stores directly |

### GameView

| Prop | Type | Description |
|------|------|-------------|
| (none) | - | Reads from stores directly |

Emits: Calls `submitAnswer(answer)` from store on user input.

### ResultsView

| Prop | Type | Description |
|------|------|-------------|
| (none) | - | Reads from stores directly |

Emits: Calls `resetGame()` or `startGame()` from store.
