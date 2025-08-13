import { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call the onError handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // Use provided fallback or default error UI
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" aria-hidden="true" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
              <p className="mt-2 text-gray-600">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try again
                </button>
                <a
                  href="/"
                  className="ml-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Custom hook to use error boundaries in function components
export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);
  
  if (error) {
    throw error;
  }
  
  return setError;
};
