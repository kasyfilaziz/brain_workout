import { writable } from 'svelte/store';

const isClient = typeof window !== 'undefined';
const THEME_COLORS = {
  light: '#ffffff',
  dark: '#111827',
};

const getInitialTheme = () => {
  if (!isClient) return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = value => {
  document.documentElement.classList.toggle('dark', value === 'dark');
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
    meta.setAttribute('content', THEME_COLORS[value]);
  });
};

export const theme = writable(getInitialTheme());

if (isClient) {
  theme.subscribe(value => {
    localStorage.setItem('theme', value);
    applyTheme(value);
  });
}

export function toggleTheme() {
  theme.update(current => current === 'dark' ? 'light' : 'dark');
}
