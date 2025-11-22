import React from 'react';
import { HistoryEntry } from '../types';
import { Clock, ChevronRight } from 'lucide-react';

interface TimelineProps {
  history: HistoryEntry[];
  onSelect: (countryName: string) => void;
  onClear: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="bg-cyber-black/90 border border-cyber-cyan/50 backdrop-blur-md p-4 text-center">
        <Clock className="mx-auto text-cyber-cyan/30 mb-2" size={24} />
        <p className="text-cyber-cyan/50 text-sm font-mono">NO HISTORY</p>
      </div>
    );
  }

  return (
    <div className="bg-cyber-black/90 border border-cyber-cyan/50 backdrop-blur-md p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-cyber-cyan font-mono text-sm font-bold flex items-center gap-2">
          <Clock size={16} />
          HISTORY ({history.length})
        </h3>
        <button
          onClick={onClear}
          className="text-cyber-pink/70 hover:text-cyber-pink text-xs font-mono transition-colors"
        >
          CLEAR
        </button>
      </div>

      <div className="space-y-1">
        {history.slice().reverse().map((entry, index) => (
          <button
            key={`${entry.countryName}-${entry.timestamp}`}
            onClick={() => onSelect(entry.countryName)}
            className="w-full text-left bg-cyber-black/50 border border-cyber-cyan/30 p-2 hover:border-cyber-cyan transition-colors group flex items-center justify-between"
          >
            <div className="flex-1">
              <p className="text-white font-mono text-sm">{entry.countryName}</p>
              <p className="text-gray-500 text-xs">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <ChevronRight className="text-cyber-cyan/50 group-hover:text-cyber-cyan transition-colors" size={16} />
          </button>
        ))}
      </div>
    </div>
  );
};

