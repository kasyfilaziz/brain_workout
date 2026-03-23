import { generateRandomSound } from './audio.js';

export function parseGridSize(gridSize) {
  const sizes = { '2x2': 4, '3x3': 9, '4x4': 16 };
  return sizes[gridSize] || 9;
}

export function generateStimulusSequence(nLevel, taskType, gridSize, totalRounds, matchProbability = 0.33) {
  const sequence = [];
  const positions = taskType === 'sound' ? 0 : parseGridSize(gridSize);
  
  for (let round = 0; round < totalRounds; round++) {
    const isMatch = round >= nLevel && Math.random() < matchProbability;
    let stimulus = {};
    
    if (taskType === 'position' || taskType === 'dual') {
      if (isMatch) {
        stimulus = { ...sequence[round - nLevel] };
      } else {
        const nBackPosition = round >= nLevel ? sequence[round - nLevel].position : null;
        let newPosition;
        do {
          newPosition = Math.floor(Math.random() * positions);
        } while (newPosition === nBackPosition);
        stimulus = { position: newPosition, sound: null };
      }
    }
    
    if (taskType === 'sound' || taskType === 'dual') {
      const sound = isMatch && taskType !== 'position'
        ? sequence[round - nLevel].sound
        : generateRandomSound();
      stimulus = { ...stimulus, sound };
    }
    
    sequence.push(stimulus);
  }
  return sequence;
}

export function checkMatch(roundIndex, nLevel, sequence, response, stream = 'position') {
  const targetIndex = roundIndex - nLevel;
  
  if (targetIndex < 0) {
    return {
      isMatch: false,
      correct: response === 'no-match',
      type: response === 'match' ? 'MISS' : 'CORRECT_REJECTION'
    };
  }
  
  const current = sequence[roundIndex];
  const target = sequence[targetIndex];
  
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

export function tallyResponses(responses) {
  let hits = 0, misses = 0, falseAlarms = 0, correctRejections = 0;
  
  for (const r of responses) {
    if (r.type === 'HIT') hits++;
    else if (r.type === 'MISS') misses++;
    else if (r.type === 'FALSE_ALARM') falseAlarms++;
    else if (r.type === 'CORRECT_REJECTION') correctRejections++;
  }
  
  return { hits, misses, falseAlarms, correctRejections };
}
