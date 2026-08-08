import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

window.addEventListener('error', (e) => {
  fetch('/api/log_error', { method: 'POST', body: JSON.stringify({ message: e.message, stack: e.error?.stack }) }).catch(() => {});
});

import React, { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red', background: 'black', minHeight: '100vh' }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Suppress THREE.Clock warning from @react-three/fiber
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) {
    return;
  }
  originalWarn(...args);
};

// Entry point for the application
createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
