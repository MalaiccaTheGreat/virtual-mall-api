import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom';
import { UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CartButton } from '../cart/CartButton';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSelector } from '../common/LanguageSelector';
import { useAppSettings } from '../../hooks/useAppSettings';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavItem = ({ to, children, className = '' }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      px-3 py-2 rounded-md text-sm font-medium transition-colors
      ${
        isActive
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      } ${className}`
    }
  >
    {children}
  </NavLink>
);

export const MainLayout = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useAppSettings();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when language changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [i18n.language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  // Skip to main content link for keyboard users
  const skipToContent = () => {
    const mainElement = document.getElementById('main-content');
    if (mainElement) {
      mainElement.tabIndex = -1;
      mainElement.focus();
      setTimeout(() => mainElement.removeAttribute('tabindex'), 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Skip to main content link - visible on focus for keyboard users */}
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          skipToContent();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      >
        {t('a11y.skipToContent')}
      </a>
      
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm relative z-10" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and desktop navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                  <img 
                    src="/assets/Logo.jpeg" 
                    alt={t('header.logoAlt', 'Pulse & Threads Logo')} 
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400 hidden sm:inline-block">
                    Pulse & Threads
                  </span>
                </Link>
              </div>
              
              {/* Desktop navigation */}
              <nav className="hidden md:ml-6 md:flex md:space-x-1 rtl:space-x-reverse">
                <NavItem to="/products">
                  {t('header.products')}
                </NavItem>
                <NavItem to="/categories">
                  {t('header.categories')}
                </NavItem>
                <NavItem 
                  to="/sale" 
                  className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  {t('header.sale')}
                </NavItem>
              </nav>
            </div>

            {/* Desktop search and actions */}
            <div className="hidden md:flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                <div className="flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t('search.placeholder', 'Search products...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label={t('search.placeholder', 'Search products')}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <span className="sr-only">{t('search.search', 'Search')}</span>
                    <span>{t('search.search', 'Search')}</span>
                  </button>
                </div>
              </form>

              <div className="flex items-center space-x-1 rtl:space-x-reverse ml-4">
                <NavLink
                  to="/account"
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label={t('header.account')}
                >
                  <UserIcon className="h-6 w-6" aria-hidden="true" />
                </NavLink>
                
                <div className="relative">
                  <CartButton />
                </div>
                
                <div className="relative">
                  <LanguageSelector />
                </div>
                
                <div className="relative">
                  <ThemeToggle iconOnly />
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={isMobileMenuOpen}
                aria-label={t('header.menu', 'Menu')}
              >
                <span className="sr-only">{t('header.openMenu', 'Open main menu')}</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <NavItem to="/products">
                {t('header.products')}
              </NavItem>
              <NavItem to="/categories">
                {t('header.categories')}
              </NavItem>
              <NavItem 
                to="/sale" 
                className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                {t('header.sale')}
              </NavItem>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4">
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t('search.placeholder', 'Search products...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label={t('search.placeholder', 'Search products')}
                    />
                  </div>
                  <button
                    type="submit"
                    className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <span className="sr-only">{t('search.search', 'Search')}</span>
                    <span>{t('search.search', 'Search')}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main 
        id="main-content" 
        className="flex-grow"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg my-4 shadow-lg">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800 mt-12" role="contentinfo">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link to="/about" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                {t('footer.about', 'About')}
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/blog" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                {t('footer.blog', 'Blog')}
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                {t('footer.contact', 'Contact')}
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                {t('footer.terms', 'Terms & Conditions')}
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                {t('footer.privacy', 'Privacy Policy')}
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} {t('footer.copyright', 'Virtual Mall. All rights reserved.')}
          </p>
        </div>
      </footer>
    </div>
  );
};
