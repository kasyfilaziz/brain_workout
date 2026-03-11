<script>
  import { cards, updateCard, loadCards } from '../stores/flashcards';
  import { calculateSM2 } from '../utils/sm2';
  import FlashCard from './FlashCard.svelte';
  import { createEventDispatcher } from 'svelte';

  export let deckId;
  const dispatch = createEventDispatcher();

  let sessionCards = [];
  let currentIndex = 0;
  let isFlipped = false;
  let sessionFinished = false;
  let isTransitioning = false;

  $: {
    const now = Date.now();
    sessionCards = $cards.filter(c => c.deckId === deckId && c.nextReview <= now);
  }

  function handleRating(rating) {
    if (isTransitioning) return;

    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      if (rating < 3) {
        window.navigator.vibrate([100, 50, 100]);
      } else {
        window.navigator.vibrate(50);
      }
    }

    isTransitioning = true;

    const currentCard = sessionCards[currentIndex];
    const updatedCard = calculateSM2(currentCard, rating);
    updateCard(updatedCard);

    // Flip back the card first
    isFlipped = false;

    // Wait for flip animation to finish (1000ms = 1 detik)
    // Only then change to the next card
    setTimeout(() => {
      if (currentIndex < sessionCards.length - 1) {
        currentIndex++;
      } else {
        sessionFinished = true;
      }
      isTransitioning = false;
    }, 1000);
  }

  function finish() {
    dispatch('finish');
  }
</script>

<div class="h-full flex flex-col space-y-6 max-w-sm mx-auto">
  <header class="flex justify-between items-center px-2">
    <button on:click={finish} class="p-2 -ml-2 text-gray-400 hover:text-blue-500 transition-colors rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <div class="text-center">
      <h2 class="font-black text-xl leading-none">Latihan</h2>
      <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
        {sessionFinished ? 'Selesai' : `Kartu ${currentIndex + 1} / ${sessionCards.length}`}
      </p>
    </div>
    <div class="w-10"></div>
  </header>

  {#if sessionFinished}
    <div class="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in p-6">
      <div class="relative">
        <div class="absolute inset-0 bg-green-500 blur-2xl opacity-20 scale-150 rounded-full animate-pulse"></div>
        <div class="bg-green-100 dark:bg-green-900/30 p-8 rounded-full relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div>
        <h3 class="text-2xl font-black mb-2">Mantap!</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm max-w-[250px]">Semua kartu di deck ini sudah kamu pelajari untuk hari ini.</p>
      </div>
      <button on:click={finish} class="w-full bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-500/30 active:scale-95 transition-all">
        Kembali ke Dashboard
      </button>
    </div>
  {:else if sessionCards.length > 0}
    {#if isTransitioning}
      <div class="flex-1 flex flex-col items-center justify-center py-4">
        <div class="text-center space-y-4 animate-fade-in">
          <div class="relative">
            <div class="w-24 h-24 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Menyimpan...</p>
        </div>
      </div>
    {:else}
      <div class="flex-1 flex flex-col items-center justify-center py-4">
        <FlashCard card={sessionCards[currentIndex]} bind:isFlipped />
      </div>
    {/if}

    {#if isFlipped && !isTransitioning}
      <div class="grid grid-cols-5 gap-2 animate-slide-up pb-4 px-1 {isTransitioning ? 'opacity-50 scale-95 transition-all duration-300' : ''}">
        {#each [1, 2, 3, 4, 5] as rating}
          <button 
            on:click={() => handleRating(rating)}
            disabled={isTransitioning}
            class="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-blue-500 active:scale-90 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="text-lg font-black group-hover:text-blue-500">{rating}</span>
            <span class="text-[8px] font-bold uppercase tracking-tighter text-gray-400">Rating</span>
          </button>
        {/each}
      </div>
      {#if !isTransitioning}
        <p class="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-fade-in pb-4">Seberapa hafal kamu?</p>
      {/if}
    {:else}
      <div class="text-center pb-20">
        <p class="text-gray-400 text-sm font-medium animate-pulse">Klik kartu untuk melihat jawaban</p>
      </div>
    {/if}
  {:else}
    <div class="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in p-6">
      <div class="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 class="text-xl font-black mb-1">Belum Ada Tugas</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm italic">Belum ada kartu yang jatuh tempo hari ini. Kamu bisa tambah kartu baru dulu!</p>
      </div>
      <button on:click={finish} class="bg-gray-100 dark:bg-gray-800 font-bold py-3 px-8 rounded-xl active:scale-95 transition-all text-sm">
        Kembali
      </button>
    </div>
  {/if}
</div>

<style>
  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-slide-up {
    animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .animate-fade-in {
    animation: fade-in 0.4s ease-out;
  }
</style>
