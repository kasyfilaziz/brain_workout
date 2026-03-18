<script>
  import { decks, cards, resetAllData } from '../stores/flashcards';
  import { settings } from '../../../lib/stores/settings';
  import { exportToJSON, exportToCSV } from '../../../lib/utils/export';

  $: totalDecks = $decks.length;
  $: totalCards = $cards.length;
  $: dueToday = $cards.filter(c => c.nextReview <= Date.now()).length;
  $: masteredCount = $cards.filter(c => c.easeFactor > 2.8).length;
  $: streak = $settings.streak;
  $: totalStudyDays = $settings.totalStudyDays;

  let showResetConfirm = false;

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

  async function handleResetApp() {
    await resetAllData();
    await settings.reset();
    showResetConfirm = false;
    window.location.reload();
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

  <div class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/30">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="bg-amber-500 rounded-full h-12 w-12 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Study Streak</p>
          <p class="text-3xl font-black text-amber-700 dark:text-amber-300">{streak} <span class="text-sm">hari</span></p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Belajar</p>
        <p class="text-lg font-bold text-gray-700 dark:text-gray-300">{totalStudyDays} hari</p>
      </div>
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

  <section class="space-y-4 pt-6">
    <div class="px-2">
      <h3 class="font-black text-lg mb-1 tracking-tighter uppercase tracking-widest text-xs text-red-400">Danger Zone</h3>
      <p class="text-xs text-gray-500">Tindakan ini tidak dapat dibatalkan.</p>
    </div>
    
    {#if showResetConfirm}
      <div class="bg-red-50 dark:bg-red-900/20 p-5 rounded-3xl border border-red-200 dark:border-red-800">
        <p class="text-sm font-bold text-red-600 dark:text-red-400 mb-4 text-center">Apakah kamu yakin ingin menghapus semua data? Semua deck dan kartu akan hilang forever!</p>
        <div class="flex gap-3">
          <button 
            on:click={() => showResetConfirm = false}
            class="flex-1 py-3 rounded-2xl font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
          >
            Batal
          </button>
          <button 
            on:click={handleResetApp}
            class="flex-1 py-3 rounded-2xl font-bold bg-red-600 text-white text-sm"
          >
            Ya, Hapus Semua
          </button>
        </div>
      </div>
    {:else}
      <button 
        on:click={() => showResetConfirm = true}
        class="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md active:scale-95 transition-all text-sm font-bold group w-full"
      >
        <span class="text-red-500 group-hover:translate-x-1 transition-transform">Hapus Semua Data</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    {/if}
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
