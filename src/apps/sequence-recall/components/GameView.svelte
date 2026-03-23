<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { gameState } from '../stores/gameState';
  import { settings } from '../stores/settings';
  import { checkMatch, tallyResponses } from '../utils/nback';
  import { calculateDPrime, clampDPrime } from '../utils/dprime';
  import { saveSession, updateSession } from '../utils/db';
  import Grid from './Grid.svelte';
  import StimulusDisplay from './StimulusDisplay.svelte';
  import MatchButtons from './MatchButtons.svelte';
  
  const dispatch = createEventDispatcher();
  
  let currentStimulus = null;
  let showStimulus = false;
  let responseHandled = false;
  let roundTimeLimit = 3000;
  let hiddenTime = null;
  let incompleteSessionId = null;
  
  $: state = $gameState;
  $: currentRound = state.currentRound;
  $: totalRounds = state.rounds;
  $: sequence = state.sequence;
  $: taskType = state.taskType;
  
  $: if (state.status === 'RUNNING' && !showStimulus) {
    showCurrentStimulus();
  }
  
  function handleVisibilityChange() {
    if (document.hidden) {
      if (state.status === 'RUNNING') {
        hiddenTime = Date.now();
        gameState.pause();
      }
    } else {
      if (state.status === 'PAUSED' && hiddenTime) {
        gameState.resume();
        hiddenTime = null;
      }
    }
  }
  
  onMount(async () => {
    if ($settings) {
      roundTimeLimit = $settings.roundTimeLimit || 3000;
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });
  
  onDestroy(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });
  
  function showCurrentStimulus() {
    if (currentRound >= totalRounds) {
      endSession();
      return;
    }
    
    currentStimulus = sequence[currentRound];
    showStimulus = true;
    responseHandled = false;
    gameState.showStimulus();
  }
  
  function handleResponse(event) {
    if (responseHandled) return;
    responseHandled = true;
    
    const { response, stream } = event.detail;
    const streamType = stream || 'position';
    
    const result = checkMatch(currentRound, state.nLevel, sequence, response, streamType);
    
    gameState.recordResponse(result.type, streamType);
    
    showStimulus = false;
    
    setTimeout(() => {
      gameState.nextRound();
    }, 300);
  }
  
  function handleTimeout() {
    if (responseHandled) return;
    responseHandled = true;
    
    gameState.recordResponse('MISS');
    
    showStimulus = false;
    
    setTimeout(() => {
      gameState.nextRound();
    }, 300);
  }
  
  async function endSession() {
    const { positionStream, soundStream, reactionTimes } = state;
    
    const positionResults = state.responses
      .filter(r => r.stream === 'position' || !r.stream)
      .map(r => ({ type: r.response }));
    const posTally = tallyResponses(positionResults);
    
    let soundTally = null;
    let soundDScore = null;
    if (taskType === 'dual' || taskType === 'sound') {
      const soundResults = state.responses
        .filter(r => r.stream === 'sound')
        .map(r => ({ type: r.response }));
      soundTally = tallyResponses(soundResults);
      soundDScore = clampDPrime(calculateDPrime(
        soundTally.hits, soundTally.misses, soundTally.falseAlarms, soundTally.correctRejections
      ));
    }
    
    const avgReactionTimeMs = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;
    
    const session = {
      date: Date.now(),
      nLevel: state.nLevel,
      taskType,
      gridSize: state.gridSize,
      rounds: totalRounds,
      matchProbability: 0.33,
      ...posTally,
      ...(soundTally && { soundHits: soundTally.hits }),
      ...(soundTally && { soundMisses: soundTally.misses }),
      ...(soundTally && { soundFalseAlarms: soundTally.falseAlarms }),
      ...(soundTally && { soundCorrectRejections: soundTally.correctRejections }),
      dScore: clampDPrime(calculateDPrime(posTally.hits, posTally.misses, posTally.falseAlarms, posTally.correctRejections)),
      ...(soundDScore !== null && { soundDScore }),
      avgReactionTimeMs: Math.round(avgReactionTimeMs),
      completed: true
    };
    
    await saveSession(session);
    gameState.complete();
    dispatch('sessionComplete');
  }
  
  async function saveIncompleteSession() {
    if (state.responses.length === 0) return;
    
    const positionResults = state.responses
      .filter(r => r.stream === 'position' || !r.stream)
      .map(r => ({ type: r.response }));
    const posTally = tallyResponses(positionResults);
    
    let soundTally = null;
    if (taskType === 'dual' || taskType === 'sound') {
      const soundResults = state.responses
        .filter(r => r.stream === 'sound')
        .map(r => ({ type: r.response }));
      soundTally = tallyResponses(soundResults);
    }
    
    const session = {
      date: state.startTime || Date.now(),
      nLevel: state.nLevel,
      taskType,
      gridSize: state.gridSize,
      rounds: totalRounds,
      currentRound: state.currentRound,
      matchProbability: 0.33,
      ...posTally,
      ...(soundTally && { soundHits: soundTally.hits }),
      ...(soundTally && { soundMisses: soundTally.misses }),
      ...(soundTally && { soundFalseAlarms: soundTally.falseAlarms }),
      ...(soundTally && { soundCorrectRejections: soundTally.correctRejections }),
      dScore: clampDPrime(calculateDPrime(posTally.hits, posTally.misses, posTally.falseAlarms, posTally.correctRejections)),
      ...(soundTally && { soundDScore: clampDPrime(calculateDPrime(soundTally.hits, soundTally.misses, soundTally.falseAlarms, soundTally.correctRejections)) }),
      avgReactionTimeMs: state.reactionTimes.length > 0
        ? Math.round(state.reactionTimes.reduce((a, b) => a + b, 0) / state.reactionTimes.length)
        : 0,
      completed: false,
      responses: state.responses
    };
    
    if (incompleteSessionId) {
      await updateSession({ ...session, id: incompleteSessionId });
    } else {
      incompleteSessionId = await saveSession(session);
    }
  }
  
  function handlePause() {
    saveIncompleteSession();
    gameState.pause();
  }
  
  function handleAbandon() {
    if (confirm('Are you sure you want to abandon this session?')) {
      saveIncompleteSession();
      gameState.abandon();
      gameState.reset();
      dispatch('sessionComplete');
    }
  }
</script>

<div class="flex flex-col gap-4 py-4">
  <div class="flex items-center justify-between">
    <button
      type="button"
      class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
      on:click={handlePause}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
    
    <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">
      Round {currentRound + 1} / {totalRounds}
    </span>
    
    <button
      type="button"
      class="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
      on:click={handleAbandon}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
  
  <div class="text-center">
    <span class="text-lg font-bold text-gray-700 dark:text-gray-300">
      {state.nLevel}-back
    </span>
    <span class="text-gray-400 mx-2">•</span>
    <span class="text-lg font-medium text-gray-500 dark:text-gray-400 capitalize">
      {taskType}
    </span>
  </div>
  
  <StimulusDisplay 
    stimulus={currentStimulus}
    {taskType}
    {roundTimeLimit}
    show={showStimulus}
    on:timeout={handleTimeout}
  >
    {#if taskType !== 'sound' && currentStimulus !== null}
      <Grid 
        gridSize={state.gridSize}
        activePosition={currentStimulus.position}
      />
    {/if}
  </StimulusDisplay>
  
  {#if showStimulus}
    <MatchButtons 
      {taskType}
      vibrationEnabled={$settings?.vibrationEnabled ?? true}
      on:response={handleResponse}
    />
  {:else}
    <div class="h-24"></div>
  {/if}
</div>
