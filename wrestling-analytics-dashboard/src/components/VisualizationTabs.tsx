import React from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../contexts/DashboardContext';

const VisualizationTabs: React.FC = () => {
  const { state, setChartType } = useDashboard();

  const tabs = [
    {
      id: 'network' as const,
      label: 'Network Graph',
      icon: '🕸️',
      description: 'Wrestler relationships and match connections'
    },
    {
      id: 'timeline' as const,
      label: 'Timeline',
      icon: '📈',
      description: 'Performance trends over time'
    },
    {
      id: 'radial' as const,
      label: 'Radial Chart',
      icon: '🎯',
      description: 'Winner\'s circle and victory patterns'
    },
    {
      id: 'map' as const,
      label: 'Venue Map',
      icon: '🗺️',
      description: 'Global wrestling venues and events'
    },
    {
      id: 'matrix' as const,
      label: 'Match Matrix',
      icon: '📊',
      description: 'Head-to-head comparison matrix'
    }
  ];

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = state.config.chartType === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => setChartType(tab.id)}
                className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-center font-medium focus:outline-none transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-2xl">{tab.icon}</span>
                  <span className="text-sm font-medium">{tab.label}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 max-w-32 leading-tight">
                    {tab.description}
                  </span>
                </div>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default VisualizationTabs;
