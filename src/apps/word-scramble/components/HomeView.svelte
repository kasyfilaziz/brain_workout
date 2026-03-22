<script>
  import { CATEGORIES, getCategoryCounts, getWordCount } from '../utils/wordBank';
  import { customLists, dailyChallenge, startSession } from '../stores/wordScramble';
  
  export let onStats = () => {};
  export let onLists = () => {};
  
  let selectedCategory = 'All';
  let selectedMode = 'zen';
  let selectedCustomList = null;
  
  const categoryCounts = getCategoryCounts();
  const totalWords = getWordCount();
  
  function handleStart() {
    if (selectedCustomList) {
      const list = $customLists.find(l => l.id === selectedCustomList);
      startSession(selectedMode, null, list.words);
    } else {
      startSession(selectedMode, selectedCategory);
    }
    window.dispatchEvent(new CustomEvent('wordScramble:startGame'));
  }
</script>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Word Scramble</h2>
    <p class="text-gray-500 dark:text-gray-400 text-sm">Unscramble the letters to form words</p>
  </div>

  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
    <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-3 text-sm uppercase tracking-wide">Select Category</h3>
    <div class="grid grid-cols-2 gap-2">
      <button
        on:click={() => selectedCategory = 'All'}
        class="px-4 py-3 rounded-xl text-sm font-medium transition-all {selectedCategory === 'All' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600'}"
      >
        All Categories
        <span class="block text-xs opacity-75">{totalWords} words</span>
      </button>
      {#each CATEGORIES as category}
        <button
          on:click={() => { selectedCategory = category; selectedCustomList = null; }}
          class="px-4 py-3 rounded-xl text-sm font-medium transition-all {selectedCategory === category && !selectedCustomList ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600'}"
        >
          {category}
          <span class="block text-xs opacity-75">{categoryCounts[category] || 0}</span>
        </button>
      {/each}
    </div>
    
    {#if $customLists.length > 0}
      <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-3 mt-4 text-sm uppercase tracking-wide">Custom Lists</h3>
      <div class="space-y-2">
        {#each $customLists as list}
          <button
            on:click={() => { selectedCategory = null; selectedCustomList = list.id; }}
            class="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left {selectedCustomList === list.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-600'}"
          >
            <span class="font-semibold">{list.name}</span>
            <span class="block text-xs opacity-75">{list.words.length} words</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
    <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-3 text-sm uppercase tracking-wide">Select Mode</h3>
    <div class="grid grid-cols-3 gap-2">
      <button
        on:click={() => selectedMode = 'zen'}
        class="px-4 py-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center {selectedMode === 'zen' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-600'}"
      >
        <span class="text-lg mb-1">🧘</span>
        Zen
        <span class="text-xs opacity-75">No timer</span>
      </button>
      <button
        on:click={() => selectedMode = 'blitz'}
        class="px-4 py-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center {selectedMode === 'blitz' ? 'bg-amber-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-600'}"
      >
        <span class="text-lg mb-1">⚡</span>
        Blitz
        <span class="text-xs opacity-75">60 seconds</span>
      </button>
      <button
        on:click={() => selectedMode = 'mastery'}
        class="px-4 py-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center {selectedMode === 'mastery' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-600'}"
      >
        <span class="text-lg mb-1">🎯</span>
        Mastery
        <span class="text-xs opacity-75">SM-2 focus</span>
      </button>
    </div>
  </div>

  {#if $dailyChallenge && !$dailyChallenge.completed}
    <div class="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-orange-600 dark:text-orange-400 text-sm uppercase tracking-wide">Daily Challenge</h3>
          <p class="text-gray-600 dark:text-gray-300 text-xs mt-1">Come back tomorrow for a new word!</p>
        </div>
        <span class="text-2xl">🌟</span>
      </div>
    </div>
  {/if}

  <button
    on:click={handleStart}
    class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
  >
    Start {selectedMode === 'zen' ? 'Zen Mode' : selectedMode === 'blitz' ? 'Blitz Mode' : 'Mastery Mode'}
  </button>
  
  <div class="grid grid-cols-2 gap-3 mt-4">
    <button
      on:click={onStats}
      class="py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      📊 Statistics
    </button>
    <button
      on:click={onLists}
      class="py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      📝 My Lists
    </button>
  </div>
</div>
