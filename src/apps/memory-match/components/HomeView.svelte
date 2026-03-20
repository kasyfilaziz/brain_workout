<script>
  import {
    selectedGridSize, selectedTheme, selectedDeckId, timerEnabled, timerDuration,
    highScores, gameState, settings,
    startGame, initMemoryMatchStores
  } from '../stores/memoryMatch';
  import { GRID_SIZES, getBuiltInThemes, getThemeName, getEligibleDecks } from '../utils/cards';
  import { onMount } from 'svelte';

  let eligibleDecks = [];
  let showDeckSelector = false;

  const themes = getBuiltInThemes();
  const timerOptions = [60, 90, 120, 180];

  onMount(async () => {
    await initMemoryMatchStores();
  });

  $: if ($selectedTheme === 'custom') {
    loadDecks();
  }

  async function loadDecks() {
    eligibleDecks = await getEligibleDecks();
    showDeckSelector = true;
  }

  function handleThemeSelect(themeId) {
    selectedTheme.set(themeId);
    if (themeId !== 'custom') {
      selectedDeckId.set(null);
      showDeckSelector = false;
    }
  }

  function handleDeckSelect(deckId) {
    selectedDeckId.set(deckId);
  }

  async function handleStartGame() {
    const success = await startGame();
    if (!success && $selectedTheme === 'custom') {
      alert('Not enough cards in selected deck for this grid size.');
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function formatScore(score) {
    if (!score) return '-';
    return `${score.bestMoves} moves in ${formatTime(score.bestTime)}`;
  }
</script>

<div class="flex flex-col gap-6">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Memory Match</h1>

  <!-- Grid Size Selection -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Grid Size</label>
    <div class="grid grid-cols-2 gap-2">
      {#each Object.entries(GRID_SIZES) as [size, config]}
        <button
          on:click={() => selectedGridSize.set(size)}
          class="p-3 rounded-xl text-left transition-all {$selectedGridSize === size
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}"
        >
          <div class="font-bold">{config.label}</div>
          <div class="text-xs opacity-75">{size} - {config.pairs * 2} cards</div>
        </button>
      {/each}
    </div>
    {#if $highScores[$selectedGridSize]}
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Best: {formatScore($highScores[$selectedGridSize])}
      </div>
    {/if}
  </div>

  <!-- Theme Selection -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
    <div class="grid grid-cols-2 gap-2">
      {#each themes as themeId}
        <button
          on:click={() => handleThemeSelect(themeId)}
          class="p-3 rounded-xl text-left transition-all {$selectedTheme === themeId
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}"
        >
          {getThemeName(themeId)}
        </button>
      {/each}
      <button
        on:click={() => handleThemeSelect('custom')}
        class="p-3 rounded-xl text-left transition-all {$selectedTheme === 'custom'
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}"
      >
        Custom Decks
      </button>
    </div>
  </div>

  <!-- Deck Selector (only for custom theme) -->
  {#if showDeckSelector && $selectedTheme === 'custom'}
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Select Deck</label>
      {#if eligibleDecks.length === 0}
        <p class="text-sm text-gray-500 dark:text-gray-400">
          No decks with enough cards. Create a flashcard deck with at least 6 cards first.
        </p>
      {:else}
        <div class="flex flex-col gap-2">
          {#each eligibleDecks as deck}
            <button
              on:click={() => handleDeckSelect(deck.id)}
              class="p-3 rounded-xl text-left transition-all {$selectedDeckId === deck.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'}"
            >
              <div class="font-medium">{deck.name}</div>
              <div class="text-xs opacity-75">{deck.cardCount} cards</div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Timer Toggle -->
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Timer Mode</label>
      <button
        on:click={() => timerEnabled.set(!$timerEnabled)}
        class="relative w-12 h-6 rounded-full transition-colors {$timerEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}"
      >
        <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform {$timerEnabled ? 'translate-x-6' : ''}"></span>
      </button>
    </div>
    {#if $timerEnabled}
      <div class="flex gap-2">
        {#each timerOptions as seconds}
          <button
            on:click={() => timerDuration.set(seconds)}
            class="flex-1 py-2 rounded-lg text-sm transition-all {$timerDuration === seconds
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'}"
          >
            {seconds}s
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Start Button -->
  <button
    on:click={handleStartGame}
    class="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-colors"
  >
    Start Game
  </button>
</div>
