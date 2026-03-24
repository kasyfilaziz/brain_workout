<script>
  import { navigation } from '../stores/navigation';
  import { apps } from '../stores/apps';
  import { settings } from '../stores/settings';
  import { vibrateDragStart, vibrateDrop } from '../utils/haptics';

  export let app;
  export let index;
  export let appCount = 0;

  let isDragging = false;
  let dragOverIndex = null;
  let touchStartY = 0;
  let touchCurrentY = 0;
  let isTouchDragging = false;
  let longPressTimer = null;
  let keyboardReorderMode = false;
  let selectedIndex = null;

  const iconMap = {
    'cards': 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    'brain': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    'memory': 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    'math': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    'puzzle': 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
    'timer': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    'stroop': 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 17.343l-6.707-6.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
  };

  $: path = iconMap[app.icon] || iconMap['brain'];

  function handleDragStart(e) {
    isDragging = true;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  }

  function handleDragEnd() {
    isDragging = false;
    dragOverIndex = null;
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverIndex = index;
  }

  function handleDrop(e) {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const toIndex = index;
    if (fromIndex !== toIndex) {
      reorderApp(fromIndex, toIndex);
    }
    dragOverIndex = null;
  }

  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
    longPressTimer = setTimeout(() => {
      isTouchDragging = true;
      vibrateDragStart();
    }, 300);
  }

  function handleTouchMove(e) {
    if (!isTouchDragging) return;
    e.preventDefault();
    touchCurrentY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    clearTimeout(longPressTimer);
    if (isTouchDragging) {
      const dropIndex = calculateDropIndex(touchStartY, touchCurrentY);
      if (dropIndex !== index) {
        reorderApps(index, dropIndex);
        vibrateDrop();
      }
      isTouchDragging = false;
    }
  }

  function calculateDropIndex(startY, currentY) {
    const items = document.querySelectorAll('.app-list-item');
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      if (currentY < midpoint) {
        return i;
      }
    }
    return items.length - 1;
  }

  async function reorderApp(fromIndex, toIndex) {
    const currentOrder = $settings.hubAppOrder || $apps.map(a => a.id);
    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    await settings.setHubAppOrder(newOrder);
  }

  function handleKeydown(e) {
    if (keyboardReorderMode) {
      if (e.key === 'ArrowUp' && selectedIndex > 0) {
        e.preventDefault();
        reorderApps(selectedIndex, selectedIndex - 1);
        selectedIndex = selectedIndex - 1;
      } else if (e.key === 'ArrowDown' && selectedIndex < appCount - 1) {
        e.preventDefault();
        reorderApps(selectedIndex, selectedIndex + 1);
        selectedIndex = selectedIndex + 1;
      } else if (e.key === 'Enter' || e.key === 'Escape') {
        keyboardReorderMode = false;
        selectedIndex = null;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      keyboardReorderMode = true;
      selectedIndex = index;
    }
  }

  function handleClick() {
    if (!keyboardReorderMode && !isTouchDragging) {
      navigation.navigateTo(app.id);
    }
  }
</script>

<div
  role="listitem"
  draggable={true}
  tabindex="0"
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  on:dragover={handleDragOver}
  on:drop={handleDrop}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
  on:keydown={handleKeydown}
  on:click={handleClick}
  aria-label="{app.name} - press Enter to reorder, click to open"
  class="app-list-item flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer select-none
    {isDragging ? 'opacity-50' : ''}
    {dragOverIndex === index ? 'ring-2 ring-blue-500' : ''}
    {keyboardReorderMode && selectedIndex === index ? 'ring-2 ring-blue-500' : ''}"
>
  <div class="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
    </svg>
  </div>

  <div class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
    </svg>
  </div>

  <div class="flex-1 min-w-0">
    <h3 class="font-semibold text-gray-900 dark:text-white truncate">{app.name}</h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{app.description}</p>
  </div>
</div>