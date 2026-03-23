<script>
  import { onMount } from 'svelte';
  import { gameState } from './stores/gameState';
  import { settings, initSettings } from './stores/settings';
  import { checkAudioAvailable } from './utils/audio';
  
  import HomeView from './components/HomeView.svelte';
  import GameView from './components/GameView.svelte';
  import ResultsView from './components/ResultsView.svelte';
  import StatsView from './components/StatsView.svelte';
  import SettingsView from './components/SettingsView.svelte';
  import Tutorial from './components/Tutorial.svelte';
  
  let activeTab = 'home';
  let audioAvailable = true;
  let tutorialSeen = false;
  
  onMount(async () => {
    await initSettings();
    audioAvailable = checkAudioAvailable();
    
    const currentSettings = $settings;
    tutorialSeen = currentSettings?.tutorialSeen || false;
  });
  
  function handleTutorialComplete() {
    tutorialSeen = true;
    activeTab = 'home';
  }
  
  function navigateTo(tab) {
    activeTab = tab;
  }
  
  $: currentStatus = $gameState.status;
</script>

<div class="flex-1 flex flex-col">
  <div class="flex-1 px-5 pt-2 pb-24">
    {#if !tutorialSeen && activeTab === 'home'}
      <Tutorial on:complete={handleTutorialComplete} />
    {:else if activeTab === 'home' || currentStatus === 'IDLE'}
      <HomeView 
        on:startGame={() => navigateTo('game')}
        on:showStats={() => navigateTo('stats')}
        on:showSettings={() => navigateTo('settings')}
      />
    {:else if currentStatus === 'RUNNING' || currentStatus === 'PAUSED'}
      <GameView on:sessionComplete={() => navigateTo('results')} />
    {:else if currentStatus === 'COMPLETED'}
      <ResultsView 
        on:playAgain={() => navigateTo('game')}
        on:goHome={() => { gameState.reset(); navigateTo('home'); }}
      />
    {:else if activeTab === 'stats'}
      <StatsView on:back={() => navigateTo('home')} />
    {:else if activeTab === 'settings'}
      <SettingsView on:close={() => navigateTo('home')} />
    {:else}
      <HomeView 
        on:startGame={() => navigateTo('game')}
        on:showStats={() => navigateTo('stats')}
      />
    {/if}
  </div>
</div>

<style>
  :global(.n-back-highlight) {
    animation: pulse 0.3s ease-in-out;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
</style>
