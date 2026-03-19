import { openDB } from 'idb';

const DB_NAME = 'flashcard_db';
const DB_VERSION = 3;

const APP_PREFIXES = {
  flashcard: 'flashcard_'
};

export function getStoreNames(prefix) {
  return {
    decks: `${prefix}decks`,
    cards: `${prefix}cards`,
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
    },
  });
}

export const dbPromise = initDB();
export { APP_PREFIXES };
