<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { getSessions } from '../utils/db';
  
  const dispatch = createEventDispatcher();
  
  let sessions = [];
  let personalBests = {};
  let totalSessions = 0;
  let totalTrainingTime = 0;
  let avgReactionTime = 0;
  let trendData = [];
  let loading = true;
  let hasData = false;
  
  const TASK_TYPES = {
    position: 'Position',
    sound: 'Sound',
    dual: 'Dual'
  };
  
  const LEVELS = [1, 2, 3, 4, 5];
  
  onMount(async () => {
    await loadStats();
  });
  
  async function loadStats() {
    loading = true;
    try {
      sessions = await getSessions();
      const completedSessions = sessions.filter(s => s.completed);
      
      hasData = completedSessions.length > 0;
      
      if (hasData) {
        calculatePersonalBests(completedSessions);
        calculateTotals(completedSessions);
        calculateTrendData(completedSessions);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
    loading = false;
  }
  
  function calculatePersonalBests(completedSessions) {
    personalBests = {};
    
    for (const level of LEVELS) {
      for (const [taskType, typeName] of Object.entries(TASK_TYPES)) {
        const relevant = completedSessions.filter(
          s => s.nLevel === level && s.taskType === taskType
        );
        
        if (relevant.length > 0) {
          const best = relevant.reduce((max, s) => 
            (s.dScore ?? 0) > (max.dScore ?? 0) ? s : max
          );
          personalBests[`${level}-${taskType}`] = {
            dScore: best.dScore ?? 0,
            date: best.date,
            sessionsCount: relevant.length
          };
        }
      }
    }
  }
  
  function calculateTotals(completedSessions) {
    totalSessions = completedSessions.length;
    
    totalTrainingTime = completedSessions.reduce((sum, s) => {
      const duration = s.endTime && s.startTime 
        ? s.endTime - s.startTime 
        : (s.rounds * 3000);
      return sum + duration;
    }, 0);
    
    const allReactionTimes = completedSessions.flatMap(s => 
      (s.responses || []).map(r => r.reactionTimeMs || 0)
    );
    
    avgReactionTime = allReactionTimes.length > 0
      ? Math.round(allReactionTimes.reduce((a, b) => a + b, 0) / allReactionTimes.length)
      : 0;
  }
  
  function calculateTrendData(completedSessions) {
    const sorted = [...completedSessions]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30);
    
    trendData = sorted.map(s => ({
      date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dScore: s.dScore ?? 0,
      fullDate: s.date
    }));
  }
  
  function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }
  
  function formatDate(timestamp) {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  function goBack() {
    dispatch('back');
  }
  
  $: chartMinY = trendData.length > 0 ? Math.min(...trendData.map(d => d.dScore), 0) : 0;
  $: chartMaxY = trendData.length > 0 ? Math.max(...trendData.map(d => d.dScore), 4) : 4;
  $: chartHeight = 120;
  $: chartWidth = 280;
  $: yLabels = [0, 1, 2, 3, 4].filter(y => y >= chartMinY && y <= chartMaxY);
</script>

<div class="flex flex-col gap-6 py-4">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-black text-gray-900 dark:text-white">Statistics</h2>
    <button
      type="button"
      on:click={goBack}
      class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
  
  {#if loading}
    <div class="flex justify-center py-12">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  {:else if !hasData}
    <div class="text-center py-12">
      <div class="text-6xl mb-4">🧠</div>
      <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Data Yet</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Complete your first session to see your progress</p>
      <button
        type="button"
        on:click={goBack}
        class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
      >
        Start Training
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
        <div class="text-2xl font-black text-blue-600 dark:text-blue-400">{totalSessions}</div>
        <div class="text-xs text-blue-600 dark:text-blue-400 font-medium">Sessions</div>
      </div>
      <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
        <div class="text-2xl font-black text-green-600 dark:text-green-400">{formatDuration(totalTrainingTime)}</div>
        <div class="text-xs text-green-600 dark:text-green-400 font-medium">Total Time</div>
      </div>
      <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
        <div class="text-2xl font-black text-purple-600 dark:text-purple-400">{avgReactionTime}ms</div>
        <div class="text-xs text-purple-600 dark:text-purple-400 font-medium">Avg Reaction</div>
      </div>
      <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
        <div class="text-2xl font-black text-orange-600 dark:text-orange-400">
          {Object.keys(personalBests).length}
        </div>
        <div class="text-xs text-orange-600 dark:text-orange-400 font-medium">Personal Bests</div>
      </div>
    </div>
    
    {#if trendData.length > 1}
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        <h3 class="font-bold text-gray-700 dark:text-gray-300 mb-3">Progress Trend</h3>
        <div class="relative" style="height: {chartHeight}px; width: {chartWidth}px; margin: 0 auto;">
          <svg width={chartWidth} height={chartHeight} class="overflow-visible">
            {#each yLabels as y}
              {@const yPos = chartHeight - ((y - chartMinY) / (chartMaxY - chartMinY)) * chartHeight}
              <line 
                x1="30" y1={yPos} x2={chartWidth} y2={yPos}
                stroke="currentColor" 
                class="text-gray-200 dark:text-gray-700"
                stroke-width="1"
                stroke-dasharray="4,4"
              />
              <text 
                x="25" y={yPos + 4}
                text-anchor="end"
                class="text-xs fill-gray-400"
              >{y}</text>
            {/each}
            
            {#if trendData.length > 1}
              {@const stepX = (chartWidth - 40) / (trendData.length - 1)}
              {@const points = trendData.map((d, i) => {
                const x = 30 + i * stepX;
                const y = chartHeight - ((d.dScore - chartMinY) / (chartMaxY - chartMinY)) * chartHeight;
                return `${x},${y}`;
              }).join(' ')}
              
              <polyline
                points={points}
                fill="none"
                stroke="currentColor"
                class="text-blue-500"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              
              {#each trendData as d, i}
                {@const x = 30 + i * stepX}
                {@const y = chartHeight - ((d.dScore - chartMinY) / (chartMaxY - chartMinY)) * chartHeight}
                <circle cx={x} cy={y} r="3" class="fill-blue-500" />
              {/each}
            {/if}
          </svg>
        </div>
        <div class="text-center text-xs text-gray-400 mt-2">Last {trendData.length} sessions</div>
      </div>
    {/if}
    
    <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
      <h3 class="font-bold text-gray-700 dark:text-gray-300 mb-3">Personal Bests</h3>
      <div class="space-y-2">
        {#each LEVELS as level}
          {#each Object.entries(TASK_TYPES) as [taskType, typeName]}
            {@const key = `${level}-${taskType}`}
            {@const pb = personalBests[key]}
            {#if pb}
              <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <span class="font-bold text-gray-800 dark:text-gray-200">{level}-back</span>
                  <span class="text-gray-500 dark:text-gray-400 ml-2">{typeName}</span>
                </div>
                <div class="text-right">
                  <div class="font-black text-blue-600 dark:text-blue-400">{pb.dScore.toFixed(2)} d'</div>
                  <div class="text-xs text-gray-400">{formatDate(pb.date)}</div>
                </div>
              </div>
            {/if}
          {/each}
        {/each}
      </div>
    </div>
  {/if}
</div>
