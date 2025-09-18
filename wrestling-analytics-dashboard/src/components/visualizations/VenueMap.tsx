import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { useDashboard } from '../../contexts/DashboardContext';
import { filterMatches, calculateVenueStats } from '../../utils/dataProcessor';

const VenueMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state } = useDashboard();

  const filteredData = useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);

  const venueData = useMemo(() => {
    const venueStats = calculateVenueStats(filteredData);
    
    // Add coordinates for known venues (simplified for demo)
    const venueCoordinates: { [key: string]: [number, number] } = {
      'The O2': [-0.1278, 51.5074], // London
      'Daily\'s Place': [-81.6557, 30.3370], // Jacksonville
      'Korakuen Hall': [139.6917, 35.6895], // Tokyo
      'Allegiant Stadium': [-115.1398, 36.1699], // Las Vegas
      'Wembley Stadium': [-0.2795, 51.5560], // London
      'United Center': [-87.6298, 41.8781], // Chicago
      'MetLife Stadium': [-74.0059, 40.8135], // New Jersey
      'Tokyo Dome': [139.7518, 35.7056], // Tokyo
      'Ryogoku Kokugikan': [139.7928, 35.6966] // Tokyo
    };

    return venueStats.map(venue => {
      const coords = venueCoordinates[venue.name] || [0, 0];
      return {
        ...venue,
        longitude: coords[0],
        latitude: coords[1]
      };
    }).filter(venue => venue.longitude !== 0 && venue.latitude !== 0);
  }, [filteredData]);

  useEffect(() => {
    if (!svgRef.current || venueData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.node()?.getBoundingClientRect();
    if (!container) return;

    const width = container.width;
    const height = Math.max(400, container.height);

    // Create projection
    const projection = d3.geoNaturalEarth1()
      .scale(100)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create world map (simplified - using circles for demo)
    const graticule = d3.geoGraticule();
    
    svg.append('path')
      .datum(graticule)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 0.5);

    // Create land masses (simplified representation)
    const landFeatures = [
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]] } }
    ];

    svg.selectAll('.land')
      .data(landFeatures)
      .join('path')
      .attr('class', 'land')
      .attr('d', path)
      .attr('fill', '#f3f4f6')
      .attr('stroke', '#d1d5db')
      .attr('stroke-width', 0.5);

    // Scale for venue sizes
    const sizeScale = d3.scaleSqrt()
      .domain([0, d3.max(venueData, d => d.totalMatches) || 0])
      .range([4, 20]);

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(venueData, d => d.totalMatches) || 0]);

    // Add venue points
    const venues = svg.selectAll('.venue')
      .data(venueData)
      .join('g')
      .attr('class', 'venue')
      .attr('transform', d => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? `translate(${coords[0]},${coords[1]})` : 'translate(0,0)';
      });

    // Add venue circles
    venues.append('circle')
      .attr('r', d => sizeScale(d.totalMatches))
      .attr('fill', d => colorScale(d.totalMatches))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke-width', 4);
        
        // Show tooltip
        const tooltip = d3.select('body').selectAll('.venue-tooltip')
          .data([d]);
        
        const tooltipEnter = tooltip.enter().append('div')
          .attr('class', 'venue-tooltip tooltip');
        
        tooltipEnter.merge(tooltip)
          .style('opacity', 1)
          .html(`
            <strong>${d.name}</strong><br/>
            ${d.city}, ${d.country}<br/>
            Total Matches: ${d.totalMatches}<br/>
            Wrestlers: ${d.wrestlers.length}<br/>
            Promotions: ${d.promotions.join(', ')}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 2);
        d3.select('.venue-tooltip').style('opacity', 0);
      });

    // Add venue labels for major venues
    venues.filter(d => d.totalMatches > 5)
      .append('text')
      .attr('dy', d => sizeScale(d.totalMatches) + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-weight', '500')
      .style('fill', 'currentColor')
      .style('pointer-events', 'none')
      .text(d => d.name);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 200}, 20)`);

    const legendData = [
      { size: 5, matches: 5, label: '5 matches' },
      { size: 10, matches: 10, label: '10 matches' },
      { size: 15, matches: 15, label: '15+ matches' }
    ];

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .join('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems.append('circle')
      .attr('r', d => d.size)
      .attr('fill', d => colorScale(d.matches))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    legendItems.append('text')
      .attr('x', 25)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', 'currentColor')
      .text(d => d.label);

    legend.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'currentColor')
      .text('Venue Activity');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        svg.selectAll('path, circle, text')
          .attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [venueData]);

  if (state.isLoading) {
    return (
      <div className="chart-container">
        <div className="flex items-center justify-center h-full">
          <div className="loading-skeleton w-full h-full"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="chart-container"
    >
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Global Venue Map
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Wrestling venues around the world
        </p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          • Circle size = total matches • Color intensity = activity level
        </div>
      </div>
      
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />
    </motion.div>
  );
};

export default VenueMap;
