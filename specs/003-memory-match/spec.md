# Feature Specification: Memory Match Game

**Feature Branch**: `[003-memory-match]`  
**Created**: 2026-03-20  
**Status**: Draft  
**Input**: User description: "Memory Match Game - A classic card-matching game where players flip cards to find matching pairs by remembering card positions. Supports multiple grid sizes (3x4, 4x4, 5x4, 6x5), card themes (animals, numbers, shapes, custom from flashcard decks), optional timer mode, move counter, difficulty scaling, high scores per grid size, and integration with existing flashcard decks for personal card content."

## Clarifications

### Session 2026-03-20

- Q: When playing with a custom deck, should each card show just the front side (simple matching), or should one card show the front and its pair show the back side (learning + memory)? → A: Option B - One card shows the front, its pair shows the back (match by pair association)
- Q: How should the move counter increment? → A: A move = flipping 2 cards (one pair attempt)
- Q: How long should non-matching cards stay visible before flipping back? → A: 2 seconds
- Q: How should the system handle a flashcard deck with an odd number of cards? → A: Use N-1 cards (always even number of pairs)

## User Scenarios & Testing

### User Story 1 - Play a Memory Match Game (Priority: P1)

A user opens the Memory Match app, selects a grid size and theme, and plays a game by flipping cards to find matching pairs. The app tracks their moves and time, and shows a victory screen when all pairs are matched.

**Why this priority**: This is the core gameplay loop. Without this, the app has no value. Everything else is enhancement.

**Independent Test**: Can be fully tested by launching the app, selecting a grid size, playing a complete game, and verifying the victory screen shows move count and time.

**Acceptance Scenarios**:

1. **Given** the user is on the Memory Match home screen, **When** they select a grid size (e.g., 4x4) and a theme (e.g., Animals), **Then** a game board appears with cards face-down in the selected grid layout
2. **Given** a game is in progress, **When** the user taps a face-down card, **Then** the card flips to reveal its content
3. **Given** a card is flipped, **When** the user taps a second card, **Then** the second card flips to reveal its content
4. **Given** two cards are flipped, **When** the cards match (same content), **Then** both cards remain face-up and the match count increases
5. **Given** two cards are flipped, **When** the cards do not match, **Then** both cards flip back face-down after a brief delay
6. **Given** all pairs have been matched, **When** the last match is made, **Then** a victory screen appears showing total moves, time elapsed, and a completion message
7. **Given** a game is complete, **When** the user taps "Play Again", **Then** a new game starts with the same grid size and theme
8. **Given** a game is in progress, **When** the user taps "Back" or closes the app, **Then** the game state is discarded and the user returns to the home screen

---

### User Story 2 - Track High Scores (Priority: P2)

After completing a game, the user can see how their performance compares to their personal best for that grid size. High scores are stored locally and persist across sessions.

**Why this priority**: High scores add replayability and a sense of progression. Without them, each game feels disconnected from previous sessions.

**Independent Test**: Can be tested by completing a game, checking that the score is recorded, completing another game on the same grid size, and verifying the best score updates correctly.

**Acceptance Scenarios**:

1. **Given** the user completes a game for the first time on a grid size, **When** the victory screen appears, **Then** the game is recorded as the personal best
2. **Given** a personal best exists for a grid size, **When** the user completes a game with fewer moves (or same moves with faster time), **Then** the new score replaces the personal best and a "New Best!" indicator is shown
3. **Given** a personal best exists, **When** the user does not beat it, **Then** the victory screen shows the current score alongside the personal best for comparison
4. **Given** personal bests exist, **When** the user views the Memory Match home screen, **Then** the personal best for each grid size is visible

---

### User Story 3 - Use Custom Flashcard Deck Content (Priority: P3)

Users who have existing flashcard decks can use the card content from their decks as the matching theme. The matching pairs are created from the front/back sides of flashcards, adding personal relevance to the game.

**Why this priority**: This creates synergy with the existing flashcard app and adds unique value that generic memory games lack. However, the game is fully functional with built-in themes alone.

**Independent Test**: Can be tested by creating a flashcard deck with at least 8 cards, selecting "Custom" theme, choosing that deck, and verifying the card content appears in the memory match grid.

**Acceptance Scenarios**:

1. **Given** the user has flashcard decks with 8 or more cards, **When** they select the "Custom" theme on the Memory Match home screen, **Then** a list of eligible decks is displayed
2. **Given** the user selects a flashcard deck, **When** the game starts, **Then** one card in each pair shows the front side of the flashcard and its matching pair shows the back side
3. **Given** the user has no flashcard decks with sufficient cards, **When** they select the "Custom" theme, **Then** a message indicates that no eligible decks are available and built-in themes are suggested instead
4. **Given** a custom deck has more unique cards than half the grid can hold (pairs), **When** the game starts, **Then** a random subset of cards is selected to fill the grid

---

### User Story 4 - Enable Timer Mode (Priority: P4)

Users can optionally enable a countdown timer that adds time pressure to the game. The timer starts when the first card is flipped and counts down. If time runs out, the game ends.

**Why this priority**: Timer mode adds an optional challenge layer for users who want it, but is not essential to the core experience.

**Independent Test**: Can be tested by enabling timer mode, starting a game, and verifying the countdown works and the game ends when time reaches zero.

**Acceptance Scenarios**:

1. **Given** the user is on the Memory Match home screen, **When** they enable timer mode, **Then** a timer duration option becomes available (e.g., 60s, 90s, 120s, 180s)
2. **Given** timer mode is enabled, **When** the game starts and the user flips the first card, **Then** the countdown timer begins
3. **Given** the timer is running, **When** time reaches zero, **Then** the game ends with a "Time's Up" screen showing the number of pairs matched out of total pairs
4. **Given** the timer is running, **When** the user matches all pairs before time runs out, **Then** the victory screen shows remaining time bonus

---

### User Story 5 - Adjust Difficulty (Priority: P5)

Users can select grid sizes that correspond to different difficulty levels, and the app provides clear labeling to help users choose the right challenge level.

**Why this priority**: Difficulty scaling ensures the game is accessible to beginners while challenging for experienced players.

**Independent Test**: Can be tested by selecting each grid size and verifying the correct number of cards appears and the difficulty label matches.

**Acceptance Scenarios**:

1. **Given** the user is on the Memory Match home screen, **When** they view grid size options, **Then** each option displays the grid dimensions, difficulty label (Easy/Medium/Hard/Expert), and total number of cards
2. **Given** the user selects Easy (3x4), **When** the game starts, **Then** 12 cards (6 pairs) appear
3. **Given** the user selects Medium (4x4), **When** the game starts, **Then** 16 cards (8 pairs) appear
4. **Given** the user selects Hard (5x4), **When** the game starts, **Then** 20 cards (10 pairs) appear
5. **Given** the user selects Expert (6x5), **When** the game starts, **Then** 30 cards (15 pairs) appear

---

### Edge Cases

- How does the system handle flashcards where the front and back have identical content?
- What happens when the user plays with timer mode and switches apps (timer behavior in background)?

## Requirements

### Functional Requirements

- **FR-001**: Users MUST be able to select a grid size from four predefined options: 3x4 (12 cards), 4x4 (16 cards), 5x4 (20 cards), and 6x5 (30 cards)
- **FR-002**: Users MUST be able to select a card theme from built-in options (Animals, Numbers, Shapes) or a custom theme from their flashcard decks
- **FR-003**: The game board MUST display all cards face-down when a game starts
- **FR-004**: Users MUST be able to flip cards by tapping them, with a maximum of two cards visible at a time
- **FR-005**: Matching pairs MUST remain face-up for the duration of the game
- **FR-006**: Non-matching pairs MUST flip back face-down after 2 seconds
- **FR-007**: The game MUST track the total number of moves, where one move is defined as flipping two cards (one pair attempt)
- **FR-008**: The game MUST track elapsed time from the first card flip to the last match
- **FR-009**: A victory screen MUST appear when all pairs are matched, displaying total moves, elapsed time, and a completion message
- **FR-010**: Personal best scores MUST be recorded per grid size, prioritized by fewest moves, then fastest time as tiebreaker
- **FR-011**: The game MUST support an optional timer mode where users select a countdown duration before starting
- **FR-012**: When timer mode is enabled, the countdown MUST start when the first card is flipped and the game MUST end when time reaches zero
- **FR-013**: When the timer expires, a "Time's Up" screen MUST display the number of matched pairs out of total pairs
- **FR-014**: Custom theme decks MUST have at least enough unique cards to fill half the selected grid (minimum pairs needed). If the deck has an odd number of cards, one card is dropped to ensure all pairs are complete.
- **FR-015**: When a custom deck has more unique cards than needed, the game MUST randomly select a subset to fill the grid
- **FR-016**: Tapping the same card twice in succession MUST not count as a move or cause unexpected behavior
- **FR-017**: The game MUST provide visual feedback when cards are flipped (animation)
- **FR-018**: The game MUST provide visual feedback when a match is made (e.g., cards stay highlighted or animate)
- **FR-019**: Users MUST be able to start a new game from the victory screen with the same settings
- **FR-020**: Users MUST be able to return to the Memory Match home screen from an active game to change settings

### Key Entities

- **Game Session**: Represents a single play session. Contains grid size, theme, timer mode, move count, elapsed time, matched pairs count, completion status, and timestamps.
- **High Score**: Represents the best performance for a specific grid size. Contains grid size, best move count, best time, and date achieved.
- **Card Theme**: Represents the set of content used for card faces. Contains theme name, theme type (built-in or custom), and associated card content list.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can start a new game within 10 seconds of opening the Memory Match app (select grid, select theme, game begins)
- **SC-002**: Card flip animation completes in under 300 milliseconds providing immediate visual feedback
- **SC-003**: Victory screen appears within 1 second of the final match being made
- **SC-004**: Personal best scores persist across sessions and are accurately recorded
- **SC-005**: Game works entirely offline with no network dependency
- **SC-006**: Timer mode countdown is accurate within 1 second of real time
- **SC-007**: Custom theme selection displays eligible decks and starts game with correct card content
- **SC-008**: All grid sizes produce the correct number of cards (12, 16, 20, 30) with all cards having a matching pair
- **SC-009**: The game is fully playable on mobile devices with touch interactions
- **SC-010**: The app meets PWA installability criteria and works offline

## Assumptions

- Built-in card themes (Animals, Numbers, Shapes) use emoji or simple visual representations for card content
- Card matching is based on exact content equality (same text/emoji = match)
- Custom decks pair each flashcard as two cards: one showing the front side, one showing the back side. Matching is based on belonging to the same flashcard, not content equality.
- The game does not require user accounts or cloud sync (local-only)
- The game follows the existing app's navigation pattern (accessible from the Hub)
- Dark mode support follows the existing theme system
- Grid sizes are fixed to the four predefined options (no custom grid dimensions)
- A "move" is defined as flipping two cards (one pair attempt), regardless of match outcome
- Non-matching cards flip back after 2 seconds
- If a custom deck has an odd number of cards, one card is dropped to ensure all pairs are complete
