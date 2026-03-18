import { writable } from 'svelte/store';
import { dbPromise } from '../utils/db';

function createAppsStore() {
  const { subscribe, set } = writable([]);

  async function loadApps() {
    const appModules = import.meta.glob('../../apps/*/index.js');
    const loadedApps = [];
    const db = await dbPromise;

    for (const path in appModules) {
      try {
        const mod = await appModules[path]();
        const appDef = mod.default;
        
        if (appDef && appDef.id) {
          // Check version and migrate
          const oldVersion = await db.get('settings', `${appDef.id}_version`);
          if (oldVersion && oldVersion.value !== appDef.version && mod.migrate) {
            console.log(`Migrating app ${appDef.id} from ${oldVersion.value} to ${appDef.version}`);
            await mod.migrate(oldVersion.value);
            await db.put('settings', { key: `${appDef.id}_version`, value: appDef.version });
          } else if (!oldVersion) {
            await db.put('settings', { key: `${appDef.id}_version`, value: appDef.version });
          }

          // Load component
          let component = null;
          if (appDef.componentLoader) {
            component = appDef.componentLoader;
          }

          loadedApps.push({
            ...appDef,
            component: component
          });
        }
      } catch (e) {
        console.error(`Failed to load app at ${path}:`, e);
      }
    }

    set(loadedApps);
  }

  return {
    subscribe,
    loadApps
  };
}

export const apps = createAppsStore();