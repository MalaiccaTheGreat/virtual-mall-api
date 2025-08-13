import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';
import './style.css';

// Global error handler for uncaught errors
const handleGlobalError = (event: ErrorEvent) => {
  console.error('Uncaught error:', event.error);
  // Here you would typically send the error to an error tracking service
  // e.g., Sentry.captureException(event.error);
};

// Global unhandled promise rejection handler
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Here you would typically send the error to an error tracking service
  // e.g., Sentry.captureException(event.reason);
};

// Set up global error handlers
if (typeof window !== 'undefined') {
  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
}

// Error boundary fallback component
const ErrorFallback = () => (
  <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
    <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="text-gray-600">
        We're sorry, but an unexpected error occurred. Our team has been notified.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Reload Page
      </button>
    </div>
  </div>
);

// Render the app with error boundary
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
