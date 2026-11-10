import { get, writable } from 'svelte/store';
import { dbPromise } from '../utils/db';

const isClient = typeof window !== 'undefined';

function createSettingsStore() {
  const defaultSettings = {
    theme: 'light',
    streak: 0,
    lastStudyDate: null,
    totalStudyDays: 0,
    hubViewMode: 'grid',
    hubAppOrder: null,
  };

  const settingsStore = writable(defaultSettings);
  const { subscribe, set, update } = settingsStore;

  async function load() {
    if (!isClient) return;
    try {
      const db = await dbPromise;
      const themeSetting = await db.get('settings', 'theme');
      const streakSetting = await db.get('settings', 'streak');
      const lastStudyDateSetting = await db.get('settings', 'lastStudyDate');
      const totalStudyDaysSetting = await db.get('settings', 'totalStudyDays');
      const hubViewModeSetting = await db.get('settings', 'hubViewMode');
      const hubAppOrderSetting = await db.get('settings', 'hubAppOrder');

      set({
        theme: themeSetting?.value || defaultSettings.theme,
        streak: streakSetting?.value ?? defaultSettings.streak,
        lastStudyDate: lastStudyDateSetting?.value || defaultSettings.lastStudyDate,
        totalStudyDays: totalStudyDaysSetting?.value ?? defaultSettings.totalStudyDays,
        hubViewMode: hubViewModeSetting?.value || defaultSettings.hubViewMode,
        hubAppOrder: hubAppOrderSetting?.value ?? defaultSettings.hubAppOrder,
      });
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }

  async function save(key, value) {
    if (!isClient) return;
    try {
      const db = await dbPromise;
      await db.put('settings', { key, value });
    } catch (e) {
      console.error('Failed to save setting:', e);
    }
  }

  async function setTheme(newTheme) {
    update(s => ({ ...s, theme: newTheme }));
    await save('theme', newTheme);
  }

  async function setHubViewMode(mode) {
    update(s => ({ ...s, hubViewMode: mode }));
    await save('hubViewMode', mode);
  }

  async function setHubAppOrder(appIds) {
    update(s => ({ ...s, hubAppOrder: appIds }));
    await save('hubAppOrder', appIds);
  }

  async function updateStudiedToday() {
    const today = new Date().toDateString();
    const current = get(settingsStore);
    let newStreak = current.streak;
    let newTotalStudyDays = current.totalStudyDays;
    const lastDate = current.lastStudyDate ? new Date(current.lastStudyDate).toDateString() : null;

    if (lastDate !== today) {
      newTotalStudyDays += 1;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const newSettings = {
      ...current,
      streak: newStreak,
      lastStudyDate: today,
      totalStudyDays: newTotalStudyDays
    };

    if (isClient) {
      const db = await dbPromise;
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      await store.put({ key: 'streak', value: newStreak });
      await store.put({ key: 'lastStudyDate', value: today });
      await store.put({ key: 'totalStudyDays', value: newTotalStudyDays });
      await tx.done;
    }

    set(newSettings);
  }

  async function reset() {
    set(defaultSettings);
  }

  load();

  return {
    subscribe,
    setTheme,
    setHubViewMode,
    setHubAppOrder,
    updateStudiedToday,
    load,
    reset,
  };
}

export const settings = createSettingsStore();
