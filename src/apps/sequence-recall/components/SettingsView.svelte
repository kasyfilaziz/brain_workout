<script>
  import { createEventDispatcher } from 'svelte';
  import { settings, updateSettings } from '../stores/settings';
  
  const dispatch = createEventDispatcher();
  
  let localSettings = {
    defaultLevel: 1,
    defaultTaskType: 'position',
    defaultGridSize: '3x3',
    defaultRounds: 20,
    soundEnabled: true,
    vibrationEnabled: true
  };
  
  let saving = false;
  let saved = false;
  
  $: if ($settings) {
    localSettings = {
      defaultLevel: $settings.defaultLevel ?? 1,
      defaultTaskType: $settings.defaultTaskType ?? 'position',
      defaultGridSize: $settings.defaultGridSize ?? '3x3',
      defaultRounds: $settings.defaultRounds ?? 20,
      soundEnabled: $settings.soundEnabled ?? true,
      vibrationEnabled: $settings.vibrationEnabled ?? true
    };
  }
  
  async function save() {
    saving = true;
    saved = false;
    
    const success = await updateSettings(localSettings);
    
    saving = false;
    if (success) {
      saved = true;
      setTimeout(() => {
        saved = false;
      }, 2000);
    }
  }
  
  function resetDefaults() {
    localSettings = {
      defaultLevel: 1,
      defaultTaskType: 'position',
      defaultGridSize: '3x3',
      defaultRounds: 20,
      soundEnabled: true,
      vibrationEnabled: true
    };
  }
  
  function close() {
    dispatch('close');
  }
</script>

<div class="flex flex-col gap-6 py-4">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-black text-gray-900 dark:text-white">Settings</h2>
    <button
      type="button"
      on:click={close}
      class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
  
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Default N-Level
      </label>
      <select
        bind:value={localSettings.defaultLevel}
        class="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border-0 focus:ring-2 focus:ring-blue-500"
      >
        {#each [1, 2, 3, 4, 5] as level}
          <option value={level}>{level}-back</option>
        {/each}
      </select>
    </div>
    
    <div>
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Default Task Type
      </label>
      <select
        bind:value={localSettings.defaultTaskType}
        class="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border-0 focus:ring-2 focus:ring-blue-500"
      >
        <option value="position">Position</option>
        <option value="sound">Sound</option>
        <option value="dual">Dual</option>
      </select>
    </div>
    
    {#if localSettings.defaultTaskType !== 'sound'}
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Default Grid Size
        </label>
        <select
          bind:value={localSettings.defaultGridSize}
          class="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border-0 focus:ring-2 focus:ring-blue-500"
        >
          <option value="2x2">2×2</option>
          <option value="3x3">3×3</option>
          <option value="4x4">4×4</option>
        </select>
      </div>
    {/if}
    
    <div>
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Default Rounds: <span class="text-blue-600 dark:text-blue-400">{localSettings.defaultRounds}</span>
      </label>
      <input
        type="range"
        min="10"
        max="50"
        step="5"
        bind:value={localSettings.defaultRounds}
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div class="flex justify-between text-xs text-gray-400 mt-1">
        <span>10</span>
        <span>50</span>
      </div>
    </div>
    
    <div class="pt-2">
      <div class="flex items-center justify-between py-3">
        <div>
          <div class="font-semibold text-gray-700 dark:text-gray-300">Sound Effects</div>
          <div class="text-sm text-gray-500">Play audio cues during training</div>
        </div>
        <button
          type="button"
          on:click={() => localSettings.soundEnabled = !localSettings.soundEnabled}
          class="relative w-12 h-7 rounded-full transition-colors duration-200 {localSettings.soundEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}"
        >
          <span
            class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 {localSettings.soundEnabled ? 'translate-x-5' : ''}"
          ></span>
        </button>
      </div>
      
      <div class="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
        <div>
          <div class="font-semibold text-gray-700 dark:text-gray-300">Vibration</div>
          <div class="text-sm text-gray-500">Haptic feedback on responses</div>
        </div>
        <button
          type="button"
          on:click={() => localSettings.vibrationEnabled = !localSettings.vibrationEnabled}
          class="relative w-12 h-7 rounded-full transition-colors duration-200 {localSettings.vibrationEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}"
        >
          <span
            class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 {localSettings.vibrationEnabled ? 'translate-x-5' : ''}"
          ></span>
        </button>
      </div>
    </div>
  </div>
  
  <div class="flex gap-3 pt-2">
    <button
      type="button"
      on:click={resetDefaults}
      class="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm transition-all"
    >
      Reset to Defaults
    </button>
    <button
      type="button"
      on:click={save}
      disabled={saving}
      class="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
    >
      {#if saving}
        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      {:else if saved}
        ✓ Saved
      {:else}
        Save Settings
      {/if}
    </button>
  </div>
</div>
