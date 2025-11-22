import React from 'react';
import { CyberpunkAnalysis } from '../types';
import { GitCompare, X } from 'lucide-react';

interface ComparisonPanelProps {
  countries: Array<{ name: string; analysis: CyberpunkAnalysis | null }>;
  onClose: () => void;
  onRemoveCountry: (countryName: string) => void;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ countries, onClose, onRemoveCountry }) => {
  const getThreatColor = (level: string) => {
    switch(level) {
      case 'LOW': return 'text-green-400';
      case 'MODERATE': return 'text-yellow-400';
      case 'CRITICAL': return 'text-orange-500';
      case 'EXTREME': return 'text-red-600';
      default: return 'text-cyber-cyan';
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-cyber-black border-2 border-cyber-cyan w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-cyber-cyan/10 border-b border-cyber-cyan/30 p-4 flex justify-between items-center sticky top-0">
          <h2 className="text-cyber-cyan font-mono text-lg font-bold flex items-center gap-2">
            <GitCompare size={20} />
            COUNTRY COMPARISON
          </h2>
          <button
            onClick={onClose}
            className="text-cyber-cyan hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((country) => (
              <div
                key={country.name}
                className="bg-cyber-black/50 border border-cyber-cyan/50 p-4 relative"
              >
                <button
                  onClick={() => onRemoveCountry(country.name)}
                  className="absolute top-2 right-2 text-cyber-pink/50 hover:text-cyber-pink"
                >
                  <X size={16} />
                </button>

                <h3 className="text-white font-mono text-lg mb-4">{country.name}</h3>

                {country.analysis ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">THREAT LEVEL</p>
                      <p className={`font-bold ${getThreatColor(country.analysis.threatLevel)}`}>
                        {country.analysis.threatLevel}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs mb-1">TECH INDEX</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-800">
                          <div
                            className="h-full bg-cyber-cyan"
                            style={{ width: `${country.analysis.techIndex}%` }}
                          />
                        </div>
                        <span className="text-cyber-cyan text-sm">{country.analysis.techIndex}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs mb-1">FACTION</p>
                      <p className="text-cyber-pink text-sm">{country.analysis.factionControl}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs mb-1">EXPORTS</p>
                      <div className="flex flex-wrap gap-1">
                        {country.analysis.notableExports.slice(0, 3).map((exp, i) => (
                          <span
                            key={i}
                            className="text-xs bg-cyber-cyan/10 border border-cyber-cyan/50 px-2 py-0.5 text-cyber-cyan"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm italic">Loading analysis...</div>
                )}
              </div>
            ))}
          </div>

          {countries.length < 2 && (
            <div className="text-center text-gray-500 text-sm mt-4 font-mono">
              Hold SHIFT and click countries to add to comparison
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

