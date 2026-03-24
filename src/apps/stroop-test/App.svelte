<script>
  import { onMount } from 'svelte';
  import { session } from './stores/session';
  import { profile } from './stores/profile';
  import { settings } from './stores/settings';
  import StimulusDisplay from './components/StimulusDisplay.svelte';
  import ControlPanel from './components/ControlPanel.svelte';
  import ResultSummary from './components/ResultSummary.svelte';
  import { getAverageRT, formatRT } from './utils/metrics';
  import { vibrateCorrect, vibrateIncorrect, vibrateSuccess } from './utils/haptics';

  let selectedMode = null;

  onMount(() => {
    profile.load();
    settings.load();
  });

  $: isCWLocked = !$profile.avgWordReadingRT || !$profile.avgColorNamingRT;

  function chooseMode(mode) {
    selectedMode = mode;
  }

  function startSession(type) {
    if (selectedMode) {
      session.start(selectedMode, type);
      selectedMode = null;
    }
  }

  function cancelModeSelection() {
    selectedMode = null;
  }

  function handleResponse(event) {
    const isCorrect = session.respond(event.detail);
    if (isCorrect === true) {
      vibrateCorrect();
    } else if (isCorrect === false) {
      vibrateIncorrect();
    }
  }

  async function handleFinish() {
    vibrateSuccess();
    const avgRT = getAverageRT($session.results);
    if ($session.mode === 'W' || $session.mode === 'C') {
      await profile.updateBaseline($session.mode, avgRT);
    }
    await session.save();
  }

  $: if ($session.isFinished) {
    handleFinish();
  }

  function togglePalette() {
    const newPalette = $settings.palette === 'standard' ? 'high-contrast' : 'standard';
    settings.setPalette(newPalette);
  }

  function formatTime(ms) {
    const seconds = Math.max(0, Math.ceil((45000 - ms) / 1000));
    return seconds + 's';
  }

  $: modeLabel = $session.mode === 'W' ? 'Word Reading' : $session.mode === 'C' ? 'Color Naming' : 'Interference';
</script>

<div class="max-w-md mx-auto p-4 flex flex-col h-full">
  {#if !$session.isActive && !$session.isFinished && selectedMode}
    <div class="text-center space-y-8 my-auto">
      <h2 class="text-3xl font-black tracking-tight dark:text-white">Choose Type</h2>
      <p class="text-gray-500 dark:text-gray-400">Select how you want to complete {selectedMode === 'W' ? 'Word Reading' : selectedMode === 'C' ? 'Color Naming' : 'Interference'}</p>
      <div class="grid gap-4">
        <button on:click={() => startSession('Fixed')} class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-left group">
          <div class="flex justify-between items-center">
            <div class="font-bold text-xl group-hover:text-blue-500">Fixed Set</div>
            <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">50 items</span>
          </div>
          <p class="text-gray-500 dark:text-gray-400">Complete exactly 50 stimuli at your own pace.</p>
        </button>
        <button on:click={() => startSession('Timed')} class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-left group">
          <div class="flex justify-between items-center">
            <div class="font-bold text-xl group-hover:text-blue-500">Timed Sprint</div>
            <span class="text-xs bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-2 py-1 rounded">45 seconds</span>
          </div>
          <p class="text-gray-500 dark:text-gray-400">Answer as many as you can in 45 seconds.</p>
        </button>
      </div>
      <button on:click={cancelModeSelection} class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium">
        ← Back
      </button>
    </div>
  {:else if !$session.isActive && !$session.isFinished}
    <div class="flex justify-end mb-4">
      <button on:click={togglePalette} class="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-blue-500 transition-colors">
        Palette: {$settings.palette === 'standard' ? 'Standard' : 'High Contrast'}
      </button>
    </div>
    <div class="text-center space-y-8 my-auto">
      <h2 class="text-3xl font-black tracking-tight dark:text-white">Choose Workout</h2>
      <div class="grid gap-4">
        <button on:click={() => chooseMode('W')} class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-left group">
          <div class="flex justify-between items-center">
            <div class="font-bold text-xl group-hover:text-blue-500">Word Reading</div>
            {#if $profile.avgWordReadingRT}
              <span class="text-xs text-green-500 font-bold">Done: {formatRT($profile.avgWordReadingRT)}</span>
            {/if}
          </div>
          <p class="text-gray-500 dark:text-gray-400">Baseline for automatic word recognition.</p>
        </button>
        <button on:click={() => chooseMode('C')} class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-left group">
          <div class="flex justify-between items-center">
            <div class="font-bold text-xl group-hover:text-blue-500">Color Naming</div>
            {#if $profile.avgColorNamingRT}
              <span class="text-xs text-green-500 font-bold">Done: {formatRT($profile.avgColorNamingRT)}</span>
            {/if}
          </div>
          <p class="text-gray-500 dark:text-gray-400">Baseline for color identification speed.</p>
        </button>
        <button 
          on:click={() => !isCWLocked && chooseMode('CW')} 
          class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-transparent transition-all text-left group {isCWLocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'}"
        >
          <div class="flex justify-between items-center">
            <div class="font-bold text-xl {isCWLocked ? '' : 'group-hover:text-blue-500'}">Interference</div>
            {#if isCWLocked}
              <span class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">Locked</span>
            {/if}
          </div>
          <p class="text-gray-500 dark:text-gray-400">The ultimate challenge for inhibitory control.</p>
          {#if isCWLocked}
            <p class="text-xs text-amber-500 mt-2 font-medium">Complete Word Reading and Color Naming baselines first.</p>
          {/if}
        </button>
      </div>
    </div>
  {:else if $session.isActive}
    <div class="flex flex-col h-full">
      <div class="flex justify-between items-center mb-4">
        <div class="text-sm font-medium text-gray-500">
          Mode: {modeLabel}
        </div>
        <div class="text-sm font-medium text-blue-500">
          {#if $session.type === 'Fixed'}
            Progress: {$session.results.length} / {$session.itemCount}
          {:else}
            Time: {formatTime($session.elapsed)}
          {/if}
        </div>
      </div>
      <StimulusDisplay stimulus={$session.currentStimulus} mode={$session.mode} />
      <ControlPanel on:respond={handleResponse} />
    </div>
  {:else if $session.isFinished}
    <div class="text-center space-y-6 my-auto">
      <div class="text-5xl">🎉</div>
      <h2 class="text-3xl font-bold dark:text-white">Session Complete!</h2>
      
      <ResultSummary 
        results={$session.results} 
        mode={$session.mode} 
        baselines={$profile} 
      />

      <button on:click={session.reset} class="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-bold">
        Back to Menu
      </button>
    </div>
  {/if}
</div>
