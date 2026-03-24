<script>
  import { createEventDispatcher } from 'svelte';
  import { PALETTES, COLOR_KEYS } from '../utils/colorEngine';
  import { settings } from '../stores/settings';
  
  const dispatch = createEventDispatcher();
  let lastTap = 0;
  const DEBOUNCE = 100;

  $: currentPalette = PALETTES[$settings.palette];

  function handleTap(colorKey) {
    const now = performance.now();
    if (now - lastTap < DEBOUNCE) return;
    lastTap = now;
    dispatch('respond', colorKey);
  }
</script>

<div class="grid grid-cols-2 gap-4 mt-8">
  {#each COLOR_KEYS as key}
    <button
      on:click={() => handleTap(key)}
      class="h-24 {currentPalette[key].bg} text-white rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center text-xl font-bold uppercase tracking-wider"
    >
      {currentPalette[key].name}
    </button>
  {/each}
</div>
