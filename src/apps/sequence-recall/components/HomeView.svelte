<script>
  import { createEventDispatcher } from 'svelte';
  import { settings } from '../stores/settings';
  import { gameState } from '../stores/gameState';
  
  const dispatch = createEventDispatcher();
  
  let nLevel = 1;
  let taskType = 'position';
  let gridSize = '3x3';
  let rounds = 20;
  
  $: if ($settings) {
    nLevel = $settings.defaultLevel;
    taskType = $settings.defaultTaskType;
    gridSize = $settings.defaultGridSize;
    rounds = $settings.defaultRounds;
  }
  
  function startGame() {
    gameState.startSession({
      nLevel,
      taskType,
      gridSize: taskType === 'sound' ? null : gridSize,
      rounds
    });
    dispatch('startGame');
  }
</script>

<div class="flex flex-col gap-6 py-4">
  <div class="text-center">
    <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Sequence Recall</h2>
    <p class="text-gray-500 dark:text-gray-400 text-sm">Train your working memory</p>
  </div>
  
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        N-Level: <span class="text-blue-600 dark:text-blue-400">{nLevel}-back</span>
      </label>
      <div class="flex gap-2">
        {#each [1, 2, 3, 4, 5] as level}
          <button
            type="button"
            class="flex-1 py-2 rounded-lg font-bold text-sm transition-all
              {nLevel === level 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}"
            on:click={() => nLevel = level}
          >
            {level}
          </button>
        {/each}
      </div>
    </div>
    
    <div>
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Task Type
      </label>
      <div class="flex gap-2">
        {#each [['position', 'Position'], ['sound', 'Sound'], ['dual', 'Dual']] as [value, label]}
          <button
            type="button"
            class="flex-1 py-2 rounded-lg font-bold text-sm transition-all
              {taskType === value 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}"
            on:click={() => taskType = value}
          >
            {label}
          </button>
        {/each}
      </div>
    </div>
    
    {#if taskType !== 'sound'}
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Grid Size
        </label>
        <div class="flex gap-2">
          {#each [['2x2', '2×2'], ['3x3', '3×3'], ['4x4', '4×4']] as [value, label]}
            <button
              type="button"
              class="flex-1 py-2 rounded-lg font-bold text-sm transition-all
                {gridSize === value 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}"
              on:click={() => gridSize = value}
            >
              {label}
            </button>
          {/each}
        </div>
      </div>
    {/if}
    
    <div>
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Rounds: <span class="text-blue-600 dark:text-blue-400">{rounds}</span>
      </label>
      <input
        type="range"
        min="10"
        max="50"
        step="5"
        bind:value={rounds}
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  </div>
  
  <button
    type="button"
    class="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition-all active:scale-95"
    on:click={startGame}
  >
    Start Training
  </button>
  
  <div class="flex gap-3">
    <button
      type="button"
      class="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
      on:click={() => dispatch('showStats')}
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      Statistics
    </button>
    <button
      type="button"
      class="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
      on:click={() => dispatch('showSettings')}
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Settings
    </button>
  </div>
</div>
