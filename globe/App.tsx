import React, { useState, useCallback, useRef } from 'react';
import WorldMap, { WorldMapRef } from './components/WorldMap';
import { HUD } from './components/HUD';
import { Terminal } from './components/Terminal';
import { Bookmarks } from './components/Bookmarks';
import { Controls } from './components/Controls';
import { Timeline } from './components/Timeline';
import { ComparisonPanel } from './components/ComparisonPanel';
import { HelpModal } from './components/HelpModal';
import { HoverPreview } from './components/HoverPreview';
import { CyberpunkAnalysis, SystemStatus, ChatMessage, City, Arc, HistoryEntry } from './types';
import { analyzeLocation, chatWithSystem } from './services/geminiService';
import { useBookmarks } from './hooks/useBookmarks';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { createRippleEffect } from './utils/animations';
import { Star, History, Settings, GitCompare } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.IDLE);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CyberpunkAnalysis | null>(null);
  const globeRef = useRef<WorldMapRef>(null);
  const [countries, setCountries] = useState<Array<{ name: string; iso_a3: string }>>([]);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Cities and arcs for visualization
  const [cities] = useState<City[]>([
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, population: 37400000, country: 'Japan' },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025, population: 30290000, country: 'India' },
    { name: 'Shanghai', lat: 31.2304, lng: 121.4737, population: 27060000, country: 'China' },
    { name: 'São Paulo', lat: -23.5505, lng: -46.6333, population: 22040000, country: 'Brazil' },
    { name: 'Mexico City', lat: 19.4326, lng: -99.1332, population: 21780000, country: 'Mexico' },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357, population: 20900000, country: 'Egypt' },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, population: 20410000, country: 'India' },
    { name: 'Beijing', lat: 39.9042, lng: 116.4074, population: 20380000, country: 'China' },
    { name: 'Dhaka', lat: 23.8103, lng: 90.4125, population: 21000000, country: 'Bangladesh' },
    { name: 'Osaka', lat: 34.6937, lng: 135.5023, population: 19280000, country: 'Japan' },
    { name: 'New York', lat: 40.7128, lng: -74.0060, population: 18820000, country: 'USA' },
    { name: 'Karachi', lat: 24.8607, lng: 67.0011, population: 16000000, country: 'Pakistan' },
    { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, population: 15180000, country: 'Argentina' },
    { name: 'Istanbul', lat: 41.0082, lng: 28.9784, population: 15460000, country: 'Turkey' },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, population: 14850000, country: 'India' },
    { name: 'Lagos', lat: 6.5244, lng: 3.3792, population: 14370000, country: 'Nigeria' },
    { name: 'Manila', lat: 14.5995, lng: 120.9842, population: 13920000, country: 'Philippines' },
    { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, population: 13460000, country: 'Brazil' },
    { name: 'Guangzhou', lat: 23.1291, lng: 113.2644, population: 13300000, country: 'China' },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 12460000, country: 'USA' },
  ]);
  const [arcs, setArcs] = useState<Arc[]>([]);
  
  // UI State
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  // Bookmarks
  const { bookmarks, toggleBookmark, isBookmarked, exportBookmarks } = useBookmarks();
  
  // Comparison mode
  const [comparisonCountries, setComparisonCountries] = useState<Array<{ name: string; analysis: CyberpunkAnalysis | null }>>([]);
  
  // Globe controls
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [showCities, setShowCities] = useState(true);
  const [showArcs, setShowArcs] = useState(true);
  
  // Hover preview
  const [hoverCountry, setHoverCountry] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  const handleLocationSelect = useCallback(async (loc: { name: string, lat: number, lng: number }, isShiftClick = false) => {
    // Create ripple effect at click position
    if (typeof window !== 'undefined') {
      createRippleEffect(window.innerWidth / 2, window.innerHeight / 2, '#00f3ff');
    }
    
    // Add to history
    setHistory(prev => [...prev, { countryName: loc.name, timestamp: Date.now() }]);
    
    // If shift-click, add to comparison
    if (isShiftClick) {
      if (!comparisonCountries.find(c => c.name === loc.name)) {
        setComparisonCountries(prev => [...prev, { name: loc.name, analysis: null }]);
        setShowComparison(true);
        
        // Load analysis for comparison
        const data = await analyzeLocation(loc.name);
        setComparisonCountries(prev => 
          prev.map(c => c.name === loc.name ? { ...c, analysis: data } : c)
        );
      }
      return;
    }
    
    setSelectedLocation(loc.name);
    setStatus(SystemStatus.SCANNING);
    setAnalysis(null);

    try {
      setTimeout(async () => {
        setStatus(SystemStatus.ANALYZING);
        const data = await analyzeLocation(loc.name);
        setAnalysis(data);
        setStatus(SystemStatus.LOCKED);
      }, 1500);
    } catch (e) {
      setStatus(SystemStatus.ERROR);
    }
  }, [comparisonCountries]);

  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsChatLoading(true);

    try {
      // Construct history for API
      const history = messages.map(m => ({
        role: m.sender === 'USER' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithSystem(history, text);
      
      const newSystemMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'SYSTEM',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newSystemMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCloseAnalysis = () => {
    setAnalysis(null);
    setSelectedLocation(null);
    setStatus(SystemStatus.IDLE);
  };

  const handleSearchSelect = useCallback((countryName: string) => {
    // Get country list and find coordinates
    if (globeRef.current) {
      const countryList = globeRef.current.getCountries();
      setCountries(countryList);
      
      // For now, just trigger the location select
      handleLocationSelect({ name: countryName, lat: 0, lng: 0 });
      
      // Fly to approximate location (we'd need a proper geocoding service for exact coords)
      // For demo, we'll use some basic lat/lng estimates
      const coords = getApproximateCoords(countryName);
      if (coords) {
        globeRef.current.flyToCountry(coords.lat, coords.lng);
      }
    }
  }, []);

  const getApproximateCoords = (countryName: string): { lat: number; lng: number } | null => {
    // Basic coordinate mapping for major countries
    const coordMap: Record<string, { lat: number; lng: number }> = {
      'United States of America': { lat: 37.0902, lng: -95.7129 },
      'China': { lat: 35.8617, lng: 104.1954 },
      'India': { lat: 20.5937, lng: 78.9629 },
      'Brazil': { lat: -14.2350, lng: -51.9253 },
      'Russia': { lat: 61.5240, lng: 105.3188 },
      'Japan': { lat: 36.2048, lng: 138.2529 },
      'Germany': { lat: 51.1657, lng: 10.4515 },
      'United Kingdom': { lat: 55.3781, lng: -3.4360 },
      'France': { lat: 46.2276, lng: 2.2137 },
      'Italy': { lat: 41.8719, lng: 12.5674 },
      'Canada': { lat: 56.1304, lng: -106.3468 },
      'Australia': { lat: -25.2744, lng: 133.7751 },
      'Mexico': { lat: 23.6345, lng: -102.5528 },
      'South Africa': { lat: -30.5595, lng: 22.9375 },
      'Egypt': { lat: 26.8206, lng: 30.8025 },
    };
    return coordMap[countryName] || { lat: 0, lng: 0 };
  };

  const handleCityClick = useCallback((city: City) => {
    handleLocationSelect({ name: city.name, lat: city.lat, lng: city.lng });
  }, []);

  // Update countries list when globe loads
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (globeRef.current) {
        setCountries(globeRef.current.getCountries());
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      searchInput?.focus();
    },
    onClearSelection: () => {
      setAnalysis(null);
      setSelectedLocation(null);
      setStatus(SystemStatus.IDLE);
      setShowHelp(false);
      setShowComparison(false);
    },
    onToggleRotation: () => setAutoRotate(prev => !prev),
    onHelp: () => setShowHelp(prev => !prev),
  });

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden selection:bg-cyber-pink selection:text-white">
      
      {/* 3D Layer */}
      <WorldMap 
        ref={globeRef}
        onLocationSelect={handleLocationSelect}
        cities={showCities ? cities : []}
        arcs={showArcs ? arcs : []}
        onCityClick={handleCityClick}
      />

      {/* UI Layer */}
      <HUD 
        status={status}
        analysis={analysis}
        selectedLocation={selectedLocation}
        onCloseAnalysis={handleCloseAnalysis}
        countries={countries}
        onSearchSelect={handleSearchSelect}
      />

      {/* Interactive Terminal */}
      <Terminal 
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isChatLoading}
      />
      
      {/* Side Panel Buttons */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-auto">
        <button
          onClick={() => setShowBookmarks(!showBookmarks)}
          className={`p-3 border transition-all ${
            showBookmarks
              ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]'
              : 'bg-cyber-black/80 border-cyber-cyan/50 text-cyber-cyan/70 hover:border-cyber-cyan hover:text-cyber-cyan'
          }`}
          title="Bookmarks"
        >
          <Star size={20} fill={isBookmarked(selectedLocation || '') ? 'currentColor' : 'none'} />
        </button>
        
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className={`p-3 border transition-all ${
            showTimeline
              ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]'
              : 'bg-cyber-black/80 border-cyber-cyan/50 text-cyber-cyan/70 hover:border-cyber-cyan hover:text-cyber-cyan'
          }`}
          title="History"
        >
          <History size={20} />
        </button>
        
        <button
          onClick={() => setShowControls(!showControls)}
          className={`p-3 border transition-all ${
            showControls
              ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]'
              : 'bg-cyber-black/80 border-cyber-cyan/50 text-cyber-cyan/70 hover:border-cyber-cyan hover:text-cyber-cyan'
          }`}
          title="Controls"
        >
          <Settings size={20} />
        </button>
        
        <button
          onClick={() => setShowComparison(!showComparison)}
          className={`p-3 border transition-all ${
            showComparison
              ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]'
              : 'bg-cyber-black/80 border-cyber-cyan/50 text-cyber-cyan/70 hover:border-cyber-cyan hover:text-cyber-cyan'
          }`}
          title="Compare"
        >
          <GitCompare size={20} />
        </button>
      </div>
      
      {/* Side Panels */}
      {showBookmarks && (
        <div className="fixed right-24 top-1/2 -translate-y-1/2 z-20 w-80 pointer-events-auto animate-[slide-in-right_0.3s_ease-out]">
          <Bookmarks
            bookmarks={bookmarks}
            onSelect={handleSearchSelect}
            onRemove={(name) => toggleBookmark({ countryName: name, timestamp: Date.now() })}
            onExport={exportBookmarks}
          />
        </div>
      )}
      
      {showTimeline && (
        <div className="fixed right-24 top-1/2 -translate-y-1/2 z-20 w-80 pointer-events-auto animate-[slide-in-right_0.3s_ease-out]">
          <Timeline
            history={history}
            onSelect={handleSearchSelect}
            onClear={() => setHistory([])}
          />
        </div>
      )}
      
      {showControls && (
        <div className="fixed right-24 top-1/2 -translate-y-1/2 z-20 pointer-events-auto animate-[slide-in-right_0.3s_ease-out]">
          <Controls
            autoRotate={autoRotate}
            rotationSpeed={rotationSpeed}
            showCities={showCities}
            showArcs={showArcs}
            onToggleRotation={() => setAutoRotate(!autoRotate)}
            onSpeedChange={setRotationSpeed}
            onToggleCities={() => setShowCities(!showCities)}
            onToggleArcs={() => setShowArcs(!showArcs)}
          />
        </div>
      )}
      
      {/* Modals */}
      {showComparison && comparisonCountries.length > 0 && (
        <ComparisonPanel
          countries={comparisonCountries}
          onClose={() => setShowComparison(false)}
          onRemoveCountry={(name) => setComparisonCountries(prev => prev.filter(c => c.name !== name))}
        />
      )}
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      
      {/* Hover Preview */}
      <HoverPreview countryName={hoverCountry} position={hoverPosition} />
      
      {/* Bookmark current location button */}
      {selectedLocation && analysis && (
        <button
          onClick={() => toggleBookmark({ countryName: selectedLocation, timestamp: Date.now(), analysis })}
          className={`fixed top-32 right-6 z-20 p-2 border transition-all pointer-events-auto ${
            isBookmarked(selectedLocation)
              ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink'
              : 'bg-cyber-black/80 border-cyber-cyan/50 text-cyber-cyan hover:border-cyber-cyan'
          }`}
          title={isBookmarked(selectedLocation) ? 'Remove bookmark' : 'Bookmark location'}
        >
          <Star size={16} fill={isBookmarked(selectedLocation) ? 'currentColor' : 'none'} />
        </button>
      )}
      
      {/* Vignette & Scanlines Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-30 bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      <div className="pointer-events-none fixed inset-0 z-40 bg-gradient-radial from-transparent to-black opacity-80" />
    </div>
  );
};

export default App;