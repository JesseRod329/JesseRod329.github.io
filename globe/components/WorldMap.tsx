import React, { useEffect, useRef, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as d3 from 'd3';
import { City, Arc } from '../types';

interface WorldMapProps {
  onLocationSelect: (loc: { name: string, lat: number, lng: number }) => void;
  cities?: City[];
  arcs?: Arc[];
  onCityClick?: (city: City) => void;
}

export interface WorldMapRef {
  flyToCountry: (lat: number, lng: number) => void;
  getCountries: () => Array<{ name: string; iso_a3: string }>;
}

// Using a public GeoJSON for countries
const GEOJSON_URL = 'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

const WorldMap = forwardRef<WorldMapRef, WorldMapProps>(({ onLocationSelect, cities = [], arcs = [], onCityClick }, ref) => {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState<object | null>(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useImperativeHandle(ref, () => ({
    flyToCountry: (lat: number, lng: number) => {
      if (globeEl.current) {
        globeEl.current.pointOfView(
          { lat, lng, altitude: 1.5 },
          1500 // animation duration in ms
        );
      }
    },
    getCountries: () => {
      return countries.features.map((f: any) => ({
        name: f.properties.ADMIN,
        iso_a3: f.properties.ISO_A3
      }));
    }
  }));

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
           onLocationSelect({
             name: d.properties.ADMIN,
             lat: 0,
             lng: 0 
           });
        }}
        
        // City markers
        pointsData={cities}
        pointLat={(d: any) => d.lat}
        pointLng={(d: any) => d.lng}
        pointAltitude={0.01}
        pointRadius={0.15}
        pointColor={() => '#ff00ff'}
        pointLabel={(d: any) => `
          <div style="background: rgba(0,0,0,0.9); color: #ff00ff; border: 1px solid #ff00ff; padding: 4px 8px; font-family: 'Share Tech Mono', monospace;">
            <b style="color: #fff">${d.name}</b><br />
            ${d.country}<br />
            POP: ${(d.population / 1000000).toFixed(1)}M
          </div>
        `}
        onPointClick={(point: any) => {
          if (onCityClick) onCityClick(point);
        }}
        
        // Connection arcs
        arcsData={arcs}
        arcStartLat={(d: any) => d.startLat}
        arcStartLng={(d: any) => d.startLng}
        arcEndLat={(d: any) => d.endLat}
        arcEndLng={(d: any) => d.endLng}
        arcColor={(d: any) => d.color}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1500}
        arcStroke={0.5}
        
        // Atmosphere
        atmosphereColor="#00f3ff"
        atmosphereAltitude={0.25}
      />
    </div>
  );
});

WorldMap.displayName = 'WorldMap';
export default WorldMap;