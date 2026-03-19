import { writable, derived } from 'svelte/store';
import { dbPromise, APP_PREFIXES, getStoreNames } from '../../../lib/utils/db';

const stores = getStoreNames(APP_PREFIXES.flashcard);

export const decks = writable([]);
export const cards = writable([]);
export const currentDeckId = writable(null);

export async function loadDecks() {
  const db = await dbPromise;
  const allDecks = await db.getAll(stores.decks);
  decks.set(allDecks);
}

export async function loadCards() {
  const db = await dbPromise;
  const allCards = await db.getAll(stores.cards);
  cards.set(allCards);
}

export async function addDeck(name) {
  const db = await dbPromise;
  const id = await db.add(stores.decks, { 
    name, 
    createdAt: Date.now() 
  });
  await loadDecks();
  return id;
}

export async function deleteDeck(id) {
  const db = await dbPromise;
  const cardsInDeck = await db.getAllFromIndex(stores.cards, 'by-deckId', id);
  const tx = db.transaction([stores.decks, stores.cards], 'readwrite');
  for (const card of cardsInDeck) {
    tx.objectStore(stores.cards).delete(card.id);
  }
  tx.objectStore(stores.decks).delete(id);
  await tx.done;
  await loadDecks();
  await loadCards();
}

export async function addCard(deckId, front, back) {
  const db = await dbPromise;
  const card = {
    deckId,
    front,
    back,
    nextReview: Date.now(),
    interval: 0,
    easeFactor: 2.5,
    createdAt: Date.now()
  };
  const id = await db.add(stores.cards, card);
  await loadCards();
  return id;
}

export async function updateCard(card) {
  const db = await dbPromise;
  await db.put(stores.cards, card);
  await loadCards();
}

export async function deleteCard(id) {
  const db = await dbPromise;
  await db.delete(stores.cards, id);
  await loadCards();
}

export async function resetAllData() {
  const db = await dbPromise;
  const tx = db.transaction([stores.decks, stores.cards, stores.settings], 'readwrite');
  await tx.objectStore(stores.decks).clear();
  await tx.objectStore(stores.cards).clear();
  await tx.objectStore(stores.settings).clear();
  await tx.done;
  await loadDecks();
  await loadCards();
}
