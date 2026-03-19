<script>
  import { addDeck, addCard, decks } from '../stores/flashcards';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let fileInput;
  let importData = [];
  let invalidData = [];
  let isImporting = false;
  let importStatus = '';
  let importType = 'csv';
  let errorDetails = [];
  let inputMode = 'file';
  let csvText = '';

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    errorDetails = [];
    invalidData = [];
    
    const text = await file.text();
    
    if (file.name.endsWith('.json')) {
      await handleJSONImport(text);
    } else {
      await handleCSVImport(text);
    }
  }

  function handleTextImport() {
    errorDetails = [];
    invalidData = [];
    if (!csvText.trim()) {
      importStatus = 'Teks kosong!';
      return;
    }
    handleCSVImport(csvText);
  }

  function resetImport() {
    importData = [];
    invalidData = [];
    importStatus = '';
    errorDetails = [];
    csvText = '';
    if (fileInput) fileInput.value = '';
  }

  async function handleCSVImport(text) {
    importType = 'csv';
    const rows = text.split('\n').filter(r => r.trim());
    
    if (rows.length === 0) {
      importStatus = 'File kosong!';
      return;
    }
    
    const header = rows[0].toLowerCase();
    if (!header.includes('deck') || !header.includes('depan') || !header.includes('belakang')) {
      importStatus = 'Header CSV tidak valid!';
      errorDetails = ['Header harus mengandung: deck, depan, belakang'];
      return;
    }
    
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

    const validItems = [];
    const invalidItems = [];
    
    rows.slice(1).forEach((row, index) => {
      const parts = parseCSVRow(row);
      if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) {
        invalidItems.push({ row: index + 2, reason: 'Data tidak lengkap' });
      } else {
        validItems.push({
          type: 'csv',
          deck: parts[0],
          front: parts[1],
          back: parts[2]
        });
      }
    });
    
    importData = validItems;
    invalidData = invalidItems;
    
    if (importData.length === 0) {
      importStatus = 'Tidak ada data valid ditemukan!';
      errorDetails = invalidItems.map(i => `Baris ${i.row}: ${i.reason}`);
    } else {
      importStatus = `Ditemukan ${importData.length} kartu valid.`;
      if (invalidData.length > 0) {
        errorDetails = [`${invalidData.length} baris dilewati karena tidak valid`];
      }
    }
  }

  async function handleJSONImport(text) {
    importType = 'json';
    try {
      const data = JSON.parse(text);
      
      const errors = [];
      
      if (!data.decks) {
        errors.push('Key "decks" tidak ditemukan');
      }
      if (!data.cards) {
        errors.push('Key "cards" tidak ditemukan');
      }
      
      if (errors.length > 0) {
        importStatus = 'Format JSON tidak valid!';
        errorDetails = errors;
        return;
      }
      
      if (!Array.isArray(data.decks)) {
        errors.push('"decks" harus berupa array');
      }
      if (!Array.isArray(data.cards)) {
        errors.push('"cards" harus berupa array');
      }
      
      if (errors.length > 0) {
        importStatus = 'Format JSON tidak valid!';
        errorDetails = errors;
        return;
      }
      
      const invalidCards = data.cards.filter(c => !c.front || !c.back);
      if (invalidCards.length > 0) {
        errorDetails = [`${invalidCards.length} kartu memiliki data yang tidak lengkap`];
      }

      importData = [{
        type: 'json',
        decks: data.decks,
        cards: data.cards.filter(c => c.front && c.back)
      }];
      
      importStatus = `Ditemukan ${data.decks.length} deck dan ${importData[0].cards.length} kartu valid.`;
    } catch (e) {
      importStatus = 'Gagal membaca file JSON!';
      errorDetails = ['File tidak dapat dibaca. Pastikan format JSON benar.'];
      console.error(e);
    }
  }

  async function startImport() {
    if (importData.length === 0) return;
    isImporting = true;
    importStatus = 'Mengimport...';
    
    try {
      if (importType === 'json') {
        await importJSON();
      } else {
        await importCSV();
      }
      importStatus = 'Import Berhasil!';
      importData = [];
      invalidData = [];
      errorDetails = [];
      setTimeout(() => dispatch('finish'), 1500);
    } catch (error) {
      importStatus = 'Gagal mengimport file.';
      errorDetails = ['Terjadi kesalahan saat import. Silakan coba lagi.'];
      console.error(error);
    } finally {
      isImporting = false;
    }
  }

  async function importCSV() {
    const deckMap = new Map();
    
    for (const item of importData) {
      let deckId;
      if (deckMap.has(item.deck)) {
        deckId = deckMap.get(item.deck);
      } else {
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
  }

  async function importJSON() {
    const data = importData[0];
    const deckIdMap = new Map();

    for (const deck of data.decks) {
      if (!deck.name) continue;
      const id = await addDeck(deck.name);
      deckIdMap.set(deck.id || deck.name, id);
    }

    for (const card of data.cards) {
      if (!card.front || !card.back) continue;
      const deckId = deckIdMap.get(card.deckId) || card.deckId;
      await addCard(deckId, card.front, card.back);
    }
  }
</script>

<div class="space-y-8 animate-fade-in p-2">
  <div class="text-center space-y-2">
    <h2 class="text-2xl font-black">Import Data</h2>
    <p class="text-xs text-gray-500 font-bold uppercase tracking-widest leading-loose max-w-[250px] mx-auto">Upload file CSV (deck,depan,belakang) atau JSON backup</p>
  </div>

  <div class="flex rounded-2xl bg-gray-100 dark:bg-gray-800 p-1">
    <button 
      on:click={() => { inputMode = 'file'; resetImport(); }}
      class="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all {inputMode === 'file' ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}"
    >
      Upload File
    </button>
    <button 
      on:click={() => { inputMode = 'text'; resetImport(); }}
      class="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all {inputMode === 'text' ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}"
    >
      Paste Text
    </button>
  </div>

  {#if inputMode === 'file'}
    <button 
      on:click={() => fileInput.click()}
      class="w-full flex flex-col items-center justify-center py-16 px-6 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/20 active:scale-95 transition-all group"
      aria-label="Pilih file untuk diimport"
    >
      <div class="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div class="text-center">
        <h3 class="font-bold text-lg mb-1">Pilih File CSV atau JSON</h3>
        <p class="text-gray-400 text-xs">Ketuk untuk telusuri file</p>
      </div>
      <input type="file" accept=".csv,.json" class="hidden" bind:this={fileInput} on:change={handleFileChange} />
    </button>
  {:else}
    <div class="space-y-4">
      <div class="relative">
        <textarea 
          bind:value={csvText}
          placeholder="deck,depan,belakang&#10;Bahasa Japan,konnichiwa,halo&#10;Matematika,2+2,4"
          class="w-full h-48 p-4 rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 font-mono text-sm focus:border-blue-500 focus:outline-none resize-none"
        ></textarea>
        <button 
          on:click={handleTextImport}
          class="mt-3 w-full py-3 rounded-2xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
        >
          Parse Text
        </button>
      </div>
      <p class="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">Format: deck,depan,belakang (satu baris per kartu)</p>
    </div>
  {/if}

  {#if importStatus}
    <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl flex items-center justify-center space-x-3 border border-blue-100 dark:border-blue-900/30 animate-fade-in">
      <div class="bg-blue-500 rounded-full h-2 w-2 animate-ping"></div>
      <p class="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">{importStatus}</p>
    </div>
  {/if}

  {#if errorDetails.length > 0}
    <div class="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 animate-fade-in">
      {#each errorDetails as error}
        <p class="text-xs font-bold text-red-600 dark:text-red-400 mb-1">{error}</p>
      {/each}
    </div>
  {/if}

  {#if importType === 'csv' && importData.length > 0}
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
            {#each importData.slice(0, 10) as item}
              <tr>
                <td class="p-3 text-gray-500 font-medium">{item.deck}</td>
                <td class="p-3 font-bold">{item.front}</td>
                <td class="p-3 font-bold">{item.back}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if importData.length > 10}
          <p class="p-4 text-center text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 uppercase tracking-widest">Dan {importData.length - 10} kartu lainnya...</p>
        {/if}
      </div>
    </div>
  {/if}

  {#if importType === 'json' && importData.length > 0}
    <div class="space-y-4">
      <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-bold">JSON Backup Detected</span>
          <span class="bg-green-100 text-green-800 text-[10px] font-black uppercase px-2 py-1 rounded-full">Valid</span>
        </div>
        <div class="grid grid-cols-2 gap-4 text-center">
          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
            <p class="text-2xl font-black">{importData[0].decks?.length || 0}</p>
            <p class="text-[10px] font-bold text-gray-400 uppercase">Deck</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
            <p class="text-2xl font-black">{importData[0].cards?.length || 0}</p>
            <p class="text-[10px] font-bold text-gray-400 uppercase">Kartu</p>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if importData.length > 0}
    <button 
      on:click={resetImport}
      class="w-full py-3 rounded-2xl font-bold text-gray-400 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
    >
      Pilih File Lain
    </button>
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
