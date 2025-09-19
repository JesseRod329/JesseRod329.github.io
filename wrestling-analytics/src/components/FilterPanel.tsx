import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';

export const FilterPanel: React.FC = () => {
  const { filters, updateFilters, matchData } = useDashboard();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchTerm: e.target.value });
  };

  const handlePromotionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ selectedPromotion: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ selectedYear: e.target.value });
  };

  const handleResultChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ selectedResult: e.target.value });
  };

  const handleMinMatchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ minMatches: parseInt(e.target.value) || 0 });
  };

  const promotions = [...new Set(matchData.map(m => m.promotion))].sort();
  const years = [...new Set(matchData.map(m => m.year))].sort((a, b) => b - a);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        🔍 Filters & Search
      </h3>
      
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Wrestlers
          </label>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter wrestler name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Promotion Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Promotion
          </label>
          <select
            value={filters.selectedPromotion}
            onChange={handlePromotionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Promotions</option>
            {promotions.map(promotion => (
              <option key={promotion} value={promotion}>
                {promotion}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={filters.selectedYear}
            onChange={handleYearChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Result Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Match Result
          </label>
          <select
            value={filters.selectedResult}
            onChange={handleResultChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Results</option>
            <option value="win">Wins Only</option>
            <option value="loss">Losses Only</option>
            <option value="draw">Draws Only</option>
          </select>
        </div>

        {/* Min Matches Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Matches
          </label>
          <input
            type="number"
            value={filters.minMatches}
            onChange={handleMinMatchesChange}
            min="0"
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
