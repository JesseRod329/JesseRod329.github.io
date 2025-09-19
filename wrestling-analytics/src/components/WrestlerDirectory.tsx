import React, { useState } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import type { WrestlerProfile } from '../types';

export const WrestlerDirectory: React.FC = () => {
  const { wrestlers, filters } = useDashboard();
  const [selectedWrestler, setSelectedWrestler] = useState<WrestlerProfile | null>(null);
  const [loadingMatches, setLoadingMatches] = useState(false);

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

  const loadWrestlerMatches = async (wrestler: WrestlerProfile) => {
    if (wrestler.matchesLoaded || !wrestler.filename) return wrestler;
    
    setLoadingMatches(true);
    try {
      console.log(`Loading matches for ${wrestler.name}...`);
      const response = await fetch(`https://raw.githubusercontent.com/JesseRod329/JesseRod329.github.io/main/wresltedash/${wrestler.filename}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${wrestler.filename}`);
      }
      
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) return wrestler;
      
      const matches = [];
      const wrestlerName = wrestler.name;
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length >= 4) {
          const date = values[1];
          const event = values[3];
          
          let parsedDate: Date | null = null;
          let year = 2023;
          
          if (date && date.includes('.')) {
            const dateParts = date.split('.');
            if (dateParts.length === 3) {
              const day = parseInt(dateParts[0]);
              const month = parseInt(dateParts[1]);
              const yearStr = dateParts[2];
              year = parseInt(yearStr);
              parsedDate = new Date(year, month - 1, day);
            }
          }
          
          const result = extractResultFromEvent(event, wrestlerName);
          const promotion = extractPromotion(event);
          const opponent = extractOpponent(event, wrestlerName);
          
          matches.push({
            date: date || 'Unknown',
            parsedDate: parsedDate || new Date(),
            year,
            wrestler: wrestlerName,
            opponent: opponent || 'Unknown',
            result,
            event: event || 'Unknown Event',
            promotion,
            location: values[4] || 'Unknown',
            matchTime: '0:00'
          });
        }
      }
      
      const wins = matches.filter(m => m.result === 'win').length;
      const losses = matches.filter(m => m.result === 'loss').length;
      const draws = matches.filter(m => m.result === 'draw').length;
      
      return {
        ...wrestler,
        matches,
        totalMatches: matches.length,
        wins,
        losses,
        draws,
        winRate: matches.length > 0 ? Math.round((wins / matches.length) * 100) : 0,
        promotion: extractPromotion(matches[0]?.event || ''),
        lastMatch: matches[matches.length - 1]?.parsedDate,
        matchesLoaded: true
      };
    } catch (error) {
      console.error(`Error loading matches for ${wrestler.name}:`, error);
      return wrestler;
    } finally {
      setLoadingMatches(false);
    }
  };

  const extractResultFromEvent = (event: string, wrestlerName: string): 'win' | 'loss' | 'draw' | 'unknown' => {
    if (!event || !wrestlerName) return 'unknown';
    
    const lowerEvent = event.toLowerCase();
    const lowerWrestler = wrestlerName.toLowerCase();
    
    if (lowerEvent.includes(`${lowerWrestler}defeats`) || 
        lowerEvent.includes(`${lowerWrestler} defeats`)) {
      return 'win';
    }
    
    if (lowerEvent.includes(`defeats${lowerWrestler}`) || 
        lowerEvent.includes(`defeats ${lowerWrestler}`)) {
      return 'loss';
    }
    
    return 'unknown';
  };

  const extractPromotion = (event: string): string => {
    if (event.toLowerCase().includes('wwe')) return 'WWE';
    if (event.toLowerCase().includes('aew')) return 'AEW';
    if (event.toLowerCase().includes('njpw')) return 'NJPW';
    if (event.toLowerCase().includes('tna') || event.toLowerCase().includes('impact')) return 'TNA';
    return 'Independent';
  };

  const extractOpponent = (event: string, wrestlerName: string): string => {
    if (!event || !wrestlerName) return 'Unknown';
    
    const lowerWrestler = wrestlerName.toLowerCase();
    
    const defeatsPattern = new RegExp(`${lowerWrestler}\\s*defeats\\s*([^\\s(]+)`, 'i');
    const match1 = event.match(defeatsPattern);
    if (match1 && match1[1]) {
      return match1[1].trim();
    }
    
    const defeatedPattern = new RegExp(`([^\\s(]+)\\s*defeats\\s*${lowerWrestler}`, 'i');
    const match2 = event.match(defeatedPattern);
    if (match2 && match2[1]) {
      return match2[1].trim();
    }
    
    return 'Unknown';
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
            onClick={async () => {
              const wrestlerWithMatches = await loadWrestlerMatches(wrestler);
              setSelectedWrestler(wrestlerWithMatches);
            }}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-900">{wrestler.name}</h4>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {wrestler.promotion}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {wrestler.matchesLoaded ? (
                <>
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
                </>
              ) : (
                <div className="text-center py-2">
                  <div className="text-xs text-gray-500">Click to load matches</div>
                </div>
              )}
            </div>
            <div className="mt-3 text-xs text-blue-600 font-medium">
              {loadingMatches ? 'Loading...' : 'Click to view match history →'}
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
