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
  return (
    <div className="absolute top-4 right-4 z-30">
      <div className="bg-black/80 backdrop-blur-lg rounded-lg p-3">
        <div className="text-white/80 text-sm font-medium mb-2">Environment</div>
        <div className="flex gap-2">
          {environments.map((env) => (
            <button
              key={env.id}
              onClick={() => onSelectEnvironment(env)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                currentEnvironment.id === env.id
                  ? 'ring-2 ring-white scale-105'
                  : 'hover:scale-105'
              }`}
              title={env.name}
            >
              <img
                src={env.background}
                alt={env.name}
                className="w-full h-full object-cover"
              />
              {/* Atmosphere overlay */}
              <div className={`absolute inset-0 ${
                env.atmosphere === 'urban' ? 'bg-orange-900/30' :
                env.atmosphere === 'industrial' ? 'bg-blue-900/30' :
                env.atmosphere === 'futuristic' ? 'bg-cyan-900/30' :
                'bg-amber-900/30'
              }`} />
              {currentEnvironment.id === env.id && (
                <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black text-xs font-bold">
                    ✓
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
