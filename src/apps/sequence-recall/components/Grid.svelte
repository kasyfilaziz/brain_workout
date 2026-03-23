<script>
  import { createEventDispatcher } from 'svelte';
  
  export let gridSize = '3x3';
  export let activePosition = null;
  
  const dispatch = createEventDispatcher();
  
  $: gridClass = {
    '2x2': 'grid-cols-2',
    '3x3': 'grid-cols-3',
    '4x4': 'grid-cols-4'
  }[gridSize] || 'grid-cols-3';
  
  $: totalCells = {
    '2x2': 4,
    '3x3': 9,
    '4x4': 16
  }[gridSize] || 9;
  
  function handleCellClick(index) {
    dispatch('select', { position: index });
  }
</script>

<div class="grid {gridClass} gap-2 w-full max-w-xs mx-auto aspect-square">
  {#each Array(totalCells) as _, index}
    <button
      type="button"
      class="aspect-square rounded-xl transition-all duration-200 flex items-center justify-center text-2xl font-bold
        {activePosition === index 
          ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/30 n-back-highlight' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}"
      on:click={() => handleCellClick(index)}
    >
      {#if activePosition === index}
        <span class="text-white">●</span>
      {/if}
    </button>
  {/each}
</div>
