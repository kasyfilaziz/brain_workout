import { writable, derived, get } from 'svelte/store';
import { dbPromise, APP_PREFIXES, getStoreNames } from '../../../lib/utils/db';
import { calculateSM2 } from '../../../lib/utils/sm2';
import { generateProblem, getRandomOperation } from '../utils/problems';

const stores = getStoreNames(APP_PREFIXES.mathSprint);

// ---- In-Memory Game State ----
export const gameState = writable('home');
export const currentProblem = writable(null);
export const problemNumber = writable(0);
export const correctCount = writable(0);
export const incorrectCount = writable(0);
export const startTime = writable(null);
export const elapsedTime = writable(0);
export const timeRemaining = writable(0);
export const selectedOperation = writable('add');
export const selectedDifficulty = writable('easy');
export const selectedMode = writable('sprint');
export const timedDuration = writable(60);
export const lastAnswerCorrect = writable(null);

// ---- Persistent Stores ----
export const mastery = writable({});
export const sessions = writable([]);
export const settings = writable({
  soundEnabled: true,
  vibrationEnabled: false,
  defaultMode: 'sprint',
  timedDuration: 60
});

// ---- Derived ----
export const totalProblems = derived(
  [correctCount, incorrectCount],
  ([$c, $i]) => $c + $i
);

export const accuracy = derived(
  [correctCount, totalProblems],
  ([$c, $total]) => $total > 0 ? Math.round(($c / $total) * 100) : 0
);

// ---- Constants ----
const SPRINT_TOTAL = 30;
let timerInterval = null;
let elapsedInterval = null;

// ---- Initialization ----
export async function initMathSprintStores() {
  await Promise.all([loadMastery(), loadSessions(), loadSettings()]);
}

// ---- Game Lifecycle ----
export function startGame() {
  const op = get(selectedOperation);
  const diff = get(selectedDifficulty);

  // Reset state
  problemNumber.set(0);
  correctCount.set(0);
  incorrectCount.set(0);
  startTime.set(null);
  elapsedTime.set(0);
  lastAnswerCorrect.set(null);

  if (get(selectedMode) === 'timed') {
    timeRemaining.set(get(timedDuration));
  }

  // Generate first problem
  const problem = op === 'mixed'
    ? generateProblem(getRandomOperation(), diff)
    : generateProblem(op, diff);

  currentProblem.set(problem);
  problemNumber.set(1);
  gameState.set('playing');
}

export function submitAnswer(answer) {
  const problem = get(currentProblem);
  if (!problem) return;

  const userAnswer = Number(answer);
  if (isNaN(userAnswer)) return;

  // Start timers on first answer
  if (get(startTime) === null) {
    startTime.set(Date.now());
    startElapsedTimer();
    if (get(selectedMode) === 'timed') {
      startCountdownTimer();
    }
  }

  const isCorrect = userAnswer === problem.answer;
  lastAnswerCorrect.set(isCorrect);

  if (isCorrect) {
    correctCount.update(v => v + 1);
  } else {
    incorrectCount.update(v => v + 1);
  }

  // Check end conditions
  const mode = get(selectedMode);
  const num = get(problemNumber);

  if (mode === 'sprint' && num >= SPRINT_TOTAL) {
    setTimeout(() => endGame(), 600);
    return;
  }

  // Generate next problem
  setTimeout(() => {
    const op = get(selectedOperation);
    const diff = get(selectedDifficulty);
    const nextProblem = op === 'mixed'
      ? generateProblem(getRandomOperation(), diff)
      : generateProblem(op, diff);

    currentProblem.set(nextProblem);
    problemNumber.update(n => n + 1);
    lastAnswerCorrect.set(null);
  }, isCorrect ? 300 : 800);
}

export function endGame() {
  stopTimers();

  const total = get(correctCount) + get(incorrectCount);
  if (total > 0) {
    const sessionData = {
      operation: get(selectedOperation),
      difficulty: get(selectedDifficulty),
      mode: get(selectedMode),
      totalProblems: total,
      correct: get(correctCount),
      incorrect: get(incorrectCount),
      accuracy: Math.round((get(correctCount) / total) * 100),
      timeMs: get(elapsedTime) * 1000,
      date: Date.now()
    };
    saveSession(sessionData);
    updateMastery(sessionData.operation, sessionData.difficulty, sessionData.accuracy, sessionData.correct, sessionData.incorrect);
  }

  gameState.set('results');
}

export function resetGame() {
  stopTimers();
  gameState.set('home');
  currentProblem.set(null);
  problemNumber.set(0);
  correctCount.set(0);
  incorrectCount.set(0);
  startTime.set(null);
  elapsedTime.set(0);
  timeRemaining.set(0);
  lastAnswerCorrect.set(null);
}

// ---- Mastery ----
export async function loadMastery() {
  const db = await dbPromise;
  const all = await db.getAll(stores.cards);
  const map = {};
  for (const record of all) {
    map[record.key] = record;
  }
  mastery.set(map);
}

export async function updateMastery(operation, difficulty, acc, sessionCorrect = 0, sessionIncorrect = 0) {
  const key = `${operation}_${difficulty}`;
  const current = get(mastery);
  let record = current[key];

  if (!record) {
    record = {
      key,
      operation,
      difficulty,
      interval: 0,
      easeFactor: 2.5,
      nextReview: Date.now(),
      totalCorrect: 0,
      totalIncorrect: 0,
      lastSessionDate: Date.now()
    };
  }

  const rating = accuracyToSM2Rating(acc);
  const updated = calculateSM2(record, rating);
  updated.totalCorrect = (record.totalCorrect || 0) + sessionCorrect;
  updated.totalIncorrect = (record.totalIncorrect || 0) + sessionIncorrect;
  updated.lastSessionDate = Date.now();

  const db = await dbPromise;
  await db.put(stores.cards, updated);

  current[key] = updated;
  mastery.set({ ...current });
}

export function getMasteryColor(interval) {
  if (interval === 0 || interval === undefined) return 'neutral';
  if (interval <= 1) return 'red';
  if (interval <= 7) return 'yellow';
  return 'green';
}

function accuracyToSM2Rating(acc) {
  if (acc <= 20) return 0;
  if (acc <= 40) return 1;
  if (acc <= 60) return 2;
  if (acc <= 75) return 3;
  if (acc <= 90) return 4;
  return 5;
}

// ---- Sessions ----
export async function loadSessions() {
  const db = await dbPromise;
  const all = await db.getAll(stores.sessions);
  sessions.set(all.sort((a, b) => b.date - a.date));
}

export async function saveSession(sessionData) {
  const db = await dbPromise;
  await db.add(stores.sessions, sessionData);
  await loadSessions();
}

// ---- Settings ----
export async function loadSettings() {
  const db = await dbPromise;
  const stored = await db.get(stores.settings, 'math_sprint_settings');
  if (stored) {
    settings.set({
      soundEnabled: stored.soundEnabled ?? true,
      vibrationEnabled: stored.vibrationEnabled ?? false,
      defaultMode: stored.defaultMode ?? 'sprint',
      timedDuration: stored.timedDuration ?? 60
    });
    timedDuration.set(stored.timedDuration ?? 60);
    selectedMode.set(stored.defaultMode ?? 'sprint');
  }
}

export async function saveSettings(newSettings) {
  const db = await dbPromise;
  await db.put(stores.settings, {
    key: 'math_sprint_settings',
    ...newSettings
  });
  settings.set(newSettings);
  timedDuration.set(newSettings.timedDuration);
}

// ---- Timers ----
function startElapsedTimer() {
  stopElapsedTimer();
  elapsedInterval = setInterval(() => {
    const start = get(startTime);
    if (start) {
      elapsedTime.set(Math.floor((Date.now() - start) / 1000));
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
    const remaining = get(timeRemaining);
    if (remaining <= 1) {
      stopTimers();
      timeRemaining.set(0);
      endGame();
    } else {
      timeRemaining.update(v => v - 1);
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
