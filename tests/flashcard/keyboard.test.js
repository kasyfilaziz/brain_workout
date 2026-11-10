import test from 'node:test';
import assert from 'node:assert/strict';

import { getStudyKeyboardAction } from '../../src/apps/flashcard/utils/keyboard.js';

const baseState = {
  repeat: false,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  isTypingTarget: false,
  isFlipped: false,
  isTransitioning: false,
  sessionFinished: false,
  hasCards: true
};

test('Space flips the card', () => {
  const action = getStudyKeyboardAction({ ...baseState, key: ' ', code: 'Space' });

  assert.deepEqual(action, { type: 'flip', preventDefault: true });
});

test('rating keys submit a numeric rating after the card is flipped', () => {
  const action = getStudyKeyboardAction({
    ...baseState,
    key: '4',
    code: 'Digit4',
    isFlipped: true
  });

  assert.deepEqual(action, { type: 'rate', rating: 4, preventDefault: true });
});

test('rating keys are ignored before the card is flipped', () => {
  const action = getStudyKeyboardAction({ ...baseState, key: '3', code: 'Digit3' });

  assert.equal(action, null);
});

test('keyboard shortcuts are ignored in typing fields and with modifiers', () => {
  assert.equal(
    getStudyKeyboardAction({
      ...baseState,
      key: ' ',
      code: 'Space',
      isTypingTarget: true
    }),
    null
  );
  assert.equal(
    getStudyKeyboardAction({
      ...baseState,
      key: '5',
      code: 'Digit5',
      isFlipped: true,
      ctrlKey: true
    }),
    null
  );
});

test('Space is consumed but ignored during a transition', () => {
  const action = getStudyKeyboardAction({
    ...baseState,
    key: ' ',
    code: 'Space',
    isTransitioning: true
  });

  assert.deepEqual(action, { type: 'none', preventDefault: true });
});
