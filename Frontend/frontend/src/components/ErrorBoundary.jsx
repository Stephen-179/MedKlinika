// src/components/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 my-4">
          <h2 className="font-bold text-lg">Something went wrong</h2>
          <p className="mt-2">{this.state.error.message}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-800"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;