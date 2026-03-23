export function calculateIG(actualCW, wBaseline, cBaseline) {
  if (!wBaseline || !cBaseline || wBaseline === 0 || cBaseline === 0) return null;
  const predictedCW = (wBaseline * cBaseline) / (wBaseline + cBaseline);
  return actualCW - predictedCW;
}

export function getAverageRT(results) {
  const correctTrials = results.filter(t => t.isCorrect);
  if (correctTrials.length === 0) return 0;
  const sum = correctTrials.reduce((acc, t) => acc + t.reactionTime, 0);
  return sum / correctTrials.length;
}

export function formatRT(ms) {
  return ms.toFixed(0) + 'ms';
}
