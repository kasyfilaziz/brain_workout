<script>
  import { onMount } from 'svelte';
  import { sessions, loadSessions } from '../stores/mathSprint';

  const operationNames = {
    add: '+',
    subtract: '-',
    multiply: '\u00D7',
    divide: '\u00F7',
    mixed: '~'
  };

  const difficultyNames = {
    easy: 'Easy',
    medium: 'Med',
    hard: 'Hard'
  };

  onMount(async () => {
    await loadSessions();
  });

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function formatDate(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
</script>

<div class="flex flex-col gap-4">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Session History</h2>

  {#if $sessions.length === 0}
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Sessions Yet</h3>
      <p class="text-gray-500 dark:text-gray-400">Play a game to see your history here.</p>
    </div>
  {:else}
    <div class="flex flex-col gap-2">
      {#each $sessions as session}
        <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="text-lg font-bold text-gray-900 dark:text-white w-8 text-center">
              {operationNames[session.operation]}
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {difficultyNames[session.difficulty]} | {session.mode === 'sprint' ? 'Sprint' : 'Timed'}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(session.date)}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-bold text-gray-900 dark:text-white">
              {session.correct}/{session.totalProblems} ({session.accuracy}%)
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(Math.round(session.timeMs / 1000))}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
