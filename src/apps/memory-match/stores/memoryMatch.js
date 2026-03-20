import { writable, derived, get } from 'svelte/store';
import { dbPromise, APP_PREFIXES, getStoreNames } from '../../../lib/utils/db';
import { generateBuiltInCards, loadCustomDeckCards, GRID_SIZES } from '../utils/cards';

const stores = getStoreNames(APP_PREFIXES.memoryMatch);

// ---- Game State Stores ----
export const gameState = writable('home'); // 'home' | 'playing' | 'victory' | 'timer_expired'
export const cards = writable([]);
export const flippedIndices = writable([]);
export const matchedPairIds = writable(new Set());
export const moves = writable(0);
export const startTime = writable(null);
export const elapsedSeconds = writable(0);
export const timerEnabled = writable(false);
export const timerDuration = writable(120);
export const timerRemaining = writable(0);
export const isPaused = writable(false);

// Selection state
export const selectedGridSize = writable('4x4');
export const selectedTheme = writable('animals');
export const selectedDeckId = writable(null);

// ---- High Scores Store ----
export const highScores = writable({});

export async function loadScores() {
  const db = await dbPromise;
  const allScores = await db.getAll(stores.scores);
  const scoreMap = {};
  for (const score of allScores) {
    scoreMap[score.gridSize] = score;
  }
  highScores.set(scoreMap);
}

export async function saveScore(gridSize, scoreMoves, scoreTime) {
  const db = await dbPromise;
  const scores = get(highScores);
  const existing = scores[gridSize];

  // Check if new best (fewer moves, or same moves with faster time)
  const isNew = !existing ||
    scoreMoves < existing.bestMoves ||
    (scoreMoves === existing.bestMoves && scoreTime < existing.bestTime);

  if (isNew) {
    const record = {
      gridSize,
      bestMoves: scoreMoves,
      bestTime: scoreTime,
      date: Date.now()
    };
    await db.put(stores.scores, record);
    scores[gridSize] = record;
    highScores.set({ ...scores });
  }

  return isNew;
}

export function isNewBest(gridSize, scoreMoves, scoreTime) {
  const scores = get(highScores);
  const existing = scores[gridSize];
  return !existing ||
    scoreMoves < existing.bestMoves ||
    (scoreMoves === existing.bestMoves && scoreTime < existing.bestTime);
}

// ---- Settings Store ----
export const settings = writable({
  soundEnabled: true,
  vibrationEnabled: false,
  timerDuration: 120
});

export async function loadSettings() {
  const db = await dbPromise;
  const stored = await db.get(stores.settings, 'memory_match_settings');
  if (stored) {
    settings.set({
      soundEnabled: stored.soundEnabled ?? true,
      vibrationEnabled: stored.vibrationEnabled ?? false,
      timerDuration: stored.timerDuration ?? 120
    });
    timerDuration.set(stored.timerDuration ?? 120);
  }
}

export async function saveSettings(newSettings) {
  const db = await dbPromise;
  await db.put(stores.settings, {
    key: 'memory_match_settings',
    ...newSettings
  });
  settings.set(newSettings);
  timerDuration.set(newSettings.timerDuration);
}

// ---- Game Logic ----

let timerInterval = null;
let elapsedInterval = null;

export async function startGame() {
  const gridSize = get(selectedGridSize);
  const theme = get(selectedTheme);
  const deckId = get(selectedDeckId);
  const timerOn = get(timerEnabled);
  const timerDur = get(timerDuration);

  let gameCards;
  if (theme === 'custom' && deckId) {
    gameCards = await loadCustomDeckCards(deckId, gridSize);
  } else {
    gameCards = generateBuiltInCards(theme, gridSize);
  }

  if (gameCards.length === 0) return false;

  // Reset state
  cards.set(gameCards);
  flippedIndices.set([]);
  matchedPairIds.set(new Set());
  moves.set(0);
  startTime.set(null);
  elapsedSeconds.set(0);
  isPaused.set(false);

  if (timerOn) {
    timerRemaining.set(timerDur);
  }

  gameState.set('playing');
  return true;
}

export function flipCard(index) {
  const currentFlipped = get(flippedIndices);
  const currentCards = get(cards);
  const paused = get(isPaused);

  // Don't allow flip if paused, already 2 cards flipped, or card is matched/flipped
  if (paused || currentFlipped.length >= 2) return;
  const card = currentCards[index];
  if (card.isMatched || card.isFlipped) return;
  // Don't allow flipping the same card twice
  if (currentFlipped.length === 1 && currentFlipped[0] === index) return;

  // Start timer on first flip
  if (get(startTime) === null) {
    startTime.set(Date.now());
    startElapsedTimer();
    if (get(timerEnabled)) {
      startCountdownTimer();
    }
  }

  // Flip the card
  currentCards[index].isFlipped = true;
  cards.set(currentCards);

  const newFlipped = [...currentFlipped, index];
  flippedIndices.set(newFlipped);

  if (newFlipped.length === 2) {
    checkMatch(newFlipped);
  }
}

function checkMatch(flipped) {
  isPaused.set(true);
  const currentCards = get(cards);
  const [first, second] = flipped;
  const card1 = currentCards[first];
  const card2 = currentCards[second];

  // Increment moves
  moves.update(m => m + 1);

  if (card1.pairId === card2.pairId) {
    // Match found
    currentCards[first].isMatched = true;
    currentCards[second].isMatched = true;
    cards.set(currentCards);

    const matched = get(matchedPairIds);
    matched.add(card1.pairId);
    matchedPairIds.set(matched);

    // Check if all pairs matched
    const gridSize = get(selectedGridSize);
    const config = GRID_SIZES[gridSize];
    if (matched.size >= config.pairs) {
      stopTimers();
      // Small delay before showing victory
      setTimeout(() => {
        gameState.set('victory');
      }, 500);
    }

    flippedIndices.set([]);
    isPaused.set(false);
  } else {
    // No match - flip back after 2 seconds
    setTimeout(() => {
      currentCards[first].isFlipped = false;
      currentCards[second].isFlipped = false;
      cards.set(currentCards);
      flippedIndices.set([]);
      isPaused.set(false);
    }, 2000);
  }
}

export function resetGame() {
  stopTimers();
  gameState.set('home');
  cards.set([]);
  flippedIndices.set([]);
  matchedPairIds.set(new Set());
  moves.set(0);
  startTime.set(null);
  elapsedSeconds.set(0);
  timerRemaining.set(0);
  isPaused.set(false);
}

function startElapsedTimer() {
  stopElapsedTimer();
  elapsedInterval = setInterval(() => {
    const start = get(startTime);
    if (start) {
      elapsedSeconds.set(Math.floor((Date.now() - start) / 1000));
    }
  }, 1000);
}

function stopElapsedTimer() {
  if (elapsedInterval) {
    clearInterval(elapsedInterval);
    elapsedInterval = null;
  }
}

function startCountdownTimer() {
  stopCountdownTimer();
  timerInterval = setInterval(() => {
    const remaining = get(timerRemaining);
    if (remaining <= 1) {
      stopTimers();
      timerRemaining.set(0);
      gameState.set('timer_expired');
    } else {
      timerRemaining.set(remaining - 1);
    }
  }, 1000);
}

function stopCountdownTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function stopTimers() {
  stopElapsedTimer();
  stopCountdownTimer();
}

// ---- Initialize ----
export async function initMemoryMatchStores() {
  await Promise.all([loadScores(), loadSettings()]);
}
