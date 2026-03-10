<script>
  import { onMount } from 'svelte';
  import { useRegisterSW } from 'virtual:pwa-register/svelte';
  import { theme, toggleTheme } from './lib/stores/theme';
  import { loadDecks, loadCards } from './lib/stores/flashcards';
  
  import Navbar from './lib/components/Navbar.svelte';
  import Dashboard from './lib/components/Dashboard.svelte';
  import StudyView from './lib/components/StudyView.svelte';
  import ImportView from './lib/components/ImportView.svelte';
  import StatsView from './lib/components/StatsView.svelte';

  const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW();

  let activeTab = typeof localStorage !== 'undefined' ? localStorage.getItem('lastActiveTab') || 'dashboard' : 'dashboard';
  let studyingDeckId = null;
  let deferredPrompt;
  let showInstallButton = false;

  $: if (typeof localStorage !== 'undefined' && activeTab !== 'study') {
    localStorage.setItem('lastActiveTab', activeTab);
  }

  onMount(async () => {
    await loadDecks();
    await loadCards();
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallButton = true;
    });
  });

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showInstallButton = false;
    }
    deferredPrompt = null;
  }

  function closeToast() {
    offlineReady.set(false);
    needRefresh.set(false);
  }

  function startStudy(deckId) {
    studyingDeckId = deckId;
    activeTab = 'study';
  }

  function finishStudy() {
    studyingDeckId = null;
    activeTab = 'dashboard';
  }

  $: toastVisible = $offlineReady || $needRefresh;
</script>

<div class="flex-1 flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 min-h-screen">
  {#if activeTab !== 'study'}
    <header class="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-30">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        </div>
        <h1 class="text-xl font-black tracking-tighter">Flashcard App</h1>
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
  {/if}

  <main class="flex-1 p-5 pb-24 max-w-[600px] mx-auto w-full">
    {#if activeTab === 'dashboard'}
      <Dashboard {showInstallButton} on:study={(e) => startStudy(e.detail)} on:install={handleInstall} />
    {:else if activeTab === 'study'}
      <StudyView deckId={studyingDeckId} on:finish={finishStudy} />
    {:else if activeTab === 'import'}
      <ImportView on:finish={() => activeTab = 'dashboard'} />
    {:else if activeTab === 'stats'}
      <StatsView />
    {/if}
  </main>

  {#if activeTab !== 'study'}
    <Navbar {activeTab} on:select={(e) => activeTab = e.detail} />
  {/if}

  {#if toastVisible}
    <div class="fixed bottom-20 left-4 right-4 max-w-[568px] mx-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-5 rounded-[2rem] shadow-2xl flex items-center justify-between z-50 animate-bounce">
      <div class="flex items-center space-x-3">
        <div class="bg-blue-500 rounded-full h-2 w-2 animate-ping"></div>
        <span class="text-xs font-black uppercase tracking-widest">
          {$offlineReady ? 'Offline Ready' : 'Update Available'}
        </span>
      </div>
      <div class="flex gap-2">
        {#if $needRefresh}
          <button on:click={() => updateServiceWorker(true)} class="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
            Update
          </button>
        {/if}
        <button on:click={closeToast} class="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/20 dark:border-black/10">
          Tutup
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    @apply bg-gray-50 dark:bg-black overflow-x-hidden;
    -webkit-tap-highlight-color: transparent;
  }
  
  :global(.rotate-y-180) {
    transform: rotateY(180deg);
  }
  
  :global(.preserve-3d) {
    transform-style: preserve-3d;
  }
  
  :global(.backface-hidden) {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
</style>
