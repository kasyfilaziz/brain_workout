export function vibrateCorrect() {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

export function vibrateIncorrect() {
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100]);
  }
}

export function vibrateSuccess() {
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100, 50, 200]);
  }
}
