<script>
  import { createEventDispatcher } from 'svelte';
  import { gameState } from '../stores/gameState';
  
  const dispatch = createEventDispatcher();
  
  $: state = $gameState;
  $: responses = state.responses;
  
  $: positionResponses = responses.filter(r => r.stream === 'position' || !r.stream);
  $: soundResponses = responses.filter(r => r.stream === 'sound');
  
  $: positionTally = {
    hits: positionResponses.filter(r => r.type === 'HIT').length,
    misses: positionResponses.filter(r => r.type === 'MISS').length,
    falseAlarms: positionResponses.filter(r => r.type === 'FALSE_ALARM').length,
    correctRejections: positionResponses.filter(r => r.type === 'CORRECT_REJECTION').length
  };
  
  $: soundTally = {
    hits: soundResponses.filter(r => r.type === 'HIT').length,
    misses: soundResponses.filter(r => r.type === 'MISS').length,
    falseAlarms: soundResponses.filter(r => r.type === 'FALSE_ALARM').length,
    correctRejections: soundResponses.filter(r => r.type === 'CORRECT_REJECTION').length
  };
  
  $: totalPosition = positionTally.hits + positionTally.misses + positionTally.falseAlarms + positionTally.correctRejections;
  $: positionAccuracy = totalPosition > 0 
    ? ((positionTally.hits + positionTally.correctRejections) / totalPosition) * 100 
    : 0;
  
  $: totalSound = soundTally.hits + soundTally.misses + soundTally.falseAlarms + soundTally.correctRejections;
  $: soundAccuracy = totalSound > 0 
    ? ((soundTally.hits + soundTally.correctRejections) / totalSound) * 100 
    : 0;
  
  $: isPerfect = totalPosition > 0 && positionAccuracy === 100;
  
  $: dScore = state.dScore ?? 0;
  $: soundDScore = state.soundDScore ?? 0;
  
  $: combinedDScore = (dScore + soundDScore) / 2;
  
  $: mainScore = state.taskType === 'dual' ? combinedDScore : dScore;
  
  $: suggestion = (() => {
    if (state.taskType === 'dual') {
      if (positionAccuracy > 80 && soundAccuracy < 50) {
        return { type: 'sound', message: 'Try Sound-only mode' };
      }
      if (positionAccuracy > 80) return 'up';
      if (positionAccuracy < 50) return 'down';
      return 'stay';
    }
    if (positionAccuracy > 80) return 'up';
    if (positionAccuracy < 50) return 'down';
    return 'stay';
  })();
  
  function playAgain() {
    gameState.startSession({
      nLevel: state.nLevel,
      taskType: state.taskType,
      gridSize: state.gridSize,
      rounds: state.rounds
    });
    dispatch('playAgain');
  }
  
  function goHome() {
    gameState.reset();
    dispatch('goHome');
  }
</script>

<div class="flex flex-col gap-6 py-4">
  <div class="text-center">
    {#if isPerfect}
      <div class="text-4xl mb-2 animate-bounce">🎉</div>
      <h2 class="text-2xl font-black text-yellow-600 dark:text-yellow-400 mb-2">Perfect Score!</h2>
    {:else}
      <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Session Complete!</h2>
    {/if}
    
    <div class="text-5xl font-black text-blue-600 dark:text-blue-400 my-4">
      {mainScore.toFixed(2)}
      <span class="text-lg text-gray-400 ml-1">d'</span>
    </div>
    
    {#if state.taskType === 'dual'}
      <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Position: {dScore.toFixed(2)} | Sound: {soundDScore.toFixed(2)}
      </div>
    {/if}
    
    {#if typeof suggestion === 'object' && suggestion.type === 'sound'}
      <div class="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-xl font-bold text-sm inline-block">
        📚 {suggestion.message}
      </div>
    {:else if suggestion === 'up'}
      <div class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl font-bold text-sm inline-block">
        🎉 Level Up! Try {state.nLevel + 1}-back
      </div>
    {:else if suggestion === 'down'}
      <div class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-xl font-bold text-sm inline-block">
        📚 Keep Practicing! Try {state.nLevel - 1}-back
      </div>
    {:else}
      <div class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl font-bold text-sm inline-block">
        👍 Stay at {state.nLevel}-back
      </div>
    {/if}
  </div>
  
  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
    <div class="flex justify-between items-center mb-3">
      <h3 class="font-bold text-gray-700 dark:text-gray-300">Position Stream</h3>
      <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{dScore.toFixed(2)} d'</span>
    </div>
    <div class="grid grid-cols-4 gap-2 text-center text-sm">
      <div class="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
        <div class="text-xl font-bold text-green-600 dark:text-green-400">{positionTally.correctRejections}</div>
        <div class="text-xs text-green-600 dark:text-green-400">Correct</div>
      </div>
      <div class="bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
        <div class="text-xl font-bold text-red-600 dark:text-red-400">{positionTally.falseAlarms}</div>
        <div class="text-xs text-red-600 dark:text-red-400">False Alarm</div>
      </div>
      <div class="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2">
        <div class="text-xl font-bold text-blue-600 dark:text-blue-400">{positionTally.hits}</div>
        <div class="text-xs text-blue-600 dark:text-blue-400">Hits</div>
      </div>
      <div class="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
        <div class="text-xl font-bold text-orange-600 dark:text-orange-400">{positionTally.misses}</div>
        <div class="text-xs text-orange-600 dark:text-orange-400">Misses</div>
      </div>
    </div>
    <div class="text-center mt-3">
      <span class="text-lg font-bold text-gray-700 dark:text-gray-300">
        Accuracy: {Math.round(positionAccuracy)}%
      </span>
    </div>
  </div>
  
  {#if state.taskType === 'dual' || state.taskType === 'sound'}
    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 space-y-2">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-bold text-gray-700 dark:text-gray-300">Sound Stream</h3>
        <span class="text-lg font-bold text-purple-600 dark:text-purple-400">{soundDScore.toFixed(2)} d'</span>
      </div>
      <div class="grid grid-cols-4 gap-2 text-center text-sm">
        <div class="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
          <div class="text-xl font-bold text-green-600 dark:text-green-400">{soundTally.correctRejections}</div>
          <div class="text-xs text-green-600 dark:text-green-400">Correct</div>
        </div>
        <div class="bg-red-100 dark:bg-red-900/30 rounded-lg p-2">
          <div class="text-xl font-bold text-red-600 dark:text-red-400">{soundTally.falseAlarms}</div>
          <div class="text-xs text-red-600 dark:text-red-400">False Alarm</div>
        </div>
        <div class="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2">
          <div class="text-xl font-bold text-blue-600 dark:text-blue-400">{soundTally.hits}</div>
          <div class="text-xs text-blue-600 dark:text-blue-400">Hits</div>
        </div>
        <div class="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2">
          <div class="text-xl font-bold text-orange-600 dark:text-orange-400">{soundTally.misses}</div>
          <div class="text-xs text-orange-600 dark:text-orange-400">Misses</div>
        </div>
      </div>
      <div class="text-center mt-3">
        <span class="text-lg font-bold text-gray-700 dark:text-gray-300">
          Accuracy: {Math.round(soundAccuracy)}%
        </span>
      </div>
    </div>
  {/if}
  
  <div class="flex gap-3">
    <button
      type="button"
      class="flex-1 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition-all active:scale-95"
      on:click={playAgain}
    >
      Play Again
    </button>
    <button
      type="button"
      class="flex-1 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-lg transition-all active:scale-95"
      on:click={goHome}
    >
      Home
    </button>
  </div>
</div>
