import { writable, get, derived } from 'svelte/store';
import { dbPromise, APP_PREFIXES, getStoreNames } from '../../../lib/utils/db';
import { calculateSM2 } from '../../../lib/utils/sm2';
import { wordBank, getWordsByCategory, getWordsByDifficulty, getRandomWord } from '../utils/wordBank';
import { scrambleWord } from '../utils/scramble';

const APP_PREFIX = APP_PREFIXES.wordScramble;
const stores = getStoreNames(APP_PREFIX);

export const customLists = writable([]);
export const currentSession = writable(null);
export const dailyChallenge = writable(null);
export const settings = writable({ soundEnabled: true, vibrationEnabled: true });
export const progress = writable([]);

let sessionWords = [];
let currentWordIndex = 0;
let currentScrambled = '';

export async function initWordScrambleStores() {
  await loadCustomLists();
  await loadProgress();
  await loadDailyChallenge();
  await loadSettings();
}

export async function loadSettings() {
  const db = await dbPromise;
  const stored = await db.get(stores.settings, 'word_scramble_settings');
  if (stored) {
    settings.set(stored);
  } else {
    const defaults = {
      key: 'word_scramble_settings',
      soundEnabled: true,
      vibrationEnabled: true,
      lastPlayedDate: null
    };
    await db.put(stores.settings, defaults);
    settings.set(defaults);
  }
}

export async function saveSettings(newSettings) {
  const db = await dbPromise;
  const updated = { ...get(settings), ...newSettings, key: 'word_scramble_settings' };
  await db.put(stores.settings, updated);
  settings.set(updated);
}

export async function loadCustomLists() {
  const db = await dbPromise;
  const lists = await db.getAll(stores.customLists);
  customLists.set(lists);
}

export async function saveCustomList(list) {
  const db = await dbPromise;
  const id = await db.add(stores.customLists, {
    name: list.name,
    words: list.words,
    createdAt: Date.now()
  });
  await loadCustomLists();
  return id;
}

export async function updateCustomList(list) {
  const db = await dbPromise;
  await db.put(stores.customLists, list);
  await loadCustomLists();
}

export async function deleteCustomList(id) {
  const db = await dbPromise;
  await db.delete(stores.customLists, id);
  await loadCustomLists();
}

export async function loadProgress() {
  const db = await dbPromise;
  const allProgress = await db.getAll(stores.progress);
  progress.set(allProgress);
}

export async function updateWordProgress(wordText, result, usedHint = false) {
  const db = await dbPromise;
  let wordProgress = await db.get(stores.progress, wordText);
  
  if (!wordProgress) {
    wordProgress = {
      wordText,
      attempts: 0,
      correct: 0,
      timesCorrectWithHint: 0,
      timesIncorrect: 0,
      easeFactor: 2.5,
      interval: 0,
      nextReview: Date.now()
    };
  }
  
  wordProgress.attempts++;
  
  let rating;
  if (result === 'correct') {
    rating = usedHint ? 3 : 4;
    wordProgress.correct++;
    if (usedHint) {
      wordProgress.timesCorrectWithHint++;
    }
  } else {
    rating = 1;
    wordProgress.timesIncorrect++;
  }
  
  const updated = calculateSM2(wordProgress, rating);
  
  await db.put(stores.progress, updated);
  await loadProgress();
  
  return updated;
}

export async function loadDailyChallenge() {
  const today = new Date().toISOString().split('T')[0];
  const db = await dbPromise;
  let challenge = await db.get(stores.dailyChallenges, today);
  
  if (!challenge) {
    const word = getRandomWord();
    challenge = {
      date: today,
      wordText: word.text,
      category: word.category,
      difficulty: word.difficulty,
      completed: false,
      score: 0,
      completedAt: null
    };
    await db.put(stores.dailyChallenges, challenge);
  }
  
  dailyChallenge.set(challenge);
}

export async function completeDailyChallenge(score) {
  const today = new Date().toISOString().split('T')[0];
  const db = await dbPromise;
  let challenge = await db.get(stores.dailyChallenges, today);
  
  if (challenge && !challenge.completed) {
    challenge.completed = true;
    challenge.score = score;
    challenge.completedAt = Date.now();
    await db.put(stores.dailyChallenges, challenge);
    dailyChallenge.set(challenge);
  }
}

export function startSession(mode, category = null, customListWords = null) {
  let words = [];
  
  if (customListWords && customListWords.length > 0) {
    words = customListWords.map(w => ({
      text: w,
      category: 'Custom',
      difficulty: w.length <= 5 ? 'easy' : w.length <= 7 ? 'medium' : 'hard'
    }));
  } else if (category && category !== 'All') {
    words = getWordsByCategory(category);
  } else {
    words = wordBank;
  }
  
  if (mode === 'mastery') {
    words = sortByMasteryPriority(words);
  }
  
  words = shuffleArray(words);
  
  sessionWords = words.map(w => ({
    ...w,
    scrambled: scrambleWord(w.text)
  }));
  
  currentWordIndex = 0;
  
  const session = {
    mode,
    category,
    startTime: Date.now(),
    wordsAttempted: 0,
    correct: 0,
    score: 0,
    hintsUsed: 0,
    skipped: 0,
    words: sessionWords,
    currentIndex: 0
  };
  
  currentSession.set(session);
  
  return getCurrentWord();
}

function sortByMasteryPriority(words) {
  const allProgress = get(progress);
  const progressMap = new Map(allProgress.map(p => [p.wordText, p]));
  
  return [...words].sort((a, b) => {
    const progressA = progressMap.get(a.text);
    const progressB = progressMap.get(b.text);
    
    if (!progressA && !progressB) return 0;
    if (!progressA) return -1;
    if (!progressB) return 1;
    
    const dueA = progressA.nextReview <= Date.now() ? -100 : 0;
    const dueB = progressB.nextReview <= Date.now() ? -100 : 0;
    
    const incorrectWeightA = progressA.timesIncorrect * 3;
    const incorrectWeightB = progressB.timesIncorrect * 3;
    
    const hintCorrectWeightA = progressA.timesCorrectWithHint * 2;
    const hintCorrectWeightB = progressB.timesCorrectWithHint * 2;
    
    const priorityA = dueA + incorrectWeightA + hintCorrectWeightA;
    const priorityB = dueB + incorrectWeightB + hintCorrectWeightB;
    
    return priorityB - priorityA;
  });
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCurrentWord() {
  const session = get(currentSession);
  if (!session || currentWordIndex >= sessionWords.length) {
    return null;
  }
  return sessionWords[currentWordIndex];
}

export function getNextWord() {
  const session = get(currentSession);
  if (!session) return null;
  
  currentWordIndex++;
  
  if (currentWordIndex >= sessionWords.length) {
    return null;
  }
  
  currentSession.update(s => ({ ...s, currentIndex: currentWordIndex }));
  
  return sessionWords[currentWordIndex];
}

export function reshuffleCurrentWord() {
  if (currentWordIndex < sessionWords.length) {
    sessionWords[currentWordIndex].scrambled = scrambleWord(sessionWords[currentWordIndex].text);
    return sessionWords[currentWordIndex];
  }
  return null;
}

export async function submitAnswer(answer, usedHint = false) {
  const session = get(currentSession);
  if (!session) return { correct: false };
  
  const currentWord = sessionWords[currentWordIndex];
  if (!currentWord) return { correct: false };
  
  const isCorrect = currentWord.text.toLowerCase().trim() === answer.toLowerCase().trim();
  
  let pointsEarned = 0;
  if (isCorrect) {
    pointsEarned = 100;
    if (usedHint) {
      pointsEarned = 50;
    }
  }
  
  currentSession.update(s => ({
    ...s,
    wordsAttempted: s.wordsAttempted + 1,
    correct: s.correct + (isCorrect ? 1 : 0),
    score: s.score + pointsEarned,
    hintsUsed: s.hintsUsed + (usedHint ? 1 : 0),
    skipped: s.skipped + (answer === '__skip__' ? 1 : 0)
  }));
  
  if (session.mode === 'mastery') {
    await updateWordProgress(currentWord.text, isCorrect ? 'correct' : 'incorrect', usedHint);
  }
  
  return {
    correct: isCorrect,
    pointsEarned,
    word: currentWord.text,
    usedHint
  };
}

export async function endSession() {
  const session = get(currentSession);
  if (!session) return null;
  
  const db = await dbPromise;
  const savedSession = {
    mode: session.mode,
    category: session.category,
    timestamp: session.startTime,
    wordsAttempted: session.wordsAttempted,
    correct: session.correct,
    score: session.score,
    hintsUsed: session.hintsUsed
  };
  
  await db.add(stores.sessions, savedSession);
  
  const today = new Date().toISOString().split('T')[0];
  const currentSettings = get(settings);
  const lastPlayedDate = currentSettings.lastPlayedDate;
  
  if (session.wordsAttempted >= 5) {
    await saveSettings({ lastPlayedDate: today });
  }
  
  currentSession.set(null);
  sessionWords = [];
  currentWordIndex = 0;
  
  return savedSession;
}

export async function getStats() {
  const db = await dbPromise;
  const sessions = await db.getAll(stores.sessions);
  
  const totalWords = sessions.reduce((sum, s) => sum + s.wordsAttempted, 0);
  const totalCorrect = sessions.reduce((sum, s) => sum + s.correct, 0);
  const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
  const totalSessions = sessions.length;
  
  const accuracy = totalWords > 0 ? Math.round((totalCorrect / totalWords) * 100) : 0;
  
  const currentSettings = get(settings);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let streak = 0;
  const lastPlayed = currentSettings.lastPlayedDate;
  
  if (lastPlayed === today) {
    streak = 1;
    if (sessions.length > 1) {
      const sortedSessions = [...sessions].sort((a, b) => b.timestamp - a.timestamp);
      let checkDate = yesterday;
      for (const session of sortedSessions) {
        const sessionDate = new Date(session.timestamp).toISOString().split('T')[0];
        if (sessionDate === checkDate && session.wordsAttempted >= 5) {
          streak++;
          checkDate = new Date(new Date(checkDate).getTime() - 86400000).toISOString().split('T')[0];
        } else if (sessionDate !== today) {
          break;
        }
      }
    }
  } else if (lastPlayed === yesterday) {
    streak = 1;
  }
  
  const allProgress = get(progress);
  const mastered = allProgress.filter(p => p.interval > 21).length;
  const learning = allProgress.filter(p => p.interval > 0 && p.interval <= 21).length;
  const newWords = allProgress.filter(p => p.attempts === 0).length;
  
  return {
    totalWords,
    totalCorrect,
    totalScore,
    totalSessions,
    accuracy,
    streak,
    mastered,
    learning,
    newWords,
    totalWordsInBank: wordBank.length
  };
}

export function getDateSeed() {
  const today = new Date().toISOString().split('T')[0];
  return today.split('-').reduce((acc, part) => acc + parseInt(part), 0);
}
