const componentLoader = () => import('./App.svelte');

export default {
  id: 'wordScramble',
  name: 'Word Scramble',
  icon: 'scramble',
  description: 'Unscramble letters to form words',
  version: '1.0.0',
  componentLoader
};

export const migrate = async (oldVersion) => {
  console.log(`Word Scramble app migrating from ${oldVersion}`);
};
