import React, { useState, useEffect } from 'react';
import { MapPin, Users, TrendingUp } from 'lucide-react';

interface HoverPreviewProps {
  countryName: string | null;
  position: { x: number; y: number } | null;
}

export const HoverPreview: React.FC<HoverPreviewProps> = ({ countryName, position }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (countryName && position) {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => {
        clearTimeout(timer);
        setIsVisible(false);
      };
    } else {
      setIsVisible(false);
    }
  }, [countryName, position]);

  if (!countryName || !position || !isVisible) return null;

  // Get some basic info (in a real app, this would come from a data source)
  const getCountryInfo = (name: string) => {
    // Placeholder data
    return {
      population: '~' + (Math.floor(Math.random() * 200) + 10) + 'M',
      gdp: '$' + (Math.floor(Math.random() * 5000) + 100) + 'B',
      capital: 'Loading...',
    };
  };

  const info = getCountryInfo(countryName);

  return (
    <div
      className="fixed z-50 pointer-events-none animate-[fade-in_0.2s_ease-out]"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y - 20}px`,
      }}
    >
      <div className="bg-cyber-black/95 border border-cyber-cyan/70 backdrop-blur-md p-3 min-w-[200px] shadow-[0_0_20px_rgba(0,243,255,0.3)]">
        <div className="flex items-center gap-2 mb-2 border-b border-cyber-cyan/30 pb-2">
          <MapPin className="text-cyber-pink" size={16} />
          <h4 className="text-white font-mono text-sm font-bold">{countryName}</h4>
        </div>
        
        <div className="space-y-1 text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-300">
            <Users size={12} className="text-cyber-cyan" />
            <span>POP: {info.population}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <TrendingUp size={12} className="text-cyber-cyan" />
            <span>GDP: {info.gdp}</span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-cyber-cyan/30">
          <p className="text-cyber-cyan/70 text-xs">Click for full analysis</p>
        </div>
      </div>
    </div>
  );
};

