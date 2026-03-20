<script>
  import { onMount } from 'svelte';
  import { useRegisterSW } from 'virtual:pwa-register/svelte';
  import { theme, toggleTheme } from './lib/stores/theme';
  import { navigation } from './lib/stores/navigation';
  import { apps } from './lib/stores/apps';
  
  import Hub from './lib/components/Hub.svelte';
  import LoadingSpinner from './lib/components/LoadingSpinner.svelte';

  const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW();

  // Store for loaded app components
  let loadedComponents = {};

  onMount(async () => {
    await navigation.init();
    await apps.loadApps();
  });

  function closeToast() {
    offlineReady.set(false);
    needRefresh.set(false);
  }

  $: currentApp = $apps.find(a => a.id === $navigation.currentAppId);
  
  async function getAppComponent(app) {
    if (!app) return null;
    if (loadedComponents[app.id]) return loadedComponents[app.id];
    if (app.componentLoader) {
      const mod = await app.componentLoader();
      loadedComponents[app.id] = mod.default;
      return mod.default;
    }
    return null;
  }

  $: toastVisible = $offlineReady || $needRefresh;
</script>

<div class="flex-1 flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 h-screen overflow-hidden">
  <header class="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-30">
    <div class="flex items-center space-x-2">
      {#if $navigation.currentAppId}
        <button on:click={() => navigation.navigateTo(null)} class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      {:else}
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        </div>
      {/if}
      <h1 class="text-xl font-black tracking-tighter">
        {#if currentApp}
          {currentApp.name}
        {:else}
          Brain Workouts
        {/if}
      </h1>
    </div>
    
    <button 
      on:click={toggleTheme}
      class="p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-all active:scale-90 shadow-sm"
      aria-label="Toggle Theme"
    >
      {#if $theme === 'dark'}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 000 14 7 7 0 000-14z" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      {/if}
    </button>
  </header>

  <main class="flex-1 p-5 pb-8 max-w-[600px] mx-auto w-full overflow-y-auto">
    {#if !$navigation.currentAppId}
      <Hub />
    {:else if currentApp}
      {#await getAppComponent(currentApp)}
        <LoadingSpinner />
      {:then Component}
        {#if Component}
          <svelte:component this={Component} />
        {:else}
          <p>App component not found</p>
          <button on:click={() => navigation.navigateTo(null)} class="text-blue-500">Back to Hub</button>
        {/if}
      {:catch error}
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to Load App</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Something went wrong while loading this app. Please try again.</p>
          <button on:click={() => navigation.navigateTo(null)} class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
            Back to Hub
          </button>
        </div>
      {/await}
    {:else}
      <p class="text-gray-500 text-center">App not found</p>
      <button on:click={() => navigation.navigateTo(null)} class="text-blue-500 mt-4">Back to Hub</button>
    {/if}
  </main>

  {#if toastVisible}
    <div class="fixed bottom-4 left-4 right-4 max-w-[568px] mx-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between z-50">
      <div class="flex items-center space-x-3">
        <div class="bg-blue-500 rounded-full h-2 w-2 animate-ping"></div>
        <span class="text-xs font-bold uppercase tracking-widest">
          {$offlineReady ? 'Offline Ready' : 'Update Available'}
        </span>
      </div>
      <div class="flex gap-2">
        {#if $needRefresh}
          <button on:click={() => updateServiceWorker(true)} class="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl">
            Update
          </button>
        {/if}
        <button on:click={closeToast} class="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-white/20 dark:border-black/10">
          Tutup
        </button>
      </div>
    </div>
  {/if}
</div>