import { writable } from 'svelte/store';
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

  const { subscribe, set, update } = writable(defaultSettings);

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
    update(async (s) => {
      let newStreak = s.streak;
      let newTotalStudyDays = s.totalStudyDays;
      const lastDate = s.lastStudyDate ? new Date(s.lastStudyDate).toDateString() : null;

      if (lastDate !== today) {
        newTotalStudyDays++;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastDate === yesterdayStr) {
          newStreak++;
        } else if (lastDate !== today) {
          newStreak = 1;
        }
      }

      const newSettings = {
        ...s,
        streak: newStreak,
        lastStudyDate: today,
        totalStudyDays: newTotalStudyDays,
      };

      await save('streak', newStreak);
      await save('lastStudyDate', today);
      await save('totalStudyDays', newTotalStudyDays);

      return newSettings;
    });
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