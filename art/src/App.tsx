import { useState, useEffect, useRef, useCallback } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import GraffitiCanvas from "./components/GraffitiCanvas";
import AdvancedToolbar from "./components/AdvancedToolbar";
import EnvironmentSelector from "./components/EnvironmentSelector";
import ParticleSystem from "./components/ParticleSystem";
import SoundManager from "./components/SoundManager";
import { SprayCan } from "./components/SprayToolbar";
import { ToolType, Environment, ParticleConfig } from "./types";

const SPRAY_COLORS = [
  { hex: "#ff0000", name: "Crimson Red", metallic: false },
  { hex: "#0000ff", name: "Electric Blue", metallic: false },
  { hex: "#ffff00", name: "Neon Yellow", metallic: true },
  { hex: "#00ff00", name: "Lime Green", metallic: false },
  { hex: "#ff6600", name: "Flame Orange", metallic: true },
  { hex: "#9900ff", name: "Royal Purple", metallic: true },
  { hex: "#00ffff", name: "Cyan", metallic: false },
  { hex: "#ff00ff", name: "Hot Pink", metallic: false },
  { hex: "#000000", name: "Jet Black", metallic: false },
  { hex: "#ffffff", name: "Pure White", metallic: false },
  { hex: "#c0c0c0", name: "Silver", metallic: true },
  { hex: "#ffd700", name: "Gold", metallic: true },
];

const ENVIRONMENTS: Environment[] = [
  {
    id: "brick",
    name: "Urban Brick",
    background: "https://www.muraldecal.com/en/img/fomb001-png/folder/products-detalle-png/wall-murals-worn-white-brick-texture.png",
    atmosphere: "urban",
    lighting: "warm"
  },
  {
    id: "concrete",
    name: "Concrete Wall",
    background: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop",
    atmosphere: "industrial",
    lighting: "cool"
  },
  {
    id: "metal",
    name: "Metal Surface",
    background: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2000&auto=format&fit=crop",
    atmosphere: "futuristic",
    lighting: "blue"
  },
  {
    id: "wood",
    name: "Wooden Panel",
    background: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop",
    atmosphere: "rustic",
    lighting: "warm"
  }
];

export default function App() {
  const [selectedColor, setSelectedColor] = useState(SPRAY_COLORS[0]);
  const [selectedTool, setSelectedTool] = useState<ToolType>("spray");
  const [currentEnvironment, setCurrentEnvironment] = useState(ENVIRONMENTS[0]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [debug, setDebug] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [brushSize, setBrushSize] = useState(20);
  const [opacity, setOpacity] = useState(0.8);
  const [particleConfig, setParticleConfig] = useState<ParticleConfig>({
    count: 15,
    size: { min: 1, max: 4 },
    velocity: { min: 0.5, max: 2 },
    lifetime: { min: 1000, max: 3000 },
    gravity: 0.1,
    wind: 0.05
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [artworkHistory, setArtworkHistory] = useState<string[]>([]);
  const [currentArtwork, setCurrentArtwork] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const soundManagerRef = useRef<SoundManager>(null);

  // Track cursor movement across the whole app
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Save artwork to history
  const saveArtwork = useCallback(() => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL('image/png');
      setCurrentArtwork(dataURL);
      setArtworkHistory(prev => [...prev.slice(-9), dataURL]);
    }
  }, []);

  // Load artwork from history
  const loadArtwork = useCallback((index: number) => {
    if (artworkHistory[index] && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = artworkHistory[index];
    }
  }, [artworkHistory]);

  // Export artwork
  const exportArtwork = useCallback(() => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `graffiti-art-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    // Enhanced keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'd':
          setDebug(prev => !prev);
          break;
        case 'h':
          setShowUI(prev => !prev);
          break;
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            saveArtwork();
          }
          break;
        case 'e':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            exportArtwork();
          }
          break;
        case 'c':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            clearCanvas();
          }
          break;
        case 'm':
          setSoundEnabled(prev => !prev);
          break;
        case 'p':
          setShowParticles(prev => !prev);
          break;
        case 'escape':
          setShowUI(true);
          setDebug(false);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMouseMove, saveArtwork, exportArtwork, clearCanvas]);

  // Calculate spray origin and can position
  const sprayOrigin = { x: cursorPosition.x, y: cursorPosition.y };
  const sprayCanPosition = {
    left: cursorPosition.x,
    top: cursorPosition.y,
    transform: `translate(-50%, 0%) scale(${isDrawing ? 1.1 : 0.9}) rotate(${isDrawing ? -15 : -10}deg)`,
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Dynamic background with environment */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={currentEnvironment.background}
          alt={`${currentEnvironment.name} texture`}
          className="size-full object-cover transition-all duration-1000"
        />
        {/* Atmospheric overlay based on environment */}
        <div className={`absolute inset-0 transition-all duration-1000 ${
          currentEnvironment.atmosphere === 'urban' ? 'bg-orange-900/20' :
          currentEnvironment.atmosphere === 'industrial' ? 'bg-blue-900/30' :
          currentEnvironment.atmosphere === 'futuristic' ? 'bg-cyan-900/25' :
          'bg-amber-900/20'
        }`} />
      </div>

      {/* Particle system overlay */}
      {showParticles && (
        <ParticleSystem
          config={particleConfig}
          isActive={isDrawing}
          color={selectedColor.hex}
          position={sprayOrigin}
        />
      )}

      {/* Main canvas for drawing */}
      <GraffitiCanvas
        ref={canvasRef}
        selectedColor={selectedColor}
        selectedTool={selectedTool}
        cursorPosition={sprayOrigin}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        brushSize={brushSize}
        opacity={opacity}
        particleConfig={particleConfig}
        onSoundPlay={(sound) => soundManagerRef.current?.playSound(sound)}
      />

      {/* Advanced toolbar */}
      {showUI && (
        <AdvancedToolbar
          colors={SPRAY_COLORS}
          selectedColor={selectedColor}
          selectedTool={selectedTool}
          brushSize={brushSize}
          opacity={opacity}
          onSelectColor={setSelectedColor}
          onSelectTool={setSelectedTool}
          onBrushSizeChange={setBrushSize}
          onOpacityChange={setOpacity}
          onSave={saveArtwork}
          onExport={exportArtwork}
          onClear={clearCanvas}
          onUndo={() => loadArtwork(artworkHistory.length - 1)}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          showParticles={showParticles}
          onToggleParticles={() => setShowParticles(!showParticles)}
        />
      )}

      {/* Environment selector */}
      {showUI && (
        <EnvironmentSelector
          environments={ENVIRONMENTS}
          currentEnvironment={currentEnvironment}
          onSelectEnvironment={setCurrentEnvironment}
        />
      )}

      {/* Floating spray can cursor */}
      <div
        className="pointer-events-none fixed z-20 transition-all duration-200"
        style={{
          left: sprayCanPosition.left,
          top: sprayCanPosition.top,
          transform: sprayCanPosition.transform,
          opacity: isDrawing ? 1 : 0.8,
          filter: selectedColor.metallic ? 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' : 'none'
        }}
      >
        <SprayCan
          color={selectedColor.hex}
          isSelected={true}
          asCursor={true}
          showNozzleDot={debug}
          metallic={selectedColor.metallic}
        />
      </div>

      {/* Enhanced debug panel */}
      {debug && (
        <div className="fixed top-4 left-4 z-50 space-y-2">
          <div className="bg-black/90 backdrop-blur-sm rounded-lg p-3 text-xs text-white">
            <div className="font-bold text-green-400 mb-2">Debug Info</div>
            <div>Cursor: {cursorPosition.x.toFixed(0)}, {cursorPosition.y.toFixed(0)}</div>
            <div>Tool: {selectedTool}</div>
            <div>Brush: {brushSize}px</div>
            <div>Opacity: {(opacity * 100).toFixed(0)}%</div>
            <div>Environment: {currentEnvironment.name}</div>
            <div>Particles: {showParticles ? 'ON' : 'OFF'}</div>
            <div>Sound: {soundEnabled ? 'ON' : 'OFF'}</div>
          </div>
          
          {/* Quick controls */}
          <div className="bg-black/90 backdrop-blur-sm rounded-lg p-2 text-xs text-white">
            <div className="font-bold text-blue-400 mb-1">Shortcuts</div>
            <div>H - Toggle UI</div>
            <div>D - Debug</div>
            <div>M - Sound</div>
            <div>P - Particles</div>
            <div>Ctrl+S - Save</div>
            <div>Ctrl+E - Export</div>
          </div>
        </div>
      )}

      {/* Sound manager */}
      <SoundManager ref={soundManagerRef} enabled={soundEnabled} />
    </div>
  );
}
