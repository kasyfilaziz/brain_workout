<script>
  import { getAverageRT, formatRT, calculateIG } from '../utils/metrics';
  export let results;
  export let mode;
  export let baselines;

  $: avgRT = getAverageRT(results);
  $: accuracy = (results.filter(t => t.isCorrect).length / results.length) * 100;
  $: ig = mode === 'CW' ? calculateIG(avgRT, baselines.avgWordReadingRT, baselines.avgColorNamingRT) : null;
</script>

<div class="space-y-4">
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm text-center">
      <div class="text-xs text-gray-500 uppercase font-bold mb-1">Accuracy</div>
      <div class="text-2xl font-black text-gray-900 dark:text-white">{accuracy.toFixed(0)}%</div>
    </div>
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm text-center">
      <div class="text-xs text-gray-500 uppercase font-bold mb-1">Avg Speed</div>
      <div class="text-2xl font-black text-gray-900 dark:text-white">{formatRT(avgRT)}</div>
    </div>
  </div>

  {#if ig !== null}
    <div class="bg-blue-600 p-6 rounded-2xl text-white text-center shadow-lg">
      <div class="text-xs uppercase font-bold mb-1 opacity-80">Interference Score (IG)</div>
      <div class="text-4xl font-black">{ig > 0 ? '+' : ''}{ig.toFixed(1)}ms</div>
      <p class="text-xs mt-2 opacity-70">Lower is better. Measures cognitive inhibition cost.</p>
    </div>
  {/if}
</div>
