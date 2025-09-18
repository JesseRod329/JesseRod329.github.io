import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../contexts/DashboardContext';
import WrestlerSearch from './WrestlerSearch';

const FilterPanel: React.FC = () => {
  const { state, setFilters, resetFilters } = useDashboard();

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    const promotions = [...new Set(state.data.map(match => match.event.promotion))];
    const wrestlers = [...new Set(state.data.flatMap(match => [...match.winners, ...match.losers]))];
    const venues = [...new Set(state.data.map(match => match.event.venue))];
    
    return {
      promotions: promotions.sort(),
      wrestlers: wrestlers.sort(),
      venues: venues.sort()
    };
  }, [state.data]);

  const handlePromotionToggle = (promotion: string) => {
    const current = state.config.filters.promotions;
    const updated = current.includes(promotion)
      ? current.filter(p => p !== promotion)
      : [...current, promotion];
    setFilters({ promotions: updated });
  };

  const handleMatchTypeChange = (matchType: 'all' | 'singles' | 'tag' | 'multi') => {
    setFilters({ matchType });
  };

  const handleEventTypeChange = (eventType: 'all' | 'ppv' | 'tv' | 'house') => {
    setFilters({ eventType });
  };

  const handleWrestlerSelect = useCallback((wrestlerFile: string) => {
    // Add logic to load additional wrestler data if needed
    console.log('Selected wrestler file:', wrestlerFile);
    // You can implement additional data loading here
  }, []);

  const getPromotionColor = (promotion: string): string => {
    if (promotion.includes('AEW')) return 'promotion-aew';
    if (promotion.includes('NJPW')) return 'promotion-njpw';
    if (promotion.includes('WWE')) return 'promotion-wwe';
    return 'filter-chip';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card mb-8"
    >
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Filters & Settings
          </h2>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Reset All
          </button>
        </div>
      </div>
      
      <div className="card-content space-y-6">
        {/* Wrestler Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Search Wrestlers
          </label>
          <WrestlerSearch 
            onWrestlerSelect={handleWrestlerSelect}
            isLoading={state.isLoading}
          />
        </div>

        {/* Promotions Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Promotions
          </label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.promotions.map(promotion => (
              <button
                key={promotion}
                onClick={() => handlePromotionToggle(promotion)}
                className={`${getPromotionColor(promotion)} ${
                  state.config.filters.promotions.includes(promotion) ? 'active' : ''
                }`}
              >
                {promotion}
              </button>
            ))}
          </div>
        </div>

        {/* Match Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Match Type
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Matches' },
              { value: 'singles', label: 'Singles' },
              { value: 'tag', label: 'Tag Team' },
              { value: 'multi', label: 'Multi-Person' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleMatchTypeChange(option.value as any)}
                className={`filter-chip ${
                  state.config.filters.matchType === option.value ? 'active' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Event Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Event Type
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Events' },
              { value: 'ppv', label: 'Pay-Per-View' },
              { value: 'tv', label: 'TV Shows' },
              { value: 'house', label: 'House Shows' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleEventTypeChange(option.value as any)}
                className={`filter-chip ${
                  state.config.filters.eventType === option.value ? 'active' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {state.config.filters.promotions.length || filterOptions.promotions.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Promotions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {state.data.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {filterOptions.wrestlers.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Wrestlers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {filterOptions.venues.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Venues</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;
