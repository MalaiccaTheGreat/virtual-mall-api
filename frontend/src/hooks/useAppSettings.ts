import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL, applyTextDirection, getTextDirection } from '../utils/rtl';

type ThemeMode = 'light' | 'dark' | 'system';

const useAppSettings = () => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme and language from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Set language and direction
    i18n.changeLanguage(savedLanguage).then(() => {
      applyTextDirection(savedLanguage);
      setIsLoading(false);
    });
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDark(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [i18n, theme]);

  // Update theme when it changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemIsDark);
      root.classList.toggle('dark', systemIsDark);
    } else {
      const darkMode = theme === 'dark';
      setIsDark(darkMode);
      root.classList.toggle('dark', darkMode);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Change language
  const changeLanguage = useCallback(async (language: string) => {
    await i18n.changeLanguage(language);
    applyTextDirection(language);
    localStorage.setItem('language', language);
  }, [i18n]);

  // Toggle between light/dark theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'system') return 'dark';
      if (prev === 'dark') return 'light';
      return 'system';
    });
  }, []);

  // Get current language direction
  const getDirection = useCallback(() => 
    getTextDirection(i18n.language), [i18n.language]);

  return {
    theme,
    isDark,
    isLoading,
    language: i18n.language,
    isRTL: isRTL(i18n.language),
    changeLanguage,
    setTheme,
    toggleTheme,
    getDirection,
  };
};

export default useAppSettings;
