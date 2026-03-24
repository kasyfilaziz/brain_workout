# Feature Specification: Stroop Test (Inhibitory Control)

**Feature Branch**: `007-stroop-test`  
**Created**: 2026-03-23  
**Status**: Final  
**Input**: User description: "Implement the Stroop Test brain workout module for measuring inhibitory control and cognitive flexibility"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Stroop Assessment (Priority: P1)

A user wants to perform a standard Stroop interference test to measure their cognitive inhibition. They need to see a word (e.g., "RED") printed in a conflicting color (e.g., Blue) and select the correct color of the ink rather than reading the word.

**Why this priority**: This is the core "workout" of the Stroop Test and provides the primary value of the module.

**Independent Test**: Can be fully tested by starting an "Interference" session, identifying the ink color of 20 stimuli, and receiving a summary of reaction times.

**Acceptance Scenarios**:

1. **Given** the user is in the Interference mode, **When** the word "GREEN" appears in RED ink, **Then** tapping the "Red" button is marked correct and tapping "Green" is marked incorrect.
2. **Given** a stimulus is displayed, **When** the user taps a button, **Then** the system records the response time in milliseconds and advances to the next stimulus.

---

### User Story 2 - Baseline Processing (Priority: P2)

A user wants to establish their baseline reading and color naming speeds so that their Interference score can be adjusted for their general processing speed.

**Why this priority**: Essential for accurate cognitive assessment (calculating the Interference Score $IG$); without baselines, results are just raw reaction times.

**Independent Test**: Can be tested by completing a "Word Reading" session and a "Color Naming" session and seeing the average RT for each saved.

**Acceptance Scenarios**:

1. **Given** the user is in "Word Reading" mode, **When** the word "BLUE" appears in white text, **Then** tapping the "Blue" button is marked correct.
2. **Given** the user is in "Color Naming" mode, **When** symbols "XXXX" appear in GREEN ink, **Then** tapping the "Green" button is marked correct.

---

### User Story 3 - Progress & Analytics (Priority: P3)

A user wants to see how their inhibitory control is improving over time by viewing historical trends of their Interference Score ($IG$) and Stroop Effect gap.

**Why this priority**: Encourages long-term engagement and provides the "workout" progress tracking.

**Independent Test**: Can be tested by completing multiple sessions and viewing a history chart/list showing the $IG$ score over time.

**Acceptance Scenarios**:

1. **Given** the user has completed at least one of each session type (W, C, CW), **When** they view results, **Then** the system displays the calculated Interference Score ($IG$) using the formula:

   $$IG = ActualCW - \frac{W \times C}{W + C}$$

   Where:
   - $ActualCW$ = average RT in correct interference (CW) trials
   - $W$ = average Word Reading RT (from StroopProfile)
   - $C$ = average Color Naming RT (from StroopProfile)

---

### Edge Cases

- **Colorblind Users**: The system MUST allow users to select high-contrast color palettes (e.g., Blue/Yellow) in settings to ensure the test is accessible for different types of color blindness.
- **Accidental Double Taps**: System MUST ignore subsequent taps within a short debounce period (e.g., 100ms) to prevent accidental double-skipping.
- **Session Interruption**: If the user leaves the app mid-session, the session is discarded to maintain data integrity and accuracy.

## Clarifications

### Session 2026-03-23
- Q: Can a user play the "Interference" mode (CW) without first completing "Word Reading" (W) and "Color Naming" (C) baselines? → A: **Mandatory Baselines**: The "Interference" button is locked or prompts the user to complete W and C modes first. Ensures valid scientific data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support three distinct testing modes: Word Reading (W), Color Naming (C), and Interference (CW).
- **FR-002**: System MUST display a stimulus (word or symbols) and a set of fixed response buttons for the supported colors.
- **FR-003**: System MUST record the reaction time (RT) for every response with millisecond precision.
- **FR-004**: System MUST calculate the Interference Score ($IG$) after a user completes all baseline (W, C) and interference (CW) sessions.
- **FR-005**: System MUST provide haptic and visual feedback for correct and incorrect responses.
- **FR-006**: System MUST persist session results (RT, accuracy, date) in the local database.
- **FR-007**: System MUST allow users to choose between a "Timed Sprint" (45 seconds) or "Fixed Set" (50 items) session.
- **FR-008**: System MUST require users to complete "Word Reading" (W) and "Color Naming" (C) baselines before unlocking the "Interference" (CW) mode.

### Key Entities *(include if feature involves data)*

- **StroopSession**: Represents a single test run. Includes `mode` (W, C, CW), `type` (Timed/Fixed), `results` (array of RTs and correctness), and `timestamp`.
- **StroopProfile**: Aggregated baseline data for a user (average W and C speeds) used to calculate $IG$ for new CW sessions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user completing a standard 50-item Fixed-set interference (CW) session SHOULD finish in under 90 seconds, measured as session duration from first stimulus to last response.
- **SC-002**: Reaction time measurements are consistent within ±10ms across identical stimuli in baseline modes.
- **SC-003**: 100% of completed sessions are persisted and available for historical review.
- **SC-004**: Users receive immediate feedback (visual/haptic) within 50ms of a tap.
