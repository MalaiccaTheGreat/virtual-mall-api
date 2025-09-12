import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useThemeToggle from '../../hooks/useThemeToggle';
import { Tooltip } from '../ui/Tooltip';

interface ThemeToggleProps {
  /**
   * Show only the icon without the dropdown
   * @default false
   */
  iconOnly?: boolean;
  /**
   * Additional class name for the button
   */
  className?: string;
}

export const ThemeToggle = ({ iconOnly = false, className = '' }: ThemeToggleProps) => {
  const { t } = useTranslation();
  const { 
    theme, 
    isMounted, 
    toggleTheme, 
    getThemeIcon, 
    getNextThemeLabel, 
    getThemeName 
  } = useThemeToggle();
  const [isOpen, setIsOpen] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.theme-toggle')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't render anything on the server to avoid hydration mismatch
  if (!isMounted) {
    return (
      <button 
        className={`w-10 h-10 rounded-full ${className}`}
        aria-hidden="true"
      />
    );
  }

  const themeIcons = {
    sun: <SunIcon className="h-5 w-5" aria-hidden="true" />,
    moon: <MoonIcon className="h-5 w-5" aria-hidden="true" />,
    computer: <ComputerDesktopIcon className="h-5 w-5" aria-hidden="true" />
  };

  const currentIcon = themeIcons[getThemeIcon() as keyof typeof themeIcons];
  const nextThemeLabel = getNextThemeLabel();

  const button = (
    <button
      type="button"
      onClick={() => iconOnly ? toggleTheme() : setIsOpen(!isOpen)}
      className={`flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      aria-expanded={!iconOnly && isOpen}
      aria-haspopup={!iconOnly}
      aria-label={iconOnly ? nextThemeLabel : t('header.theme', 'Theme')}
    >
      {currentIcon}
      {!iconOnly && (
        <span className="ml-2 text-sm font-medium sr-only md:not-sr-only">
          {getThemeName()}
        </span>
      )}
    </button>
  );

  if (iconOnly) {
    return (
      <Tooltip content={nextThemeLabel} placement="bottom">
        {button}
      </Tooltip>
    );
  }

  return (
    <div className="relative theme-toggle">
      {button}
      
      {isOpen && (
        <div 
          className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('header.theme', 'Theme')}
            </div>
            
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              role="menuitem"
            >
              {themeIcons[getThemeIcon() === 'sun' ? 'moon' : getThemeIcon() === 'moon' ? 'computer' : 'sun']}
              <span className="ml-3">
                {nextThemeLabel}
              </span>
            </button>
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
            
            <div className="space-y-1" role="group" aria-label="Theme options">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  theme === 'light'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                role="menuitemradio"
                aria-checked={theme === 'light'}
              >
                <SunIcon className="h-4 w-4 mr-3" aria-hidden="true" />
                {t('theme.light', 'Light')}
              </button>
              
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  theme === 'dark'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                role="menuitemradio"
                aria-checked={theme === 'dark'}
              >
                <MoonIcon className="h-4 w-4 mr-3" aria-hidden="true" />
                {t('theme.dark', 'Dark')}
              </button>
              
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  theme === 'system'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                role="menuitemradio"
                aria-checked={theme === 'system'}
              >
                <ComputerDesktopIcon className="h-4 w-4 mr-3" aria-hidden="true" />
                {t('theme.system', 'System')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
