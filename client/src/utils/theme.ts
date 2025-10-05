
import { Theme } from '../types/theme';

let listeners: ((dark: boolean) => void)[] = [];


/**
 * checks if the system is in dark mode
 */
export const isAppDarkMode = (): boolean => {
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    return savedTheme === 'dark';
};

export const setAppTheme = (theme: 'light' | 'dark') => {
  localStorage.setItem('app-theme', theme);
  const isDark = theme === 'dark';
  listeners.forEach((cb) => cb(isDark));
};

/**
 * Adds a listener that reacts to dark mode changes.
 *
 * @param callback Called with true (dark) or false (light) when the color scheme changes
 * @returns Cleanup function to remove the listener
 */
export const onAppDarkModeChange = (callback: (dark: boolean) => void) => {
  listeners.push(callback);

  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
};