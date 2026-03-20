<script>
  import {
    moves, elapsedSeconds, selectedGridSize,
    highScores, saveScore, isNewBest, resetGame, gameState
  } from '../stores/memoryMatch';
  import { onMount } from 'svelte';

  let wasNewBest = false;

  onMount(async () => {
    wasNewBest = await saveScore($selectedGridSize, $moves, $elapsedSeconds);
  });

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function handlePlayAgain() {
    resetGame();
  }

  function handleHome() {
    resetGame();
  }
</script>

<div class="flex flex-col items-center gap-6 py-8">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
    {wasNewBest ? '🎉 New Best!' : '🏆 Complete!'}
  </h2>

  <div class="flex flex-col gap-4 w-full max-w-xs">
    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
      <div class="text-sm text-gray-500 dark:text-gray-400">Moves</div>
      <div class="text-2xl font-bold text-gray-900 dark:text-white">{$moves}</div>
    </div>

    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
      <div class="text-sm text-gray-500 dark:text-gray-400">Time</div>
      <div class="text-2xl font-bold text-gray-900 dark:text-white">{formatTime($elapsedSeconds)}</div>
    </div>

    {#if $highScores[$selectedGridSize] && !wasNewBest}
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
        <div class="text-sm text-blue-600 dark:text-blue-400">Personal Best</div>
        <div class="text-lg font-bold text-blue-900 dark:text-blue-300">
          {$highScores[$selectedGridSize].bestMoves} moves in {formatTime($highScores[$selectedGridSize].bestTime)}
        </div>
      </div>
    {/if}
  </div>

  <div class="flex gap-3 w-full max-w-xs">
    <button
      on:click={handlePlayAgain}
      class="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-colors"
    >
      Play Again
    </button>
    <button
      on:click={handleHome}
      class="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-xl transition-colors"
    >
      Home
    </button>
  </div>
</div>
