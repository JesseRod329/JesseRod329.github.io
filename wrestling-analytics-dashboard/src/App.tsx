import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardProvider } from './contexts/DashboardContext';
import Header from './components/Header';
import HeroMetrics from './components/HeroMetrics';
import FilterPanel from './components/FilterPanel';
import VisualizationTabs from './components/VisualizationTabs';
import NetworkGraph from './components/visualizations/NetworkGraph';
import TimelineChart from './components/visualizations/TimelineChart';
import RadialChart from './components/visualizations/RadialChart';
import VenueMap from './components/visualizations/VenueMap';
import WrestlerMatrix from './components/visualizations/WrestlerMatrix';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import { useDashboard } from './contexts/DashboardContext';
import { parseMultipleCSVs } from './utils/dataProcessor';

const DashboardContent: React.FC = () => {
  const { state, setLoading, setError, setData } = useDashboard();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('Loading wrestling data from multiple CSV files...');
        const matches = await parseMultipleCSVs();
        
        if (matches.length === 0) {
          throw new Error('No valid match data found');
        }
        
        console.log(`Loaded ${matches.length} matches from wrestling data`);
        setData(matches);
        setError(null);
      } catch (error) {
        console.error('Error loading wrestling data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load wrestling data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setLoading, setError, setData]);

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderVisualization = () => {
    if (state.isLoading) {
      return <LoadingSpinner />;
    }

    if (state.error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{state.error}</p>
          </div>
        </div>
      );
    }

    switch (state.config.chartType) {
      case 'network':
        return <NetworkGraph />;
      case 'timeline':
        return <TimelineChart />;
      case 'radial':
        return <RadialChart />;
      case 'map':
        return <VenueMap />;
      case 'matrix':
        return <WrestlerMatrix />;
      default:
        return <NetworkGraph />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">
              Wrestling Analytics
              <span className="text-gradient block">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Transform raw wrestling match data into compelling, interactive visual narratives. 
              Explore patterns, analyze performance, and discover insights in professional wrestling.
            </p>
          </div>

          {/* Hero Metrics */}
          <HeroMetrics />

          {/* Filter Panel */}
          <FilterPanel />

          {/* Visualization Tabs */}
          <VisualizationTabs />

          {/* Main Visualization */}
          <motion.div
            key={state.config.chartType}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <ErrorBoundary>
              {renderVisualization()}
            </ErrorBoundary>
          </motion.div>

          {/* Footer */}
          <footer className="text-center text-gray-500 dark:text-gray-400 py-8 border-t border-gray-200 dark:border-gray-700">
            <p>
              Built with ❤️ for wrestling fans • Data visualization by{' '}
              <a 
                href="https://jesserodriguez.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Jesse Rodriguez
              </a>
            </p>
          </footer>
        </motion.div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </ErrorBoundary>
  );
};

export default App;
