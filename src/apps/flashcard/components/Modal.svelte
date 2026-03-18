<script>
  import { createEventDispatcher } from 'svelte';
  export let title = '';
  export let isOpen = false;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
    <div 
      class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur">
        <h2 class="text-xl font-bold">{title}</h2>
        <button on:click={close} class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6 max-h-[80vh] overflow-y-auto">
        <slot />
      </div>
      
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
        <slot name="footer" />
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  :global(.animate-slide-up) {
    animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  :global(.animate-fade-in) {
    animation: fade-in 0.2s ease-out;
  }
</style>
