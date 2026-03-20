<script>
  import {
    correctCount, incorrectCount, totalProblems, accuracy,
    elapsedTime, selectedOperation, selectedDifficulty, selectedMode,
    startGame, resetGame
  } from '../stores/mathSprint';

  const operationNames = {
    add: 'Addition',
    subtract: 'Subtraction',
    multiply: 'Multiplication',
    divide: 'Division',
    mixed: 'Mixed'
  };

  const difficultyNames = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  };

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function handlePlayAgain() {
    startGame();
  }

  function handleHome() {
    resetGame();
  }
</script>

<div class="flex flex-col items-center gap-6 py-8">
  <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
    {#if $accuracy >= 90}
      Excellent!
    {:else if $accuracy >= 70}
      Good Job!
    {:else if $accuracy >= 50}
      Keep Practicing!
    {:else}
      Try Again!
    {/if}
  </h2>

  <div class="text-sm text-gray-500 dark:text-gray-400">
    {operationNames[$selectedOperation]} | {difficultyNames[$selectedDifficulty]} | {$selectedMode === 'sprint' ? 'Sprint' : 'Timed'}
  </div>

  <div class="flex flex-col gap-4 w-full max-w-xs">
    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
      <div class="text-sm text-gray-500 dark:text-gray-400">Score</div>
      <div class="text-2xl font-bold text-gray-900 dark:text-white">
        {$correctCount} / {$totalProblems}
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
        <div class="text-sm text-green-600 dark:text-green-400">Correct</div>
        <div class="text-2xl font-bold text-green-700 dark:text-green-300">{$correctCount}</div>
      </div>

      <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
        <div class="text-sm text-red-600 dark:text-red-400">Incorrect</div>
        <div class="text-2xl font-bold text-red-700 dark:text-red-300">{$incorrectCount}</div>
      </div>
    </div>

    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
      <div class="text-sm text-gray-500 dark:text-gray-400">Accuracy</div>
      <div class="text-2xl font-bold text-gray-900 dark:text-white">{$accuracy}%</div>
    </div>

    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
      <div class="text-sm text-gray-500 dark:text-gray-400">Time</div>
      <div class="text-2xl font-bold text-gray-900 dark:text-white">{formatTime($elapsedTime)}</div>
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
