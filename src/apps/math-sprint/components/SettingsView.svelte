<script>
  import { onMount } from 'svelte';
  import { settings, saveSettings } from '../stores/mathSprint';

  let soundEnabled = true;
  let vibrationEnabled = false;
  let defaultMode = 'sprint';
  let timedDuration = 60;

  const timerOptions = [30, 60, 90, 120];

  onMount(() => {
    const s = $settings;
    soundEnabled = s.soundEnabled;
    vibrationEnabled = s.vibrationEnabled;
    defaultMode = s.defaultMode;
    timedDuration = s.timedDuration;
  });

  async function handleSave() {
    await saveSettings({
      soundEnabled,
      vibrationEnabled,
      defaultMode,
      timedDuration
    });
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    handleSave();
  }

  function toggleVibration() {
    vibrationEnabled = !vibrationEnabled;
    handleSave();
  }

  function setDefaultMode(mode) {
    defaultMode = mode;
    handleSave();
  }

  function setTimedDuration(dur) {
    timedDuration = dur;
    handleSave();
  }
</script>

<div class="flex flex-col gap-6">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>

  <!-- Sound Toggle -->
  <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
    <div>
      <div class="font-medium text-gray-900 dark:text-white">Sound Effects</div>
      <div class="text-sm text-gray-500 dark:text-gray-400">Play sounds on correct/incorrect</div>
    </div>
    <button
      on:click={toggleSound}
      class="relative w-12 h-6 rounded-full transition-colors {soundEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}"
    >
      <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform {soundEnabled ? 'translate-x-6' : ''}"></span>
    </button>
  </div>

  <!-- Vibration Toggle -->
  <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
    <div>
      <div class="font-medium text-gray-900 dark:text-white">Haptic Feedback</div>
      <div class="text-sm text-gray-500 dark:text-gray-400">Vibrate on answers</div>
    </div>
    <button
      on:click={toggleVibration}
      class="relative w-12 h-6 rounded-full transition-colors {vibrationEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}"
    >
      <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform {vibrationEnabled ? 'translate-x-6' : ''}"></span>
    </button>
  </div>

  <!-- Default Mode -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Default Mode</label>
    <div class="grid grid-cols-2 gap-2">
      <button
        on:click={() => setDefaultMode('sprint')}
        class="p-3 rounded-xl text-center transition-all {defaultMode === 'sprint'
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'}"
      >
        <div class="font-bold">Sprint</div>
        <div class="text-xs opacity-75">30 problems</div>
      </button>
      <button
        on:click={() => setDefaultMode('timed')}
        class="p-3 rounded-xl text-center transition-all {defaultMode === 'timed'
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'}"
      >
        <div class="font-bold">Timed</div>
        <div class="text-xs opacity-75">Countdown</div>
      </button>
    </div>
  </div>

  <!-- Timed Duration -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Default Timed Duration</label>
    <div class="flex gap-2">
      {#each timerOptions as seconds}
        <button
          on:click={() => setTimedDuration(seconds)}
          class="flex-1 py-2 rounded-lg text-sm transition-all {timedDuration === seconds
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'}"
        >
          {seconds}s
        </button>
      {/each}
    </div>
  </div>
</div>
