<script>
  import { createEventDispatcher } from 'svelte';
  
  export let taskType = 'position';
  export let vibrationEnabled = true;
  
  const dispatch = createEventDispatcher();
  
  function handleResponse(response, stream = null) {
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
    dispatch('response', { response, stream });
  }
</script>

<div class="flex flex-col gap-3 w-full max-w-xs mx-auto">
  {#if taskType === 'dual'}
    <div class="text-center mb-2">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Position</p>
      <div class="flex gap-3">
        <button
          type="button"
          class="flex-1 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-lg transition-all active:scale-95 shadow-lg"
          on:click={() => handleResponse('match', 'position')}
        >
          Match
        </button>
        <button
          type="button"
          class="flex-1 py-4 px-6 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold text-lg transition-all active:scale-95"
          on:click={() => handleResponse('no-match', 'position')}
        >
          No Match
        </button>
      </div>
    </div>
    
    <div class="text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Sound</p>
      <div class="flex gap-3">
        <button
          type="button"
          class="flex-1 py-4 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-bold text-lg transition-all active:scale-95 shadow-lg"
          on:click={() => handleResponse('match', 'sound')}
        >
          Match
        </button>
        <button
          type="button"
          class="flex-1 py-4 px-6 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold text-lg transition-all active:scale-95"
          on:click={() => handleResponse('no-match', 'sound')}
        >
          No Match
        </button>
      </div>
    </div>
  {:else}
    <div class="flex gap-3">
      <button
        type="button"
        class="flex-1 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-lg transition-all active:scale-95 shadow-lg"
        on:click={() => handleResponse('match')}
      >
        Match
      </button>
      <button
        type="button"
        class="flex-1 py-4 px-6 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold text-lg transition-all active:scale-95"
        on:click={() => handleResponse('no-match')}
      >
        No Match
      </button>
    </div>
  {/if}
</div>
