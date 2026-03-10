/**
 * SM-2 Algorithm implementation
 * Based on user-provided requirements in README
 */
export function calculateSM2(card, rating) {
  let { interval, easeFactor } = card;

  if (rating < 3) {
    // Reset interval but keep EF
    interval = 0;
  } else {
    // Update EF
    // Formula: EF = EF + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
    const q = rating;
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    
    if (easeFactor < 1.3) easeFactor = 1.3;

    // Update Interval
    if (interval === 0) {
      interval = 1;
    } else if (interval === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Calculate nextReview timestamp (days to ms)
  // Set to 4:00 AM of the target day for better UX
  const targetDate = new Date(Date.now() + (interval * 86400000));
  targetDate.setHours(4, 0, 0, 0);
  const nextReview = targetDate.getTime();

  return {
    ...card,
    interval,
    easeFactor,
    nextReview
  };
}
