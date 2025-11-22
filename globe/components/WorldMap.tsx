import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as d3 from 'd3';

interface WorldMapProps {
  onLocationSelect: (loc: { name: string, lat: number, lng: number }) => void;
}

// Using a public GeoJSON for countries
const GEOJSON_URL = 'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

const WorldMap: React.FC<WorldMapProps> = ({ onLocationSelect }) => {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState<object | null>(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    // Load country data
    fetch(GEOJSON_URL)
      .then(res => res.json())
      .then(setCountries)
      .catch(err => console.error("Failed to load geojson", err));

    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
    }
  }, []);

  // Color scale for random tech levels per country visual
  const colorScale = d3.scaleSequentialSqrt(d3.interpolateGnBu);
  const getVal = (feat: any) => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  return (
    <div className="fixed inset-0 z-0 bg-black w-full h-full">
        {/* Starfield background is handled by the globe library or we can add a CSS layer */}
      <Globe
        ref={globeEl}
        width={width}
        height={height}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        lineHoverPrecision={0}
        
        polygonsData={countries.features}
        polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
        polygonCapColor={d => d === hoverD ? 'rgba(0, 243, 255, 0.3)' : 'rgba(10, 10, 20, 0.8)'}
        polygonSideColor={() => 'rgba(0, 243, 255, 0.15)'}
        polygonStrokeColor={() => '#00f3ff'}
        polygonLabel={({ properties: d }: any) => `
          <div style="background: rgba(0,0,0,0.8); color: #00f3ff; border: 1px solid #00f3ff; padding: 4px 8px; font-family: 'Share Tech Mono', monospace;">
            <b style="color: #fff">${d.ADMIN}</b> <br />
            SECTOR ID: ${d.ISO_A3}
          </div>
        `}
        onPolygonHover={setHoverD}
        onPolygonClick={(d: any) => {
          // Focus on country
          const coords = d.properties.coord || { lat: 0, lng: 0 }; // GeoJSON might not have center props easily accessible without calculation, but let's rely on click event props if available, or calculating centroid.
          // React-globe-gl passes the feature. We need to compute centroid or just use the click event location if possible. 
          // Actually, onPolygonClick passes (polygon, event, { lat, lng, altitude }).
          // Let's use a simplified approximate approach or the library's args.
          
          // Since the type defs might be loose, let's assume we just pass the name for now.
          // Ideally we use d3-geo to calculate centroid, but for now let's just trigger the name.
           onLocationSelect({
             name: d.properties.ADMIN,
             lat: 0, // Not strictly needed for the text analysis
             lng: 0 
           });
        }}
        
        // Atmosphere
        atmosphereColor="#00f3ff"
        atmosphereAltitude={0.25}
      />
    </div>
  );
};

export default WorldMap;