<script>
  import { decks, cards, addDeck, deleteDeck, addCard } from '../stores/flashcards';
  import DeckCard from './DeckCard.svelte';
  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let isAddModalOpen = false;
  let newDeckName = '';
  
  let isAddCardModalOpen = false;
  let selectedCardId = null;
  let newCardFront = '';
  let newCardBack = '';

  function handleAddDeck() {
    if (newDeckName.trim()) {
      addDeck(newDeckName.trim());
      newDeckName = '';
      isAddModalOpen = false;
    }
  }

  function handleAddCard() {
    if (newCardFront.trim() && newCardBack.trim() && selectedCardId) {
      addCard(selectedCardId, newCardFront.trim(), newCardBack.trim());
      newCardFront = '';
      newCardBack = '';
      isAddCardModalOpen = false;
    }
  }

  function openAddCard(deckId) {
    selectedCardId = deckId;
    isAddCardModalOpen = true;
  }

  function getDueCount(deckId) {
    const now = Date.now();
    return $cards.filter(c => c.deckId === deckId && c.nextReview <= now).length;
  }

  function getTotalCount(deckId) {
    return $cards.filter(c => c.deckId === deckId).length;
  }
  export let showInstallButton = false;
</script>

<div class="space-y-6">
  {#if showInstallButton}
    <section class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20 flex items-center justify-between space-x-4 animate-fade-in">
      <div class="flex-1 space-y-1">
        <h3 class="font-black text-lg leading-tight uppercase tracking-tighter">Install App</h3>
        <p class="text-[10px] font-bold text-blue-100 opacity-80 uppercase tracking-widest">Akses lebih cepat & hemat data!</p>
      </div>
      <button 
        on:click={() => dispatch('install')}
        class="bg-white text-blue-600 font-black text-[10px] px-6 py-3 rounded-2xl shadow-xl active:scale-90 transition-transform uppercase tracking-widest"
      >
        Install
      </button>
    </section>
  {/if}

  <div class="flex justify-between items-center px-2">
    <div>
      <h2 class="text-2xl font-black tracking-tighter">Deck Saya</h2>
      <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{$decks.length} deck tersedia</p>
    </div>
    <button 
      on:click={() => isAddModalOpen = true}
      class="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>

  {#if $decks.length === 0}
    <div class="flex flex-col items-center justify-center py-20 text-center space-y-4 px-6 bg-gray-50 dark:bg-gray-800/20 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
      <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <div>
        <h3 class="font-bold text-lg">Belum Ada Deck</h3>
        <p class="text-gray-500 text-xs max-w-[200px] mx-auto">Buat deck pertamamu untuk mulai menghapal!</p>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-4">
      {#each $decks as deck (deck.id)}
        <div 
          class="group cursor-pointer active:scale-95 transition-transform duration-200"
          on:click={() => dispatch('study', deck.id)}
          role="button"
          tabindex="0"
          on:keydown={(e) => e.key === 'Enter' && dispatch('study', deck.id)}
        >
          <DeckCard 
            {deck} 
            totalCount={getTotalCount(deck.id)}
            dueCount={getDueCount(deck.id)}
            on:addCard={(e) => openAddCard(e.detail)}
            on:delete={(e) => { if(confirm('Hapus deck ini beserta semua isinya?')) deleteDeck(e.detail); }}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal title="Buat Deck Baru" isOpen={isAddModalOpen} on:close={() => isAddModalOpen = false}>
  <div class="space-y-4">
    <div>
      <label for="deck-name" class="block text-xs font-black text-gray-400 mb-2 px-1 uppercase tracking-widest">Nama Deck</label>
      <input 
        id="deck-name"
        type="text" 
        bind:value={newDeckName} 
        placeholder="Misal: Kosakata Jepang N5" 
        class="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 focus:border-blue-500 focus:outline-none transition-all text-lg font-bold"
        on:keydown={(e) => e.key === 'Enter' && handleAddDeck()}
      />
    </div>
  </div>
  <div slot="footer" class="w-full flex gap-3">
    <button on:click={() => isAddModalOpen = false} class="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Batal</button>
    <button on:click={handleAddDeck} class="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white shadow-xl shadow-blue-500/30 active:scale-95 transition-all">Simpan</button>
  </div>
</Modal>

<Modal title="Tambah Kartu" isOpen={isAddCardModalOpen} on:close={() => isAddCardModalOpen = false}>
  <div class="space-y-6">
    <div>
      <label for="card-front" class="block text-xs font-black text-gray-400 mb-2 px-1 uppercase tracking-widest">Sisi Depan</label>
      <textarea 
        id="card-front"
        bind:value={newCardFront} 
        placeholder="Pertanyaan atau kata..." 
        rows="3"
        class="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 focus:border-blue-500 focus:outline-none transition-all text-lg font-bold"
      ></textarea>
    </div>
    <div>
      <label for="card-back" class="block text-xs font-black text-gray-400 mb-2 px-1 uppercase tracking-widest">Sisi Belakang</label>
      <textarea 
        id="card-back"
        bind:value={newCardBack} 
        placeholder="Jawaban atau penjelasan..." 
        rows="3"
        class="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 focus:border-blue-500 focus:outline-none transition-all text-lg font-bold"
      ></textarea>
    </div>
  </div>
  <div slot="footer" class="w-full flex gap-3">
    <button on:click={() => isAddCardModalOpen = false} class="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Batal</button>
    <button on:click={handleAddCard} class="flex-1 py-4 rounded-2xl font-bold bg-blue-600 text-white shadow-xl shadow-blue-500/30 active:scale-95 transition-all">Tambah</button>
  </div>
</Modal>
