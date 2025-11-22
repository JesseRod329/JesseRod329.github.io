import React from 'react';
import { Settings, RotateCw, Pause, Play, Layers } from 'lucide-react';

interface ControlsProps {
  autoRotate: boolean;
  rotationSpeed: number;
  showCities: boolean;
  showArcs: boolean;
  onToggleRotation: () => void;
  onSpeedChange: (speed: number) => void;
  onToggleCities: () => void;
  onToggleArcs: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  autoRotate,
  rotationSpeed,
  showCities,
  showArcs,
  onToggleRotation,
  onSpeedChange,
  onToggleCities,
  onToggleArcs,
}) => {
  return (
    <div className="bg-cyber-black/90 border border-cyber-cyan/50 backdrop-blur-md p-4 w-64">
      <h3 className="text-cyber-cyan font-mono text-sm font-bold flex items-center gap-2 mb-4">
        <Settings size={16} />
        GLOBE CONTROLS
      </h3>

      <div className="space-y-4">
        {/* Auto Rotation */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-xs font-mono">AUTO ROTATE</span>
            <button
              onClick={onToggleRotation}
              className={`p-1 border transition-colors ${
                autoRotate
                  ? 'border-cyber-cyan text-cyber-cyan'
                  : 'border-gray-600 text-gray-600'
              }`}
            >
              {autoRotate ? <RotateCw size={14} /> : <Pause size={14} />}
            </button>
          </div>

          {/* Speed Slider */}
          {autoRotate && (
            <div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00f3ff 0%, #00f3ff ${(rotationSpeed / 2) * 100}%, #374151 ${(rotationSpeed / 2) * 100}%, #374151 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>SLOW</span>
                <span>FAST</span>
              </div>
            </div>
          )}
        </div>

        {/* Layer Toggles */}
        <div className="border-t border-cyber-cyan/30 pt-4">
          <p className="text-gray-400 text-xs font-mono mb-2 flex items-center gap-1">
            <Layers size={12} />
            LAYERS
          </p>

          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-gray-300 text-xs font-mono group-hover:text-white transition-colors">
                CITY MARKERS
              </span>
              <input
                type="checkbox"
                checked={showCities}
                onChange={onToggleCities}
                className="w-4 h-4 accent-cyber-cyan"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-gray-300 text-xs font-mono group-hover:text-white transition-colors">
                CONNECTIONS
              </span>
              <input
                type="checkbox"
                checked={showArcs}
                onChange={onToggleArcs}
                className="w-4 h-4 accent-cyber-cyan"
              />
            </label>
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="border-t border-cyber-cyan/30 pt-4">
          <p className="text-gray-500 text-xs font-mono">
            Press <span className="text-cyber-pink">?</span> for shortcuts
          </p>
        </div>
      </div>
    </div>
  );
};

