import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';
import { VirtualAssistant } from './components/assistant/VirtualAssistant';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AssistantProvider } from './contexts/AssistantContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

// Import i18n configuration
import './i18n/i18n';

interface RouteErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

// Error boundary fallback component for routes
const RouteErrorFallback = ({ error, resetErrorBoundary }: RouteErrorFallbackProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="w-full max-w-md p-8 space-y-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t('error.somethingWentWrong')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {error?.message || t('error.pageLoadError')}
        </p>
        <div className="flex justify-center space-x-4 mt-4 rtl:space-x-reverse">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('common.retry')}
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('error.goToHome')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface RouteWithErrorBoundaryProps {
  element: React.ComponentType<any>;
  [key: string]: any;
}

// Wrapper component for route-level error boundaries
const RouteWithErrorBoundary = ({ element: Element, ...rest }: RouteWithErrorBoundaryProps) => (
  <ErrorBoundary
    fallback={({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
      <RouteErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
    )}
  >
    <Element {...rest} />
  </ErrorBoundary>
);

const HomePage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96 flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            {t('home.welcome', { defaultValue: 'Welcome to Pulse & Threads' })}
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-center max-w-md mb-6">
            {t('home.tagline', {
              defaultValue: 'Discover amazing fashion and shop with our virtual assistant.'
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
              aria-label={t('home.browseProducts', 'Browse our products')}
            >
              {t('home.browseProducts', 'Browse Products')}
            </a>
            <a
              href="/virtual-assistant"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center font-medium"
              aria-label={t('home.tryVirtualAssistant', 'Try our virtual assistant')}
            >
              {t('home.tryVirtualAssistant', 'Try Virtual Assistant')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // Set document title and meta description
  useEffect(() => {
    document.title = 'Pulse & Threads | Premium Fashion Store';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Discover the latest fashion trends at Pulse & Threads. Shop now for premium clothing, accessories, and more.');
  }, []);

  // Background image styles
  const backgroundStyles = {
    backgroundImage: 'url(/assets/Background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.1, // Adjust opacity as needed
  };

  return (
    <ThemeProvider>
      <CartProvider>
        <AssistantProvider>
          <Router>
            <MainLayout>
              <div style={backgroundStyles} aria-hidden="true" />
              <Routes>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="checkout/success" element={<CheckoutSuccessPage />} />
                <Route path="virtual-assistant" element={<VirtualAssistant />} />
              </Routes>
              <VirtualAssistant />
            </MainLayout>
          </Router>
        </AssistantProvider>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;
