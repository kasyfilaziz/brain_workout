# Quickstart: Hub View Toggle Implementation

**Feature**: 008-hub-view-toggle  
**Date**: 2026-03-24

## Prerequisites

- Familiarity with Svelte 4 reactivity (`$:` blocks, `$store` syntax)
- Understanding of existing stores: `settings.js`, `apps.js`
- HTML5 Drag and Drop API basics

## Implementation Order

Follow this sequence for minimal integration conflicts.

### Phase 1: Data Layer (Settings Store)

**File**: `src/lib/stores/settings.js`

1. Add `hubViewMode` and `hubAppOrder` to default settings:
   ```javascript
   const defaultSettings = {
     theme: 'light',
     streak: 0,
     lastStudyDate: null,
     totalStudyDays: 0,
     hubViewMode: 'grid',      // NEW
     hubAppOrder: null,        // NEW
   };
   ```

2. Add getter helper in `load()`:
   ```javascript
   const hubViewModeSetting = await db.get('settings', 'hubViewMode');
   const hubAppOrderSetting = await db.get('settings', 'hubAppOrder');
   ```

3. Add setters:
   ```javascript
   async function setHubViewMode(mode) {
     update(s => ({ ...s, hubViewMode: mode }));
     await save('hubViewMode', mode);
   }

   async function setHubAppOrder(appIds) {
     update(s => ({ ...s, hubAppOrder: appIds }));
     await save('hubAppOrder', appIds);
   }
   ```

4. Export new functions:
   ```javascript
   return {
     subscribe,
     setTheme,
     setHubViewMode,    // NEW
     setHubAppOrder,    // NEW
     load,
     reset,
   };
   ```

### Phase 2: App Ordering Logic

**File**: `src/lib/stores/apps.js`

1. Add `getOrderedApps` helper:
   ```javascript
   function getOrderedApps(viewMode, apps, storedOrder) {
     if (viewMode === 'grid') {
       // Alphabetical sort by name
       return [...apps].sort((a, b) => a.name.localeCompare(b.name));
     } else {
       // List view - use custom order
       if (storedOrder && storedOrder.length > 0) {
         const ordered = storedOrder
           .map(id => apps.find(a => a.id === id))
           .filter(Boolean); // Remove undefined (deleted apps)
         const newApps = apps.filter(a => !storedOrder.includes(a.id));
         return [...ordered, ...newApps];
       }
       return apps;
     }
   }
   ```

2. Export helper:
   ```javascript
   export { apps, getOrderedApps };
   ```

### Phase 3: Hub Component (View Toggle)

**File**: `src/lib/components/Hub.svelte`

1. Import new dependencies:
   ```svelte
   <script>
     import { apps, getOrderedApps } from '../stores/apps';
     import { settings } from '../stores/settings';
     import AppCard from './AppCard.svelte';
     import AppListItem from './AppListItem.svelte'; // NEW
     // ... existing imports
   </script>
   ```

2. Add view toggle button in header (after "Brain Workouts" title):
   ```svelte
   <button 
     on:click={toggleView}
     class="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
     aria-label="Toggle view"
   >
     {#if $settings.hubViewMode === 'grid'}
       <!-- List icon -->
       <svg><!-- list icon SVG --></svg>
     {:else}
       <!-- Grid icon -->
       <svg><!-- grid icon SVG --></svg>
     {/if}
   </button>
   ```

3. Add toggle function:
   ```javascript
   async function toggleView() {
     const newMode = $settings.hubViewMode === 'grid' ? 'list' : 'grid';
     await settings.setHubViewMode(newMode);
   }
   ```

4. Replace static `$apps` rendering with ordered apps:
   ```svelte
   $: orderedApps = getOrderedApps($settings.hubViewMode, $apps, $settings.hubAppOrder);
   ```

5. Conditional rendering:
   ```svelte
   {#if $settings.hubViewMode === 'grid'}
     <!-- Grid view -->
     <div class="grid grid-cols-2 gap-6">
       {#each orderedApps as app (app.id)}
         <AppCard {app} />
       {/each}
     </div>
   {:else}
     <!-- List view -->
     <div class="flex flex-col gap-2">
       {#each orderedApps as app, index (app.id)}
         <AppListItem {app} index={index} />
       {/each}
     </div>
   {/if}
   ```

### Phase 4: AppListItem Component (Drag & Drop)

**File**: `src/lib/components/AppListItem.svelte` (NEW FILE)

1. Create component with drag handle:
   ```svelte
   <script>
     import { navigation } from '../stores/navigation';
     import { settings } from '../stores/settings';

     export let app;
     export let index;

     let isDragging = false;
     let dragOverIndex = null;

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
     }

     function handleDrop(e) {
       e.preventDefault();
       const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
       const toIndex = index;
       if (fromIndex !== toIndex) {
         reorderApps(fromIndex, toIndex);
       }
       dragOverIndex = null;
     }

     async function reorderApps(fromIndex, toIndex) {
       const currentOrder = $settings.hubAppOrder || $apps.map(a => a.id);
       const newOrder = [...currentOrder];
       const [moved] = newOrder.splice(fromIndex, 1);
       newOrder.splice(toIndex, 0, moved);
       await settings.setHubAppOrder(newOrder);
     }

     function handleClick() {
       navigation.navigateTo(app.id);
     }
   </script>

   <div
     draggable="true"
     on:dragstart={handleDragStart}
     on:dragend={handleDragEnd}
     on:dragover={handleDragOver}
     on:drop={handleDrop}
     on:click={handleClick}
     class:list-item
     class:opacity-50={isDragging}
     class:ring-2={dragOverIndex === index}
     class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
   >
     <!-- Drag handle -->
     <div class="cursor-grab text-gray-400 hover:text-gray-600">
       <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
       </svg>
     </div>

     <!-- App icon -->
     <div class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
       <!-- App icon SVG -->
     </div>

     <!-- App info -->
     <div class="flex-1">
       <h3 class="font-semibold text-gray-900 dark:text-white">{app.name}</h3>
       <p class="text-sm text-gray-500 dark:text-gray-400">{app.description}</p>
     </div>
   </div>
   ```

2. Add keyboard support for accessibility:
   - Tab navigation between items
   - Enter to select for reordering
   - Arrow Up/Down to move position
   - Enter to confirm, Escape to cancel

### Phase 5: Keyboard Accessibility

**In AppListItem.svelte**, add keyboard handlers:

1. Track keyboard reordering state:
   ```javascript
   let keyboardReorderMode = false;
   let selectedIndex = index;
   ```

2. Add keydown handler:
   ```javascript
   function handleKeydown(e) {
     if (keyboardReorderMode) {
       if (e.key === 'ArrowUp' && index > 0) {
         e.preventDefault();
         // Move up
         reorderApps(index, index - 1);
       } else if (e.key === 'ArrowDown' && index < $apps.length - 1) {
         e.preventDefault();
         // Move down
         reorderApps(index, index + 1);
       } else if (e.key === 'Enter' || e.key === 'Escape') {
         keyboardReorderMode = false;
       }
     } else if (e.key === 'Enter') {
       e.preventDefault();
       keyboardReorderMode = true;
     }
   }
   ```

3. Add visual indicator for keyboard reorder mode:
   ```svelte
   <div
     tabindex="0"
     on:keydown={handleKeydown}
     class:ring-2={keyboardReorderMode && selectedIndex === index}
     class:ring-blue-500={keyboardReorderMode && selectedIndex === index}
   >
     <!-- existing content -->
   </div>
   ```

## Testing Checklist

After implementation, verify:

1. **Grid View**:
   - [ ] Apps displayed in 2-column card grid
   - [ ] Apps sorted alphabetically by name
   - [ ] Click navigates to app

2. **List View**:
   - [ ] Apps displayed in vertical list
   - [ ] Drag handle visible on left side
   - [ ] Click navigates to app
   - [ ] Drag-and-drop reorders apps

3. **View Toggle**:
   - [ ] Button shows grid icon in list view
   - [ ] Button shows list icon in grid view
   - [ ] Toggle switches view immediately

4. **Persistence**:
   - [ ] Refresh page → same view mode
   - [ ] Reorder apps in list view → refresh → order preserved
   - [ ] Switch to grid view → refresh → grid view shown
   - [ ] Switch back to list view → custom order preserved

5. **Keyboard Accessibility**:
   - [ ] Tab to list item
   - [ ] Enter to start reorder mode
   - [ ] Arrow keys move position
   - [ ] Enter/Escape exits reorder mode

## Common Issues

| Issue | Solution |
|-------|----------|
| Apps not ordered on grid view | Check `getOrderedApps()` is called with correct mode |
| Order not persisting | Verify `settings.setHubAppOrder()` is awaited |
| Drag not working on mobile | Add touch event handlers (touchstart, touchmove, touchend) |
| Keyboard not entering reorder mode | Check tabindex="0" on list item |

## Files Modified

| File | Changes |
|------|---------|
| `src/lib/utils/haptics.js` | NEW FILE - Shared haptic feedback utility |
| `src/lib/stores/settings.js` | +2 properties, +2 setters |
| `src/lib/stores/apps.js` | +1 helper function |
| `src/lib/components/Hub.svelte` | +view toggle, +conditional rendering, +haptic |
| `src/lib/components/AppListItem.svelte` | NEW FILE - List row with drag handle |

## Additional Files to Create

### Haptic Utility

**File**: `src/lib/utils/haptics.js` (NEW FILE)

```javascript
export function vibrateTap() {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

export function vibrateDragStart() {
  if ('vibrate' in navigator) {
    navigator.vibrate(30);
  }
}

export function vibrateDrop() {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 30, 50]);
  }
}
```

**Usage in components**:
- `Hub.svelte`: Import `vibrateTap` for toggle button
- `AppListItem.svelte`: Import `vibrateDragStart` and `vibrateDrop` for drag operations

## Touch Device Support

### AppListItem Touch Handlers

**Mobile touch events** - Add to AppListItem.svelte:

```javascript
let touchStartY = 0;
let touchCurrentY = 0;
let isTouchDragging = false;
let longPressTimer = null;

function handleTouchStart(e) {
  touchStartY = e.touches[0].clientY;
  longPressTimer = setTimeout(() => {
    isTouchDragging = true;
    vibrateDragStart();
  }, 300); // 300ms long-press to start drag
}

function handleTouchMove(e) {
  if (!isTouchDragging) return;
  e.preventDefault();
  touchCurrentY = e.touches[0].clientY;
  // Calculate drop position based on Y coordinate
}

function handleTouchEnd(e) {
  clearTimeout(longPressTimer);
  if (isTouchDragging) {
    // Calculate final drop index and reorder
    const dropIndex = calculateDropIndex(touchStartY, touchCurrentY);
    if (dropIndex !== index) {
      reorderApps(index, dropIndex);
      vibrateDrop();
    }
    isTouchDragging = false;
  }
}
```