<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { playSound, checkAudioAvailable } from '../utils/audio';
  
  export let stimulus = null;
  export let taskType = 'position';
  export let roundTimeLimit = 3000;
  export let show = false;
  
  const dispatch = createEventDispatcher();
  
  let timeRemaining = roundTimeLimit;
  let timerInterval = null;
  let audioPlayed = false;
  let audioAvailable = true;
  let audioWarningShown = false;
  
  onMount(() => {
    audioAvailable = checkAudioAvailable();
  });
  
  $: if (show && stimulus) {
    audioWarningShown = false;
    startTimer();
    if ((taskType === 'sound' || taskType === 'dual') && stimulus.sound) {
      if (audioAvailable) {
        playSound(stimulus.sound);
      } else if (!audioWarningShown) {
        audioWarningShown = true;
      }
    }
  }
  
  function startTimer() {
    timeRemaining = roundTimeLimit;
    audioPlayed = false;
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
      timeRemaining -= 100;
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        dispatch('timeout');
      }
    }, 100);
  }
  
  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });
  
  $: progressPercent = (timeRemaining / roundTimeLimit) * 100;
  $: isLowTime = timeRemaining < roundTimeLimit * 0.3;
</script>

<div class="flex flex-col items-center justify-center gap-4 py-4">
  {#if taskType === 'sound'}
    <div class="relative">
      <div class="w-24 h-24 rounded-full {audioAvailable ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'} flex items-center justify-center animate-pulse">
        {#if audioAvailable}
          <span class="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {stimulus?.sound || '?'}
          </span>
        {:else}
          <svg class="w-12 h-12 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        {/if}
      </div>
      {#if !audioAvailable}
        <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-yellow-600 dark:text-yellow-400 whitespace-nowrap">
          Audio unavailable
        </div>
      {/if}
    </div>
    <p class="text-gray-500 dark:text-gray-400 text-sm">
      {audioAvailable ? 'Listen and compare' : 'Visual mode - no audio'}
    </p>
    <p class="text-xs text-purple-500 dark:text-purple-400 font-medium">
      Was that the SAME letter as {stimulus?.nLevel || 1}-back?
    </p>
  {:else if stimulus !== null}
    <slot />
  {/if}
  
  <div class="w-full max-w-xs h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
    <div 
      class="h-full transition-all duration-100 rounded-full {isLowTime ? 'bg-red-500' : 'bg-blue-600 dark:bg-blue-500'}"
      style="width: {progressPercent}%"
    ></div>
  </div>
  
  <p class="text-xs text-gray-400 dark:text-gray-500">
    {Math.ceil(timeRemaining / 1000)}s remaining
  </p>
</div>
