<script>
  import { onMount } from 'svelte';
  import { getStats } from '../stores/wordScramble';
  
  let stats = null;
  
  onMount(async () => {
    stats = await getStats();
  });
</script>

<div class="space-y-6">
  <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-4">Statistics</h2>
  
  {#if stats}
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 text-center">
        <p class="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.totalWords}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Words Practiced</p>
      </div>
      
      <div class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 text-center">
        <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.accuracy}%</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Accuracy</p>
      </div>
      
      <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 text-center">
        <p class="text-3xl font-black text-amber-600 dark:text-amber-400">{stats.streak}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Day Streak</p>
      </div>
      
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 text-center">
        <p class="text-3xl font-black text-purple-600 dark:text-purple-400">{stats.totalSessions}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sessions</p>
      </div>
    </div>
    
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
      <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-3 text-sm uppercase tracking-wide">Mastery Progress</h3>
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600 dark:text-gray-300">New Words</span>
          <span class="font-bold text-blue-600 dark:text-blue-400">{stats.newWords}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600 dark:text-gray-300">Learning</span>
          <span class="font-bold text-amber-600 dark:text-amber-400">{stats.learning}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600 dark:text-gray-300">Mastered</span>
          <span class="font-bold text-emerald-600 dark:text-emerald-400">{stats.mastered}</span>
        </div>
      </div>
    </div>
  {:else}
    <div class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  {/if}
</div>
