export function vibrateTap() {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

export function vibrateDragStart() {
  if ('vibrate' in navigator) {
    navigator.vibrate(30);
  }
}

export function vibrateDrop() {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 30, 50]);
  }
}
