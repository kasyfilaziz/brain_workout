<script>
  import { createEventDispatcher } from 'svelte';
  export let activeTab = 'dashboard';

  const dispatch = createEventDispatcher();

  function selectTab(tab) {
    dispatch('select', tab);
  }
</script>

<nav class="fixed bottom-0 left-0 right-0 max-w-[600px] mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 flex justify-around items-center h-16 px-4 z-40 shadow-2xl safe-area-pb">
  <button 
    on:click={() => selectTab('dashboard')} 
    class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 {activeTab === 'dashboard' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-400 dark:text-gray-500'}"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1.1 1.1 0 001.1 1.1h11.8a1.1 1.1 0 001.1-1.1V10M9 21V9h6v12" />
    </svg>
    <span class="text-[10px] font-bold mt-1 uppercase tracking-tighter">Deck</span>
  </button>

  <button 
    on:click={() => selectTab('import')} 
    class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 {activeTab === 'import' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-400 dark:text-gray-500'}"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
    <span class="text-[10px] font-bold mt-1 uppercase tracking-tighter">Import</span>
  </button>

  <button 
    on:click={() => selectTab('stats')} 
    class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 {activeTab === 'stats' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-400 dark:text-gray-500'}"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <span class="text-[10px] font-bold mt-1 uppercase tracking-tighter">Stats</span>
  </button>
</nav>

<style>
  .safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom);
    height: calc(4rem + env(safe-area-inset-bottom));
  }
</style>
