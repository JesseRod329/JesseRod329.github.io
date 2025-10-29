import React, { Component, ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Default error fallback component
interface DefaultErrorFallbackProps {
  error: Error | null;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ error }) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleReset = () => {
    // Clear any cached data and reload
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="error-fallback">
      <div className="error-content">
        <h2>🎮 Game Error</h2>
        <p>Something went wrong with the game physics or rendering.</p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="error-details">
            <summary>Error Details (Development Only)</summary>
            <pre className="error-stack">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
        
        <div className="error-actions">
          <button onClick={handleReload} className="error-button primary">
            🔄 Reload Game
          </button>
          <button onClick={handleReset} className="error-button secondary">
            🗑️ Reset & Reload
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default ErrorBoundary;
