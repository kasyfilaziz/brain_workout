export function validateSession(session) {
  const errors = [];
  
  if (!session.nLevel || session.nLevel < 1 || session.nLevel > 5) {
    errors.push('nLevel must be between 1 and 5');
  }
  
  const validTaskTypes = ['position', 'sound', 'dual'];
  if (!session.taskType || !validTaskTypes.includes(session.taskType)) {
    errors.push('taskType must be position, sound, or dual');
  }
  
  const validGridSizes = ['2x2', '3x3', '4x4'];
  if (session.taskType !== 'sound' && (!session.gridSize || !validGridSizes.includes(session.gridSize))) {
    errors.push('gridSize must be 2x2, 3x3, or 4x4 for position/dual mode');
  }
  
  if (!session.rounds || session.rounds < 1) {
    errors.push('rounds must be positive integer');
  }
  
  if (typeof session.completed !== 'boolean') {
    errors.push('completed must be boolean');
  }
  
  const { hits = 0, misses = 0, falseAlarms = 0, correctRejections = 0 } = session;
  const positionTotal = hits + misses + falseAlarms + correctRejections;
  
  if (positionTotal !== session.rounds) {
    errors.push(`Position stream response count (${positionTotal}) must equal rounds (${session.rounds})`);
  }
  
  if (session.dScore !== undefined && (session.dScore < -4 || session.dScore > 4)) {
    errors.push('dScore must be between -4 and 4');
  }
  
  if (session.taskType === 'sound' || session.taskType === 'dual') {
    const { soundHits = 0, soundMisses = 0, soundFalseAlarms = 0, soundCorrectRejections = 0 } = session;
    const soundTotal = soundHits + soundMisses + soundFalseAlarms + soundCorrectRejections;
    
    if (soundTotal !== session.rounds) {
      errors.push(`Sound stream response count (${soundTotal}) must equal rounds (${session.rounds})`);
    }
    
    if (session.soundDScore !== undefined && (session.soundDScore < -4 || session.soundDScore > 4)) {
      errors.push('soundDScore must be between -4 and 4');
    }
  }
  
  if (session.avgReactionTimeMs !== undefined && session.avgReactionTimeMs < 0) {
    errors.push('avgReactionTimeMs must be non-negative');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateSettings(settings) {
  const errors = [];
  
  if (settings.defaultLevel < 1 || settings.defaultLevel > 5) {
    errors.push('defaultLevel must be between 1 and 5');
  }
  
  const validTaskTypes = ['position', 'sound', 'dual'];
  if (!validTaskTypes.includes(settings.defaultTaskType)) {
    errors.push('defaultTaskType must be position, sound, or dual');
  }
  
  const validGridSizes = ['2x2', '3x3', '4x4'];
  if (!validGridSizes.includes(settings.defaultGridSize)) {
    errors.push('defaultGridSize must be 2x2, 3x3, or 4x4');
  }
  
  if (settings.defaultRounds < 1 || settings.defaultRounds > 100) {
    errors.push('defaultRounds must be between 1 and 100');
  }
  
  if (settings.roundTimeLimit < 1000 || settings.roundTimeLimit > 10000) {
    errors.push('roundTimeLimit must be between 1000 and 10000 ms');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
