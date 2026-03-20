const componentLoader = () => import('./App.svelte');

export default {
  id: 'math-sprint',
  name: 'Math Sprint',
  icon: 'calculator',
  description: 'Mental arithmetic trainer with timed challenges',
  version: '1.0.0',
  componentLoader
};

export const migrate = async (oldVersion) => {
  console.log(`Math Sprint app migrating from ${oldVersion}`);
};
