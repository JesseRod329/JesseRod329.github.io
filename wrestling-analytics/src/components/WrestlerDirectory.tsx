import React, { useState } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import type { WrestlerProfile } from '../types';

export const WrestlerDirectory: React.FC = () => {
  const { wrestlers, filters } = useDashboard();
  const [selectedWrestler, setSelectedWrestler] = useState<WrestlerProfile | null>(null);

  const filteredWrestlers = wrestlers.filter(wrestler => {
    const matchesSearch = !filters.searchTerm || 
      wrestler.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesMinMatches = wrestler.totalMatches >= filters.minMatches;
    
    return matchesSearch && matchesMinMatches;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win': return 'text-green-600 font-bold';
      case 'loss': return 'text-red-600 font-bold';
      case 'draw': return 'text-yellow-600 font-bold';
      default: return 'text-gray-500';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'win': return '✅';
      case 'loss': return '❌';
      case 'draw': return '🤝';
      default: return '❓';
    }
  };

  if (selectedWrestler) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {selectedWrestler.name} - Match History
          </h3>
          <button
            onClick={() => setSelectedWrestler(null)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Directory
          </button>
        </div>

        {/* Wrestler Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{selectedWrestler.totalMatches}</div>
              <div className="text-blue-100">Total Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-300">{selectedWrestler.wins}</div>
              <div className="text-blue-100">Wins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-300">{selectedWrestler.losses}</div>
              <div className="text-blue-100">Losses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-300">{selectedWrestler.winRate}%</div>
              <div className="text-blue-100">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Match History */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h4 className="font-semibold text-gray-900">Recent Matches</h4>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {selectedWrestler.matches.slice(0, 50).map((match, index) => (
              <div key={index} className="border-b border-gray-100 p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-lg ${getResultColor(match.result)}`}>
                        {getResultIcon(match.result)}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {match.result === 'win' ? `${match.wrestler} defeats ${match.opponent}` :
                           match.result === 'loss' ? `${match.opponent} defeats ${match.wrestler}` :
                           `${match.wrestler} vs ${match.opponent} (Draw)`}
                        </div>
                        <div className="text-sm text-gray-600">{match.event}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 {formatDate(match.parsedDate)}</span>
                      <span>🏢 {match.promotion}</span>
                      <span>📍 {match.location}</span>
                      {match.matchTime && <span>⏱️ {match.matchTime}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedWrestler.matches.length > 50 && (
            <div className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-600">
              Showing 50 of {selectedWrestler.matches.length} matches
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Wrestler Directory ({filteredWrestlers.length} wrestlers)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWrestlers.map((wrestler) => (
          <div
            key={wrestler.name}
            onClick={() => setSelectedWrestler(wrestler)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-900">{wrestler.name}</h4>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {wrestler.promotion}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Total Matches:</span>
                <span className="font-medium">{wrestler.totalMatches}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-medium text-green-600">{wrestler.winRate}%</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{wrestler.wins}W-{wrestler.losses}L-{wrestler.draws}D</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-600 font-medium">
              Click to view match history →
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
