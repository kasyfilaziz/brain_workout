<script>
  import { onDestroy } from 'svelte';
  import { 
    timerState, 
    currentSession, 
    dailyCount,
    settings,
    generateRandomSessionName,
    startSession,
    pauseSession,
    resumeSession,
    skipSession,
    getTimerDisplay,
    loadCompletedWorkSessionsToday
  } from '../stores/pomodoro';
  import { playNotification } from '../utils/notifications';
  
  let sessionName = generateRandomSessionName();
  let displayTime = '25:00';
  let showBreakOptions = false;
  
  $: state = $timerState;
  $: session = $currentSession;
  $: completedToday = $dailyCount;
  $: currentSettings = $settings;
  
  $: if (state === 'waiting_for_break') {
    showBreakOptions = true;
  } else if (state === 'idle') {
    showBreakOptions = false;
    sessionName = generateRandomSessionName();
  }
  
  $: if (session && session.remaining !== undefined) {
    displayTime = getTimerDisplay(Math.ceil(session.remaining / 1000));
  }
  
  $: if (state === 'idle') {
    displayTime = getTimerDisplay(currentSettings?.workDuration * 60 || 1500);
  }
  
  $: if (state === 'work' || state === 'break') {
    if (session) {
      const total = session.duration;
      const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
      const remaining = Math.max(0, total - elapsed);
      displayTime = getTimerDisplay(remaining);
    }
  }
  
  async function handleStart() {
    console.log("Start button clicked, state:", state);
    if (state === 'idle') {
      await startSession(sessionName, 'work');
      console.log("startSession called");
    } else if (state === 'waiting_for_break') {
      const completed = completedToday;
      const needed = currentSettings?.sessionsBeforeLongBreak || 4;
      const isLongBreak = completed >= needed;
      await startSession(sessionName, isLongBreak ? 'long_break' : 'short_break');
    }
  }
  
  function handlePause() {
    pauseSession();
  }
  
  async function handleResume() {
    await resumeSession();
  }
  
  async function handleSkip() {
    await skipSession();
  }
  
  onDestroy(() => {
    // cleanup if needed
  });
</script>

<div class="flex flex-col flex-grow w-full space-y-8">
  {#if state === 'idle'}
    <div class="text-center space-y-2">
      <label for="sessionName" class="block text-sm font-medium text-gray-500 dark:text-gray-400">
        Session Name
      </label>
      <input
        id="sessionName"
        type="text"
        bind:value={sessionName}
        placeholder="What are you working on?"
        class="w-full max-w-xs px-4 py-3 text-center text-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
      />
    </div>
    
    <div class="text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Today's Sessions: <span class="font-bold text-blue-600 dark:text-blue-400">{completedToday}</span>
      </p>
      <div class="text-7xl font-bold text-gray-900 dark:text-white tabular-nums">
        {displayTime}
      </div>
    </div>
    
    <button
      on:click={handleStart}
      class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 mx-auto"
    >
      Start Focus
    </button>
    
  {:else if state === 'work' || state === 'break'}
    <div class="text-center space-y-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {session?.name || 'Focus Session'}
      </p>
      
      {#if state === 'work'}
        <p class="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">
          Focus Time
        </p>
      {:else}
        <p class="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wider">
          Break Time
        </p>
      {/if}
      
      <div class="text-8xl font-bold text-gray-900 dark:text-white tabular-nums">
        {displayTime}
      </div>
      
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Session {completedToday + 1} {currentSettings?.sessionsBeforeLongBreak ? `of ${currentSettings.sessionsBeforeLongBreak}` : ''}
      </p>
    </div>
    
    <div class="flex gap-4 mx-auto">
      <button
        on:click={handlePause}
        class="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        Pause
      </button>
      
      <button
        on:click={handleSkip}
        class="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        Skip
      </button>
    </div>
    
  {:else if state === 'paused'}
    <div class="text-center space-y-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {session?.name || 'Focus Session'}
      </p>
      <p class="text-xs text-yellow-600 dark:text-yellow-400 font-medium uppercase tracking-wider">
        Paused
      </p>
      <div class="text-8xl font-bold text-gray-400 dark:text-gray-500 tabular-nums">
        {displayTime}
      </div>
    </div>
    
    <button
      on:click={handleResume}
      class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 mx-auto"
    >
      Resume
    </button>
    
  {:else if state === 'waiting_for_break'}
    <div class="text-center space-y-6">
      <div class="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Session Complete!
        </h2>
        <p class="text-gray-500 dark:text-gray-400">
          Great focus session. Time for a break.
        </p>
      </div>
      
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {completedToday} {completedToday === 1 ? 'session' : 'sessions'} completed today
        </p>
      </div>
      
      <div class="flex flex-col gap-3">
        {#if completedToday >= (currentSettings?.sessionsBeforeLongBreak || 4)}
          <button
            on:click={handleStart}
            class="px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-95"
          >
            Long Break ({currentSettings?.longBreakDuration || 15} min)
          </button>
        {:else}
          <button
            on:click={handleStart}
            class="px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-95"
          >
            Short Break ({currentSettings?.shortBreakDuration || 5} min)
          </button>
        {/if}
        
        <button
          on:click={handleSkip}
          class="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium"
        >
          Skip Break
        </button>
      </div>
    </div>
  {/if}
</div>
