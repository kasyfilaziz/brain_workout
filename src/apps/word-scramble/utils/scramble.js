export function scrambleWord(word) {
  const letters = word.split('');
  let scrambled;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    scrambled = fisherYatesShuffle([...letters]);
    attempts++;
  } while (!isValidScramble(word, scrambled) && attempts < maxAttempts);
  
  return scrambled.join('');
}

function fisherYatesShuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function isValidScramble(original, scrambled) {
  if (original.length !== scrambled.length) {
    return false;
  }
  
  const originalLower = original.toLowerCase();
  const scrambledLower = scrambled.map(l => l.toLowerCase()).join('');
  
  if (originalLower === scrambledLower) {
    return false;
  }
  
  const reversed = originalLower.split('').reverse().join('');
  if (scrambledLower === reversed) {
    return false;
  }
  
  return true;
}

export function getScrambledDisplay(word) {
  return scrambleWord(word);
}

export function isAnswerCorrect(original, answer) {
  return original.toLowerCase().trim() === answer.toLowerCase().trim();
}
