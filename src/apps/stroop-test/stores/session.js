import { writable, get } from 'svelte/store';
import { generateStimulus } from '../utils/colorEngine';
import { dbPromise, APP_PREFIXES, getStoreNames } from '../../../lib/utils/db';

function createSessionStore() {
  const initialState = {
    isActive: false,
    mode: null,
    type: 'Fixed',
    startTime: null,
    currentStimulus: null,
    results: [],
    itemCount: 50,
    timeLimit: 45000,
    elapsed: 0,
    isFinished: false
  };

  const { subscribe, set, update } = writable(initialState);
  let timerInterval = null;

  function clearTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    clearTimer();
    timerInterval = setInterval(() => {
      const state = get({ subscribe });
      if (!state.isActive || state.isFinished) {
        clearTimer();
        return;
      }
      const elapsed = performance.now() - state.startTime;
      if (elapsed >= state.timeLimit) {
        clearTimer();
        update(s => ({ ...s, elapsed, isFinished: true, isActive: false, currentStimulus: null }));
      } else {
        update(s => ({ ...s, elapsed }));
      }
    }, 50);
  }

  return {
    subscribe,
    start: (mode, type = 'Fixed') => {
      clearTimer();
      const stimulus = generateStimulus(mode);
      const newState = {
        ...initialState,
        isActive: true,
        mode,
        type,
        startTime: performance.now(),
        currentStimulus: stimulus,
        results: [],
        elapsed: 0
      };
      set(newState);
      if (type === 'Timed') {
        startTimer();
      }
    },
    respond: (colorKey) => {
      const state = get({ subscribe });
      if (!state.isActive || state.isFinished) return null;

      const now = performance.now();
      const reactionTime = now - (state.lastStimulusTime || state.startTime);
      const isCorrect = state.mode === 'W' 
        ? colorKey === state.currentStimulus.word 
        : colorKey === state.currentStimulus.color;

      const newResult = {
        word: state.currentStimulus.word,
        color: state.currentStimulus.color,
        userResponse: colorKey,
        isCorrect,
        reactionTime
      };

      const newResults = [...state.results, newResult];
      
      let isFinished = false;
      if (state.type === 'Fixed' && newResults.length >= state.itemCount) {
        isFinished = true;
        clearTimer();
      } else if (state.type === 'Timed' && (performance.now() - state.startTime) >= state.timeLimit) {
        isFinished = true;
        clearTimer();
      }

      if (isFinished) {
        update(s => ({ ...s, results: newResults, isFinished, isActive: false, currentStimulus: null }));
      } else {
        const nextStimulus = generateStimulus(state.mode);
        update(s => ({
          ...s,
          results: newResults,
          currentStimulus: nextStimulus,
          lastStimulusTime: now
        }));
      }

      return isCorrect;
    },
    save: async () => {
      const state = get({ subscribe });
      if (!state.isFinished) return;

      const db = await dbPromise;
      const stores = getStoreNames(APP_PREFIXES.stroopTest);
      
      const sessionData = {
        mode: state.mode,
        type: state.type,
        results: state.results,
        timestamp: Date.now()
      };

      await db.add(stores.sessions, sessionData);
    },
    reset: () => {
      clearTimer();
      set(initialState);
    }
  };
}

export const session = createSessionStore();
