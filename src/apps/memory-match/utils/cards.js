import { shuffle } from './shuffle';
import { dbPromise, APP_PREFIXES, getStoreNames } from '../../../lib/utils/db';

const flashcardStores = getStoreNames(APP_PREFIXES.flashcard);

// Built-in theme definitions - 15 pairs each
const BUILT_IN_THEMES = {
  animals: {
    name: 'Animals',
    pairs: [
      '\u{1F436}', '\u{1F431}', '\u{1F430}', '\u{1F43B}', '\u{1F43C}',
      '\u{1F42F}', '\u{1F42E}', '\u{1F428}', '\u{1F427}', '\u{1F426}',
      '\u{1F42D}', '\u{1F439}', '\u{1F434}', '\u{1F429}', '\u{1F437}'
    ]
  },
  numbers: {
    name: 'Numbers',
    pairs: [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
      '11', '12', '13', '14', '15'
    ]
  },
  shapes: {
    name: 'Shapes',
    pairs: [
      '\u{2B50}', '\u{2764}', '\u{1F49B}', '\u{1F49A}', '\u{1F499}',
      '\u{2600}', '\u{1F319}', '\u{2728}', '\u{1F308}', '\u{1F33A}',
      '\u{1F33B}', '\u{1F33C}', '\u{1F340}', '\u{1F347}', '\u{1F349}'
    ]
  }
};

// Grid size configurations
export const GRID_SIZES = {
  '3x4': { rows: 3, cols: 4, pairs: 6, label: 'Easy' },
  '4x4': { rows: 4, cols: 4, pairs: 8, label: 'Medium' },
  '5x4': { rows: 5, cols: 4, pairs: 10, label: 'Hard' },
  '6x5': { rows: 6, cols: 5, pairs: 15, label: 'Expert' }
};

/**
 * Get list of available built-in theme names
 */
export function getBuiltInThemes() {
  return Object.keys(BUILT_IN_THEMES);
}

/**
 * Get theme display name
 */
export function getThemeName(themeId) {
  return BUILT_IN_THEMES[themeId]?.name || themeId;
}

/**
 * Generate cards for a built-in theme
 * @param {string} themeId - Theme identifier (animals, numbers, shapes)
 * @param {string} gridSize - Grid size identifier (3x4, 4x4, 5x4, 6x5)
 * @returns {Array} Array of card objects
 */
export function generateBuiltInCards(themeId, gridSize) {
  const theme = BUILT_IN_THEMES[themeId];
  const config = GRID_SIZES[gridSize];
  if (!theme || !config) return [];

  const selectedPairs = shuffle(theme.pairs).slice(0, config.pairs);
  const cards = [];

  selectedPairs.forEach((content, index) => {
    // Two cards per pair, both show same content
    cards.push({
      pairId: `${themeId}-${index}`,
      displayContent: content,
      isFlipped: false,
      isMatched: false
    });
    cards.push({
      pairId: `${themeId}-${index}`,
      displayContent: content,
      isFlipped: false,
      isMatched: false
    });
  });

  const shuffled = shuffle(cards);
  return shuffled.map((card, index) => ({ ...card, index }));
}

/**
 * Load custom deck cards from IndexedDB
 * @param {number} deckId - Flashcard deck ID
 * @param {string} gridSize - Grid size identifier
 * @returns {Promise<Array>} Array of card objects
 */
export async function loadCustomDeckCards(deckId, gridSize) {
  const config = GRID_SIZES[gridSize];
  if (!config) return [];

  const db = await dbPromise;
  const flashcards = await db.getAllFromIndex(flashcardStores.cards, 'by-deckId', deckId);

  // If odd number of cards, drop one
  const evenFlashcards = flashcards.length % 2 === 0
    ? flashcards
    : flashcards.slice(0, flashcards.length - 1);

  // Select enough cards for the grid
  const selected = evenFlashcards.length > config.pairs
    ? shuffle(evenFlashcards).slice(0, config.pairs)
    : evenFlashcards;

  if (selected.length < config.pairs) {
    return []; // Not enough cards
  }

  const cards = [];

  selected.forEach((flashcard, index) => {
    // Front card
    cards.push({
      pairId: `flashcard-${flashcard.id}`,
      displayContent: flashcard.front,
      isFlipped: false,
      isMatched: false,
      side: 'front',
      flashcardId: flashcard.id
    });
    // Back card
    cards.push({
      pairId: `flashcard-${flashcard.id}`,
      displayContent: flashcard.back,
      isFlipped: false,
      isMatched: false,
      side: 'back',
      flashcardId: flashcard.id
    });
  });

  const shuffled = shuffle(cards);
  return shuffled.map((card, index) => ({ ...card, index }));
}

/**
 * Get eligible decks for memory match (have enough cards for at least 3x4)
 */
export async function getEligibleDecks() {
  const db = await dbPromise;
  const allDecks = await db.getAll(flashcardStores.decks);
  const eligible = [];

  for (const deck of allDecks) {
    const cards = await db.getAllFromIndex(flashcardStores.cards, 'by-deckId', deck.id);
    // Need at least 6 cards for smallest grid (3x4 = 6 pairs)
    if (cards.length >= 6) {
      eligible.push({ ...deck, cardCount: cards.length });
    }
  }

  return eligible;
}
