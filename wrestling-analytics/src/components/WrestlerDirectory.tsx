import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';

export const WrestlerDirectory: React.FC = () => {
  const { wrestlers, filters } = useDashboard();

  const filteredWrestlers = wrestlers.filter(wrestler => {
    const matchesSearch = !filters.searchTerm || 
      wrestler.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesMinMatches = wrestler.totalMatches >= filters.minMatches;
    
    return matchesSearch && matchesMinMatches;
  });

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Wrestler Directory</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWrestlers.map((wrestler) => (
          <div
            key={wrestler.name}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-900">{wrestler.name}</h4>
              <span className="text-sm text-gray-500">{wrestler.promotion}</span>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Matches:</span>
                <span className="font-medium">{wrestler.totalMatches}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-medium text-green-600">{wrestler.winRate}%</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{wrestler.wins}W-{wrestler.losses}L-{wrestler.draws}D</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredWrestlers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No wrestlers found matching your criteria.
        </div>
      )}
    </div>
  );
};
