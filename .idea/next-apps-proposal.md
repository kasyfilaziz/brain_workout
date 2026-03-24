# Brain Workout App Ideas

**Created**: 2026-03-19  
**Status**: Brainstorming  
**Context**: This project is a modular brain workout platform. The first app (Flashcard) is complete with spaced repetition (SM-2). This document outlines potential future apps to add to the platform.

---

## Executive Summary

This document proposes 5 brain workout apps that can be built on top of the existing modular container architecture. Each app targets different cognitive skills and complements the existing flashcard functionality. **Priority recommendation: Pomodoro/Focus Timer** as the next app due to high synergy with flashcards and low development complexity.

---

## App #1: Pomodoro Focus Timer

**Priority: HIGH** (Recommended First)

### Concept
A productivity timer app that helps users maintain focus during study sessions. Uses the proven Pomodoro Technique (25 min work, 5 min break, with longer breaks after 4 cycles).

### Cognitive Skill Targeted
- **Time management & discipline**
- **Sustained attention**
- **Work-break rhythm building**

### Core Features

| Feature | Description |
|---------|-------------|
| Timer Modes | Work (25 min), Short Break (5 min), Long Break (15 min) |
| Session Counter | Track completed pomodoros per day |
| Deck Integration | Link focus sessions to specific flashcard decks |
| Statistics | Daily/weekly focus time, average sessions per day |
| Notifications | Sound/vibration when timer completes |
| Auto-start | Option to auto-start next phase |

### Data Model

```javascript
{
  sessions: [
    {
      id: number,
      deckId: number | null,      // optional link to flashcard deck
      startTime: timestamp,
      endTime: timestamp,
      duration: number,            // in seconds
      type: 'work' | 'short_break' | 'long_break',
      completed: boolean
    }
  ],
  settings: {
    workDuration: number,          // default 25
    shortBreakDuration: number,     // default 5
    longBreakDuration: number,      // default 15
    sessionsBeforeLongBreak: number // default 4
  }
}
```

### Why This App

| Factor | Score | Notes |
|--------|-------|-------|
| User Value | ⭐⭐⭐⭐⭐ | Immediate practical benefit |
| Synergy with Flashcard | ⭐⭐⭐⭐⭐ | Perfect study companion |
| Development Effort | ⭐⭐⭐ | Medium - reuse patterns |
| Reusability | ⭐⭐⭐⭐ | Shared stores, components |

### Implementation Notes
- Uses same Hub navigation pattern
- Can share `src/lib/stores/theme.js`
- New IndexedDB store prefix: `pomodoro_`
- Could extend streak system to reward daily focus sessions

---

## App #2: Memory Match Game

### Concept
A classic card-matching game where players flip cards to find matching pairs. Difficulty increases with larger grids and time pressure. Can optionally use content from flashcard decks.

### Cognitive Skill Targeted
- **Spatial memory**
- **Visual recognition**
- **Short-term memory recall**

### Core Features

| Feature | Description |
|---------|-------------|
| Grid Sizes | 3x4 (Easy), 4x4 (Medium), 5x4 (Hard), 6x5 (Expert) |
| Card Themes | Animals, Numbers, Shapes, Custom (from decks) |
| Timer Mode | Optional countdown pressure |
| Move Counter | Track efficiency |
| Difficulty Scaling | Fewer matches needed on harder levels |
| High Scores | Best times per grid size |

### Data Model

```javascript
{
  games: [
    {
      id: number,
      gridSize: string,            // e.g., "4x4"
      theme: string,              // 'animals' | 'numbers' | 'shapes' | 'custom'
      moves: number,
      timeSeconds: number,
      completed: boolean,
      createdAt: timestamp
    }
  ],
  bestScores: {
    // Best times per grid size
    "3x4": { moves: number, time: number },
    "4x4": { moves: number, time: number },
    // ...
  },
  settings: {
    soundEnabled: boolean,
    vibrationEnabled: boolean
  }
}
```

### Why This App
- Classic game with proven cognitive benefits
- Fun, engaging format (not just studying)
- Can pull content from existing flashcard decks
- Different cognitive skill than flashcards (spatial vs. semantic memory)

---

## App #3: Math Sprint

### Concept
A mental arithmetic trainer that challenges users with timed math problems. Tracks mastery per operation type and difficulty level.

### Cognitive Skill Targeted
- **Mental calculation speed**
- **Working memory (holding numbers while computing)**
- **Number sense**

### Core Features

| Feature | Description |
|---------|-------------|
| Operations | Addition, Subtraction, Multiplication, Division |
| Difficulty Levels | Easy (single digit), Medium (double digit), Hard (triple digit) |
| Sprint Modes | 30 problems as fast as possible |
| Timed Mode | Complete X problems in Y seconds |
| Problem Bank | Generated algorithmically, no pre-authored content |
| Mastery Tracking | Per operation, per difficulty level |
| SM-2 Integration | Harder problems appear more frequently |

### Data Model

```javascript
{
  problems: [
    {
      id: number,
      operation: '+' | '-' | '*' | '/',
      operand1: number,
      operand2: number,
      answer: number,
      difficulty: 'easy' | 'medium' | 'hard',
      nextReview: timestamp,       // SM-2 scheduling
      easeFactor: number,
      interval: number,
      timesCorrect: number,
      timesIncorrect: number
    }
  ],
  sessions: [
    {
      id: number,
      date: timestamp,
      correct: number,
      incorrect: number,
      avgTimeMs: number
    }
  ]
}
```

### Why This App
- SM-2 scheduling naturally fits arithmetic mastery
- Targets different brain function than memorization (logic vs. recall)
- Self-generating content (no need to author problems)
- Clear progress metrics

---

## App #4: Word Scramble (Anagram Challenge)

### Concept
Players are given a set of scrambled letters and must unscramble them to form valid words. Difficulty varies by word length and language.

### Cognitive Skill Targeted
- **Phonological processing**
- **Pattern recognition**
- **Vocabulary reinforcement**

### Core Features

| Feature | Description |
|---------|-------------|
| Word Sources | Use content from flashcard decks (front/back) |
| Difficulty Levels | 4-letter, 6-letter, 8-letter+ words |
| Hint System | Reveal letter positions, cost points |
| Timer Mode | Optional pressure timer |
| Streak Bonus | Consecutive correct answers |
| Dictionary Validation | Only accept valid English words |
| Word of the Day | Featured challenging word |

### Data Model

```javascript
{
  words: [
    {
      id: number,
      original: string,            // "keyboard"
      scrambled: string,          // "roabykrd"
      hintCost: number,            // points to reveal letter
      difficulty: 'easy' | 'medium' | 'hard',
      source: 'flashcard' | 'builtin'
    }
  ],
  progress: {
    [wordId]: {
      attempts: number,
      correct: number,
      hintsUsed: number,
      lastAttempt: timestamp
    }
  },
  sessions: [
    {
      id: number,
      date: timestamp,
      wordsAttempted: number,
      wordsCorrect: number,
      score: number
    }
  ]
}
```

### Why This App
- Could pull words from user's own flashcard decks (personal relevance)
- Reinforces vocabulary from flashcards through active recall
- Engaging game format
- Reuses flashcard data structure

---

## App #5: Sequence Recall (N-Back Style)

### Concept
A working memory trainer based on the dual N-back research paradigm. Users must remember sequences of items and indicate if the current item matches the one from N steps ago.

### Cognitive Skill Targeted
- **Working memory capacity**
- **Attention control**
- **Fluid intelligence**

### Core Features

| Feature | Description |
|---------|-------------|
| N-Back Levels | 1-back through 5-back |
| Stimulus Types | Position, Sound, Image |
| Dual Task Mode | Track two streams simultaneously |
| Session Duration | 20 rounds per level (standard N-back protocol) |
| Accuracy Tracking | Hit rate, false alarm rate |
| Adaptive Difficulty | Level up/down based on performance |
| Progress Charts | Improvement over weeks |

### Data Model

```javascript
{
  sessions: [
    {
      id: number,
      date: timestamp,
      level: number,              // 1-5
      taskType: 'position' | 'audio' | 'visual' | 'dual',
      rounds: number,              // typically 20
      hits: number,                // correct "yes" matches
      misses: number,              // missed matches
      falseAlarms: number,         // incorrect "yes"
      correctRejections: number,   // correct "no"
      score: number                // computed d'
    }
  ],
  personalBests: {
    "position_1": { score: number, date: timestamp },
    "position_2": { score: number, date: timestamp },
    // ...
  },
  settings: {
    soundEnabled: boolean,
    vibrationEnabled: boolean
  }
}
```

### Why This App
- Scientifically validated cognitive training (N-back has research backing)
- Clear improvement metrics (d' score)
- Different cognitive demand than flashcards
- Appeals to users interested in "brain training" research

---

## Comparison Matrix

| App | Cognitive Skill | Effort | Reuse | User Value | Synergy |
|-----|----------------|--------|-------|------------|---------|
| Pomodoro Timer | Focus/Time | Medium | High | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Memory Match | Spatial Memory | Medium | Medium | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Math Sprint | Logic/Calc | Medium | High | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Word Scramble | Vocabulary | Medium | Medium | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Sequence Recall | Working Memory | High | Low | ⭐⭐⭐ | ⭐⭐ |

---

## Recommended Implementation Order

### Phase 1: Pomodoro Timer
- **Rationale**: Highest synergy with existing flashcard app, easiest to build, immediate user value
- **Timeline**: ~1-2 weeks
- **Reuse**: 70%+ of infrastructure

### Phase 2: Math Sprint
- **Rationale**: Builds on SM-2 algorithm, self-generating content, targets different skill
- **Timeline**: ~2 weeks
- **Reuse**: 50%+ (SM-2, deck concepts)

### Phase 3: Memory Match
- **Rationale**: Fun variation, reuses card UI patterns, pulls from deck content
- **Timeline**: ~1-2 weeks
- **Reuse**: 60%+

### Phase 4: Word Scramble
- **Rationale**: Leverages flashcard deck content, vocabulary reinforcement
- **Timeline**: ~2 weeks
- **Reuse**: 50%+

### Phase 5: Sequence Recall
- **Rationale**: Most complex, scientifically validated, appeals to specific user segment
- **Timeline**: ~3-4 weeks
- **Reuse**: 40%+

---

## Shared Architecture Benefits

Each new app will automatically benefit from:

| Feature | Provided By |
|---------|-------------|
| Hub Navigation | Container (`src/App.svelte`) |
| Theme System | `src/lib/stores/theme.js` |
| PWA Support | Vite PWA Plugin |
| Data Persistence | IndexedDB (per-app prefix) |
| Offline Support | Service Worker |
| Streak System | Can extend existing |

---

## Appendix: Cognitive Science Notes

| Cognitive Skill | Brain Area | Training Method |
|-----------------|------------|-----------------|
| Working Memory | Prefrontal Cortex | N-back, Dual-task |
| Episodic Memory | Hippocampus | Flashcards, Spaced Repetition |
| Spatial Memory | Parietal Lobe | Memory games, Navigation |
| Processing Speed | Throughout | Timed challenges |
| Attention Control | Frontal Lobe | Focus timers, N-back |

---

## Next Steps

1. **Decide**: Which app should we build first?
2. **Create Spec**: Run `/speckit.specify` to create feature specification
3. **Plan**: Run `/speckit.plan` to generate implementation plan
4. **Build**: Implement following the modular container pattern
