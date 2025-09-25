import { useState } from 'react';
import { Environment } from '../types';

interface EnvironmentSelectorProps {
  environments: Environment[];
  currentEnvironment: Environment;
  onSelectEnvironment: (env: Environment) => void;
}

export default function EnvironmentSelector({
  environments,
  currentEnvironment,
  onSelectEnvironment,
}: EnvironmentSelectorProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="absolute top-4 right-4 z-30">
      <div className="bg-black/80 backdrop-blur-lg rounded-lg border border-white/20 overflow-hidden transition-all duration-300">
        {/* Header - always visible */}
        <div 
          className="p-3 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30">
                <img 
                  src={currentEnvironment.background} 
                  alt={currentEnvironment.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">{currentEnvironment.name}</h3>
                <p className="text-white/60 text-xs">{currentEnvironment.description}</p>
              </div>
            </div>
            <div className={`text-white/60 transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
              ▼
            </div>
          </div>
        </div>

        {/* Collapsible content */}
        <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'}`}>
          <div className="p-3 pt-0 border-t border-white/10">
            <div className="grid grid-cols-1 gap-2">
              {environments.map((env) => (
                <button
                  key={env.id}
                  onClick={() => {
                    onSelectEnvironment(env);
                    setIsCollapsed(true); // Auto-collapse after selection
                  }}
                  className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                    currentEnvironment.id === env.id
                      ? 'border-indigo-400 bg-indigo-500/20'
                      : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20">
                      <img 
                        src={env.background} 
                        alt={env.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-white text-xs font-medium">{env.name}</div>
                      <div className="text-white/60 text-xs">{env.description}</div>
                    </div>
                    {currentEnvironment.id === env.id && (
                      <div className="w-5 h-5 bg-indigo-400 rounded-full flex items-center justify-center text-xs text-white">
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}