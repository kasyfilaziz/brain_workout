import { writable } from 'svelte/store';
import { dbPromise, APP_PREFIXES, getStoreNames } from '../../../lib/utils/db';

function createProfileStore() {
  const { subscribe, set, update } = writable({
    avgWordReadingRT: null,
    avgColorNamingRT: null,
    isLoaded: false
  });

  const stores = getStoreNames(APP_PREFIXES.stroopTest);

  return {
    subscribe,
    load: async () => {
      const db = await dbPromise;
      const profileData = await db.get(stores.profiles, 'default');
      if (profileData) {
        set({ ...profileData, isLoaded: true });
      } else {
        update(s => ({ ...s, isLoaded: true }));
      }
    },
    updateBaseline: async (mode, rt) => {
      const db = await dbPromise;
      const current = await db.get(stores.profiles, 'default') || { userId: 'default' };
      
      if (mode === 'W') current.avgWordReadingRT = rt;
      if (mode === 'C') current.avgColorNamingRT = rt;
      
      current.lastUpdate = Date.now();
      await db.put(stores.profiles, current);
      set({ ...current, isLoaded: true });
    }
  };
}

export const profile = createProfileStore();
