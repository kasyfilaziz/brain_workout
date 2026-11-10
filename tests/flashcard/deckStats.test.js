import test from 'node:test';
import assert from 'node:assert/strict';

import { buildDeckStats } from '../../src/apps/flashcard/utils/deckStats.js';

test('deck stats update totals and due counts for every deck', () => {
  const now = 1000;
  const stats = buildDeckStats(
    [
      { deckId: 1, nextReview: 500 },
      { deckId: 1, nextReview: 1500 },
      { deckId: 2, nextReview: 1000 }
    ],
    now
  );

  assert.deepEqual(stats, {
    1: { total: 2, due: 1 },
    2: { total: 1, due: 1 }
  });
});

test('quick-study total equals the sum of per-deck due counts', () => {
  const stats = buildDeckStats(
    [
      { deckId: 1, nextReview: 1 },
      { deckId: 1, nextReview: 100 },
      { deckId: 2, nextReview: 2 },
      { deckId: 3, nextReview: 200 }
    ],
    50
  );
  const dueTotal = Object.values(stats).reduce((total, deck) => total + deck.due, 0);

  assert.equal(dueTotal, 2);
});

test('invalid timestamps do not make per-deck totals disagree', () => {
  const stats = buildDeckStats(
    [
      { deckId: 1, nextReview: 1 },
      { deckId: 1, nextReview: Number.NaN },
      { deckId: 2, nextReview: 2 }
    ],
    50
  );
  const dueTotal = Object.values(stats).reduce((total, deck) => total + deck.due, 0);

  assert.equal(dueTotal, 2);
});
