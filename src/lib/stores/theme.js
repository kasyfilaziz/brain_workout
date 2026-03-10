import { writable } from 'svelte/store';

const isClient = typeof window !== 'undefined';

const initialTheme = isClient 
  ? localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  : 'light';

export const theme = writable(initialTheme);

if (isClient) {
  theme.subscribe(value => {
    localStorage.setItem('theme', value);
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
}

export function toggleTheme() {
  theme.update(current => current === 'dark' ? 'light' : 'dark');
}
