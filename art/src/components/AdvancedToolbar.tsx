import { useState } from 'react';
import { Color, ToolType } from '../types';
import { SprayCan } from './SprayToolbar';

interface AdvancedToolbarProps {
  colors: Color[];
  selectedColor: Color;
  selectedTool: ToolType;
  brushSize: number;
  opacity: number;
  onSelectColor: (color: Color) => void;
  onSelectTool: (tool: ToolType) => void;
  onBrushSizeChange: (size: number) => void;
  onOpacityChange: (opacity: number) => void;
  onSave: () => void;
  onExport: () => void;
  onClear: () => void;
  onUndo: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  showParticles: boolean;
  onToggleParticles: () => void;
}

const TOOLS = [
  { id: 'spray', name: 'Spray', icon: '🎨', description: 'Spray paint effect' },
  { id: 'brush', name: 'Brush', icon: '🖌️', description: 'Smooth brush strokes' },
  { id: 'eraser', name: 'Eraser', icon: '🧽', description: 'Remove paint' },
  { id: 'fill', name: 'Fill', icon: '🪣', description: 'Fill areas' },
  { id: 'stencil', name: 'Stencil', icon: '📐', description: 'Predefined shapes' },
  { id: 'pattern', name: 'Pattern', icon: '🔷', description: 'Repeating patterns' },
];

export default function AdvancedToolbar({
  colors,
  selectedColor,
  selectedTool,
  brushSize,
  opacity,
  onSelectColor,
  onSelectTool,
  onBrushSizeChange,
  onOpacityChange,
  onSave,
  onExport,
  onClear,
  onUndo,
  soundEnabled,
  onToggleSound,
  showParticles,
  onToggleParticles,
}: AdvancedToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30">
      {/* Main toolbar */}
      <div className="bg-gradient-to-t from-black/90 via-black/80 to-transparent backdrop-blur-lg p-4">
        <div className="max-w-7xl mx-auto">
          {/* Top row - Tools and main controls */}
          <div className="flex items-center justify-between mb-4">
            {/* Tools */}
            <div className="flex items-center gap-2">
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id as ToolType)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    selectedTool === tool.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  title={tool.description}
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span className="text-sm font-medium">{tool.name}</span>
                </button>
              ))}
            </div>

            {/* Main controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={onUndo}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Undo (Ctrl+Z)"
              >
                ↶
              </button>
              <button
                onClick={onSave}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Save (Ctrl+S)"
              >
                💾
              </button>
              <button
                onClick={onExport}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Export (Ctrl+E)"
              >
                📤
              </button>
              <button
                onClick={onClear}
                className="p-2 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                title="Clear (Ctrl+C)"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Bottom row - Colors and settings */}
          <div className="flex items-center justify-between">
            {/* Color palette */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => onSelectColor(color)}
                    className={`relative w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                      selectedColor.hex === color.hex
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {color.metallic && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/30 to-transparent" />
                    )}
                    {selectedColor.hex === color.hex && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Custom color picker */}
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-12 h-12 rounded-lg border-2 border-dashed border-white/50 flex items-center justify-center text-white/70 hover:border-white/80 transition-colors"
                title="Custom Color"
              >
                +
              </button>
            </div>

            {/* Brush settings */}
            <div className="flex items-center gap-4">
              {/* Brush size */}
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">Size:</span>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={brushSize}
                  onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                  className="w-20 accent-indigo-500"
                />
                <span className="text-white text-sm w-8">{brushSize}px</span>
              </div>

              {/* Opacity */}
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">Opacity:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => onOpacityChange(Number(e.target.value))}
                  className="w-20 accent-indigo-500"
                />
                <span className="text-white text-sm w-8">{Math.round(opacity * 100)}%</span>
              </div>

              {/* Settings toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* Settings panel */}
          {showSettings && (
            <div className="mt-4 p-4 bg-black/50 rounded-lg backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Sound Effects</span>
                  <button
                    onClick={onToggleSound}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      soundEnabled
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {soundEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Particles</span>
                  <button
                    onClick={onToggleParticles}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      showParticles
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {showParticles ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Custom color picker */}
          {showColorPicker && (
            <div className="mt-4 p-4 bg-black/50 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="text-white/80 text-sm">Custom Color:</span>
                <input
                  type="color"
                  value={selectedColor.hex}
                  onChange={(e) => onSelectColor({
                    hex: e.target.value,
                    name: 'Custom',
                    metallic: false
                  })}
                  className="w-12 h-12 rounded border-2 border-white/30"
                />
                <label className="flex items-center gap-2 text-white/80 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedColor.metallic}
                    onChange={(e) => onSelectColor({
                      ...selectedColor,
                      metallic: e.target.checked
                    })}
                  />
                  Metallic
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
