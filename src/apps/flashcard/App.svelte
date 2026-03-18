<script>
  import { onMount } from 'svelte';
  import { theme } from '../../lib/stores/theme';
  import { decks, cards, loadDecks, loadCards, addDeck, deleteDeck, addCard } from './stores/flashcards';
  
  import Navbar from './components/Navbar.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import StudyView from './components/StudyView.svelte';
  import ImportView from './components/ImportView.svelte';
  import StatsView from './components/StatsView.svelte';

  let activeTab = typeof localStorage !== 'undefined' ? localStorage.getItem('lastActiveTab') || 'dashboard' : 'dashboard';
  let studyingDeckId = null;
  let isQuickStudy = false;

  $: if (typeof localStorage !== 'undefined' && activeTab !== 'study') {
    localStorage.setItem('lastActiveTab', activeTab);
  }

  onMount(async () => {
    await loadDecks();
    await loadCards();
  });

  function startStudy(deckId) {
    studyingDeckId = deckId;
    isQuickStudy = false;
    activeTab = 'study';
  }

  function startQuickStudy() {
    isQuickStudy = true;
    studyingDeckId = null;
    activeTab = 'study';
  }

  function finishStudy() {
    studyingDeckId = null;
    isQuickStudy = false;
    activeTab = 'dashboard';
  }
</script>

<div class="flex-1 flex flex-col">
  {#if activeTab !== 'study'}
    <main class="flex-1 px-2 py-5 pb-24 max-w-[600px] mx-auto w-full">
      {#if activeTab === 'dashboard'}
        <Dashboard on:study={(e) => startStudy(e.detail)} on:quickStudy={startQuickStudy} />
      {:else if activeTab === 'import'}
        <ImportView on:finish={() => activeTab = 'dashboard'} />
      {:else if activeTab === 'stats'}
        <StatsView />
      {/if}
    </main>
  {:else}
    <main class="flex-1 px-2 py-5 max-w-[600px] mx-auto w-full">
      <StudyView deckId={studyingDeckId} isQuickStudy={isQuickStudy} on:finish={finishStudy} />
    </main>
  {/if}

  {#if activeTab !== 'study'}
    <Navbar {activeTab} on:select={(e) => activeTab = e.detail} />
  {/if}
</div>