import { writable } from 'svelte/store';
import { dbPromise, APP_PREFIXES, getStoreNames } from '../../../lib/utils/db';

function createSettingsStore() {
  const { subscribe, set } = writable({
    palette: 'standard' // 'standard' | 'high-contrast'
  });

  const stores = getStoreNames(APP_PREFIXES.stroopTest);

  return {
    subscribe,
    load: async () => {
      const db = await dbPromise;
      const palette = await db.get(stores.settings, 'palette');
      if (palette) set({ palette: palette.value });
    },
    setPalette: async (value) => {
      const db = await dbPromise;
      await db.put(stores.settings, { key: 'palette', value });
      set({ palette: value });
    }
  };
}

export const settings = createSettingsStore();
