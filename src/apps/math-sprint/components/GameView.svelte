<script>
  import {
    currentProblem, problemNumber, correctCount, incorrectCount,
    elapsedTime, timeRemaining, selectedMode, lastAnswerCorrect,
    settings, submitAnswer, totalProblems
  } from '../stores/mathSprint';
  import { getOperationSymbol } from '../utils/problems';

  let answerInput = '';

  function playSound(correct) {
    if (!$settings.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = correct ? 880 : 220;
      osc.type = correct ? 'sine' : 'square';
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) { /* Audio not available */ }
  }

  function vibrate(correct) {
    if (!$settings.vibrationEnabled) return;
    if (navigator.vibrate) {
      navigator.vibrate(correct ? 50 : [50, 50, 50]);
    }
  }

  function handleSubmit() {
    if (answerInput === '') return;
    const wasCorrect = $currentProblem && Number(answerInput) === $currentProblem.answer;
    submitAnswer(answerInput);
    answerInput = '';
    playSound(wasCorrect);
    vibrate(wasCorrect);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
</script>

<div class="flex flex-col gap-4">
  <!-- Stats Bar -->
  <div class="flex justify-between items-center px-2">
    <div class="flex items-center gap-4">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        <span class="font-bold text-gray-900 dark:text-white">{$correctCount}</span> / {$correctCount + $incorrectCount}
      </div>
    </div>
    <div class="text-sm font-bold {$selectedMode === 'timed' && $timeRemaining <= 10 ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}">
      {#if $selectedMode === 'sprint'}
        {$problemNumber} / 30
      {:else}
        {formatTime($timeRemaining)}
      {/if}
    </div>
  </div>

  <!-- Problem Display -->
  {#if $currentProblem}
    <div class="flex flex-col items-center gap-6 py-8">
      <div class="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white select-none leading-tight">
        {$currentProblem.operand1} {getOperationSymbol($currentProblem.operation)} {$currentProblem.operand2} = ?
      </div>

      <!-- Feedback -->
      {#if $lastAnswerCorrect !== null}
        <div class="text-lg font-semibold {$lastAnswerCorrect ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}">
          {#if $lastAnswerCorrect}
            Correct!
          {:else}
            Answer: {$currentProblem.answer}
          {/if}
        </div>
      {/if}

      <!-- Input -->
      <div class="flex gap-2 w-full max-w-xs">
        <input
          type="number"
          bind:value={answerInput}
          on:keydown={handleKeydown}
          class="flex-1 px-4 py-3 text-2xl text-center rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="?"
          inputmode="numeric"
          autocomplete="off"
        />
        <button
          on:click={handleSubmit}
          class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
        >
          Go
        </button>
      </div>
    </div>
  {/if}
</div>
