function compareCards(left, right) {
  const leftNextReview = Number.isFinite(left.nextReview) ? left.nextReview : 0;
  const rightNextReview = Number.isFinite(right.nextReview) ? right.nextReview : 0;

  if (leftNextReview !== rightNextReview) {
    return leftNextReview - rightNextReview;
  }

  return String(left.id ?? '').localeCompare(String(right.id ?? ''), undefined, {
    numeric: true
  });
}

export function buildStudyQueue(cards, { deckId = null, isQuickStudy = false, now = Date.now() } = {}) {
  return cards
    .filter((card) => {
      const isDue = Number.isFinite(card.nextReview) && card.nextReview <= now;
      return isDue && (isQuickStudy || card.deckId === deckId);
    })
    .slice()
    .sort(compareCards);
}
