import { useTranslation } from 'react-i18next';
import { GlobeAltIcon, CheckIcon } from '@heroicons/react/24/outline';
import { isRTL, applyTextDirection } from '../../utils/rtl';
import { useAppSettings } from '../../hooks/useAppSettings';
import { useEffect, useState } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  rtl?: boolean;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
];

export const LanguageSelector = () => {
  const { t } = useTranslation();
  const { changeLanguage, language } = useAppSettings();
  const [isOpen, setIsOpen] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-selector')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLanguageChange = async (lng: string) => {
    await changeLanguage(lng);
    applyTextDirection(lng);
    setIsOpen(false);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language) || SUPPORTED_LANGUAGES[0];
  
  return (
    <div className="relative language-selector">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('header.changeLanguage', 'Change language')}
      >
        <GlobeAltIcon className="w-5 h-5" />
        <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 z-20 mt-1 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('header.language', 'Language')}
            </div>
            
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  language === lang.code
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                role="menuitem"
                dir={lang.rtl ? 'rtl' : 'ltr'}
              >
                <span className="flex-1 text-left">
                  <span className="block">{lang.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {lang.nativeName}
                  </span>
                </span>
                {language === lang.code && (
                  <CheckIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                )}
              </button>
            ))}
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
            
            <a
              href="#"
              className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-700"
              role="menuitem"
            >
              {t('header.addTranslation', 'Add translation')}...
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
