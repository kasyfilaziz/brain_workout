function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function finiteNumber(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

export function normalizeBackup(data, now = Date.now()) {
  const sourceDecks = Array.isArray(data?.decks) ? data.decks : [];
  const sourceCards = Array.isArray(data?.cards) ? data.cards : [];
  const decks = [];
  const deckKeys = new Set();

  sourceDecks.forEach((deck) => {
    if (!deck || typeof deck.name !== 'string' || !deck.name.trim()) {
      return;
    }

    const name = deck.name.trim();
    const sourceKey = hasValue(deck.id) ? String(deck.id) : name;
    if (deckKeys.has(sourceKey)) {
      return;
    }

    deckKeys.add(sourceKey);
    decks.push({
      sourceKey,
      name,
      createdAt: finiteNumber(deck.createdAt, now)
    });
  });

  const validCards = [];
  let invalidCards = 0;
  let unknownDeckReferences = 0;

  sourceCards.forEach((card) => {
    if (
      !card ||
      typeof card.front !== 'string' ||
      typeof card.back !== 'string' ||
      !card.front.trim() ||
      !card.back.trim()
    ) {
      invalidCards += 1;
      return;
    }

    const deckKey = hasValue(card.deckId) ? String(card.deckId) : '';
    if (!deckKeys.has(deckKey)) {
      unknownDeckReferences += 1;
      return;
    }

    validCards.push({
      sourceDeckKey: deckKey,
      front: card.front.trim(),
      back: card.back.trim(),
      interval: finiteNumber(card.interval, 0),
      easeFactor: finiteNumber(card.easeFactor, 2.5),
      nextReview: finiteNumber(card.nextReview, now),
      createdAt: finiteNumber(card.createdAt, now)
    });
  });

  return {
    decks,
    cards: validCards,
    invalidCards,
    unknownDeckReferences
  };
}
