import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';
import { VirtualAssistant } from './components/3d/VirtualAssistant';
import { CartProvider } from './contexts/CartContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import './App.css';

// Error boundary fallback component for routes
const RouteErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
    <div className="w-full max-w-md p-8 space-y-4 text-center bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
      <p className="text-gray-600">
        {error?.message || 'An error occurred while loading this page.'}
      </p>
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to home
        </a>
      </div>
    </div>
  </div>
);

// Wrapper component for route-level error boundaries
const RouteWithErrorBoundary = ({ element: Element, ...rest }) => (
  <ErrorBoundary
    fallback={({ error, resetErrorBoundary }) => (
      <RouteErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
    )}
  >
    <Element {...rest} />
  </ErrorBoundary>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Virtual Mall</h1>
                  <p className="text-gray-500 text-center max-w-md">
                    Discover amazing products and shop with our virtual assistant.
                  </p>
                  <div className="mt-6">
                    <a
                      href="/products"
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Browse Products
                    </a>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route 
            path="products" 
            element={<RouteWithErrorBoundary element={ProductsPage} />} 
          />
          <Route 
            path="products/:id" 
            element={<RouteWithErrorBoundary element={ProductDetailPage} />} 
          />
          <Route 
            path="cart" 
            element={<RouteWithErrorBoundary element={CartPage} />} 
          />
          <Route 
            path="checkout" 
            element={<RouteWithErrorBoundary element={CheckoutPage} />} 
          />
          <Route 
            path="checkout/success" 
            element={<RouteWithErrorBoundary element={CheckoutSuccessPage} />} 
          />
        </Route>
      </Routes>
      <VirtualAssistant />
    </Router>
  </CartProvider>
  );
}

export default App;
