import { writable, derived, get } from 'svelte/store';
import { dbPromise, APP_PREFIXES, getStoreNames } from '../../../lib/utils/db';

const stores = getStoreNames(APP_PREFIXES.pomodoro);

export const APP_PREFIX = APP_PREFIXES.pomodoro;

export const timerState = writable('idle');
export const currentSession = writable(null);
export const sessions = writable([]);
export const settings = writable(null);
export const dailyCount = writable(0);

let timerInterval = null;
let pauseTime = null;
let wakeLock = null;

export async function initPomodoroStores() {
  await loadSettings();
  await loadSessions();
  await refreshDailyCount();
}

export async function refreshDailyCount() {
  const count = await loadCompletedWorkSessionsToday();
  dailyCount.set(count);
}

export async function loadSettings() {
  const db = await dbPromise;
  const stored = await db.get(stores.settings, 'pomodoro_settings');
  if (stored) {
    settings.set(stored);
  } else {
    const defaults = {
      key: 'pomodoro_settings',
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
      soundEnabled: true,
      vibrationEnabled: false
    };
    await db.put(stores.settings, defaults);
    settings.set(defaults);
  }
}

export async function saveSettings(newSettings) {
  const db = await dbPromise;
  const updated = { ...get(settings), ...newSettings, key: 'pomodoro_settings' };
  await db.put(stores.settings, updated);
  settings.set(updated);
}

export async function loadSessions() {
  const db = await dbPromise;
  const allSessions = await db.getAll(stores.sessions);
  sessions.set(allSessions.sort((a, b) => b.startTime - a.startTime));
}

export async function saveSession(session) {
  const db = await dbPromise;
  const id = await db.add(stores.sessions, session);
  await loadSessions();
  return id;
}

export async function loadCompletedWorkSessionsToday() {
  const today = new Date().toISOString().split('T')[0];
  const todayStart = new Date(today).getTime();
  const todayEnd = todayStart + 86400000;
  
  const allSessions = get(sessions);
  return allSessions.filter(s => 
    s.type === 'work' && 
    s.completed && 
    s.startTime >= todayStart && 
    s.startTime < todayEnd
  ).length;
}

export function generateRandomSessionName() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `Session #${num}`;
}

export async function startSession(name, type = 'work') {
  const currentSettings = get(settings);
  let duration;
  
  if (type === 'work') {
    duration = currentSettings.workDuration * 60;
  } else if (type === 'short_break') {
    duration = currentSettings.shortBreakDuration * 60;
  } else {
    duration = currentSettings.longBreakDuration * 60;
  }
  
  const session = {
    name,
    type,
    startTime: Date.now(),
    duration,
    completed: false
  };
  
  currentSession.set(session);
  timerState.set(type === 'work' ? 'work' : 'break');
  
  if (type === 'work') {
    await acquireWakeLock();
  }
  
  startTimer(duration);
}

function startTimer(durationSeconds) {
  const startTime = Date.now();
  const endTime = startTime + (durationSeconds * 1000);
  
  if (timerInterval) clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    const now = Date.now();
    const remaining = Math.max(0, endTime - now);
    
    currentSession.update(s => ({ ...s, remaining }));
    
    if (remaining <= 0) {
      completeSession();
    }
  }, 1000);
}

export function pauseSession() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  pauseTime = Date.now();
  timerState.set('paused');
  releaseWakeLock();
}

export async function resumeSession() {
  const session = get(currentSession);
  if (session && pauseTime) {
    const pausedDuration = Date.now() - pauseTime;
    session.startTime = session.startTime + pausedDuration;
    currentSession.set(session);
    pauseTime = null;
  }
  
  const state = get(timerState);
  timerState.set(state === 'paused' ? 
    (session?.type === 'work' ? 'work' : 'break') : state);
  
  if (session?.type === 'work') {
    await acquireWakeLock();
  }
  
  if (session) {
    const now = Date.now();
    const remaining = Math.max(0, (session.startTime + (session.duration * 1000)) - now);
    startTimer(Math.ceil(remaining / 1000));
  }
}

export async function skipSession() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  const session = get(currentSession);
  const state = get(timerState);
  const completed = get(completedWorkSessions);
  const currentSettings = get(settings);
  
  releaseWakeLock();
  
  if (state === 'work') {
    timerState.set('waiting_for_break');
    currentSession.set(null);
  } else if (state === 'break' || state === 'waiting_for_break') {
    timerState.set('idle');
    currentSession.set(null);
    completedWorkSessions.set(0);
  }
}

async function completeSession() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  const session = get(currentSession);
  const state = get(timerState);
  
  releaseWakeLock();
  
  if (session) {
    session.completed = true;
    session.endTime = Date.now();
    await saveSession(session);
  }
  
  if (state === 'work') {
    timerState.set('waiting_for_break');
    currentSession.set(null);
    await refreshDailyCount();
  } else if (state === 'break') {
    timerState.set('idle');
    currentSession.set(null);
  }
}

export async function acquireWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
      console.log('Wake Lock not available:', err);
    }
  }
}

export function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

export function getTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getSessionDuration(type) {
  const currentSettings = get(settings);
  if (type === 'work') return currentSettings.workDuration * 60;
  if (type === 'short_break') return currentSettings.shortBreakDuration * 60;
  return currentSettings.longBreakDuration * 60;
}
