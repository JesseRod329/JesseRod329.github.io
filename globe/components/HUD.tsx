import React from 'react';
import { CountryData, SystemStatus } from '../types';
import { GlitchText } from './GlitchText';
import { SearchBar } from './SearchBar';
import { Activity, MapPin, DollarSign, Users, Building2, Globe, Crosshair } from 'lucide-react';

interface HUDProps {
  status: SystemStatus;
  countryData: CountryData | null;
  selectedLocation: string | null;
  onCloseAnalysis: () => void;
  countries: Array<{ name: string; iso_a3: string }>;
  onSearchSelect: (countryName: string) => void;
}

export const HUD: React.FC<HUDProps> = ({ status, countryData, selectedLocation, onCloseAnalysis, countries, onSearchSelect }) => {
  
  const formatGDP = (gdp: number): string => {
    if (gdp >= 1e12) return `$${(gdp / 1e12).toFixed(2)}T`;
    if (gdp >= 1e9) return `$${(gdp / 1e9).toFixed(2)}B`;
    if (gdp >= 1e6) return `$${(gdp / 1e6).toFixed(2)}M`;
    return `$${gdp.toLocaleString()}`;
  };

  const formatPopulation = (pop: number): string => {
    if (pop >= 1e9) return `${(pop / 1e9).toFixed(2)}B`;
    if (pop >= 1e6) return `${(pop / 1e6).toFixed(2)}M`;
    if (pop >= 1e3) return `${(pop / 1e3).toFixed(2)}K`;
    return pop.toLocaleString();
  };

  const formatGDPPerCapita = (gdp: number): string => {
    return `$${Math.round(gdp).toLocaleString()}`;
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

      {/* Country Data Panel (Center-Right or Overlay) */}
      {countryData && selectedLocation && (
        <div className="pointer-events-auto absolute top-24 right-6 w-96 bg-cyber-black/90 border border-cyber-cyan backdrop-blur-md p-6 clip-path-corner transition-all duration-300 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
           <button 
             onClick={onCloseAnalysis}
             className="absolute top-2 right-2 text-cyber-cyan hover:text-white"
           >
             [X]
           </button>
           
           <div className="flex items-center gap-2 mb-4 border-b border-cyber-cyan/30 pb-2">
             <MapPin className="text-cyber-pink" />
             <h2 className="text-2xl font-display text-white">{countryData.location}</h2>
           </div>

           <div className="space-y-4">
             <div className="border border-cyber-cyan p-2 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <DollarSign size={18} className="text-cyber-cyan" />
                 <span className="text-cyber-cyan">GDP</span>
               </div>
               <span className="font-bold text-white">{formatGDP(countryData.gdp)}</span>
             </div>

             <div className="flex items-center gap-4">
               <div className="flex-1">
                 <div className="flex justify-between text-xs mb-1 text-gray-300">
                    <span>GDP PER CAPITA</span>
                    <span>{formatGDPPerCapita(countryData.gdpPerCapita)}</span>
                 </div>
                 <div className="h-2 bg-gray-800 w-full overflow-hidden">
                   <div 
                     className="h-full bg-cyber-cyan shadow-[0_0_10px_#00f3ff]" 
                     style={{ width: `${Math.min(100, (countryData.gdpPerCapita / 80000) * 100)}%` }}
                   />
                 </div>
               </div>
             </div>

             <div className="border border-cyber-pink/50 p-2 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <Users size={18} className="text-cyber-pink" />
                 <span className="text-cyber-pink">POPULATION</span>
               </div>
               <span className="font-bold text-white">{formatPopulation(countryData.population)}</span>
             </div>

             <div>
               <h3 className="text-xs text-cyber-pink mb-1 flex items-center gap-1">
                 <Building2 size={12} /> CAPITAL CITY
               </h3>
               <p className="text-white text-lg leading-tight">{countryData.capital}</p>
             </div>

             <div>
               <h3 className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                 <Globe size={12} /> REGION
               </h3>
               <p className="text-white text-sm">{countryData.region}</p>
             </div>

             <div>
               <h3 className="text-xs text-gray-400 mb-1">CURRENCY</h3>
               <p className="text-sm text-gray-300 normal-case font-body leading-relaxed border-l-2 border-cyber-pink pl-2">
                 {countryData.currency}
               </p>
             </div>

             <div>
               <h3 className="text-xs text-gray-400 mb-1">DESCRIPTION</h3>
               <p className="text-sm text-gray-300 normal-case font-body leading-relaxed border-l-2 border-cyber-pink pl-2">
                 {countryData.description}
               </p>
             </div>

             <div>
               <h3 className="text-xs text-gray-400 mb-1">MAJOR EXPORTS</h3>
               <div className="flex flex-wrap gap-2">
                 {countryData.tradeExports.map((item, i) => (
                   <span key={i} className="text-xs bg-cyber-cyan/10 border border-cyber-cyan/50 px-2 py-0.5 text-cyber-cyan">
                     {item}
                   </span>
                 ))}
               </div>
             </div>

             <div>
               <h3 className="text-xs text-gray-400 mb-1">TRADING PARTNERS</h3>
               <div className="flex flex-wrap gap-2">
                 {countryData.tradePartners.map((partner, i) => (
                   <span key={i} className="text-xs bg-cyber-pink/10 border border-cyber-pink/50 px-2 py-0.5 text-cyber-pink">
                     {partner}
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