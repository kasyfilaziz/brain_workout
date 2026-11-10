import test, { mock } from 'node:test';
import assert from 'node:assert/strict';

import { calculateSM2 } from '../../src/lib/utils/sm2.js';

const testDate = new Date('2026-11-10T10:00:00.000+07:00');

function withFixedTime(callback) {
  mock.timers.enable({ apis: ['Date'], now: testDate });
  try {
    callback();
  } finally {
    mock.timers.reset();
  }
}

test('failed ratings reset the interval and preserve the ease factor', () => {
  withFixedTime(() => {
    const card = { id: 1, interval: 6, easeFactor: 2.4, nextReview: 0 };
    const result = calculateSM2(card, 1);

    assert.equal(result.interval, 0);
    assert.equal(result.easeFactor, 2.4);
    assert.equal(new Date(result.nextReview).getHours(), 4);
  });
});

test('the first successful rating starts a one-day interval', () => {
  withFixedTime(() => {
    const result = calculateSM2({ interval: 0, easeFactor: 2.5 }, 5);

    assert.equal(result.interval, 1);
    assert.equal(result.easeFactor, 2.6);
  });
});

test('the second successful rating starts a six-day interval', () => {
  withFixedTime(() => {
    const result = calculateSM2({ interval: 1, easeFactor: 2.5 }, 4);

    assert.equal(result.interval, 6);
    assert.equal(result.easeFactor, 2.5);
  });
});

test('later successful ratings multiply the interval by the ease factor', () => {
  withFixedTime(() => {
    const result = calculateSM2({ interval: 6, easeFactor: 2.5 }, 3);

    assert.equal(result.interval, 14);
    assert.equal(result.easeFactor, 2.36);
  });
});

test('the ease factor never falls below 1.3', () => {
  withFixedTime(() => {
    const result = calculateSM2({ interval: 6, easeFactor: 1.31 }, 3);

    assert.equal(result.easeFactor, 1.3);
  });
});
