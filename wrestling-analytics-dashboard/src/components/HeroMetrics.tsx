import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../contexts/DashboardContext';
import { calculateHeroMetrics, filterMatches } from '../utils/dataProcessor';

const HeroMetrics: React.FC = () => {
  const { state } = useDashboard();

  const filteredData = useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);

  const metrics = useMemo(() => {
    return calculateHeroMetrics(filteredData);
  }, [filteredData]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const formatTime = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const metricCards = [
    {
      label: 'Total Matches',
      value: formatNumber(metrics.totalMatches),
      icon: '🥊',
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      label: 'Wrestlers',
      value: formatNumber(metrics.totalWrestlers),
      icon: '👥',
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      label: 'Venues',
      value: formatNumber(metrics.totalVenues),
      icon: '🏟️',
      color: 'bg-purple-500',
      change: '+3%'
    },
    {
      label: 'Promotions',
      value: formatNumber(metrics.totalPromotions),
      icon: '🏆',
      color: 'bg-yellow-500',
      change: '+1%'
    },
    {
      label: 'Avg Match Time',
      value: formatTime(metrics.averageMatchTime),
      icon: '⏱️',
      color: 'bg-red-500',
      change: '-2%'
    }
  ];

  if (state.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="metric-card">
            <div className="loading-skeleton h-8 w-16 mb-2"></div>
            <div className="loading-skeleton h-4 w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {metricCards.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="metric-card hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">{metric.icon}</div>
            <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
          </div>
          
          <div className="space-y-1">
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${
                metric.change.startsWith('+') 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {metric.change}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                vs last period
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HeroMetrics;
