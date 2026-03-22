<script>
  import { customLists, saveCustomList, deleteCustomList, updateCustomList } from '../stores/wordScramble';
  
  let showForm = false;
  let editingList = null;
  let listName = '';
  let wordsText = '';
  let errorMessage = '';
  
  function validateWords(text) {
    const words = text
      .split(/[,\n]+/)
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length >= 4)
      .filter(w => /^[a-z]+$/.test(w));
    
    const unique = [...new Set(words)];
    return unique;
  }
  
  async function handleSave() {
    errorMessage = '';
    
    if (!listName.trim()) {
      errorMessage = 'Please enter a list name';
      return;
    }
    
    const words = validateWords(wordsText);
    
    if (words.length === 0) {
      errorMessage = 'Please enter at least one valid word (4+ letters, alphabetic only)';
      return;
    }
    
    if (editingList) {
      await updateCustomList({
        ...editingList,
        name: listName.trim(),
        words
      });
    } else {
      await saveCustomList({
        name: listName.trim(),
        words
      });
    }
    
    handleCancel();
  }
  
  function handleCancel() {
    showForm = false;
    editingList = null;
    listName = '';
    wordsText = '';
    errorMessage = '';
  }
  
  function handleEdit(list) {
    editingList = list;
    listName = list.name;
    wordsText = list.words.join(', ');
    showForm = true;
  }
  
  async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this list?')) {
      await deleteCustomList(id);
    }
  }
  
  function openNewForm() {
    editingList = null;
    listName = '';
    wordsText = '';
    errorMessage = '';
    showForm = true;
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-black text-gray-900 dark:text-white">Custom Lists</h2>
    <button
      on:click={openNewForm}
      class="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
    >
      + New List
    </button>
  </div>
  
  {#if showForm}
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
      <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-3">
        {editingList ? 'Edit List' : 'Create New List'}
      </h3>
      
      {#if errorMessage}
        <div class="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm">
          {errorMessage}
        </div>
      {/if}
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">List Name</label>
          <input
            type="text"
            bind:value={listName}
            placeholder="e.g., SAT Words"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Words (comma or newline separated)</label>
          <textarea
            bind:value={wordsText}
            placeholder="Enter words separated by commas or new lines&#10;Example: apple, banana, cherry"
            rows="5"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 outline-none resize-none"
          ></textarea>
          <p class="text-xs text-gray-400 mt-1">Minimum 4 characters per word, alphabetic only</p>
        </div>
        
        <div class="flex gap-2">
          <button
            on:click={handleSave}
            class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            {editingList ? 'Update List' : 'Create List'}
          </button>
          <button
            on:click={handleCancel}
            class="flex-1 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
  
  {#if $customLists.length === 0 && !showForm}
    <div class="text-center py-12">
      <div class="text-5xl mb-4">📝</div>
      <p class="text-gray-500 dark:text-gray-400 mb-4">No custom lists yet</p>
      <p class="text-sm text-gray-400 dark:text-gray-500">Create your own word lists to practice specific vocabulary</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each $customLists as list}
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold text-gray-900 dark:text-white">{list.name}</h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">{list.words.length} words</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {list.words.slice(0, 5).join(', ')}{list.words.length > 5 ? '...' : ''}
          </p>
          <div class="flex gap-2">
            <button
              on:click={() => handleEdit(list)}
              class="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Edit
            </button>
            <button
              on:click={() => handleDelete(list.id)}
              class="py-2 px-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
