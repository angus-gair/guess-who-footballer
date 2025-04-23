import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // If a fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, use default error UI
      return (
        <div className="flex items-center justify-center min-h-screen p-5 bg-light-gray">
          <div className="card p-8 max-w-lg w-full">
            <h2 className="text-2xl font-montserrat font-bold text-error mb-4">
              Something went wrong
            </h2>
            <p className="text-medium-gray mb-4">
              We're sorry, an error occurred while rendering this view. Please try refreshing the page.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 overflow-auto max-h-32">
              <pre className="text-sm text-dark-gray">
                {this.state.error?.message}
              </pre>
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
            >
              Go to Home Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 