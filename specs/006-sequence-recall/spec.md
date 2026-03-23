# Feature Specification: Sequence Recall (N-Back)

**Feature Branch**: `006-sequence-recall`  
**Created**: 2026-03-22  
**Status**: Draft  
**Input**: User description: "Add Sequence Recall (N-Back) brain workout app - a cognitive training tool based on the dual N-back paradigm that targets working memory capacity"

## User Scenarios & Testing

### User Story 1 - Single N-Back Training Session (Priority: P1)

As a user, I want to perform a single N-back training session where I see a sequence of visual stimuli and indicate whether each current stimulus matches the one from N positions ago.

**Why this priority**: This is the core, essential experience of the app. Without this, there is no N-back training. It delivers immediate cognitive training value.

**Independent Test**: Can be fully tested by starting a session at a given N-level, presenting 20 rounds of stimuli, recording user responses, and displaying a results summary with accuracy metrics.

**Acceptance Scenarios**:

1. **Given** the user is on the home screen, **When** they select "Start Training" and choose "Position 2-back", **Then** the app displays a 3x3 grid and begins presenting stimuli one at a time in random positions

2. **Given** the user is in an active 2-back session, **When** the current position matches the position from 2 steps ago, **Then** the user can tap "Match" and the system records a HIT if correct or FALSE ALARM if incorrect

3. **Given** the user is in an active 2-back session, **When** the current position does NOT match the position from 2 steps ago, **Then** the user can tap "No Match" and the system records a CORRECT REJECTION if correct or MISS if incorrect

4. **Given** the user completes 20 rounds, **Then** the session ends and the app displays results including hit rate, false alarm rate, and computed d' score

---

### User Story 2 - Dual N-Back Training Session (Priority: P2)

As a user, I want to perform a dual N-back session where I track two independent stimulus streams simultaneously (e.g., position AND audio cues), challenging my working memory more intensely.

**Why this priority**: Dual N-back is widely considered the most effective variant for cognitive training research. It provides higher user value but requires the single N-back to be functional first.

**Independent Test**: Can be tested by starting a dual task session with position + sound, presenting 20 rounds with both stimuli, and validating that both streams are tracked independently.

**Acceptance Scenarios**:

1. **Given** the user selects "Dual N-Back" mode, **When** they choose "Position + Sound" and level 1-back, **Then** the app presents both a visual position stimulus and an audio cue simultaneously

2. **Given** the user is in a dual task session, **When** responding to one stream (e.g., position), **Then** their response is tracked independently from the other stream (sound)

3. **Given** the user completes a dual task session, **Then** the app displays separate accuracy metrics for each stream and a combined d' score

---

### User Story 3 - Adaptive Difficulty Progression (Priority: P2)

As a user, I want the app to automatically adjust the difficulty level based on my performance, keeping me in the optimal learning zone.

**Why this priority**: Adaptive difficulty maintains user engagement and ensures continuous improvement. Without it, users may become frustrated (too hard) or bored (too easy).

**Independent Test**: Can be tested by completing multiple sessions with high accuracy (>80% correct) and verifying the app suggests increasing N-level, or with low accuracy (<50%) and verifying the app suggests decreasing N-level.

**Acceptance Scenarios**:

1. **Given** the user completes a session with accuracy above 80%, **When** the session ends, **Then** the app displays "Level Up!" and suggests moving to the next N-level

2. **Given** the user completes a session with accuracy below 50%, **When** the session ends, **Then** the app displays "Keep Practicing" and suggests reducing to a lower N-level

3. **Given** the user maintains accuracy between 50-80%, **When** the session ends, **Then** the app suggests staying at the current level

---

### User Story 4 - Progress Tracking and Statistics (Priority: P3)

As a user, I want to view my training history and track improvement in my working memory capacity over time.

**Why this priority**: Progress tracking provides motivation and demonstrates the value of regular training. This is secondary to the core training experience.

**Independent Test**: Can be tested by completing multiple sessions over time and verifying that the statistics view shows historical data with trend indicators.

**Acceptance Scenarios**:

1. **Given** the user has completed at least one session, **When** they navigate to "Statistics", **Then** the app displays their personal best scores per N-level and task type

2. **Given** the user has completed multiple sessions, **When** they view statistics, **Then** the app shows a trend chart of d' scores over time

3. **Given** the user wants to compare single vs dual task performance, **When** they view statistics, **Then** the app displays separate metrics for each task type

---

### User Story 5 - Custom Session Configuration (Priority: P3)

As a user, I want to customize my training session by choosing the N-level, task type, grid size, and session duration.

**Why this priority**: Customization allows users to tailor training to their goals and time available. Lower priority as defaults can work for most users.

**Independent Test**: Can be tested by accessing settings, changing N-level to 3-back, selecting "Sound only" task type, grid size to "4x4", and verifying a 3-back sound-only session starts with the correct grid.

**Acceptance Scenarios**:

1. **Given** the user is on the home screen, **When** they tap "Settings", **Then** they can choose N-level (1-5), task type (Position only, Sound only, Position + Sound), grid size (2x2, 3x3, 4x4), and rounds per session

2. **Given** the user configures a session with "Position only" at 3-back for 20 rounds, **When** they start training, **Then** the session presents only position stimuli at 3-back difficulty

3. **Given** the user configures a session with "Sound only" at 2-back for 15 rounds, **When** they start training, **Then** the session presents only audio tone letter stimuli and records sound-only responses

4. **Given** the user has saved custom settings, **When** they start a new session, **Then** the app uses their saved preferences as defaults

---

### Edge Cases

- What happens when the user does not respond within the time limit for a round? → The system records a MISS and proceeds to the next round
- How does the system handle audio playback failures on devices without sound capability? → Falls back to visual-only mode with user notification
- What happens if the app loses focus during an active session (e.g., phone call)? → Pauses the session and resumes when user returns
- What happens if the user achieves 100% accuracy? → Display "Perfect Score!" celebration and suggest level up
- What happens if the user has no historical data? → Statistics view shows "Complete your first session to see progress"

## Requirements

### Functional Requirements

- **FR-001**: The system MUST present stimuli in a continuous sequence where users indicate if the current item matches the one from N positions ago, with a 3-second response window per round
- **FR-002**: The system MUST support N-levels from 1-back through 5-back
- **FR-003**: The system MUST support three stimulus types: Position (grid-based visual), Sound (audio cue), and Dual (both simultaneously)
- **FR-004**: The system MUST record user responses as HIT, MISS, FALSE ALARM, or CORRECT REJECTION based on whether the current stimulus matched N steps ago and the user's response
- **FR-005**: The system MUST compute and display the d' (d-prime) score at the end of each session using standard signal detection formula
- **FR-006**: The system MUST adjust suggested difficulty based on session accuracy: above 80% suggests level up, below 50% suggests level down
- **FR-007**: The system MUST persist session history including date, level, task type, rounds, hits, misses, false alarms, correct rejections, and d' score
- **FR-008**: The system MUST display personal best scores per N-level and task type
- **FR-009**: The system MUST display a historical trend of d' scores across sessions
- **FR-010**: The system MUST allow users to configure session parameters: N-level (1-5), task type, grid size (2x2, 3x3, 4x4), and number of rounds (default 20)
- **FR-011**: The system MUST provide a brief instruction/tutorial before the first session explaining the N-back concept
- **FR-012**: The system MUST support pausing and resuming sessions if interrupted
- **FR-013**: Users MUST be able to start a new session from the home screen with one tap using default or last-used settings
- **FR-014**: The system MUST provide haptic or audio feedback upon response recording

## Clarifications

### Session 2026-03-22

- Q: Should the Sequence Recall app share data with the Flashcard app or be independent? → A: Independent Only - Sequence Recall is entirely standalone with built-in stimuli. No data sharing with Flashcard app.
- Q: What level of accessibility support should the app provide? → A: Minimal (Visual-Only Focus) - Position-based stimuli is primary. Sound is optional enhancement. No special accessibility features beyond standard PWA support.
- Q: Should there be a mandatory time limit per round? → A: 3 seconds - Standard N-Back research protocol uses 3 seconds per item. Keeps sessions short and maintains cognitive challenge.
- Q: For Sound stimulus type, what specific sounds should be used? → A: Tone Letters - Standard research uses distinct letters (A, B, C, D, etc.) spoken aloud. Familiar and scientifically validated.
- Q: What should be the default starting N-level for new users? → A: 1-back - Easiest level. New users can understand the task quickly and experience early success.

### Session 2026-03-22 (Follow-up)

- Q: What percentage of rounds should be "match" rounds? → A: ~33% Matches - Standard N-Back research protocol. ~1/3 of rounds are matches, 2/3 are non-matches. Balanced cognitive challenge.
- Q: Should the position grid be fixed 3x3 or configurable? → A: Configurable Grid Size - Allow users to choose 2x2 (4 positions), 3x3 (9 positions), or 4x4 (16 positions). More variety but increases complexity.
- Q: How should session IDs be generated? → A: Auto-increment Integer - Simple integer IDs (1, 2, 3...) using IndexedDB auto-increment. Works well for single-user local storage.
- Q: Should users be able to export/import their session data? → A: No Export - All data stays local only. Simplest implementation but users cannot backup or transfer data.

### Key Entities

- **Session**: Represents a single training session. Attributes: id (auto-increment integer), date, N-level (1-5), taskType (position/sound/dual), gridSize, rounds (default 20), matchProbability (~33% of rounds are matches), hits, misses, falseAlarms, correctRejections, dScore, completed
- **PersonalBest**: Represents the best performance for a specific N-level and task type combination. Attributes: level, taskType, dScore, date achieved
- **UserSettings**: Stores user preferences. Attributes: defaultLevel (default: 1), defaultTaskType (default: position), defaultGridSize (default: 3x3), defaultRounds (default: 20), soundEnabled, vibrationEnabled, roundTimeLimit (default: 3000ms)
- **StimulusRound**: Represents a single round within a session. Attributes: roundNumber, stimulusShown, expectedResponse (match/no-match), userResponse, isCorrect, reactionTimeMs

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can complete a training session in under 5 minutes (20 rounds at ~10-15 seconds per round including response time)
- **SC-002**: The d' score calculation produces values within the standard psychological range (-2 to +4), with positive values indicating above-chance performance
- **SC-003**: At least 90% of users who start a session can complete it without confusion (verified by session completion rate)
- **SC-004**: Users can understand the N-back concept within 30 seconds from the instruction screen
- **SC-005**: The app provides meaningful accuracy feedback that enables users to make informed decisions about difficulty level
- **SC-006**: Personal best scores persist across browser/app sessions and are retrievable immediately upon app launch
- **SC-007**: Progress statistics display trends clearly, allowing users to compare performance from sessions at least 7 days apart
