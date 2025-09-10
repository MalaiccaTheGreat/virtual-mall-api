import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type ThemeMode = 'light' | 'dark' | 'system';

const useThemeToggle = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setIsMounted(true);
  }, []);

  // Update theme when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemIsDark);
      if (systemIsDark) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    } else {
      const darkMode = theme === 'dark';
      setIsDark(darkMode);
      root.classList.add(darkMode ? 'dark' : 'light');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light/dark/system themes
  const toggleTheme = useCallback((newTheme?: ThemeMode) => {
    if (newTheme) {
      setTheme(newTheme);
      return;
    }
    
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  // Get the current theme icon
  const getThemeIcon = useCallback(() => {
    if (theme === 'system') return 'computer';
    return theme === 'dark' ? 'moon' : 'sun';
  }, [theme]);

  // Get the next theme label for screen readers
  const getNextThemeLabel = useCallback(() => {
    if (theme === 'light') return t('theme.toggleToDark', 'Switch to dark mode');
    if (theme === 'dark') return t('theme.toggleToSystem', 'Use system preference');
    return t('theme.toggleToLight', 'Switch to light mode');
  }, [theme, t]);

  // Get the current theme name
  const getThemeName = useCallback(() => {
    return t(`theme.${theme}`, theme);
  }, [theme, t]);

  return {
    theme,
    isDark,
    isMounted,
    setTheme,
    toggleTheme,
    getThemeIcon,
    getNextThemeLabel,
    getThemeName,
  };
};

export default useThemeToggle;
