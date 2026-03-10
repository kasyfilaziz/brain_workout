<script>
  import { decks, cards } from '../stores/flashcards';
  import { exportToJSON, exportToCSV } from '../utils/export';

  $: totalDecks = $decks.length;
  $: totalCards = $cards.length;
  $: dueToday = $cards.filter(c => c.nextReview <= Date.now()).length;
  $: masteredCount = $cards.filter(c => c.easeFactor > 2.8).length; // Simple mastery heuristic

  function handleExportJSON() {
    const data = {
      decks: $decks,
      cards: $cards,
      exportDate: new Date().toISOString()
    };
    exportToJSON(data, `flashcard_backup_${new Date().toISOString().split('T')[0]}.json`);
  }

  function handleExportCSV() {
    const csvData = $cards.map(c => {
      const deck = $decks.find(d => d.id === c.deckId);
      return {
        deck: deck ? deck.name : 'Unknown',
        front: c.front,
        back: c.back,
        interval: c.interval,
        easeFactor: c.easeFactor.toFixed(2),
        nextReview: new Date(c.nextReview).toLocaleDateString()
      };
    });
    exportToCSV(csvData, `flashcard_export_${new Date().toISOString().split('T')[0]}.csv`);
  }
</script>

<div class="space-y-8 animate-fade-in p-2">
  <div class="text-center space-y-2 mb-8">
    <h2 class="text-2xl font-black">Statistik Saya</h2>
    <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-loose">Ringkasan belajar hari ini</p>
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div class="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30 shadow-sm flex flex-col items-center justify-center space-y-2 group transition-transform hover:scale-105 active:scale-95">
      <div class="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <span class="text-2xl font-black">{totalDecks}</span>
      <span class="text-[10px] font-black uppercase tracking-tighter text-blue-400 group-hover:text-blue-600 transition-colors">Total Deck</span>
    </div>

    <div class="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-[2.5rem] border border-purple-100 dark:border-purple-900/30 shadow-sm flex flex-col items-center justify-center space-y-2 group transition-transform hover:scale-105 active:scale-95">
      <div class="bg-purple-500 rounded-full h-10 w-10 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <span class="text-2xl font-black">{totalCards}</span>
      <span class="text-[10px] font-black uppercase tracking-tighter text-purple-400 group-hover:text-purple-600 transition-colors">Total Kartu</span>
    </div>

    <div class="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-[2.5rem] border border-orange-100 dark:border-orange-900/30 shadow-sm flex flex-col items-center justify-center space-y-2 group transition-transform hover:scale-105 active:scale-95">
      <div class="bg-orange-500 rounded-full h-10 w-10 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span class="text-2xl font-black">{dueToday}</span>
      <span class="text-[10px] font-black uppercase tracking-tighter text-orange-400 group-hover:text-orange-600 transition-colors">Due Hari Ini</span>
    </div>

    <div class="bg-green-50 dark:bg-green-900/10 p-5 rounded-[2.5rem] border border-green-100 dark:border-green-900/30 shadow-sm flex flex-col items-center justify-center space-y-2 group transition-transform hover:scale-105 active:scale-95">
      <div class="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>
      <span class="text-2xl font-black">{masteredCount}</span>
      <span class="text-[10px] font-black uppercase tracking-tighter text-green-400 group-hover:text-green-600 transition-colors">Mastered</span>
    </div>
  </div>

  <section class="space-y-4 pt-6">
    <div class="px-2">
      <h3 class="font-black text-lg mb-1 tracking-tighter uppercase tracking-widest text-xs text-gray-400">Data & Backup</h3>
      <p class="text-xs text-gray-500">Amankan datamu dengan melakukan backup secara berkala.</p>
    </div>
    
    <div class="grid grid-cols-1 gap-3 px-2">
      <button 
        on:click={handleExportJSON}
        class="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md active:scale-95 transition-all text-sm font-bold group"
      >
        <span class="group-hover:translate-x-1 transition-transform">Ekspor Database (JSON)</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4-4v12" />
        </svg>
      </button>

      <button 
        on:click={handleExportCSV}
        class="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md active:scale-95 transition-all text-sm font-bold group"
      >
        <span class="group-hover:translate-x-1 transition-transform">Ekspor Semua Kartu (CSV)</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    </div>
  </section>
</div>

<style>
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 0.4s ease-out;
  }
</style>
