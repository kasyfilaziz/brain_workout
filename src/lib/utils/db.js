import { openDB } from 'idb';

const DB_NAME = 'flashcard_db';
const DB_VERSION = 6;

const APP_PREFIXES = {
  flashcard: 'flashcard_',
  pomodoro: 'pomodoro_',
  memoryMatch: 'memory_match_',
  mathSprint: 'math_sprint_'
};

export function getStoreNames(prefix) {
  return {
    decks: `${prefix}decks`,
    cards: `${prefix}cards`,
    sessions: `${prefix}sessions`,
    scores: `${prefix}scores`,
    settings: `${prefix}settings`
  };
}

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains('decks')) {
          const deckStore = db.createObjectStore('decks', { keyPath: 'id', autoIncrement: true });
          deckStore.createIndex('by-name', 'name');
        }
        
        if (!db.objectStoreNames.contains('cards')) {
          const cardStore = db.createObjectStore('cards', { keyPath: 'id', autoIncrement: true });
          cardStore.createIndex('by-deckId', 'deckId');
          cardStore.createIndex('by-nextReview', 'nextReview');
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      }

      if (oldVersion < 3) {
        const prefix = APP_PREFIXES.flashcard || '';
        const stores = getStoreNames(prefix);
        
        if (!db.objectStoreNames.contains(stores.decks)) {
          const deckStore = db.createObjectStore(stores.decks, { keyPath: 'id', autoIncrement: true });
          deckStore.createIndex('by-name', 'name');
        }
        
        if (!db.objectStoreNames.contains(stores.cards)) {
          const cardStore = db.createObjectStore(stores.cards, { keyPath: 'id', autoIncrement: true });
          cardStore.createIndex('by-deckId', 'deckId');
          cardStore.createIndex('by-nextReview', 'nextReview');
        }

        if (!db.objectStoreNames.contains(stores.settings)) {
          db.createObjectStore(stores.settings, { keyPath: 'key' });
        }
      }

      if (oldVersion < 4) {
        const pomodoroStores = getStoreNames(APP_PREFIXES.pomodoro);

        if (!db.objectStoreNames.contains(pomodoroStores.sessions)) {
          const sessionStore = db.createObjectStore(pomodoroStores.sessions, { keyPath: 'id', autoIncrement: true });
          sessionStore.createIndex('by-date', 'startTime');
          sessionStore.createIndex('by-type', 'type');
          sessionStore.createIndex('by-completed', 'completed');
        }

        if (!db.objectStoreNames.contains(pomodoroStores.settings)) {
          db.createObjectStore(pomodoroStores.settings, { keyPath: 'key' });
        }
      }

      if (oldVersion < 5) {
        const memoryMatchStores = getStoreNames(APP_PREFIXES.memoryMatch);

        if (!db.objectStoreNames.contains(memoryMatchStores.scores)) {
          db.createObjectStore(memoryMatchStores.scores, { keyPath: 'gridSize' });
        }

        if (!db.objectStoreNames.contains(memoryMatchStores.settings)) {
          db.createObjectStore(memoryMatchStores.settings, { keyPath: 'key' });
        }
      }

      if (oldVersion < 6) {
        const mathSprintStores = getStoreNames(APP_PREFIXES.mathSprint);

        if (!db.objectStoreNames.contains(mathSprintStores.cards)) {
          db.createObjectStore(mathSprintStores.cards, { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains(mathSprintStores.sessions)) {
          const sessionStore = db.createObjectStore(mathSprintStores.sessions, { keyPath: 'id', autoIncrement: true });
          sessionStore.createIndex('by-date', 'date');
          sessionStore.createIndex('by-operation', 'operation');
        }

        if (!db.objectStoreNames.contains(mathSprintStores.settings)) {
          db.createObjectStore(mathSprintStores.settings, { keyPath: 'key' });
        }
      }
    },
  });
}

export const dbPromise = initDB();
export { APP_PREFIXES };
