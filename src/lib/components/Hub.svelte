<script>
  import { apps, getOrderedApps } from '../stores/apps';
  import { settings } from '../stores/settings';
  import { onMount } from 'svelte';
  import { vibrateTap } from '../utils/haptics';
  import AppCard from './AppCard.svelte';
  import AppListItem from './AppListItem.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let deferredPrompt = null;
  let showInstallButton = false;

  onMount(() => {
    apps.loadApps();
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallButton = true;
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      showInstallButton = false;
    });
  });

  async function installApp() {
    if (!deferredPrompt) {
      alert('Install prompt not available. Please use your browser menu to add to home screen.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt = null;
      showInstallButton = false;
    }
  }

  async function toggleView() {
    const newMode = $settings.hubViewMode === 'grid' ? 'list' : 'grid';
    vibrateTap();
    await settings.setHubViewMode(newMode);
  }

  $: orderedApps = getOrderedApps($settings.hubViewMode, $apps, $settings.hubAppOrder || null);
</script>

<div class="p-6">
  <div class="flex items-center justify-between mb-8">
    <h2 class="text-3xl font-black text-gray-900 dark:text-white">Brain Workouts</h2>
    <div class="flex items-center gap-2">
      <button
        on:click={toggleView}
        class="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle view"
      >
        {#if $settings.hubViewMode === 'grid'}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        {/if}
      </button>
      {#if showInstallButton}
        <button 
          on:click={installApp}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Install
        </button>
      {/if}
    </div>
  </div>
  
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
  {:else if $settings.hubViewMode === 'grid'}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each orderedApps as app (app.id)}
        <AppCard {app} />
      {/each}
    </div>
  {:else}
    <div class="flex flex-col gap-2">
      {#each orderedApps as app, index (app.id)}
        <AppListItem {app} {index} appCount={orderedApps.length} />
      {/each}
    </div>
  {/if}
</div>
