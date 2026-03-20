<script>
  import { gameState, resetGame } from './stores/mathSprint';

  import HomeView from './components/HomeView.svelte';
  import GameView from './components/GameView.svelte';
  import ResultsView from './components/ResultsView.svelte';
  import StatsView from './components/StatsView.svelte';
  import SettingsView from './components/SettingsView.svelte';

  import PlayIcon from './components/icons/PlayIcon.svelte';
  import StatsIcon from './components/icons/StatsIcon.svelte';
  import SettingsIcon from './components/icons/SettingsIcon.svelte';

  let activeTab = 'play';

  $: isPlaying = $gameState === 'playing';

  function handleTabChange(tab) {
    if (isPlaying) return;
    if ($gameState !== 'home') {
      resetGame();
    }
    activeTab = tab;
  }
</script>

<div class="flex-1 flex flex-col">
  <div class="flex-1 px-5 pt-2 pb-24">
    {#if activeTab === 'play'}
      {#if $gameState === 'home'}
        <HomeView />
      {:else if $gameState === 'playing'}
        <GameView />
      {:else if $gameState === 'results'}
        <ResultsView />
      {/if}
    {:else if activeTab === 'stats'}
      <StatsView />
    {:else if activeTab === 'settings'}
      <SettingsView />
    {/if}
  </div>

  {#if !isPlaying}
    <nav class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 flex justify-around items-center h-16 px-4 z-40 shadow-2xl safe-area-pb">
      <button
        on:click={() => handleTabChange('play')}
        class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 {activeTab === 'play' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-400 dark:text-gray-500'}"
      >
        <PlayIcon />
        <span class="text-[10px] font-bold mt-1 uppercase tracking-tighter">Play</span>
      </button>

      <button
        on:click={() => handleTabChange('stats')}
        class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 {activeTab === 'stats' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-400 dark:text-gray-500'}"
      >
        <StatsIcon />
        <span class="text-[10px] font-bold mt-1 uppercase tracking-tighter">Stats</span>
      </button>

      <button
        on:click={() => handleTabChange('settings')}
        class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 {activeTab === 'settings' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-400 dark:text-gray-500'}"
      >
        <SettingsIcon />
        <span class="text-[10px] font-bold mt-1 uppercase tracking-tighter">Settings</span>
      </button>
    </nav>
  {/if}
</div>

<style>
  .safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom);
    height: calc(4rem + env(safe-area-inset-bottom));
  }
</style>
