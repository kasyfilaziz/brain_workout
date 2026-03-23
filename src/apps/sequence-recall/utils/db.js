import { dbPromise, APP_PREFIXES } from '../../../lib/utils/db';

const stores = {
  sessions: `${APP_PREFIXES.sequenceRecall}sessions`,
  settings: `${APP_PREFIXES.sequenceRecall}settings`
};

export async function saveSession(session) {
  const db = await dbPromise;
  const id = await db.add(stores.sessions, session);
  session.id = id;
  return id;
}

export async function getSessions() {
  const db = await dbPromise;
  return db.getAll(stores.sessions);
}

export async function getSession(id) {
  const db = await dbPromise;
  return db.get(stores.sessions, id);
}

export async function updateSession(session) {
  const db = await dbPromise;
  await db.put(stores.sessions, session);
}

export async function getSettings() {
  const db = await dbPromise;
  return db.get(stores.settings, 'sequence_recall_settings');
}

export async function saveSettings(settings) {
  const db = await dbPromise;
  await db.put(stores.settings, { ...settings, key: 'sequence_recall_settings' });
}

export async function loadOrCreateSettings() {
  let settings = await getSettings();
  if (!settings) {
    settings = {
      key: 'sequence_recall_settings',
      defaultLevel: 1,
      defaultTaskType: 'position',
      defaultGridSize: '3x3',
      defaultRounds: 20,
      soundEnabled: true,
      vibrationEnabled: true,
      roundTimeLimit: 3000,
      tutorialSeen: false
    };
    await saveSettings(settings);
  }
  return settings;
}

export async function deleteOldAbandonedSessions(maxAgeDays = 7) {
  const db = await dbPromise;
  const cutoffTime = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000);
  const sessions = await getSessions();
  for (const session of sessions) {
    if (!session.completed && session.date < cutoffTime) {
      await db.delete(stores.sessions, session.id);
    }
  }
}
