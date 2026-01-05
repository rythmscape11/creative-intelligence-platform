'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-lavender-50 to-pink-50 p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="glass-card rounded-2xl p-8 shadow-xl">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-center text-gray-600 mb-8">
                We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Error Details (Development Only)</h3>
                  <p className="text-sm text-red-700 font-mono mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-red-600">
                      <summary className="cursor-pointer font-semibold mb-2">Stack Trace</summary>
                      <pre className="whitespace-pre-wrap overflow-auto max-h-64 p-2 bg-red-100 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>

                <button
                  onClick={this.handleReload}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reload Page
                </button>

                <Link
                  href="/"
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </Link>
              </div>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-center text-gray-700">
                  If this problem persists, please{' '}
                  <Link href="/help" className="text-amber-600 hover:text-amber-700 underline">
                    contact support
                  </Link>
                  {' '}or try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Page Error Boundary
 * 
 * Simplified error boundary for page-level errors
 */
export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Page Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Component Error Boundary
 * 
 * Lightweight error boundary for individual components
 */
export function ComponentErrorBoundary({ 
  children, 
  componentName 
}: { 
  children: React.ReactNode;
  componentName?: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-semibold">
              {componentName ? `${componentName} Error` : 'Component Error'}
            </p>
          </div>
          <p className="text-sm text-red-600 mt-2">
            This component failed to load. Please refresh the page.
          </p>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error(`Component Error (${componentName}):`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * API Error Boundary
 * 
 * Error boundary specifically for API-related errors
 */
export function APIErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Failed to Load Data
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't fetch the data. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('API Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;

