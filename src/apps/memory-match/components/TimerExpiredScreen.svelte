<script>
  import {
    matchedPairIds, selectedGridSize, resetGame
  } from '../stores/memoryMatch';
  import { GRID_SIZES } from '../utils/cards';

  $: config = GRID_SIZES[$selectedGridSize] || GRID_SIZES['4x4'];
  $: matchedCount = $matchedPairIds.size;

  function handlePlayAgain() {
    resetGame();
  }

  function handleHome() {
    resetGame();
  }
</script>

<div class="flex flex-col items-center gap-6 py-8">
  <h2 class="text-3xl font-bold text-red-500 dark:text-red-400">
    ⏰ Time's Up!
  </h2>

  <div class="flex flex-col gap-4 w-full max-w-xs">
    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
      <div class="text-sm text-gray-500 dark:text-gray-400">Pairs Matched</div>
      <div class="text-2xl font-bold text-gray-900 dark:text-white">
        {matchedCount} / {config.pairs}
      </div>
    </div>
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
