export const PALETTES = {
  standard: {
    RED: { name: 'Red', hex: '#EF4444', class: 'text-red-500', bg: 'bg-red-500' },
    BLUE: { name: 'Blue', hex: '#3B82F6', class: 'text-blue-500', bg: 'bg-blue-500' },
    GREEN: { name: 'Green', hex: '#10B981', class: 'text-green-500', bg: 'bg-green-500' },
    YELLOW: { name: 'Yellow', hex: '#F59E0B', class: 'text-yellow-500', bg: 'bg-yellow-500' }
  },
  'high-contrast': {
    RED: { name: 'Pink', hex: '#EC4899', class: 'text-pink-500', bg: 'bg-pink-500' },
    BLUE: { name: 'Cyan', hex: '#06B6D4', class: 'text-cyan-500', bg: 'bg-cyan-500' },
    GREEN: { name: 'Lime', hex: '#84CC16', class: 'text-lime-500', bg: 'bg-lime-500' },
    YELLOW: { name: 'Indigo', hex: '#6366F1', class: 'text-indigo-500', bg: 'bg-indigo-500' }
  }
};

export const COLOR_KEYS = ['RED', 'BLUE', 'GREEN', 'YELLOW'];

export function getRandomColor() {
  return COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
}

export function generateStimulus(mode) {
  const wordKey = getRandomColor();
  let colorKey;

  if (mode === 'W') {
    colorKey = 'DEFAULT'; 
  } else if (mode === 'C') {
    colorKey = wordKey;
  } else if (mode === 'CW') {
    do {
      colorKey = getRandomColor();
    } while (colorKey === wordKey);
  }

  return { word: wordKey, color: colorKey };
}
