<script>
  import Card from './Card.svelte';
  import {
    cards, moves, elapsedSeconds, gameState,
    selectedGridSize, timerEnabled, timerRemaining,
    flipCard
  } from '../stores/memoryMatch';
  import { GRID_SIZES } from '../utils/cards';

  $: gridConfig = GRID_SIZES[$selectedGridSize] || GRID_SIZES['4x4'];
  $: gridCols = gridConfig.cols;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function handleFlip(index) {
    flipCard(index);
  }
</script>

<div class="flex flex-col gap-4">
  <!-- Stats Bar -->
  <div class="flex justify-between items-center px-2">
    <div class="flex items-center gap-4">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        <span class="font-bold text-gray-900 dark:text-white">{$moves}</span> moves
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400">
        <span class="font-bold text-gray-900 dark:text-white">{formatTime($elapsedSeconds)}</span>
      </div>
    </div>
    {#if $timerEnabled}
      <div class="text-sm font-bold {$timerRemaining <= 10 ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}">
        {$timerRemaining > 0 ? formatTime($timerRemaining) : '0:00'}
      </div>
    {/if}
  </div>

  <!-- Game Grid -->
  <div class="grid gap-2 sm:gap-3 w-full" style="grid-template-columns: repeat({gridCols}, 1fr);">
    {#each $cards as card, i}
      <Card {card} onFlip={handleFlip} />
    {/each}
  </div>
</div>
