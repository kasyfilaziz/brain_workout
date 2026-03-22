<script>
  import { onMount, onDestroy } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import LetterTile from './LetterTile.svelte';
  import { 
    getCurrentWord, 
    getNextWord, 
    reshuffleCurrentWord, 
    submitAnswer, 
    endSession,
    currentSession
  } from '../stores/wordScramble';
  
  export let onFinish = () => {};
  
  let currentWord = null;
  let userAnswer = '';
  let showResult = false;
  let lastResult = null;
  let sessionEnded = false;
  let sessionResult = null;
  let feedbackMessage = '';
  let inputElement;
  let timerInterval = null;
  let timeRemaining = 60;
  let timerRunning = false;
  
  $: session = $currentSession;
  
  function startTimer() {
    if (session?.mode !== 'blitz') return;
    
    timeRemaining = 60;
    timerRunning = true;
    
    timerInterval = setInterval(() => {
      timeRemaining--;
      
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerRunning = false;
        handleTimeUp();
      }
    }, 1000);
  }
  
  function handleTimeUp() {
    endGame();
  }
  
  function handleGameStart() {
    currentWord = getCurrentWord();
    userAnswer = '';
    showResult = false;
    sessionEnded = false;
    sessionResult = null;
    timeRemaining = 60;
    timerRunning = false;
    
    if (session?.mode === 'blitz') {
      startTimer();
    }
  }
  
  onMount(() => {
    handleGameStart();
    window.addEventListener('wordScramble:startGame', handleGameStart);
  });
  
  onDestroy(() => {
    window.removeEventListener('wordScramble:startGame', handleGameStart);
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  });
  
  async function handleSubmit() {
    if (!userAnswer.trim()) return;
    
    const result = await submitAnswer(userAnswer, false);
    lastResult = result;
    showResult = true;
    
    if (result.correct) {
      feedbackMessage = 'Correct! 🎉';
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } else {
      feedbackMessage = `The word was: ${result.word}`;
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
    }
    
    userAnswer = '';
  }
  
  function handleSkip() {
    submitAnswer('__skip__', false);
    feedbackMessage = `Skipped - The word was: ${currentWord.text}`;
    showResult = true;
    userAnswer = '';
  }
  
  function handleShuffle() {
    const reshuffled = reshuffleCurrentWord();
    if (reshuffled) {
      currentWord = reshuffled;
    }
  }
  
  function handleUseHint() {
    const session = get(currentSession);
    if (session) {
      currentSession.update(s => ({ ...s, hintsUsed: s.hintsUsed + 1 }));
    }
    const correctWord = currentWord.text;
    const firstLetter = correctWord.charAt(0);
    feedbackMessage = `Hint: The word starts with '${firstLetter}'`;
    userAnswer = correctWord.charAt(0).toUpperCase() + '_'.repeat(correctWord.length - 1);
  }
  
  function handleNext() {
    showResult = false;
    feedbackMessage = '';
    
    const next = getNextWord();
    if (next) {
      currentWord = next;
      userAnswer = '';
      if (inputElement) {
        inputElement.focus();
      }
    } else {
      endGame();
    }
  }
  
  async function endGame() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerRunning = false;
    sessionResult = await endSession();
    sessionEnded = true;
    onFinish();
  }
  
  function handleInput(e) {
    userAnswer = e.target.value.toUpperCase();
  }
  
  function handleKeydown(e) {
    if (e.key === 'Enter') {
      if (showResult) {
        handleNext();
      } else {
        handleSubmit();
      }
    }
  }
  
  $: letters = currentWord ? currentWord.scrambled.split('') : [];
  $: isUrgent = session?.mode === 'blitz' && timeRemaining <= 10;
</script>

<div class="flex flex-col h-full">
  {#if sessionEnded && sessionResult}
    <div class="flex-1 flex flex-col items-center justify-center text-center" in:fade>
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Session Complete!</h2>
      <div class="space-y-2 text-gray-600 dark:text-gray-300">
        <p>Words: {sessionResult.correct}/{sessionResult.wordsAttempted}</p>
        <p>Score: {sessionResult.score}</p>
        <p>Accuracy: {sessionResult.wordsAttempted > 0 ? Math.round((sessionResult.correct / sessionResult.wordsAttempted) * 100) : 0}%</p>
      </div>
    </div>
  {:else if currentWord}
    <div class="mb-4 flex items-center justify-between">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {#if session}
          <span class="font-medium">{session.correct}</span> correct · <span class="font-medium">{session.wordsAttempted}</span> attempted
        {/if}
      </div>
      <div class="flex items-center gap-3">
        {#if session?.mode === 'blitz'}
          <div class="px-3 py-1 rounded-full font-mono font-bold text-lg {isUrgent ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}">
            {timeRemaining}s
          </div>
        {/if}
        <div class="text-sm font-medium">
          {#if session?.mode === 'blitz'}
            <span class="text-amber-600 dark:text-amber-400">⚡ Blitz</span>
          {:else if session?.mode === 'mastery'}
            <span class="text-purple-600 dark:text-purple-400">🎯 Mastery</span>
          {:else}
            <span class="text-emerald-600 dark:text-emerald-400">🧘 Zen</span>
          {/if}
        </div>
      </div>
    </div>
    
    <div class="flex-1 flex flex-col items-center justify-center">
      <div class="mb-8" in:fly={{ y: -20, duration: 300 }}>
        <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 text-center">Unscramble this word</p>
        <div class="flex flex-wrap justify-center gap-2 mb-6">
          {#each letters as letter, i}
            <LetterTile {letter} index={i} />
          {/each}
        </div>
      </div>
      
      <div class="w-full max-w-md">
        {#if showResult}
          <div 
            class="mb-4 p-4 rounded-xl text-center {lastResult?.correct ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}"
            in:fade
          >
            <p class="font-bold text-lg mb-1">{feedbackMessage}</p>
          </div>
          
          <button
            on:click={handleNext}
            class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Next Word
          </button>
        {:else}
          <div class="relative">
            <input
              bind:this={inputElement}
              type="text"
              value={userAnswer}
              on:input={handleInput}
              on:keydown={handleKeydown}
              placeholder="Type your answer..."
              class="w-full px-6 py-4 text-xl text-center font-bold uppercase rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
              autocomplete="off"
              autocapitalize="characters"
            />
          </div>
          
          <div class="flex gap-2 mt-4">
            <button
              on:click={handleShuffle}
              class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              🔀 Shuffle
            </button>
            <button
              on:click={handleUseHint}
              class="flex-1 py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-xl font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
            >
              💡 Hint (-50%)
            </button>
            <button
              on:click={handleSkip}
              class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ⏭️ Skip
            </button>
          </div>
          
          <button
            on:click={handleSubmit}
            disabled={!userAnswer.trim()}
            class="w-full mt-4 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
