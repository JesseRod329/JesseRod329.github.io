// Main App Component
import React from 'react';
import PRDCreator from './components/prd/PRDCreator';
import ErrorBoundary from './components/ui/ErrorBoundary';
import './styles/globals.css';

/**
 * Main App Component
 * Renders the PRD Creator application with error boundary
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <PRDCreator />
      </div>
    </ErrorBoundary>
  );
};

export default App;
