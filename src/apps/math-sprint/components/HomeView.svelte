<script>
  import { onMount } from 'svelte';
  import {
    selectedOperation, selectedDifficulty, selectedMode, timedDuration,
    mastery, settings, startGame, initMathSprintStores, getMasteryColor
  } from '../stores/mathSprint';

  const operations = [
    { id: 'add', name: 'Addition', symbol: '+' },
    { id: 'subtract', name: 'Subtraction', symbol: '-' },
    { id: 'multiply', name: 'Multiplication', symbol: '\u00D7' },
    { id: 'divide', name: 'Division', symbol: '\u00F7' },
    { id: 'mixed', name: 'Mixed', symbol: '~' }
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', desc: '1-9' },
    { id: 'medium', name: 'Medium', desc: '10-99' },
    { id: 'hard', name: 'Hard', desc: '100-999' }
  ];

  const modes = [
    { id: 'sprint', name: 'Sprint', desc: '30 problems' },
    { id: 'timed', name: 'Timed', desc: 'Countdown' }
  ];

  const timerOptions = [30, 60, 90, 120];

  const colorClasses = {
    neutral: 'bg-gray-200 dark:bg-gray-700',
    red: 'bg-red-400 dark:bg-red-600',
    yellow: 'bg-yellow-400 dark:bg-yellow-600',
    green: 'bg-green-400 dark:bg-green-600'
  };

  onMount(async () => {
    await initMathSprintStores();
    selectedMode.set($settings.defaultMode);
    timedDuration.set($settings.timedDuration);
  });

  function handleStart() {
    startGame();
  }

  function getMasteryForCombo(op, diff) {
    const key = `${op}_${diff}`;
    const record = $mastery[key];
    if (!record) return { color: 'neutral', label: 'New' };
    return { color: getMasteryColor(record.interval), label: `Lv ${record.interval}` };
  }
</script>

<div class="flex flex-col gap-6">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Math Sprint</h1>

  <!-- Mastery Grid -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Mastery</label>
    <div class="grid grid-cols-5 gap-1 text-center text-xs">
      {#each ['add', 'subtract', 'multiply', 'divide', 'mixed'] as op}
        {#each ['easy', 'medium', 'hard'] as diff}
          {@const masteryInfo = getMasteryForCombo(op, diff)}
          <div class="p-1.5 rounded-lg {colorClasses[masteryInfo.color]} text-white font-medium" title="{op} {diff}: {masteryInfo.label}">
            {masteryInfo.label}
          </div>
        {/each}
      {/each}
    </div>
    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
      <span>+  -  x  /  ~</span>
      <span>E / M / H</span>
    </div>
  </div>

  <!-- Operation Selection -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Operation</label>
    <div class="grid grid-cols-2 gap-2">
      {#each operations as op}
        <button
          on:click={() => selectedOperation.set(op.id)}
          class="p-3 rounded-xl text-left transition-all {$selectedOperation === op.id
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}"
        >
          <div class="font-bold">{op.name}</div>
          <div class="text-xs opacity-75">{op.symbol}</div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Difficulty Selection -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty</label>
    <div class="grid grid-cols-3 gap-2">
      {#each difficulties as diff}
        <button
          on:click={() => selectedDifficulty.set(diff.id)}
          class="p-3 rounded-xl text-center transition-all {$selectedDifficulty === diff.id
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}"
        >
          <div class="font-bold">{diff.name}</div>
          <div class="text-xs opacity-75">{diff.desc}</div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Mode Selection -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Mode</label>
    <div class="grid grid-cols-2 gap-2">
      {#each modes as mode}
        <button
          on:click={() => selectedMode.set(mode.id)}
          class="p-3 rounded-xl text-center transition-all {$selectedMode === mode.id
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}"
        >
          <div class="font-bold">{mode.name}</div>
          <div class="text-xs opacity-75">{mode.desc}</div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Timed Duration -->
  {#if $selectedMode === 'timed'}
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
      <div class="flex gap-2">
        {#each timerOptions as seconds}
          <button
            on:click={() => timedDuration.set(seconds)}
            class="flex-1 py-2 rounded-lg text-sm transition-all {$timedDuration === seconds
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'}"
          >
            {seconds}s
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Start Button -->
  <button
    on:click={handleStart}
    class="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-colors"
  >
    Start Game
  </button>
</div>
