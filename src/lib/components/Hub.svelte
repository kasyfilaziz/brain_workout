<script>
  import { apps } from '../stores/apps';
  import { onMount } from 'svelte';
  import AppCard from './AppCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  onMount(() => {
    apps.loadApps();
  });
</script>

<div class="p-6">
  <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-8">Brain Workouts</h2>
  
  {#if $apps.length === 0}
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-20 h-20 mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Apps Available</h3>
      <p class="text-gray-500 dark:text-gray-400 max-w-xs">No workout apps have been registered yet. Check back later!</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each $apps as app (app.id)}
        <AppCard {app} />
      {/each}
    </div>
  {/if}
</div>
