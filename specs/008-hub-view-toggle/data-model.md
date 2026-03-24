# Data Model: Hub View Toggle

**Feature**: 008-hub-view-toggle  
**Date**: 2026-03-24

## Entities

### ViewPreference

Represents user's display preferences for the Hub home screen.

**Storage**: IndexedDB `settings` store (existing)

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `hubViewMode` | `'grid'` \| `'list'` | Current view mode preference | Must be 'grid' or 'list' |
| `hubAppOrder` | `string[]` | Ordered array of app IDs for list view custom order | Array of valid app IDs, duplicates removed |

**Storage Key Pattern**:
```javascript
// Stored as separate entries in settings store
{ key: 'hubViewMode', value: 'grid' }
{ key: 'hubAppOrder', value: ['flashcard', 'pomodoro', 'memory-match', ...] }
```

**Default Values**:
- `hubViewMode`: `'grid'` (first launch)
- `hubAppOrder`: `null` (unset, use default load order)

**State Transitions**:
```text
[Initial Load]
    ↓
Load from IndexedDB
    ↓
If hubViewMode not set → Default to 'grid'
If hubAppOrder not set → Use apps array as-is (list view)
    ↓
User toggles view → Save hubViewMode
User reorders list → Save hubAppOrder
```

### App (Existing)

Represents a brain workout app module. No changes to existing structure.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (e.g., 'flashcard', 'pomodoro') |
| `name` | `string` | Display name (used for alphabetical sorting) |
| `description` | `string` | Short description text |
| `icon` | `string` | Icon identifier for rendering |
| `version` | `string` | App version |
| `componentLoader` | `function` | Lazy-loaded component |

## Relationships

```text
ViewPreference ──┐
                  │
                  │ references (by id)
                  ▼
               App[]
```

- One `ViewPreference` stores ordered references to many `App`s
- No inverse relationship (App is unaware of ordering)

## Data Flow

### Load Sequence

```text
1. apps.loadApps() → Load all app modules
2. settings.load() → Load persisted preferences
3. apps = getOrderedApps(hubViewMode, apps, hubAppOrder)
4. Hub.svelte renders ordered apps
```

### Save Sequence (View Toggle)

```text
1. User clicks toggle button
2. newMode = hubViewMode === 'grid' ? 'list' : 'grid'
3. settings.setHubViewMode(newMode)
4. Hub re-renders with new mode
```

### Save Sequence (App Reorder)

```text
1. User drags App A to position N
2. hubAppOrder = reorderArray(oldOrder, fromIndex, toIndex)
3. settings.setHubAppOrder(hubAppOrder)
4. Hub re-renders with new order
```

## Validation Rules

### hubViewMode

- Must be exactly `'grid'` or `'list'`
- Case-sensitive
- Default to `'grid'` if not set or invalid

### hubAppOrder

- Must be an array of strings
- Each string must be a valid app ID (verified against loaded apps)
- Remove duplicates on save
- Remove non-existent app IDs on load
- Store only app IDs (not app objects)

## Migration Considerations

No IndexedDB schema migration needed. The `settings` store already uses key-value pattern with arbitrary keys. New keys (`hubViewMode`, `hubAppOrder`) are additive.

## IndexedDB Operations

### Read Operations

```javascript
// Get view mode
const hubViewMode = await db.get('settings', 'hubViewMode');

// Get app order
const hubAppOrderEntry = await db.get('settings', 'hubAppOrder');
```

### Write Operations

```javascript
// Set view mode
await db.put('settings', { key: 'hubViewMode', value: mode });

// Set app order
await db.put('settings', { key: 'hubAppOrder', value: orderedIds });
```

## Example Data

### Grid Mode Preference

```json
{
  "key": "hubViewMode",
  "value": "grid"
}
```

### List Mode with Custom Order

```json
{
  "key": "hubViewMode",
  "value": "list"
}
```

```json
{
  "key": "hubAppOrder",
  "value": ["pomodoro", "flashcard", "math-sprint", "memory-match", "word-scramble", "sequence-recall", "stroop-test"]
}
```