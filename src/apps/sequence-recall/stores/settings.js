import { writable, get } from 'svelte/store';
import { loadOrCreateSettings, saveSettings } from '../utils/db';
import { validateSettings } from '../utils/validation';

export const settings = writable(null);

export async function initSettings() {
  const loadedSettings = await loadOrCreateSettings();
  settings.set(loadedSettings);
  return loadedSettings;
}

export async function updateSettings(newSettings) {
  const current = get(settings);
  const updated = { ...current, ...newSettings };
  
  const validation = validateSettings(updated);
  if (!validation.valid) {
    console.error('Invalid settings:', validation.errors);
    return false;
  }
  
  await saveSettings(updated);
  settings.set(updated);
  return true;
}

export function getSettings() {
  return get(settings);
}
