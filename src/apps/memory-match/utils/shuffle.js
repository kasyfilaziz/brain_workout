/**
 * Fisher-Yates shuffle algorithm
 * Shuffles an array in place with uniform distribution
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
export function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
