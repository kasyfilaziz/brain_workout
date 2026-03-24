const componentLoader = () => import('./App.svelte');

export default {
  id: 'stroop-test',
  name: 'Stroop Test',
  icon: 'brain',
  description: 'Measure inhibitory control and cognitive flexibility',
  version: '1.0.0',
  componentLoader,
  
  routes: {
    '': 'Dashboard',
    'session/:mode': 'Session',
    'results': 'Results'
  }
};

export const migrate = async (oldVersion) => {
  console.log(`Stroop Test app migrating from ${oldVersion}`);
};
