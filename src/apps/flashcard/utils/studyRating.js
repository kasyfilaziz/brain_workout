export async function saveRatingAndAdvance({
  updatedCard,
  currentIndex,
  totalCards,
  saveCard,
  saveStreak,
  wait
}) {
  await saveCard(updatedCard);

  if (wait) {
    await wait();
  }

  if (currentIndex >= totalCards - 1) {
    let streakError = null;
    try {
      await saveStreak();
    } catch (error) {
      streakError = error;
    }

    return {
      nextIndex: currentIndex,
      finished: true,
      streakError
    };
  }

  return {
    nextIndex: currentIndex + 1,
    finished: false,
    streakError: null
  };
}
