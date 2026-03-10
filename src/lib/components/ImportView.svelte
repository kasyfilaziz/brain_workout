<script>
  import { addDeck, addCard, decks } from '../stores/flashcards';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let fileInput;
  let csvData = [];
  let isImporting = false;
  let importStatus = '';

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const rows = text.split('\n').filter(r => r.trim());
    
    // Improved CSV parser to handle quoted commas
    const parseCSVRow = (row) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result.map(p => p.replace(/^"|"$/g, ''));
    };

    csvData = rows.slice(1).map(row => {
      const parts = parseCSVRow(row);
      return {
        deck: parts[0],
        front: parts[1],
        back: parts[2]
      };
    }).filter(d => d.deck && d.front && d.back);
    
    importStatus = `Ditemukan ${csvData.length} kartu valid.`;
  }

  async function startImport() {
    if (csvData.length === 0) return;
    isImporting = true;
    importStatus = 'Mengimport...';
    
    const deckMap = new Map(); // name -> id
    
    try {
      for (const item of csvData) {
        let deckId;
        if (deckMap.has(item.deck)) {
          deckId = deckMap.get(item.deck);
        } else {
          // Check if deck exists
          const existing = $decks.find(d => d.name === item.deck);
          if (existing) {
            deckId = existing.id;
          } else {
            deckId = await addDeck(item.deck);
          }
          deckMap.set(item.deck, deckId);
        }
        
        await addCard(deckId, item.front, item.back);
      }
      importStatus = 'Import Berhasil!';
      csvData = [];
      setTimeout(() => dispatch('finish'), 1500);
    } catch (error) {
      importStatus = 'Gagal mengimport file.';
      console.error(error);
    } finally {
      isImporting = false;
    }
  }
</script>

<div class="space-y-8 animate-fade-in p-2">
  <div class="text-center space-y-2">
    <h2 class="text-2xl font-black">Import Kartu</h2>
    <p class="text-xs text-gray-500 font-bold uppercase tracking-widest leading-loose max-w-[200px] mx-auto">Upload file CSV dengan format: deck,depan,belakang</p>
  </div>

  <button 
    on:click={() => fileInput.click()}
    class="w-full flex flex-col items-center justify-center py-16 px-6 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/20 active:scale-95 transition-all group"
    aria-label="Pilih file CSV untuk diimport"
  >
    <div class="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10 mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    </div>
    <div class="text-center">
      <h3 class="font-bold text-lg mb-1">Pilih File CSV</h3>
      <p class="text-gray-400 text-xs">Ketuk untuk telusuri file</p>
    </div>
    <input type="file" accept=".csv" class="hidden" bind:this={fileInput} on:change={handleFileChange} />
  </button>

  {#if importStatus}
    <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl flex items-center justify-center space-x-3 border border-blue-100 dark:border-blue-900/30 animate-fade-in">
      <div class="bg-blue-500 rounded-full h-2 w-2 animate-ping"></div>
      <p class="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">{importStatus}</p>
    </div>
  {/if}

  {#if csvData.length > 0}
    <div class="space-y-4">
      <div class="max-h-60 overflow-y-auto rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-inner">
        <table class="w-full text-xs">
          <thead class="bg-gray-50 dark:bg-gray-800/50 sticky top-0 border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th class="p-3 text-left font-black uppercase tracking-tighter">Deck</th>
              <th class="p-3 text-left font-black uppercase tracking-tighter">Depan</th>
              <th class="p-3 text-left font-black uppercase tracking-tighter">Belakang</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            {#each csvData.slice(0, 10) as item}
              <tr>
                <td class="p-3 text-gray-500 font-medium">{item.deck}</td>
                <td class="p-3 font-bold">{item.front}</td>
                <td class="p-3 font-bold">{item.back}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if csvData.length > 10}
          <p class="p-4 text-center text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 uppercase tracking-widest">Dan {csvData.length - 10} kartu lainnya...</p>
        {/if}
      </div>

      <button 
        on:click={startImport}
        disabled={isImporting}
        class="w-full py-4 rounded-3xl font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-500/30 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
      >
        <span>Mulai Import Sekarang</span>
        {#if isImporting}
          <div class="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></div>
        {/if}
      </button>
    </div>
  {/if}
</div>

<style>
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.4s ease-out;
  }
</style>
