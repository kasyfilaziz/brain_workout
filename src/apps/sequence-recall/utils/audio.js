const TONE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function generateRandomSound() {
  return TONE_LETTERS[Math.floor(Math.random() * TONE_LETTERS.length)];
}

export function playSound(letter) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
}

export function checkAudioAvailable() {
  return 'speechSynthesis' in window;
}

export function speakLetter(letter) {
  return new Promise((resolve) => {
    if (!checkAudioAvailable()) {
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.rate = 0.8;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    speechSynthesis.speak(utterance);
  });
}
