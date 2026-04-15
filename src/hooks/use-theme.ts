import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
export type ColorTheme = 'default' | 'ocean' | 'sunset' | 'forest';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme, colorTheme: ColorTheme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  // Remove all color theme classes
  root.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest');
  if (colorTheme !== 'default') {
    root.classList.add(`theme-${colorTheme}`);
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('algotrainer-theme') as Theme) || 'system';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem('algotrainer-color-theme') as ColorTheme) || 'default';
  });

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem('algotrainer-theme', t);
    setThemeState(t);
    applyTheme(t, colorTheme);
  }, [colorTheme]);

  const setColorTheme = useCallback((ct: ColorTheme) => {
    localStorage.setItem('algotrainer-color-theme', ct);
    setColorThemeState(ct);
    applyTheme(theme, ct);
  }, [theme]);

  useEffect(() => {
    applyTheme(theme, colorTheme);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') applyTheme('system', colorTheme); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, colorTheme]);

  return { theme, setTheme, colorTheme, setColorTheme };
}
