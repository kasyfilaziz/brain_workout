export function getStudyKeyboardAction({
  key,
  code,
  repeat = false,
  ctrlKey = false,
  metaKey = false,
  altKey = false,
  isTypingTarget = false,
  isFlipped = false,
  isTransitioning = false,
  sessionFinished = false,
  hasCards = true
}) {
  if (repeat || ctrlKey || metaKey || altKey || isTypingTarget || sessionFinished || !hasCards) {
    return null;
  }

  if (code === 'Space' || key === ' ') {
    return {
      type: isTransitioning ? 'none' : 'flip',
      preventDefault: true
    };
  }

  if (isFlipped && !isTransitioning && /^[1-5]$/.test(key)) {
    return {
      type: 'rate',
      rating: Number(key),
      preventDefault: true
    };
  }

  return null;
}
