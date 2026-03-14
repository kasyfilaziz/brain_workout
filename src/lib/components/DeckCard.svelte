<script>
  import { createEventDispatcher } from 'svelte';
  export let deck;
  export let dueCount = 0;
  export let totalCount = 0;

  const dispatch = createEventDispatcher();
</script>

<div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-shadow duration-200 group">
  <div class="flex justify-between items-start mb-3">
    <h3 class="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{deck.name}</h3>
    <button on:click|stopPropagation={() => dispatch('delete', deck.id)} class="text-gray-300 hover:text-red-500 p-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
  
  <div class="flex justify-between items-end">
    <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
      <p>{totalCount} total kartu</p>
      {#if dueCount > 0}
        <p class="text-orange-500 font-semibold">{dueCount} perlu dipelajari hari ini</p>
      {:else}
        <p class="text-green-500">Semua kartu sudah dipelajari</p>
      {/if}
    </div>
  </div>
</div>
