import { Outlet, Link, useNavigate } from 'react-router-dom';
import { UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CartButton } from '../cart/CartButton';
import { useState } from 'react';

export const MainLayout = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Skip to main content link - visible on focus for keyboard users */}
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          skipToContent();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex
            ">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <img 
                    src="/assets/Logo.jpeg" 
                    alt="Pulse & Threads Logo" 
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-bold text-blue-600 hidden sm:inline-block">
                    Pulse & Threads
                  </span>
                </Link>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Primary navigation">
                <Link
                  to="/products"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  to="/categories"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Categories
                </Link>
                <Link
                  to="/deals"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Deals
                </Link>
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-l-md"
                    aria-label="Search products"
                    aria-describedby="search-description"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <span className="sr-only">Search products</span>
                  <span aria-hidden="true">Search</span>
                </button>
              </form>
              <div className="flex items-center space-x-4 md:ml-6">
                <Link
                  to="/account"
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">View account</span>
                  <UserIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
                <div className="h-6 w-px bg-gray-200" aria-hidden="true" />
                <CartButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow" tabIndex={-1} aria-label="Main content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12" role="contentinfo">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                About
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/blog" className="text-base text-gray-500 hover:text-gray-900">
                Blog
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                Terms & Conditions
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                Privacy Policy
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Virtual Mall. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
