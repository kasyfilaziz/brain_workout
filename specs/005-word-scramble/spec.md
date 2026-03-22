# Feature Specification: Word Scramble

**Feature Branch**: `005-word-scramble`  
**Created**: 2026-03-21  
**Status**: Draft  
**Input**: User description: "Word Scramble brain workout app - a vocabulary game where users unscramble letters to form words. Features: 1000+ built-in word bank categorized by topic and difficulty, custom user-entered word lists, multiple game modes (Zen, Blitz, Mastery), daily challenge, SM-2 scheduling for difficult words, streak system."

---

## User Scenarios & Testing

### User Story 1 - Practice Vocabulary in Zen Mode (Priority: P1)

As a user, I want to unscramble words at my own pace without time pressure, so I can focus on learning and improving my vocabulary.

**Why this priority**: Zen mode is the simplest, most accessible entry point. Users can start practicing immediately without understanding game mechanics or committing to timed challenges.

**Independent Test**: Can be fully tested by launching the app, selecting a word category, and successfully unscrambling 5 words with no timer running.

**Acceptance Scenarios**:

1. **Given** the user has opened the Word Scramble app, **When** they select "Zen Mode", **Then** a scrambled word is displayed with letter tiles.
2. **Given** the user is viewing a scrambled word, **When** they tap letters in the correct order to form the word, **Then** the game validates the answer and shows the next word.
3. **Given** the user enters an incorrect answer, **When** they submit, **Then** the game shows an error indication and allows them to try again.
4. **Given** the user completes all available words in the category, **Then** a completion message is displayed with their session stats.

---

### User Story 2 - Challenge Mode with Blitz (Priority: P1)

As a user, I want to race against the clock in a 60-second sprint, so I can test my vocabulary speed and compete against my own high scores.

**Why this priority**: Blitz mode adds excitement and replayability. Timed challenges drive engagement and create goals for users to improve.

**Independent Test**: Can be fully tested by selecting Blitz mode, completing the 60-second session, and verifying the score is calculated correctly.

**Acceptance Scenarios**:

1. **Given** the user selects Blitz mode, **When** the countdown begins, **Then** a 60-second timer starts immediately.
2. **Given** the user is in an active Blitz session, **When** they correctly unscramble a word, **Then** points are added to their score and the next word appears.
3. **Given** the user answers incorrectly, **When** they submit, **Then** no points are added but the session continues.
4. **Given** the 60 seconds expire, **Then** the session ends and results screen shows words attempted, correct answers, and final score.

---

### User Story 3 - Mastery Mode with SM-2 Scheduling (Priority: P2)

As a user, I want the game to prioritize words I find difficult, so I can focus my practice on improving my weak areas.

**Why this priority**: Mastery mode provides long-term value by adapting to the user's learning pattern. It leverages spaced repetition to optimize memory retention.

**Independent Test**: Can be tested by completing multiple sessions in Mastery mode and verifying that previously incorrect or difficult words appear more frequently over time.

**Acceptance Scenarios**:

1. **Given** the user is in Mastery mode, **When** they answer a word correctly multiple times, **Then** that word's review interval increases (appears less frequently).
2. **Given** the user answers a word incorrectly, **When** they submit, **Then** that word is marked as due for review and will appear again soon.
3. **Given** the user has words due for review, **When** they start a Mastery session, **Then** due words are prioritized in the word queue.

---

### User Story 4 - Daily Challenge (Priority: P2)

As a user, I want a unique daily challenge that is the same for all users, so I can compare my performance with the community.

**Why this priority**: Daily challenges create habit-forming behavior and social engagement. Users return daily to check their performance relative to others.

**Independent Test**: Can be tested by completing the daily challenge on two different days and verifying that a different word/seed is used each day.

**Acceptance Scenarios**:

1. **Given** it is a new calendar day (midnight local time), **When** the user opens the Daily Challenge, **Then** a new scrambled word is presented.
2. **Given** the user completes the Daily Challenge, **When** they finish, **Then** their completion is recorded with the date and time.
3. **Given** the user has already completed today's Daily Challenge, **When** they try to access it again, **Then** they see their previous score and next challenge countdown.

---

### User Story 5 - Custom Word Lists (Priority: P2)

As a user, I want to add my own words to practice, so I can use the app to study specific vocabulary sets that matter to me.

**Why this priority**: Custom word lists provide personalization. Users can study anything from SAT words to medical terminology without being limited to the built-in bank.

**Independent Test**: Can be tested by creating a custom list with 5 words, selecting it for practice, and successfully unscrambling those exact words.

**Acceptance Scenarios**:

1. **Given** the user is on the home screen, **When** they tap "Add Custom List", **Then** they are shown an input interface to name the list and enter words.
2. **Given** the user has created a custom word list, **When** they select it for practice, **Then** only words from that list are used.
3. **Given** the user wants to edit a custom list, **When** they open the list editor, **Then** they can add, remove, or modify words in the list.
4. **Given** the user wants to delete a custom list, **When** they confirm deletion, **Then** the list is removed and any associated progress is cleared.

---

### User Story 6 - Track Progress and Statistics (Priority: P3)

As a user, I want to see my learning progress and statistics, so I can understand how my vocabulary skills are improving over time.

**Why this priority**: Statistics provide motivation and feedback. Users want to see their streak, accuracy, and mastery progress.

**Independent Test**: Can be tested by completing several sessions and verifying statistics accurately reflect the completed activities.

**Acceptance Scenarios**:

1. **Given** the user has completed practice sessions, **When** they view the Statistics screen, **Then** they see total words practiced, overall accuracy percentage, and current streak.
2. **Given** the user is on a winning streak, **When** they complete a session, **Then** their streak count increases and is displayed.

---

### Edge Cases

- What happens when a user's custom word list contains words shorter than 4 letters? (Reject words with fewer than 4 characters)
- What happens when a user's custom word list contains duplicate words? (Remove duplicates silently)
- What happens when all words in a category have been mastered in Mastery mode? (Show completion message, reset some words for continued practice)
- What happens when the daily challenge date changes while the user is mid-session? (Complete the current challenge with the old seed)
- What happens when user enters special characters or numbers in custom words? (Strip non-alphabetic characters)
- What happens when the device clock is manipulated to access tomorrow's challenge early? (Use server-independent date seed, but accept local time)

---

## Requirements

### Functional Requirements

- **FR-001**: The app MUST display scrambled letter tiles and accept user answers via keyboard typing to form words.
- **FR-002**: The app MUST include a built-in word bank of at least 1000 words organized into categories and difficulty levels.
- **FR-003**: The word bank MUST be categorized by topic (Animals, Food, Countries, Sports, Technology, Nature, Common).
- **FR-003b**: The app MUST allow users to select a single category or an "All Categories" option for mixed practice.
- **FR-004**: The word bank MUST have difficulty levels (Easy: 4-5 letters, Medium: 6-7 letters, Hard: 8+ letters).
- **FR-005**: Users MUST be able to create, edit, and delete custom word lists.
- **FR-005b**: Users MUST be able to add words via bulk paste (comma or newline separated) OR individual word entry.
- **FR-006**: Custom word lists MUST be stored locally and persist between sessions.
- **FR-007**: The app MUST offer three game modes: Zen (no timer), Blitz (60 seconds), and Mastery (SM-2 scheduling).
- **FR-008**: In Mastery mode, the app MUST use the SM-2 algorithm to schedule word reviews based on user performance.
- **FR-009**: The app MUST include a Daily Challenge feature that presents the same word to all users on a given day.
- **FR-009b**: The Daily Challenge word difficulty MUST be randomly selected each day.
- **FR-010**: The Daily Challenge seed MUST be deterministic based on the calendar date.
- **FR-011**: The app MUST provide a shuffle feature that reshuffles the current letters at no cost.
- **FR-012**: The app MUST provide a hint feature that reveals one correct letter at a scoring penalty.
- **FR-012b**: The app MUST allow users to skip difficult words, but skipped words count as incorrect in session statistics.
- **FR-012c**: The app MUST validate answers case-insensitively with trimmed whitespace.
- **FR-013**: The app MUST track and display user statistics including: total words practiced, accuracy percentage, and current streak.
- **FR-013b**: A session MUST have at least 5 words attempted to count toward streak.
- **FR-014**: In Blitz mode, words MUST continue appearing until the 60-second timer expires.
- **FR-014**: The app MUST support Dark/Light theme based on user preference.
- **FR-015**: The app MUST provide haptic feedback on correct answers and button presses.
- **FR-016**: The app MUST function completely offline with no network dependency.

### Key Entities

- **Word**: A single vocabulary word with attributes: text, category, difficulty, scramble variant
- **WordList**: A collection of words, either built-in (shared) or custom (user-owned)
- **CustomList**: User-created word list with name, word array, and creation date
- **Session**: A single practice session with mode, timestamp, words attempted, correct count, score
- **Progress**: Per-word tracking including attempts, correct count, ease factor, interval, next review date
- **DailyChallenge**: Daily challenge record with date, word, user completion status, score achieved

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can complete a Zen mode session with 10 words in under 5 minutes
- **SC-002**: Users can complete a Blitz mode session and receive an accurate score based on correct answers
- **SC-003**: The built-in word bank contains at least 1000 unique words across all categories
- **SC-004**: Mastery mode correctly prioritizes difficult words for review within 3 sessions
- **SC-005**: Daily Challenge presents a deterministic word based on the current calendar date
- **SC-006**: Custom word lists persist after app restart and app reinstall (until data is cleared)
- **SC-007**: Statistics accurately reflect session history with 100% accuracy
- **SC-008**: The app loads and functions fully offline with no network errors
- **SC-009**: Theme preference persists across app sessions
- **SC-010**: 95% of valid word submissions are correctly validated within 500ms

---

## Clarifications

### Session 2026-03-21

- **Q1: Word Input Method**
  A1: Full keyboard typing - User types the unscrambled word directly on keyboard.

- **Q2: Daily Challenge - Should there be a leaderboard?**
  A2: No leaderboard. Daily challenge is self-scored only. User competes against themselves to improve their own daily score.

- **Q3: Mastery Mode - How should difficult words be weighted?**
  A3: Words answered incorrectly appear 3x more frequently than normal. Words answered correctly with hints appear 2x more frequently. Fully mastered words (5+ correct, no hints) appear 50% as often.

- **Q4: Hint System - What should be the scoring penalty?**
  A4: Each hint reduces points for that word to 50% of full value. Hints are optional per word.

- **Q5: Retry and Skip Mechanics**
  A5: Skip available with count penalty - User can skip but it counts as incorrect in stats.

- **Q6: Category Selection in Game Modes**
  A6: Single category + "All" - User picks one category OR practices all categories mixed.

- **Q7: Daily Challenge Difficulty**
  A7: Random difficulty - Daily challenge word difficulty varies each day, creating unpredictability.

- **Q8: Custom Word List - Import Method**
  A8: Both paste and individual entry - Users can paste bulk word lists OR add one word at a time.

- **Q9: Input Validation Rules**
  A9: Case-insensitive, trim whitespace - Most forgiving for casual learners.

- **Q10: Streak Qualification Criteria**
  A10: Session must have 5+ words attempted to count toward streak - Ensures meaningful engagement.

- **Q11: Blitz Mode Session Structure**
  A11: Continuous until time expires - More exciting, higher scores possible.

---

## Assumptions

1. Words in the built-in bank are common English words that are unambiguous when scrambled
2. The scramble algorithm ensures no word is returned in its original or simply reversed form
3. Custom words are user-generated content and user takes responsibility for appropriate vocabulary
4. The app targets casual learners; no academic vocabulary or rare words in the built-in bank
5. Daily Challenge uses local device time; no server validation of date
