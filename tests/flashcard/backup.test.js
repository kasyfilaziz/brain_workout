import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';

import { normalizeBackup } from '../../src/apps/flashcard/utils/backup.js';

const now = Date.UTC(2026, 10, 10, 2);

test('normalizeBackup preserves scheduling metadata', () => {
  const result = normalizeBackup(
    {
      decks: [{ id: 10, name: 'Biologi', createdAt: 100 }],
      cards: [
        {
          id: 20,
          deckId: 10,
          front: 'Sel',
          back: 'Unit terkecil',
          interval: 6,
          easeFactor: 2.7,
          nextReview: 500,
          createdAt: 200
        }
      ]
    },
    now
  );

  assert.deepEqual(result.decks, [
    { sourceKey: '10', name: 'Biologi', createdAt: 100 }
  ]);
  assert.deepEqual(result.cards, [
    {
      sourceDeckKey: '10',
      front: 'Sel',
      back: 'Unit terkecil',
      interval: 6,
      easeFactor: 2.7,
      nextReview: 500,
      createdAt: 200
    }
  ]);
});

test('normalizeBackup applies safe defaults to legacy cards', () => {
  const result = normalizeBackup(
    {
      decks: [{ name: 'Biologi' }],
      cards: [{ deckId: 'Biologi', front: 'Sel', back: 'Unit terkecil' }]
    },
    now
  );

  assert.deepEqual(result.decks[0], {
    sourceKey: 'Biologi',
    name: 'Biologi',
    createdAt: now
  });
  assert.deepEqual(result.cards[0], {
    sourceDeckKey: 'Biologi',
    front: 'Sel',
    back: 'Unit terkecil',
    interval: 0,
    easeFactor: 2.5,
    nextReview: now,
    createdAt: now
  });
});

test('normalizeBackup reports cards with unknown deck references', () => {
  const result = normalizeBackup(
    {
      decks: [{ id: 1, name: 'Biologi' }],
      cards: [
        { deckId: 99, front: 'A', back: 'B' },
        { deckId: 1, front: '', back: 'B' }
      ]
    },
    now
  );

  assert.equal(result.cards.length, 0);
  assert.equal(result.unknownDeckReferences, 1);
  assert.equal(result.invalidCards, 1);
});

test('importFlashcardBackup restores cards transactionally with scheduling metadata', async () => {
  const { dbPromise } = await import('../../src/lib/utils/db.js');
  const { importFlashcardBackup, resetAllData } = await import(
    '../../src/apps/flashcard/stores/flashcards.js'
  );
  const db = await dbPromise;

  await resetAllData();
  await importFlashcardBackup({
    decks: [{ id: 10, name: 'Biologi', createdAt: 100 }],
    cards: [
      {
        deckId: 10,
        front: 'Sel',
        back: 'Unit terkecil',
        interval: 6,
        easeFactor: 2.7,
        nextReview: 500,
        createdAt: 200
      }
    ]
  });

  const restoredDecks = await db.getAll('flashcard_decks');
  const restoredCards = await db.getAll('flashcard_cards');

  assert.equal(restoredDecks.length, 1);
  assert.equal(restoredCards.length, 1);
  assert.equal(restoredCards[0].deckId, restoredDecks[0].id);
  assert.equal(restoredCards[0].interval, 6);
  assert.equal(restoredCards[0].easeFactor, 2.7);
  assert.equal(restoredCards[0].nextReview, 500);
});
