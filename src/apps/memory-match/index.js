const componentLoader = () => import('./App.svelte');

export default {
  id: 'memory-match',
  name: 'Memory Match',
  icon: 'puzzle',
  description: 'Card matching game to train spatial memory',
  version: '1.0.0',
  componentLoader
};

export const migrate = async (oldVersion) => {
  console.log(`Memory Match app migrating from ${oldVersion}`);
};
