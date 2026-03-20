<script>
  import { gameState, resetGame } from './stores/memoryMatch';

  import HomeView from './components/HomeView.svelte';
  import GameBoard from './components/GameBoard.svelte';
  import VictoryScreen from './components/VictoryScreen.svelte';
  import TimerExpiredScreen from './components/TimerExpiredScreen.svelte';
  import GameIcon from './components/icons/GameIcon.svelte';

  function handleHome() {
    resetGame();
  }
</script>

<div class="flex-1 flex flex-col">
  <main class="flex-1 px-4 py-5 pb-24 max-w-[600px] mx-auto w-full">
    {#if $gameState === 'home'}
      <HomeView />
    {:else if $gameState === 'playing'}
      <GameBoard />
    {:else if $gameState === 'victory'}
      <VictoryScreen />
    {:else if $gameState === 'timer_expired'}
      <TimerExpiredScreen />
    {/if}
  </main>

  {#if $gameState !== 'home'}
    <nav class="fixed bottom-0 left-0 right-0 max-w-[600px] mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 flex justify-around items-center h-16 px-4 z-40 shadow-2xl safe-area-pb">
      <button
        on:click={handleHome}
        class="flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 text-gray-400 dark:text-gray-500"
      >
        <GameIcon />
        <span class="text-[10px] font-bold mt-1 uppercase tracking-tighter">Home</span>
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
