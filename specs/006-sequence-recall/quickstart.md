# Quickstart: Sequence Recall (N-Back)

## Implementation Overview

This guide provides a step-by-step implementation path for the Sequence Recall N-Back brain workout app, following the established modular pattern in this project.

## Prerequisite Knowledge

Before implementing, understand:
- **N-Back Task**: User sees a sequence of stimuli and must indicate if current matches one from N positions ago
- **d' Score**: Signal detection metric for discrimination accuracy
- **Svelte 4**: Component framework (stores, reactivity, event handlers)
- **IndexedDB via idb**: Async key-value storage

## Step-by-Step Implementation

### Step 1: Create App Skeleton

Create `src/apps/sequence-recall/index.js`:

```javascript
export default {
  id: 'sequence-recall',
  name: 'Sequence Recall',
  version: '1.0.0',
  componentLoader: () => import('./App.svelte')
}
```

### Step 2: Set Up IndexedDB Store

**IMPORTANT**: This app shares the existing `flashcard_db` with other apps. The DB version must be checked properly to avoid overwriting existing stores.

Create `src/apps/sequence-recall/utils/db.js`:

```javascript
import { openDB } from 'idb';

const DB_NAME = 'flashcard_db';
const STORE_SESSIONS = 'sequence_recall_sessions';
const STORE_SETTINGS = 'sequence_recall_settings';
// IMPORTANT: Use version 2 (or current_version + 1) to avoid overwriting existing schema
// Check existing apps' upgrade callbacks to determine correct version
const DB_VERSION = 2; // Adjust based on existing DB version

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // IMPORTANT: Only create stores if they don't exist
      // Never delete or modify existing stores from other apps
      
      // Sessions store
      if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
        const sessionStore = db.createObjectStore(STORE_SESSIONS, { 
          keyPath: 'id', autoIncrement: true 
        });
        sessionStore.createIndex('date', 'date');
        sessionStore.createIndex('nLevel', 'nLevel');
        sessionStore.createIndex('taskType', 'taskType');
      }
      // Settings store
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    },
    blocked() {
      console.warn('Database upgrade blocked by another tab. Close other tabs first.');
    },
    blocking() {
      // Close this connection to allow upgrade in other tab
      location.reload();
    }
  });
  return db;
}
```

### Step 3: Implement Core N-Back Logic

Create `src/apps/sequence-recall/utils/nback.js`:

```javascript
import { generateRandomSound } from './audio.js';

// Generate sequence with ~33% match probability
export function generateStimulusSequence(nLevel, taskType, gridSize, totalRounds, matchProbability = 0.33) {
  const sequence = [];
  const positions = taskType === 'sound' ? 0 : parseGridSize(gridSize); // 0 for sound-only
  
  for (let round = 0; round < totalRounds; round++) {
    const isMatch = round >= nLevel && Math.random() < matchProbability;
    let stimulus;
    
    if (taskType === 'position' || taskType === 'dual') {
      // Position-based stimuli
      if (isMatch) {
        // Match: use stimulus from n positions ago
        stimulus = { ...sequence[round - nLevel] };
      } else {
        // Non-match: random position different from n-back
        const nBackPosition = round >= nLevel ? sequence[round - nLevel].position : null;
        let newPosition;
        do {
          newPosition = Math.floor(Math.random() * positions);
        } while (newPosition === nBackPosition);
        stimulus = { position: newPosition, sound: null };
      }
    }
    
    if (taskType === 'sound' || taskType === 'dual') {
      // Sound-based stimuli (always generated, even in position-only for consistency)
      const sound = isMatch && taskType !== 'position' 
        ? sequence[round - nLevel].sound 
        : generateRandomSound();
      stimulus = { ...stimulus, sound };
    }
    
    sequence.push(stimulus);
  }
  return sequence;
}

// Check if response is correct
export function checkMatch(roundIndex, nLevel, sequence, response, stream = 'position') {
  const targetIndex = roundIndex - nLevel;
  if (targetIndex < 0) return response === 'no-match'; // Can't be match before n rounds
  
  const current = sequence[roundIndex];
  const target = sequence[targetIndex];
  
  // Check the appropriate stream
  const isMatch = stream === 'position' 
    ? current.position === target.position
    : current.sound === target.sound;
  
  return {
    isMatch,
    correct: (response === 'match') === isMatch,
    type: isMatch 
      ? (response === 'match' ? 'HIT' : 'MISS')
      : (response === 'no-match' ? 'CORRECT_REJECTION' : 'FALSE_ALARM')
  };
}

export function parseGridSize(gridSize) {
  const sizes = { '2x2': 4, '3x3': 9, '4x4': 16 };
  return sizes[gridSize] || 9;
}
```

### Step 4: Create Game State Store

Create `src/apps/sequence-recall/stores/gameState.js`:

```javascript
import { writable, derived } from 'svelte/store';

function createGameState() {
  const { subscribe, set, update } = writable({
    status: 'IDLE', // IDLE | RUNNING | PAUSED | COMPLETED | ABANDONED
    nLevel: 1,
    taskType: 'position',
    gridSize: '3x3',
    rounds: 20,
    currentRound: 0,
    sequence: [],
    stimulusBuffer: [],
    responses: [],
    reactionTimes: [], // Track reaction time per round
    stimulusStartTime: null, // Timestamp when current stimulus was shown
    startTime: null
  });

  return {
    subscribe,
    startSession: (config) => update(state => ({
      ...state,
      ...config,
      status: 'RUNNING',
      currentRound: 0,
      responses: [],
      reactionTimes: [],
      startTime: Date.now()
    })),
    showStimulus: () => update(state => ({
      ...state,
      stimulusStartTime: Date.now()
    })),
    nextRound: () => update(state => ({
      ...state,
      currentRound: state.currentRound + 1,
      stimulusStartTime: null
    })),
    recordResponse: (response) => update(state => {
      const reactionTimeMs = state.stimulusStartTime 
        ? Date.now() - state.stimulusStartTime 
        : 3000; // Default to timeout if no stimulus time
      return {
        ...state,
        responses: [...state.responses, response],
        reactionTimes: [...state.reactionTimes, reactionTimeMs]
      };
    }),
    complete: () => update(state => ({ ...state, status: 'COMPLETED' })),
    pause: () => update(state => ({ ...state, status: 'PAUSED' })),
    resume: () => update(state => ({ ...state, status: 'RUNNING', stimulusStartTime: Date.now() })),
    abandon: () => update(state => ({ ...state, status: 'ABANDONED' })),
    reset: () => set({ 
      status: 'IDLE', nLevel: 1, taskType: 'position', gridSize: '3x3', 
      rounds: 20, currentRound: 0, sequence: [], stimulusBuffer: [], 
      responses: [], reactionTimes: [], stimulusStartTime: null, startTime: null 
    }),
    getAvgReactionTime: (state) => {
      if (state.reactionTimes.length === 0) return 0;
      return state.reactionTimes.reduce((a, b) => a + b, 0) / state.reactionTimes.length;
    }
  };
}

export const gameState = createGameState();
```

### Step 5: Build UI Components

**HomeView.svelte** - Main entry with start button and tutorial link
**GameView.svelte** - Grid display + Match/No Match buttons
**ResultsView.svelte** - d' score display + level up/down suggestion
**StatsView.svelte** - Historical charts and personal bests
**Tutorial.svelte** - Animated explanation of N-Back task

### Step 6: Implement Audio

Create `src/apps/sequence-recall/utils/audio.js`:

```javascript
const TONE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; // 8 distinct letters

export function generateRandomSound() {
  return TONE_LETTERS[Math.floor(Math.random() * TONE_LETTERS.length)];
}

export function playSound(letter) {
  // Use Web Speech API for tone letters
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }
}
```

### Step 7: Calculate d' Score

Create `src/apps/sequence-recall/utils/dprime.js`:

```javascript
// Standard normal CDF approximation
function normalCDF(x) {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return 0.5 * (1.0 + sign * y);
}

export function calculateDPrime(hits, misses, falseAlarms, correctRejections) {
  const hitRate = hits / (hits + misses) || 0.001;
  const faRate = falseAlarms / (falseAlarms + correctRejections) || 0.001;
  
  // Clamp rates to avoid infinity
  const clampedHitRate = Math.max(0.001, Math.min(0.999, hitRate));
  const clampedFaRate = Math.max(0.001, Math.min(0.999, faRate));
  
  return normalCDF(clampedHitRate) - normalCDF(clampedFaRate);
}
```

## Key Files to Create

| File | Purpose |
|------|---------|
| `src/apps/sequence-recall/index.js` | App definition |
| `src/apps/sequence-recall/App.svelte` | Root component with routing |
| `src/apps/sequence-recall/utils/db.js` | IndexedDB operations (DB version aware) |
| `src/apps/sequence-recall/utils/nback.js` | Core N-back logic (all modes) |
| `src/apps/sequence-recall/utils/dprime.js` | d' calculation (position + sound) |
| `src/apps/sequence-recall/utils/audio.js` | Sound generation and playback |
| `src/apps/sequence-recall/utils/validation.js` | Session data validation |
| `src/apps/sequence-recall/stores/gameState.js` | Session state (with reaction time) |
| `src/apps/sequence-recall/stores/settings.js` | User preferences |
| `src/apps/sequence-recall/components/HomeView.svelte` | Home screen with selectors |
| `src/apps/sequence-recall/components/GameView.svelte` | Game UI (all modes) |
| `src/apps/sequence-recall/components/Grid.svelte` | Position grid display |
| `src/apps/sequence-recall/components/StimulusDisplay.svelte` | Stimulus presentation |
| `src/apps/sequence-recall/components/MatchButtons.svelte` | Response buttons (single/dual) |
| `src/apps/sequence-recall/components/ResultsView.svelte` | Results display |
| `src/apps/sequence-recall/components/StatsView.svelte` | Statistics and personal bests |
| `src/apps/sequence-recall/components/Tutorial.svelte` | First-time onboarding |
| `src/apps/sequence-recall/components/SettingsView.svelte` | Settings configuration |

## Testing Checklist

- [ ] Session starts with correct N-level
- [ ] Match detection is accurate (HIT when should match, MISS when should match but didn't)
- [ ] d' score calculates correctly (within -2 to +4 range)
- [ ] 3-second timeout records MISS with reactionTimeMs = 3000
- [ ] Reaction time tracked per round and average calculated correctly
- [ ] Pause/resume maintains session state
- [ ] Abandoned sessions marked with completed: false
- [ ] Sound-only mode generates audio only (no grid shown)
- [ ] Dual mode tracks position and sound streams independently
- [ ] Statistics show correct historical data (excluding abandoned sessions)
- [ ] Settings persist across sessions
- [ ] Works offline after initial load
- [ ] Audio fallback works when speechSynthesis unavailable
