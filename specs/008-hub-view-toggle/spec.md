# Feature Specification: Hub View Toggle

**Feature Branch**: `008-hub-view-toggle`  
**Created**: 2026-03-24  
**Status**: Planning Complete  
**Input**: User description: "Hub view toggle between grid and list view, with drag-to-reorder capability in list view and alphabetical sorting in grid view"

## Clarifications

### Session 2026-03-24

- Q: Should keyboard-only users be able to reorder apps in list view? → A: Full keyboard support - focus item, use arrow keys to move, Enter to confirm

## User Scenarios & Testing

### User Story 1 - Toggle Between Grid and List View (Priority: P1)

As a user, I want to switch the Hub home screen between a grid layout and a compact list layout so that I can view my brain workout apps in my preferred display format.

**Why this priority**: This is the core feature request and must work reliably for all users.

**Independent Test**: Can be fully tested by toggling the view control and observing the layout change immediately.

**Acceptance Scenarios**:

1. **Given** the user is on the Hub home page in grid view, **When** the user clicks the view toggle button, **Then** the layout changes to list view displaying apps in a vertical list format.

2. **Given** the user is on the Hub home page in list view, **When** the user clicks the view toggle button, **Then** the layout changes to grid view displaying apps in a 2-column card grid.

3. **Given** the user has toggled to a preferred view mode, **When** the user closes and reopens the app, **Then** the same view mode is displayed (preference is persisted).

---

### User Story 2 - Alphabetical Sorting in Grid View (Priority: P2)

As a user, I want apps in grid view to be automatically sorted alphabetically by name, so I can quickly locate apps when browsing.

**Why this priority**: Provides consistent, predictable organization in the default view mode.

**Independent Test**: Can be tested by switching to grid view and verifying apps appear in A-Z order by name.

**Acceptance Scenarios**:

1. **Given** the user is in grid view, **When** the apps are displayed, **Then** they appear sorted alphabetically from A to Z by app name.

2. **Given** the user has reordered apps in list view, **When** the user switches to grid view, **Then** the apps display in alphabetical order regardless of list view custom order.

---

### User Story 3 - Custom Ordering in List View via Drag and Drop (Priority: P2)

As a user, I want to drag and reorder apps in list view to create my preferred custom order, so that frequently used apps appear at the top.

**Why this priority**: Enables personalization and faster access to favorite apps.

**Independent Test**: Can be tested by switching to list view, dragging an app to a new position, and observing the order change.

**Acceptance Scenarios**:

1. **Given** the user is in list view, **When** the user clicks and holds on an app item, **Then** visual feedback indicates the item is being dragged (e.g., reduced opacity).

2. **Given** the user is dragging an app item, **When** they move it over another item, **Then** a drop indicator shows where the item will be placed.

3. **Given** the user releases the dragged app at a new position, **When** the app is dropped, **Then** the app appears in the new position and the custom order is saved.

4. **Given** the user has created a custom order in list view, **When** the user closes and reopens the app, **Then** the custom order is preserved (preference is persisted).

5. **Given** the user is in list view using only keyboard navigation, **When** the user tabs to an app item and presses Enter, **Then** the item becomes selected for reordering, arrow keys move it up/down, and Enter confirms the new position.

---

### User Story 4 - Toggle Control Visual Design (Priority: P3)

As a user, I want the view toggle control to be easily visible and intuitive to use, so that I can switch layouts without confusion.

**Why this priority**: Good UX ensures the feature is discoverable and pleasant to use.

**Independent Test**: Can be tested by observing the toggle button placement and iconography.

**Acceptance Scenarios**:

1. **Given** the user is on the Hub home page, **When** the page loads, **Then** a visible toggle button with grid/list icons appears in the header area.

2. **Given** the user hovers over the toggle button, **When** the cursor is over the button, **Then** the button provides visual hover feedback.

---

### Edge Cases

- What happens when a new app is added to the system?
  - In grid view: New apps appear at the end (alphabetical order maintained).
  - In list view: New apps appear at the end of the custom order list.
- What happens when an app is uninstalled or removed?
  - The stored custom order should gracefully handle missing apps (removed from order list).
- What happens when drag operation is cancelled (e.g., dropping outside valid area)?
  - App returns to its original position with no order change.
- What happens on first launch (no stored preferences)?
  - Default to grid view with alphabetical sorting.

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a view toggle control that switches between grid and list display modes.
- **FR-002**: System MUST persist the user's view mode preference across sessions using local storage.
- **FR-003**: System MUST display apps in alphabetical order (A-Z by name) when in grid view.
- **FR-004**: System MUST support drag-and-drop reordering of apps when in list view.
- **FR-005**: System MUST persist the user's custom app order for list view across sessions.
- **FR-006**: When switching from list to grid view, the custom order MUST be preserved for future list view sessions.
- **FR-007**: System MUST provide visual feedback during drag operations (dragged item shows reduced opacity; drop position indicated by blue ring highlight).
- **FR-008**: Toggle control MUST support both dark and light themes without visual conflicts.
- **FR-009**: System MUST gracefully handle new apps added after custom order is set (append to end).
- **FR-010**: System MUST gracefully handle missing apps in stored order (remove non-existent apps from order).
- **FR-011**: System MUST support keyboard-only reordering in list view (Tab to focus, Enter to select, Arrow keys to move, Enter to confirm).

### Key Entities

- **ViewPreference**: Represents user's display preferences
  - `viewMode`: string enum ('grid' | 'list')
  - `appOrder`: array of app ID strings (used for list view custom order)

- **App**: Represents a brain workout app module
  - `id`: unique identifier
  - `name`: display name used for alphabetical sorting
  - `description`: short description text
  - `icon`: icon identifier

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can toggle between grid and list views with a single tap/click action.
- **SC-002**: View mode preference persists across browser/app restarts (verified by reopening app).
- **SC-003**: Custom list order persists across browser/app restarts (verified by reopening app).
- **SC-004**: Grid view displays apps in strict alphabetical order (verified by visual inspection).
- **SC-005**: Drag-and-drop reorder operation completes in under 500ms from drop to visual update.
- **SC-006**: 100% of apps remain visible and accessible after reordering (no data loss).
- **SC-007**: Toggle control is visible and accessible on mobile viewport sizes (320px minimum width).
- **SC-008**: Keyboard-only users can reorder apps in list view using standard keyboard navigation patterns.
