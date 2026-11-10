import test from 'node:test';
import assert from 'node:assert/strict';

import { buildStudyQueue } from '../../src/apps/flashcard/utils/studyQueue.js';

const now = Date.UTC(2026, 10, 10, 2);

test('buildStudyQueue filters due cards for one deck and sorts deterministically', () => {
  const cards = [
    { id: 3, deckId: 1, nextReview: now },
    { id: 2, deckId: 1, nextReview: now - 1000 },
    { id: 4, deckId: 2, nextReview: now - 5000 },
    { id: 5, deckId: 1, nextReview: now + 1000 }
  ];

  const queue = buildStudyQueue(cards, { deckId: 1, now });

  assert.deepEqual(queue.map((card) => card.id), [2, 3]);
});

test('buildStudyQueue includes due cards from all decks in quick study', () => {
  const cards = [
    { id: 1, deckId: 1, nextReview: now - 1000 },
    { id: 2, deckId: 2, nextReview: now },
    { id: 3, deckId: 1, nextReview: now + 1 }
  ];

  const queue = buildStudyQueue(cards, { isQuickStudy: true, now });

  assert.deepEqual(queue.map((card) => card.id), [1, 2]);
});

test('buildStudyQueue returns a stable snapshot when the source array changes later', () => {
  const cards = [
    { id: 1, deckId: 1, nextReview: now },
    { id: 2, deckId: 1, nextReview: now }
  ];
  const queue = buildStudyQueue(cards, { deckId: 1, now });

  cards.push({ id: 3, deckId: 1, nextReview: now });
  cards.splice(0, 1);

  assert.deepEqual(queue.map((card) => card.id), [1, 2]);
});

test('buildStudyQueue returns an empty array when no card is due', () => {
  const queue = buildStudyQueue(
    [{ id: 1, deckId: 1, nextReview: now + 1 }],
    { deckId: 1, now }
  );

  assert.deepEqual(queue, []);
});
