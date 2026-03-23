<script>
  import { PALETTES } from '../utils/colorEngine';
  import { settings } from '../stores/settings';
  export let stimulus;
  export let mode;

  $: currentPalette = PALETTES[$settings.palette];
  $: colorClass = stimulus && stimulus.color !== 'DEFAULT' 
    ? currentPalette[stimulus.color].class 
    : 'text-gray-900 dark:text-gray-100';
  
  $: displayText = mode === 'C' ? 'XXXX' : (stimulus ? currentPalette[stimulus.word].name : '');
</script>

<div class="flex items-center justify-center h-48 my-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner border-2 border-gray-200 dark:border-gray-700">
  {#if stimulus}
    <span class="text-6xl font-black tracking-tighter uppercase transition-all duration-75 {colorClass}">
      {displayText}
    </span>
  {:else}
    <span class="text-gray-400">Ready?</span>
  {/if}
</div>
