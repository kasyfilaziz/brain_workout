export function buildDeckStats(cards, now = Date.now()) {
  return cards.reduce((stats, card) => {
    const current = stats[card.deckId] || { total: 0, due: 0 };
    current.total += 1;
    if (Number.isFinite(card.nextReview) && card.nextReview <= now) {
      current.due += 1;
    }
    stats[card.deckId] = current;
    return stats;
  }, {});
}
