import { writable, get } from 'svelte/store';
import { generateStimulusSequence } from '../utils/nback';

function createGameState() {
  const initialState = {
    status: 'IDLE',
    nLevel: 1,
    taskType: 'position',
    gridSize: '3x3',
    rounds: 20,
    currentRound: 0,
    sequence: [],
    responses: [],
    reactionTimes: [],
    stimulusStartTime: null,
    startTime: null,
    positionStream: null,
    soundStream: null
  };
  
  const { subscribe, set, update } = writable(initialState);
  
  return {
    subscribe,
    
    startSession: (config) => {
      const sequence = generateStimulusSequence(
        config.nLevel,
        config.taskType,
        config.gridSize,
        config.rounds,
        0.33
      );
      
      update(state => ({
        ...state,
        ...config,
        status: 'RUNNING',
        currentRound: 0,
        sequence,
        responses: [],
        reactionTimes: [],
        stimulusStartTime: null,
        startTime: Date.now(),
        positionStream: { hits: 0, misses: 0, falseAlarms: 0, correctRejections: 0 },
        soundStream: config.taskType === 'dual' || config.taskType === 'sound' 
          ? { hits: 0, misses: 0, falseAlarms: 0, correctRejections: 0 }
          : null
      }));
    },
    
    showStimulus: () => {
      update(state => ({
        ...state,
        stimulusStartTime: Date.now()
      }));
    },
    
    recordResponse: (response, stream = 'position') => {
      update(state => {
        const reactionTimeMs = state.stimulusStartTime
          ? Date.now() - state.stimulusStartTime
          : 3000;
        
        const currentResponse = {
          round: state.currentRound,
          stream,
          response,
          reactionTimeMs,
          timestamp: Date.now()
        };
        
        const newState = {
          ...state,
          responses: [...state.responses, currentResponse],
          reactionTimes: [...state.reactionTimes, reactionTimeMs]
        };
        
        return newState;
      });
    },
    
    nextRound: () => {
      update(state => ({
        ...state,
        currentRound: state.currentRound + 1,
        stimulusStartTime: null
      }));
    },
    
    complete: () => {
      update(state => ({ ...state, status: 'COMPLETED' }));
    },
    
    pause: () => {
      update(state => ({ ...state, status: 'PAUSED' }));
    },
    
    resume: () => {
      update(state => ({
        ...state,
        status: 'RUNNING',
        stimulusStartTime: Date.now()
      }));
    },
    
    abandon: () => {
      update(state => ({ ...state, status: 'ABANDONED' }));
    },
    
    reset: () => {
      set(initialState);
    },
    
    getAvgReactionTime: () => {
      const state = get({ subscribe });
      if (state.reactionTimes.length === 0) return 0;
      const sum = state.reactionTimes.reduce((a, b) => a + b, 0);
      return sum / state.reactionTimes.length;
    }
  };
}

export const gameState = createGameState();
