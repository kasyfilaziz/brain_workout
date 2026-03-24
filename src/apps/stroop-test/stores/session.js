import { writable, get } from 'svelte/store';
import { generateStimulus } from '../utils/colorEngine';
import { dbPromise, APP_PREFIXES, getStoreNames } from '../../../lib/utils/db';

function createSessionStore() {
  const initialState = {
    isActive: false,
    mode: null, // 'W', 'C', 'CW'
    type: 'Fixed', // 'Timed' | 'Fixed'
    startTime: null,
    currentStimulus: null,
    results: [],
    itemCount: 50,
    timeLimit: 45000, // 45s
    elapsed: 0,
    isFinished: false
  };

  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    start: (mode, type = 'Fixed') => {
      const stimulus = generateStimulus(mode);
      set({
        ...initialState,
        isActive: true,
        mode,
        type,
        startTime: performance.now(),
        currentStimulus: stimulus,
        results: []
      });
    },
    respond: (colorKey) => {
      const state = get({ subscribe });
      if (!state.isActive || state.isFinished) return;

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
      
      // Check finish condition
      let isFinished = false;
      if (state.type === 'Fixed' && newResults.length >= state.itemCount) {
        isFinished = true;
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
    reset: () => set(initialState)
  };
}

export const session = createSessionStore();
