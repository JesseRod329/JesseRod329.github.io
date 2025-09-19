import { DashboardProvider } from './contexts/DashboardContext';
import { HeroMetrics } from './components/HeroMetrics';
import { FilterPanel } from './components/FilterPanel';
import { VisualizationTabs } from './components/VisualizationTabs';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <DashboardProvider>
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
      </DashboardProvider>
    </ErrorBoundary>
  );
}

export default App;