<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { getStats } from '../stores/wordScramble';
  
  export let onDone = () => {};
  
  let showContent = false;
  let stats = null;
  
  onMount(async () => {
    setTimeout(() => {
      showContent = true;
    }, 300);
    stats = await getStats();
  });
  
  $: accuracy = stats && stats.totalWords > 0 
    ? Math.round((stats.totalCorrect / stats.totalWords) * 100) 
    : 0;
</script>

<div class="flex flex-col h-full items-center justify-center">
  {#if showContent}
    <div class="text-center" in:fade={{ duration: 500 }}>
      <div class="text-7xl mb-6" in:fly={{ y: 20, duration: 600 }}>🎉</div>
      
      <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-2" in:fly={{ y: 20, duration: 600, delay: 100 }}>
        Great Job!
      </h2>
      
      <p class="text-gray-500 dark:text-gray-400 mb-8" in:fly={{ y: 20, duration: 600, delay: 200 }}>
        You've completed this session
      </p>
      
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 mb-8 w-full max-w-sm mx-auto" in:fly={{ y: 20, duration: 600, delay: 300 }}>
        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <p class="text-3xl font-black text-blue-600 dark:text-blue-400">{accuracy}%</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Accuracy</p>
          </div>
          <div>
            <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats?.streak || 0}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Day Streak</p>
          </div>
        </div>
      </div>
      
      <button
        on:click={onDone}
        class="w-full max-w-sm py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        in:fly={{ y: 20, duration: 600, delay: 400 }}
      >
        Back to Home
      </button>
    </div>
  {/if}
</div>
