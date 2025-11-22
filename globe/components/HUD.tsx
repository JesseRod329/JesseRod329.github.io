import React from 'react';
import { CyberpunkAnalysis, SystemStatus } from '../types';
import { GlitchText } from './GlitchText';
import { SearchBar } from './SearchBar';
import { ShieldAlert, Activity, Zap, Radio, MapPin, Hexagon, Crosshair } from 'lucide-react';

interface HUDProps {
  status: SystemStatus;
  analysis: CyberpunkAnalysis | null;
  selectedLocation: string | null;
  onCloseAnalysis: () => void;
  countries: Array<{ name: string; iso_a3: string }>;
  onSearchSelect: (countryName: string) => void;
}

export const HUD: React.FC<HUDProps> = ({ status, analysis, selectedLocation, onCloseAnalysis, countries, onSearchSelect }) => {
  
  const getThreatColor = (level: string) => {
    switch(level) {
      case 'LOW': return 'text-green-400 border-green-400';
      case 'MODERATE': return 'text-yellow-400 border-yellow-400';
      case 'CRITICAL': return 'text-orange-500 border-orange-500';
      case 'EXTREME': return 'text-red-600 border-red-600 shadow-[0_0_15px_red]';
      default: return 'text-cyber-cyan border-cyber-cyan';
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-6 text-cyber-cyan font-mono uppercase tracking-wider">
      
      {/* Header Bar */}
      <div className="flex flex-col gap-4 pointer-events-auto">
        <div className="flex justify-between items-start">
          <div className="border-l-4 border-cyber-cyan pl-4 bg-cyber-glass backdrop-blur-sm p-2">
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              <GlitchText text="NEON NEXUS" />
            </h1>
            <div className="flex items-center gap-2 text-xs">
              <Activity size={14} className="animate-pulse" />
              <span>SYSTEM ONLINE // V.2077.4</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="bg-cyber-black border border-cyber-pink px-4 py-1 text-cyber-pink font-bold text-sm animate-pulse shadow-[0_0_10px_#ff00ff]">
              {status}
            </div>
            <div className="text-xs text-gray-400">
              LAT: {Math.random().toFixed(4)} // LNG: {Math.random().toFixed(4)}
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="flex justify-center">
          <SearchBar countries={countries} onSelectCountry={onSearchSelect} />
        </div>
      </div>

      {/* Analysis Panel (Center-Right or Overlay) */}
      {analysis && selectedLocation && (
        <div className="pointer-events-auto absolute top-24 right-6 w-96 bg-cyber-black/90 border border-cyber-cyan backdrop-blur-md p-6 clip-path-corner transition-all duration-300 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
           <button 
             onClick={onCloseAnalysis}
             className="absolute top-2 right-2 text-cyber-cyan hover:text-white"
           >
             [X]
           </button>
           
           <div className="flex items-center gap-2 mb-4 border-b border-cyber-cyan/30 pb-2">
             <MapPin className="text-cyber-pink" />
             <h2 className="text-2xl font-display text-white">{analysis.location}</h2>
           </div>

           <div className="space-y-4">
             <div className={`border p-2 flex justify-between items-center ${getThreatColor(analysis.threatLevel)}`}>
               <div className="flex items-center gap-2">
                 <ShieldAlert size={18} />
                 <span>THREAT LEVEL</span>
               </div>
               <span className="font-bold animate-pulse">{analysis.threatLevel}</span>
             </div>

             <div className="flex items-center gap-4">
               <div className="flex-1">
                 <div className="flex justify-between text-xs mb-1 text-gray-300">
                    <span>TECH INDEX</span>
                    <span>{analysis.techIndex}%</span>
                 </div>
                 <div className="h-2 bg-gray-800 w-full overflow-hidden">
                   <div 
                     className="h-full bg-cyber-cyan shadow-[0_0_10px_#00f3ff]" 
                     style={{ width: `${analysis.techIndex}%` }}
                   />
                 </div>
               </div>
             </div>

             <div>
               <h3 className="text-xs text-cyber-pink mb-1 flex items-center gap-1">
                 <Hexagon size={12} /> CONTROLLING FACTION
               </h3>
               <p className="text-white text-lg leading-tight">{analysis.factionControl}</p>
             </div>

             <div>
               <h3 className="text-xs text-gray-400 mb-1">INTEL SUMMARY</h3>
               <p className="text-sm text-gray-300 normal-case font-body leading-relaxed border-l-2 border-cyber-pink pl-2">
                 {analysis.description}
               </p>
             </div>

             <div>
               <h3 className="text-xs text-gray-400 mb-1">KEY EXPORTS</h3>
               <div className="flex flex-wrap gap-2">
                 {analysis.notableExports.map((item, i) => (
                   <span key={i} className="text-xs bg-cyber-cyan/10 border border-cyber-cyan/50 px-2 py-0.5 text-cyber-cyan">
                     {item}
                   </span>
                 ))}
               </div>
             </div>
           </div>
        </div>
      )}

      {/* Footer / Decorative */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="w-64 h-32 bg-gradient-to-t from-cyber-cyan/20 to-transparent border-b-2 border-cyber-cyan p-2 relative">
          <div className="absolute bottom-1 left-1 text-[10px] text-cyber-cyan/70">
             // GRID_MATRIX_LOADED <br/>
             // SECTOR_SCAN_COMPLETE <br/>
             // WAITING_FOR_INPUT_
          </div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border border-cyber-pink rounded-full flex items-center justify-center animate-spin-slow">
             <Crosshair size={16} className="text-cyber-pink" />
          </div>
        </div>
      </div>
      
      <style>{`
        .clip-path-corner {
          clip-path: polygon(
            0 0, 
            100% 0, 
            100% 85%, 
            92% 100%, 
            0 100%
          );
        }
      `}</style>
    </div>
  );
};