import React from 'react';
import { stack } from '../data/stack';

const TechStack: React.FC = () => {
  // Double the list to create a seamless infinite loop
  const displayStack = [...stack, ...stack];

  return (
    <div className="w-full bg-dark-900 border-y border-white/5 py-10 overflow-hidden relative group">
      {/* Gradient Masks for Fade Effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-dark-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-dark-900 to-transparent pointer-events-none" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {displayStack.map((item, index) => (
          <div 
            key={`${item.name}-${index}`} 
            className="flex items-center gap-3 px-8 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-pointer"
          >
            {/* Fallback for broken images or just use text if prefer minimalist */}
            <img 
              src={item.logo} 
              alt={item.name} 
              className="h-8 w-auto object-contain max-w-[120px]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback Text */}
            <span className="hidden text-lg font-mono font-bold text-gray-400 hover:text-white">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
