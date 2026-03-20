<script>
  export let card;
  export let onFlip;

  $: isFlipped = card.isFlipped || card.isMatched;
  $: content = card.displayContent || '';

  function handleClick() {
    if (!card.isMatched && !card.isFlipped) {
      onFlip(card.index);
    }
  }
</script>

<button
  on:click={handleClick}
  class="card-container w-full aspect-square cursor-pointer perspective-1000"
  disabled={card.isMatched}
  aria-label={card.isMatched ? `Matched card: ${content}` : 'Hidden card'}
>
  <div class="card-inner relative w-full h-full transition-transform duration-300 {isFlipped ? 'rotate-y-180' : ''}">
    <!-- Card Back -->
    <div class="card-face card-back absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center shadow-lg border-2 border-blue-400/30 dark:border-purple-500/30">
      <span class="text-2xl text-white/30">?</span>
    </div>

    <!-- Card Front -->
    <div class="card-face card-front absolute inset-0 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg border-2 {card.isMatched ? 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-gray-200 dark:border-gray-700'}">
      <span class="text-2xl sm:text-3xl select-none {card.isMatched ? 'opacity-100' : ''}">{content}</span>
    </div>
  </div>
</button>

<style>
  .perspective-1000 {
    perspective: 1000px;
  }

  .card-inner {
    transform-style: preserve-3d;
  }

  .rotate-y-180 {
    transform: rotateY(180deg);
  }

  .card-face {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .card-front {
    transform: rotateY(180deg);
  }

  .card-container:disabled {
    cursor: default;
  }
</style>
