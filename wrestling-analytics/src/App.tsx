import { DashboardProvider, useDashboard } from './contexts/DashboardContext';
import { HeroMetrics } from './components/HeroMetrics';
import { FilterPanel } from './components/FilterPanel';
import { VisualizationTabs } from './components/VisualizationTabs';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

function DashboardContent() {
  const { loading, error } = useDashboard();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Data</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 max-w-md mx-4 text-center">
          <LoadingSpinner />
          <h2 className="text-xl font-bold text-gray-900 mt-4">Loading Wrestling Data</h2>
          <p className="text-gray-600 mt-2">Fetching match data from ALL 594 wrestlers...</p>
          <p className="text-sm text-gray-500 mt-1">This may take a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🏆 Wrestling Analytics Dashboard
          </h1>
          <p className="text-xl text-blue-100">
            Professional wrestling data visualization and analytics platform
          </p>
        </div>

        {/* Hero Metrics */}
        <HeroMetrics />

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel />
          </div>

          {/* Visualizations */}
          <div className="lg:col-span-3">
            <VisualizationTabs />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </ErrorBoundary>
  );
}

export default App;