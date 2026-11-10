<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { cards, updateCard } from '../stores/flashcards';
  import { calculateSM2 } from '../../../lib/utils/sm2';
  import { settings } from '../../../lib/stores/settings';
  import { getStudyKeyboardAction } from '../utils/keyboard';
  import { saveRatingAndAdvance } from '../utils/studyRating';
  import { buildStudyQueue } from '../utils/studyQueue';
  import FlashCard from './FlashCard.svelte';

  export let deckId;
  export let isQuickStudy = false;
  const dispatch = createEventDispatcher();

  let sessionCards = [];
  let currentIndex = 0;
  let isFlipped = false;
  let sessionFinished = false;
  let isTransitioning = false;
  let sessionInitialized = false;
  let persistenceError = '';

  $: if (!sessionInitialized) {
    sessionCards = buildStudyQueue($cards, {
      deckId,
      isQuickStudy,
      now: Date.now()
    });
    sessionInitialized = true;
  }

  async function handleRating(rating) {
    if (isTransitioning || !isFlipped || sessionFinished) return;

    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      if (rating < 3) {
        window.navigator.vibrate([100, 50, 100]);
      } else {
        window.navigator.vibrate(50);
      }
    }

    isTransitioning = true;
    persistenceError = '';

    const currentCard = sessionCards[currentIndex];
    const updatedCard = calculateSM2(currentCard, rating);
    let result;

    try {
      result = await saveRatingAndAdvance({
        updatedCard,
        currentIndex,
        totalCards: sessionCards.length,
        saveCard: updateCard,
        saveStreak: settings.updateStudiedToday,
        wait: () => new Promise((resolve) => setTimeout(resolve, 1000))
      });
    } catch (error) {
      console.error('Failed to save flashcard rating:', error);
      persistenceError = 'Rating belum tersimpan. Periksa penyimpanan perangkat lalu coba lagi.';
      isTransitioning = false;
      return;
    }

    isFlipped = false;
    currentIndex = result.nextIndex;

    if (result.finished) {
      if (result.streakError) {
        console.error('Failed to save study streak:', result.streakError);
        persistenceError = 'Kartu tersimpan, tetapi streak belajar gagal diperbarui.';
      }
      sessionFinished = true;
    }

    isTransitioning = false;
  }

  function finish() {
    dispatch('finish');
  }

  function isTypingTarget(target) {
    return target instanceof HTMLElement && (
      target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    );
  }

  function handleKeydown(event) {
    const action = getStudyKeyboardAction({
      key: event.key,
      code: event.code,
      repeat: event.repeat,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      altKey: event.altKey,
      isTypingTarget: isTypingTarget(event.target),
      isFlipped,
      isTransitioning,
      sessionFinished,
      hasCards: sessionCards.length > 0
    });

    if (!action) return;

    if (action.preventDefault) {
      event.preventDefault();
    }

    if (action.type === 'flip') {
      isFlipped = !isFlipped;
    } else if (action.type === 'rate') {
      handleRating(action.rating);
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="h-full flex flex-col space-y-6 max-w-sm mx-auto">
  <header class="flex justify-between items-center px-2">
    <button on:click={finish} class="p-2 -ml-2 text-gray-400 hover:text-blue-500 transition-colors rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <div class="text-center">
      <h2 class="font-black text-xl leading-none">{isQuickStudy ? 'Latihan Cepat' : 'Latihan'}</h2>
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
        <p class="text-gray-500 dark:text-gray-400 text-sm max-w-[250px]">
          {isQuickStudy
            ? 'Semua kartu yang jatuh tempo sudah kamu pelajari untuk hari ini.'
            : 'Semua kartu di deck ini sudah kamu pelajari untuk hari ini.'}
        </p>
      </div>
      {#if persistenceError}
        <p class="text-xs font-bold text-amber-600 dark:text-amber-400 max-w-[280px]" role="alert">
          {persistenceError}
        </p>
      {/if}
      <button on:click={finish} class="w-full bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-500/30 active:scale-95 transition-all">
        Kembali ke Dashboard
      </button>
    </div>
  {:else if sessionCards.length > 0}
    {#if isTransitioning}
      <div class="flex-1 flex flex-col items-center justify-center py-4">
        <div class="w-full max-w-sm aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
      </div>
    {:else}
      {#if persistenceError}
        <div class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-400" role="alert">
          {persistenceError}
        </div>
      {/if}
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
        <div class="text-center animate-fade-in pb-4 space-y-1">
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Seberapa hafal kamu?</p>
          <p class="text-[10px] text-gray-400 dark:text-gray-500">
            Tekan <kbd class="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[9px] font-bold dark:border-gray-700 dark:bg-gray-800">Space</kbd>
            untuk balik kartu, lalu <kbd class="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[9px] font-bold dark:border-gray-700 dark:bg-gray-800">1-5</kbd>
            untuk memberi rating
          </p>
        </div>
      {/if}
    {:else}
      <div class="text-center pb-20">
        <p class="text-gray-400 text-sm font-medium animate-pulse">
          Klik kartu atau tekan <kbd class="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] font-bold dark:border-gray-700 dark:bg-gray-800">Space</kbd> untuk melihat jawaban
        </p>
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
