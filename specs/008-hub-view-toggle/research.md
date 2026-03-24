# Research: Hub View Toggle

**Feature**: 008-hub-view-toggle  
**Date**: 2026-03-24  
**Status**: Complete

## Research Areas

### 1. Native Drag-and-Drop vs Library

**Decision**: Use native HTML5 Drag and Drop API  
**Rationale**: 
- Simple vertical list reordering - no need for complex library
- Project constitution favors minimal dependencies
- Native API is well-supported in modern browsers
- Keyboard support can be added with standard event handlers

**Alternatives Considered**:
| Library | Rejected Because |
|---------|-------------------|
| dnd-kit (React) | React-specific |
| sortablejs | Adds ~30KB, overkill for simple reorder |
| @shopify/draggable | Adds complexity, project uses vanilla JS |

### 2. Keyboard Accessibility Pattern

**Decision**: Standard ARIA drag-and-drop pattern with focus management  
**Rationale**:
- WCAG-compliant approach
- Tab to focus item
- Enter to select (start reorder)
- Arrow Up/Down to move position
- Enter to confirm, Escape to cancel

**Reference**: WAI-ARIA Authoring Practices - Drag and Drop

### 3. Settings Persistence Pattern

**Decision**: Extend existing `settings.js` store with `hubViewMode` and `hubAppOrder` keys  
**Rationale**:
- Follows established pattern in codebase (`settings.js` already persists theme)
- Uses same IndexedDB `settings` object store
- Pattern: `{ key: 'hubViewMode', value: 'grid' }`, `{ key: 'hubAppOrder', value: ['app1', 'app2'] }`

**Implementation Pattern** (from existing code):
```javascript
// settings.js already has:
// - load() function
// - save(key, value) function
// - setTheme() function

// Add:
// - setHubViewMode(mode) 
// - setHubAppOrder(appIds)
```

### 4. App Ordering Logic

**Decision**: Add helper to `apps.js` store  
**Rationale**:
- Apps are loaded dynamically via `import.meta.glob()`
- Need to apply custom order after initial load
- Grid view: Sort by `app.name` alphabetically
- List view: Use stored `hubAppOrder` or default order

**Algorithm**:
```text
getOrderedApps(viewMode, apps, storedOrder):
  if viewMode === 'grid':
    return apps.sort((a, b) => a.name.localeCompare(b.name))
  else:
    // List view - apply custom order
    if storedOrder exists:
      // Map stored IDs to app objects
      ordered = storedOrder.map(id => apps.find(a => a.id === id))
      // Append any new apps not in stored order
      newApps = apps.filter(a => !storedOrder.includes(a.id))
      return [...ordered, ...newApps]
    else:
      return apps // Default load order
```

### 5. UI Component Design

**Decision**: New `AppListItem.svelte` component for list view  
**Rationale**:
- Separation of concerns from card-based grid view
- Dedicated drag handle for accessibility
- Compact layout with icon, name, description

**Structure**:
```svelte
<AppListItem>
  <!-- Drag handle (left) -->
  <!-- App icon + name + description (center) -->
  <!-- Visual drag state indicators -->
</AppListItem>
```

### 6. Theme Support

**Decision**: Use existing Tailwind `dark:` modifier pattern  
**Rationale**:
- Project already uses dark mode via Tailwind classes
- Toggle button, list items use `dark:bg-gray-800`, etc.
- No additional CSS needed

---

## Dependencies

No new npm packages required. All functionality uses:
- Native HTML5 Drag and Drop API
- Existing Svelte store patterns
- Existing IndexedDB via idb
- Existing Tailwind classes

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Drag UX on mobile touch | Touch events handled, haptic feedback for actions |
| Keyboard navigation confusion | Clear visual focus indicators, Escape to cancel |
| Order corruption on app removal | Prune invalid IDs on load, clean storage periodically |
| Performance with many apps | Current scale is 7 apps, no virtualization needed |

---

## References

- HTML5 Drag and Drop MDN: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- WAI-ARIA Drag and Drop Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/drag-and-drop/
- Project constitution: `.specify/memory/constitution.md`
- Existing settings pattern: `src/lib/stores/settings.js`