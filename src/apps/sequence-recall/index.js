const componentLoader = () => import('./App.svelte');

export default {
  id: 'sequence-recall',
  name: 'Sequence Recall',
  icon: 'brain',
  description: 'Working memory training using the N-Back cognitive exercise',
  version: '1.0.0',
  componentLoader
};

export const migrate = async (oldVersion) => {
  console.log(`Sequence Recall app migrating from ${oldVersion}`);
};
