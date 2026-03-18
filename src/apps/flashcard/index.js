// Component loader - will be awaited when app is selected
const componentLoader = () => import('./App.svelte');

export default {
  id: 'flashcard',
  name: 'Flashcards',
  icon: 'cards',
  description: 'Spaced repetition flashcards',
  version: '1.0.0',
  componentLoader,
  
  routes: {
    '': 'Dashboard',
    'study/:deckId': 'Study',
    'deck/:deckId': 'DeckView'
  }
};

export const migrate = async (oldVersion) => {
  console.log(`Flashcard app migrating from ${oldVersion}`);
  // Future: Add migration logic for schema changes
};