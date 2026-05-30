import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary text-text-primary">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full space-y-6 text-center"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
              <h2 className="text-2xl font-bold text-danger"
                style={{ fontFamily: 'var(--font-display)' }}>
                Terjadi Kesalahan
              </h2>
              <p className="text-text-secondary leading-relaxed text-sm">
                Something went wrong. This error has been logged.
              </p>
              {this.state.error && (
                <details className="text-left kawaii-card p-4">
                  <summary className="cursor-pointer text-sm font-bold text-main">
                    Error Details
                  </summary>
                  <pre className="mt-3 text-xs text-text-secondary font-mono overflow-x-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
            <button
              onClick={this.handleRetry}
              className="kawaii-btn w-full px-8 py-3"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
