import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as d3 from 'd3';

interface PoliticianGlobeProps {
  onStateSelect: (stateName: string, data: any) => void;
}

// US States GeoJSON
const GEOJSON_URL = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

const PoliticianGlobe: React.FC<PoliticianGlobeProps> = ({ onStateSelect }) => {
  const globeEl = useRef<GlobeMethods>();
  const [states, setStates] = useState({ features: [] });
  const [hoverState, setHoverState] = useState<any | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const updateDimensions = () => {
        const container = document.getElementById('globe-container');
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: container.clientHeight
          });
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);

      fetch(GEOJSON_URL)
        .then(res => res.json())
        .then(setStates)
        .catch(err => console.error("Failed to load US GeoJSON", err));

      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  useEffect(() => {
    // Center on US
    if (globeEl.current) {
      // Initial view
      globeEl.current.pointOfView({ lat: 39.8, lng: -98.5, altitude: 1.8 }, 1000);

      // Auto-rotate setup
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().minDistance = 101; // Prevent going inside
      globeEl.current.controls().maxDistance = 1000; // Limit zoom out
    }
  }, [mounted]);

  const handleStateClick = useCallback(async (stateFeature: any) => {
    const stateName = stateFeature.properties.name;

    // Stop rotation
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = false;
      const { lat, lng } = getGeoCentroid(stateFeature.geometry);

      // Smooth fly to
      globeEl.current.pointOfView({ lat, lng, altitude: 0.4 }, 1500);
    }

    // Fetch data
    try {
      // Simulate loading/fetching for immediate feedback
      onStateSelect(stateName, null); // Clear previous or set loading

      const res = await fetch(`/api/states?state=${encodeURIComponent(stateName)}`);
      const data = await res.json();
      onStateSelect(stateName, data);
    } catch (error) {
      console.error("Failed to fetch state data", error);
    }
  }, [onStateSelect]);

  // Memoize polygon styling for performance
  const getPolygonCapColor = useCallback((d: any) => {
    if (d === hoverState) return 'rgba(6, 182, 212, 0.3)'; // Cyan-500 with opacity
    return 'rgba(15, 23, 42, 0.8)'; // Slate-900 with opacity
  }, [hoverState]);

  const getPolygonSideColor = useCallback(() => {
    return 'rgba(6, 182, 212, 0.1)'; // Cyan-500 very low opacity
  }, []);

  const getPolygonStrokeColor = useCallback((d: any) => {
    if (d === hoverState) return '#22d3ee'; // Cyan-400
    return '#0e7490'; // Cyan-700
  }, [hoverState]);

  const getPolygonAltitude = useCallback((d: any) => {
    return d === hoverState ? 0.08 : 0.01;
  }, [hoverState]);

  return (
    <div id="globe-container" className="relative w-full h-[600px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl group">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),rgba(15,23,42,0.5))] pointer-events-none z-0" />

      {mounted && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

          // Atmosphere
          atmosphereColor="#06b6d4" // Cyan-500
          atmosphereAltitude={0.25}

          // Polygons (States)
          polygonsData={states.features}
          polygonAltitude={getPolygonAltitude}
          polygonCapColor={getPolygonCapColor}
          polygonSideColor={getPolygonSideColor}
          polygonStrokeColor={getPolygonStrokeColor}
          onPolygonHover={setHoverState}
          onPolygonClick={handleStateClick}

          // Labels
          polygonLabel={({ properties: d }: any) => `
            <div class="px-3 py-2 bg-slate-900/90 border border-cyan-500/50 rounded shadow-lg backdrop-blur-sm">
              <div class="text-cyan-400 font-bold text-sm tracking-wider">${d.name}</div>
              <div class="text-xs text-slate-400 mt-1">Click to Analyze</div>
            </div>
          `}

          // Interaction
          lineHoverPrecision={0}
        />
      )}

      {/* HUD Overlay - Top Left */}
      <div className="absolute top-6 left-6 pointer-events-none z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-cyan-500 font-mono text-xs tracking-[0.2em] font-bold">SYSTEM ONLINE</span>
          </div>
          <div className="text-slate-500 font-mono text-[10px] tracking-widest pl-4">
            TARGET: NORTH_AMERICA<br />
            MODE: INTERACTIVE_SURVEILLANCE
          </div>
        </div>
      </div>

      {/* HUD Overlay - Bottom Right */}
      <div className="absolute bottom-6 right-6 pointer-events-none z-10 text-right">
        <div className="text-cyan-900/40 font-mono text-xs tracking-widest">
          LAT: {globeEl.current?.pointOfView().lat.toFixed(2) || '00.00'}<br />
          LNG: {globeEl.current?.pointOfView().lng.toFixed(2) || '00.00'}
        </div>
      </div>

      {/* Grid Overlay Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 opacity-20" />
    </div>
  );
};

// Helper to find centroid of polygon
function getGeoCentroid(geometry: any) {
  let lat = 0, lng = 0;
  // @ts-ignore
  const coordinates = geometry?.type === 'MultiPolygon' ? geometry?.coordinates?.[0]?.[0] : geometry?.coordinates?.[0];

  if (coordinates && Array.isArray(coordinates)) {
    coordinates.forEach((coord: number[]) => {
      lng += coord[0];
      lat += coord[1];
    });
    lng /= coordinates.length;
    lat /= coordinates.length;
  }
  return { lat, lng };
}

export default PoliticianGlobe;


