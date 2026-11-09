<script>
  export let card;
  export let isFlipped = false;

  function toggleFlip() {
    isFlipped = !isFlipped;
  }

  function getTextSize(text = '') {
    const length = text?.length ?? 0;
    if (length > 320) return 'text-sm md:text-base';
    if (length > 180) return 'text-base md:text-lg';
    if (length > 100) return 'text-lg md:text-xl';
    return 'text-2xl md:text-3xl';
  }

  $: frontTextSize = getTextSize(card.front);
  $: backTextSize = getTextSize(card.back);
</script>

<button 
  class="w-full max-w-sm aspect-[3/4] perspective-1000 mx-auto cursor-pointer block text-left" 
  on:click={toggleFlip}
  aria-label="Balik kartu flashcard"
>
  <div class="relative w-full h-full transition-transform duration-500 preserve-3d {isFlipped ? 'rotate-y-180' : ''}">
    <!-- Front -->
    <div class="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 flex flex-col items-center justify-center text-center border-2 border-blue-100 dark:border-blue-900 shadow-xl overflow-hidden">
      <p class="shrink-0 text-xs text-blue-500 dark:text-blue-400 font-bold uppercase tracking-widest mb-4">Sisi Depan</p>
      <div class="flashcard-content min-h-0 flex-1 w-full overflow-y-auto overscroll-contain px-2 py-3">
        <div class="min-h-full flex items-center justify-center">
          <h2 class="w-full break-words font-bold leading-snug {frontTextSize}">{card.front}</h2>
        </div>
      </div>
      <p class="shrink-0 text-gray-400 text-xs mt-4">Klik untuk balik kartu</p>
    </div>

    <!-- Back -->
    <div class="absolute inset-0 w-full h-full backface-hidden bg-blue-50 dark:bg-blue-900/30 rounded-3xl p-5 sm:p-8 flex flex-col items-center justify-center text-center border-2 border-blue-500 dark:border-blue-400 shadow-xl overflow-hidden rotate-y-180">
      <p class="shrink-0 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-4">Sisi Belakang</p>
      <div class="flashcard-content min-h-0 flex-1 w-full overflow-y-auto overscroll-contain px-2 py-3">
        <div class="min-h-full flex items-center justify-center">
          <h2 class="w-full break-words font-bold leading-snug {backTextSize}">{card.back}</h2>
        </div>
      </div>
      <p class="shrink-0 text-gray-400 text-xs mt-4">Klik untuk balik lagi</p>
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
  .flashcard-content {
    scrollbar-color: rgb(96 165 250 / 0.65) transparent;
    scrollbar-width: thin;
  }
  .flashcard-content::-webkit-scrollbar {
    width: 4px;
  }
  .flashcard-content::-webkit-scrollbar-thumb {
    background-color: rgb(96 165 250 / 0.65);
    border-radius: 9999px;
  }
  .flashcard-content::-webkit-scrollbar-track {
    background: transparent;
  }
</style>
