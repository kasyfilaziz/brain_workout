<script>
  import { createEventDispatcher } from 'svelte';
  import { updateSettings } from '../stores/settings';
  
  const dispatch = createEventDispatcher();
  
  let step = 0;
  
  const steps = [
    {
      title: 'What is N-Back?',
      description: 'N-Back is a memory exercise where you need to remember if the current item matches the one from N positions ago.',
      example: null
    },
    {
      title: '1-Back Example',
      description: 'For 1-back, compare each item to the previous one. If they match, tap "Match"!',
      example: { sequence: ['A', 'B', 'A'], match: 2, answer: 'Match! A matches A' }
    },
    {
      title: '2-Back Example',
      description: 'For 2-back, compare each item to the one 2 positions back. This is harder!',
      example: { sequence: ['A', 'B', 'A'], match: 2, answer: 'Match! A matches A (2 positions back)' }
    },
    {
      title: 'Ready to Start?',
      description: 'You will see a sequence of positions. Your job is to say if the current one matches the one from N steps ago.',
      example: null
    }
  ];
  
  function next() {
    if (step < steps.length - 1) {
      step++;
    } else {
      complete();
    }
  }
  
  function back() {
    if (step > 0) {
      step--;
    }
  }
  
  async function complete() {
    await updateSettings({ tutorialSeen: true });
    dispatch('complete');
  }
  
  $: currentStep = steps[step];
</script>

<div class="flex flex-col gap-6 py-4">
  <div class="text-center">
    <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">{currentStep.title}</h2>
  </div>
  
  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center">
    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
      {currentStep.description}
    </p>
    
    {#if currentStep.example}
      <div class="mt-4 flex justify-center gap-2">
        {#each currentStep.example.sequence as item, i}
          <div class="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg
            {i === currentStep.example.match 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}">
            {item}
          </div>
        {/each}
      </div>
      <p class="mt-3 text-sm text-blue-600 dark:text-blue-400 font-semibold">
        {currentStep.example.answer}
      </p>
    {/if}
  </div>
  
  <div class="flex justify-center gap-2">
    {#each steps as _, i}
      <div class="w-2 h-2 rounded-full {i === step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}"></div>
    {/each}
  </div>
  
  <div class="flex gap-3 mt-auto">
    {#if step > 0}
      <button
        type="button"
        class="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold transition-all"
        on:click={back}
      >
        Back
      </button>
    {/if}
    <button
      type="button"
      class="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold transition-all"
      on:click={next}
    >
      {step === steps.length - 1 ? "Let's Go!" : 'Next'}
    </button>
  </div>
</div>
