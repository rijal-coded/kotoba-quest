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
              <AlertTriangle className="w-16 h-16 text-neon-pink mx-auto" />
              <h2 className="text-2xl font-black uppercase tracking-widest text-neon-pink">
                Terjadi Kesalahan
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Something went wrong. This error has been logged.
              </p>
              {this.state.error && (
                <details className="text-left bg-bg-surface border border-text-primary/10 rounded-xl p-4">
                  <summary className="cursor-pointer text-sm font-bold uppercase tracking-widest text-main">
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
              className="flex items-center justify-center gap-2 w-full px-8 py-3 bg-main text-bg-primary font-black uppercase tracking-widest rounded-xl hover:brightness-110 transition-all"
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
