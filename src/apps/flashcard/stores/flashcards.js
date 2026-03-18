import { writable, derived } from 'svelte/store';
import { dbPromise } from '../../../lib/utils/db';

export const decks = writable([]);
export const cards = writable([]);
export const currentDeckId = writable(null);

export async function loadDecks() {
  const db = await dbPromise;
  const allDecks = await db.getAll('decks');
  decks.set(allDecks);
}

export async function loadCards() {
  const db = await dbPromise;
  const allCards = await db.getAll('cards');
  cards.set(allCards);
}

export async function addDeck(name) {
  const db = await dbPromise;
  const id = await db.add('decks', { 
    name, 
    createdAt: Date.now() 
  });
  await loadDecks();
  return id;
}

export async function deleteDeck(id) {
  const db = await dbPromise;
  // Delete all cards in the deck
  const cardsInDeck = await db.getAllFromIndex('cards', 'by-deckId', id);
  const tx = db.transaction(['decks', 'cards'], 'readwrite');
  for (const card of cardsInDeck) {
    tx.objectStore('cards').delete(card.id);
  }
  tx.objectStore('decks').delete(id);
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
    nextReview: Date.now(), // Due immediately
    interval: 0,
    easeFactor: 2.5,
    createdAt: Date.now()
  };
  const id = await db.add('cards', card);
  await loadCards();
  return id;
}

export async function updateCard(card) {
  const db = await dbPromise;
  await db.put('cards', card);
  await loadCards();
}

export async function deleteCard(id) {
  const db = await dbPromise;
  await db.delete('cards', id);
  await loadCards();
}

export async function resetAllData() {
  const db = await dbPromise;
  const tx = db.transaction(['decks', 'cards', 'settings'], 'readwrite');
  await tx.objectStore('decks').clear();
  await tx.objectStore('cards').clear();
  await tx.objectStore('settings').clear();
  await tx.done;
  await loadDecks();
  await loadCards();
}
