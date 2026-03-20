# Feature Specification: Math Sprint

**Feature Branch**: `[004-math-sprint]`
**Created**: 2026-03-20
**Status**: Draft
**Input**: User description: "Mental arithmetic trainer app - a math sprint game with operations (addition, subtraction, multiplication, division, mixed), three difficulty levels, two game modes (sprint and timed), SM-2 mastery tracking per operation and difficulty, session history with accuracy and speed metrics, and sound/vibration settings."

## Clarifications

### Session 2026-03-20

- Q: Should division problems always produce whole number results (e.g., 12÷3=4), or allow decimals (e.g., 7÷2=3.5)? → A: Whole numbers only - division always divides evenly, no decimal handling needed.
- Q: What duration options should be available for timed mode? → A: 30s, 60s, 90s, 120s - four options from quick burst to extended challenge.
- Q: Should the app include a 'mixed operations' mode that randomly picks between all 4 operations? → A: Yes - a 5th option that randomly selects +, -, ×, ÷ per problem.

## User Scenarios & Testing

### User Story 1 - Play a Math Sprint Game (Priority: P1)

A user opens the Math Sprint app, selects an operation type and difficulty level, chooses between sprint or timed mode, and solves arithmetic problems as quickly as possible. The app tracks their score, time, and accuracy, and shows results when the game ends.

**Why this priority**: This is the core gameplay loop. Without this, the app has no value. Everything else is enhancement.

**Independent Test**: Can be fully tested by launching the app, selecting addition at easy difficulty, choosing sprint mode, playing a complete game, and verifying the results screen shows correct/incorrect counts and elapsed time.

**Acceptance Scenarios**:

1. **Given** the user is on the Math Sprint home screen, **When** they select an operation (e.g., Addition), a difficulty (e.g., Easy), and a mode (e.g., Sprint), **Then** a game starts with math problems displayed one at a time
2. **Given** a game is in progress, **When** the user types the correct answer and submits, **Then** the answer is marked correct, the score increases, and the next problem appears
3. **Given** a game is in progress, **When** the user types an incorrect answer and submits, **Then** the answer is marked incorrect, the correct answer is briefly shown, and the next problem appears
4. **Given** the user is in sprint mode, **When** they complete 30 problems, **Then** a results screen appears showing total time, correct count, incorrect count, and accuracy percentage
5. **Given** the user is in timed mode, **When** the countdown reaches zero, **Then** a results screen appears showing problems attempted, correct count, incorrect count, and accuracy percentage
6. **Given** a game is complete, **When** the user taps "Play Again", **Then** a new game starts with the same operation, difficulty, and mode
7. **Given** a game is in progress, **When** the user taps "Back" or closes the app, **Then** the game is discarded and the user returns to the home screen

---

### User Story 2 - Track Mastery Per Operation and Difficulty (Priority: P2)

After completing games, the user can see their mastery level for each operation and difficulty combination. Mastery levels are calculated using a spaced repetition algorithm based on session performance, and are displayed with color-coded indicators (red for needs practice, yellow for learning, green for mastered).

**Why this priority**: Mastery tracking adds long-term engagement and a sense of progression. It helps users identify weak areas and practice them. Without it, each game feels disconnected from previous sessions.

**Independent Test**: Can be tested by completing several games on different operation/difficulty combinations, checking that mastery levels update based on performance, and verifying the color indicators change appropriately.

**Acceptance Scenarios**:

1. **Given** the user has completed at least one game on a specific operation/difficulty, **When** they view the home screen, **Then** the mastery level for that combination is displayed with a color indicator
2. **Given** the user completes a game with high accuracy (above 90%), **When** the mastery is recalculated, **Then** the mastery level increases (interval grows, color shifts toward green)
3. **Given** the user completes a game with low accuracy (below 40%), **When** the mastery is recalculated, **Then** the mastery level decreases (interval resets or shrinks, color shifts toward red)
4. **Given** the user has never played a specific operation/difficulty, **When** they view the home screen, **Then** that combination shows a "New" or neutral indicator

---

### User Story 3 - View Session History and Statistics (Priority: P3)

Users can view their session history showing past games with scores, times, and accuracy. Statistics show trends over time for each operation.

**Why this priority**: Session history provides motivation through visible improvement over time. However, the app is fully functional without it.

**Independent Test**: Can be tested by completing several games, navigating to the stats view, and verifying session records appear with correct data.

**Acceptance Scenarios**:

1. **Given** the user has completed at least one game, **When** they navigate to the Stats view, **Then** a list of recent sessions is displayed showing operation, difficulty, mode, score, time, and date
2. **Given** the user has completed multiple games, **When** they view the Stats view, **Then** sessions are sorted by most recent first
3. **Given** the user has no completed games, **When** they view the Stats view, **Then** a message indicates no sessions yet with a prompt to play

---

### User Story 4 - Configure Settings (Priority: P4)

Users can enable or disable sound effects and haptic feedback, and set their default game mode preference.

**Why this priority**: Settings improve user experience but are not essential to core functionality.

**Independent Test**: Can be tested by toggling sound and vibration settings, playing a game, and verifying the behavior matches the settings.

**Acceptance Scenarios**:

1. **Given** the user is on the Settings view, **When** they toggle sound effects off, **Then** no sounds play during gameplay
2. **Given** the user is on the Settings view, **When** they toggle vibration on, **Then** the device vibrates on correct and incorrect answers during gameplay
3. **Given** the user changes their default mode to "Timed", **When** they return to the home screen, **Then** the timed mode is pre-selected

---

### Edge Cases

- How does the system handle subtraction problems where the result would be negative? (Answer: First operand is always greater than or equal to the second, ensuring non-negative results)
- How does the system handle division problems that don't divide evenly? (Answer: Problems are generated so division always results in a whole number)
- What happens if the user submits an empty answer? (Answer: The submit action is ignored; user must type a number)
- How does the system handle rapid repeated submissions? (Answer: Only one submission per problem is accepted; subsequent submissions are ignored until the next problem loads)

## Requirements

### Functional Requirements

- **FR-001**: Users MUST be able to select one of five operation types: Addition, Subtraction, Multiplication, Division, or Mixed (random per problem)
- **FR-002**: Users MUST be able to select one of three difficulty levels: Easy (single-digit operands 1-9), Medium (double-digit operands 10-99), or Hard (triple-digit operands 100-999)
- **FR-003**: Users MUST be able to select between two game modes: Sprint (30 problems, count-up timer) and Timed (maximum correct answers within a time limit)
- **FR-004**: For timed mode, users MUST be able to select a duration from four options: 30 seconds, 60 seconds, 90 seconds, or 120 seconds
- **FR-005**: The game MUST display math problems one at a time, showing the operands and operation symbol (e.g., "7 + 3 = ?")
- **FR-006**: Users MUST be able to enter their answer using a numeric input field and submit it
- **FR-007**: The system MUST provide immediate visual feedback when an answer is submitted: correct answers are highlighted green, incorrect answers are highlighted red with the correct answer shown briefly
- **FR-008**: In sprint mode, the timer MUST count up from zero and stop when all 30 problems are completed
- **FR-009**: In timed mode, the timer MUST count down from the selected duration and end the game when it reaches zero
- **FR-010**: A results screen MUST appear after each game showing: total problems attempted, correct count, incorrect count, accuracy percentage, and elapsed time
- **FR-011**: The system MUST track mastery for each operation and difficulty combination using a spaced repetition algorithm that updates based on session accuracy
- **FR-012**: Mastery levels MUST be displayed on the home screen with color indicators: red (needs practice, interval 0-1), yellow (learning, interval 2-7), or green (mastered, interval 8+)
- **FR-013**: The system MUST persist session records including operation, difficulty, mode, correct count, incorrect count, elapsed time, and date
- **FR-014**: Users MUST be able to view a list of past sessions in a Stats view, sorted by most recent
- **FR-015**: Users MUST be able to toggle sound effects on or off in Settings
- **FR-016**: Users MUST be able to toggle haptic vibration on or off in Settings
- **FR-017**: Users MUST be able to set a default game mode (Sprint or Timed) in Settings
- **FR-018**: Subtraction problems MUST always produce non-negative results (first operand is greater than or equal to second)
- **FR-019**: Division problems MUST always produce whole number results (dividend is a multiple of divisor)
- **FR-020**: The system MUST prevent duplicate submissions for the same problem (only one answer accepted per problem)
- **FR-021**: Users MUST be able to start a new game from the results screen with the same settings
- **FR-022**: Users MUST be able to return to the home screen from an active game to change settings

### Key Entities

- **Game Session**: Represents a single play session. Contains operation type, difficulty level, game mode, total problems attempted, correct count, incorrect count, elapsed time, accuracy percentage, and timestamp.
- **Mastery Record**: Represents the learning progress for a specific operation and difficulty combination. Contains operation, difficulty, spaced repetition interval, ease factor, next review timestamp, total correct answers, and total incorrect answers across all sessions.
- **User Settings**: Represents user preferences. Contains sound enabled flag, vibration enabled flag, and default game mode preference.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can start a new game within 5 seconds of opening the Math Sprint app (select operation, difficulty, mode, game begins)
- **SC-002**: Problem display and answer feedback complete in under 500 milliseconds providing immediate visual response
- **SC-003**: Results screen appears within 1 second of game completion
- **SC-004**: Mastery levels accurately reflect cumulative session performance and persist across sessions
- **SC-005**: Session history records are accurate and persist across sessions
- **SC-006**: Game works entirely offline with no network dependency
- **SC-007**: Sprint mode timer is accurate within 1 second of real time
- **SC-008**: Timed mode countdown is accurate within 1 second of real time
- **SC-009**: All generated problems produce mathematically correct answers for their operation and difficulty level
- **SC-010**: The game is fully playable on mobile devices with touch interactions
- **SC-011**: 90% of users can complete their first game without confusion or errors
- **SC-012**: The app meets PWA installability criteria and works offline

## Assumptions

- Problem generation is algorithmic (no pre-authored problem bank needed)
- Operands for each difficulty level are randomly generated within defined ranges
- Mixed mode selects a random operation for each individual problem
- Mastery is tracked per operation and difficulty combination (15 total combinations: 5 operations × 3 difficulties)
- A session is considered "complete" when it ends naturally (all problems done or time expired), not when the user abandons it
- The numeric input uses the device's native numeric keyboard on mobile
- Sound effects use simple built-in audio feedback (beep for correct, buzz for incorrect)
- The app does not require user accounts or cloud sync (local-only)
- The app follows the existing navigation pattern (accessible from the Hub)
- Dark mode support follows the existing theme system
