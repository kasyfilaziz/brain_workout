<script>
  import { createEventDispatcher } from 'svelte';
  export let card;
  export let isFlipped = false;

  const dispatch = createEventDispatcher();

  function toggleFlip() {
    isFlipped = !isFlipped;
  }
</script>

<button 
  class="w-full max-w-sm aspect-[3/4] perspective-1000 mx-auto cursor-pointer block text-left" 
  on:click={toggleFlip}
  aria-label="Balik kartu flashcard"
>
  <div class="relative w-full h-full transition-transform duration-500 preserve-3d {isFlipped ? 'rotate-y-180' : ''}">
    <!-- Front -->
    <div class="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center border-2 border-blue-100 dark:border-blue-900 shadow-xl overflow-hidden">
      <p class="text-xs text-blue-500 dark:text-blue-400 font-bold uppercase tracking-widest mb-4">Sisi Depan</p>
      <div class="flex-1 flex items-center justify-center overflow-auto w-full px-2">
        <h2 class="text-2xl md:text-3xl font-bold leading-tight">{card.front}</h2>
      </div>
      <p class="text-gray-400 text-xs mt-4">Klik untuk balik kartu</p>
    </div>

    <!-- Back -->
    <div class="absolute inset-0 w-full h-full backface-hidden bg-blue-50 dark:bg-blue-900/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center border-2 border-blue-500 dark:border-blue-400 shadow-xl overflow-hidden rotate-y-180">
      <p class="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-4">Sisi Belakang</p>
      <div class="flex-1 flex items-center justify-center overflow-auto w-full px-2">
        <h2 class="text-2xl md:text-3xl font-bold leading-tight">{card.back}</h2>
      </div>
      <p class="text-gray-400 text-xs mt-4">Klik untuk balik lagi</p>
    </div>
  </div>
</button>

<style>
  .perspective-1000 {
    perspective: 1000px;
  }
  .preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
</style>
