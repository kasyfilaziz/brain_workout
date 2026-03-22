<script>
  import { onMount } from 'svelte';
  import { theme } from '../../lib/stores/theme';
  import { initWordScrambleStores, currentSession } from './stores/wordScramble';
  
  import HomeView from './components/HomeView.svelte';
  import GameView from './components/GameView.svelte';
  import ResultsView from './components/ResultsView.svelte';
  import StatsView from './components/StatsView.svelte';
  import ListEditor from './components/ListEditor.svelte';
  
  let activeView = 'home';
  let loading = true;
  let sessionResult = null;
  
  $: isPlaying = $currentSession !== null;
  
  onMount(async () => {
    try {
      console.log('Word Scramble: Starting initialization...');
      await initWordScrambleStores();
      console.log('Word Scramble: Initialization complete');
      loading = false;
    } catch (e) {
      console.error('Word Scramble init error:', e);
      loading = false;
    }
    
    window.addEventListener('wordScramble:startGame', handleStartGame);
  });
  
  function handleStartGame() {
    activeView = 'game';
  }
  
  function handleFinish() {
    activeView = 'results';
  }
  
  function handleResultsDone() {
    activeView = 'home';
    sessionResult = null;
  }
  
  function handleShowStats() {
    activeView = 'stats';
  }
  
  function handleShowLists() {
    activeView = 'lists';
  }
  
  function handleBackToHome() {
    activeView = 'home';
  }
</script>

<div class="flex-1 flex flex-col">
  {#if loading}
    <div class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  {:else if activeView === 'home'}
    <div class="flex-1 px-5 pt-2 pb-24">
      <HomeView onStats={handleShowStats} onLists={handleShowLists} />
    </div>
  {:else if activeView === 'game'}
    <div class="flex-1 px-5 pt-2">
      <GameView onFinish={handleFinish} />
    </div>
  {:else if activeView === 'results'}
    <div class="flex-1 px-5 pt-2 pb-24">
      <ResultsView onDone={handleResultsDone} />
    </div>
  {:else if activeView === 'stats'}
    <div class="flex-1 px-5 pt-2 pb-24">
      <StatsView />
      <button
        on:click={handleBackToHome}
        class="w-full mt-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        ← Back to Home
      </button>
    </div>
  {:else if activeView === 'lists'}
    <div class="flex-1 px-5 pt-2 pb-24">
      <ListEditor />
      <button
        on:click={handleBackToHome}
        class="w-full mt-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        ← Back to Home
      </button>
    </div>
  {/if}
</div>
