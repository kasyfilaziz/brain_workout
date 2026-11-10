import test from 'node:test';
import assert from 'node:assert/strict';

import { saveRatingAndAdvance } from '../../src/apps/flashcard/utils/studyRating.js';

test('saving a rating advances through all cards without skipping', async () => {
  const savedCards = [];
  const visitedIndexes = [];

  for (let currentIndex = 0; currentIndex < 3; currentIndex += 1) {
    const result = await saveRatingAndAdvance({
      updatedCard: { id: currentIndex + 1 },
      currentIndex,
      totalCards: 3,
      saveCard: async (card) => savedCards.push(card),
      saveStreak: async () => {},
      wait: async () => {}
    });
    visitedIndexes.push(result.nextIndex);
  }

  assert.deepEqual(savedCards.map((card) => card.id), [1, 2, 3]);
  assert.deepEqual(visitedIndexes, [1, 2, 2]);
});

test('a failed card save prevents advancement', async () => {
  const saveError = new Error('IndexedDB unavailable');

  await assert.rejects(
    saveRatingAndAdvance({
      updatedCard: { id: 1 },
      currentIndex: 0,
      totalCards: 3,
      saveCard: async () => {
        throw saveError;
      },
      saveStreak: async () => {},
      wait: async () => {}
    }),
    saveError
  );
});

test('last-card completion waits for streak persistence and reports its failure', async () => {
  const calls = [];
  const streakError = new Error('streak write failed');
  const result = await saveRatingAndAdvance({
    updatedCard: { id: 3 },
    currentIndex: 2,
    totalCards: 3,
    saveCard: async () => calls.push('card'),
    saveStreak: async () => {
      calls.push('streak');
      throw streakError;
    },
    wait: async () => calls.push('wait')
  });

  assert.deepEqual(calls, ['card', 'wait', 'streak']);
  assert.equal(result.finished, true);
  assert.equal(result.streakError, streakError);
});
