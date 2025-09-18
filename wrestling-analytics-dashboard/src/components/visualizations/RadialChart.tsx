import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { useDashboard } from '../../contexts/DashboardContext';
import { filterMatches, calculateWrestlerStats } from '../../utils/dataProcessor';

const RadialChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state } = useDashboard();

  const filteredData = useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);

  const radialData = useMemo(() => {
    const wrestlerStats = calculateWrestlerStats(filteredData);
    
    // Get top 20 wrestlers by total matches
    return wrestlerStats
      .filter(wrestler => wrestler.totalMatches >= 3)
      .slice(0, 20)
      .map(wrestler => ({
        name: wrestler.name,
        wins: wrestler.wins,
        losses: wrestler.losses,
        totalMatches: wrestler.totalMatches,
        winRate: wrestler.winRate
      }));
  }, [filteredData]);

  useEffect(() => {
    if (!svgRef.current || radialData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.node()?.getBoundingClientRect();
    if (!container) return;

    const width = container.width;
    const height = Math.max(400, container.height);
    const radius = Math.min(width, height) / 2 - 40;
    
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Scales
    const angleScale = d3.scaleBand()
      .domain(radialData.map(d => d.name))
      .range([0, 2 * Math.PI])
      .padding(0.1);

    const radiusScale = d3.scaleLinear()
      .domain([0, d3.max(radialData, d => d.totalMatches) || 0])
      .range([50, radius]);

    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([0, 100]);

    // Add concentric circles (grid)
    const gridLevels = [25, 50, 75, 100];
    gridLevels.forEach(level => {
      const gridRadius = radiusScale(level);
      g.append('circle')
        .attr('r', gridRadius)
        .attr('fill', 'none')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);
      
      // Add level labels
      g.append('text')
        .attr('x', 5)
        .attr('y', -gridRadius)
        .attr('dy', '0.35em')
        .style('text-anchor', 'start')
        .style('font-size', '10px')
        .style('fill', '#6b7280')
        .text(`${level} matches`);
    });

    // Create arc generator
    const arc = d3.arc<any>()
      .innerRadius(50)
      .outerRadius(d => radiusScale(d.totalMatches))
      .startAngle(d => angleScale(d.name)!)
      .endAngle(d => angleScale(d.name)! + angleScale.bandwidth())
      .cornerRadius(2);

    // Add arcs
    const arcs = g.selectAll('.arc')
      .data(radialData)
      .join('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.winRate))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        
        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'radial-tooltip tooltip')
          .style('position', 'absolute')
          .style('padding', '10px')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('border-radius', '5px')
          .style('pointer-events', 'none');
        
        tooltip
          .style('opacity', 1)
          .html(`
            <strong>${d.name}</strong><br/>
            Total Matches: ${d.totalMatches}<br/>
            Wins: ${d.wins}<br/>
            Losses: ${d.losses}<br/>
            Win Rate: ${d.winRate.toFixed(1)}%
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        d3.select('.radial-tooltip').style('opacity', 0);
      });

    // Add wrestler labels
    arcs.append('text')
      .attr('transform', d => {
        const angle = angleScale(d.name)! + angleScale.bandwidth() / 2;
        const labelRadius = radiusScale(d.totalMatches) + 10;
        const x = Math.sin(angle) * labelRadius;
        const y = -Math.cos(angle) * labelRadius;
        return `translate(${x},${y}) rotate(${angle * 180 / Math.PI - 90})`;
      })
      .attr('text-anchor', d => {
        const angle = angleScale(d.name)! + angleScale.bandwidth() / 2;
        return angle > Math.PI ? 'end' : 'start';
      })
      .attr('dy', '0.35em')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('fill', 'currentColor')
      .text(d => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name);

    // Add center title
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', 'currentColor')
      .text('Wrestler');
    
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', 'currentColor')
      .text('Performance');

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(20, ${height - 80})`);

    const legendScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, 200]);

    const legendAxis = d3.axisBottom(legendScale)
      .tickSize(-15)
      .tickValues([0, 25, 50, 75, 100]);

    legend.append('g')
      .attr('transform', 'translate(0, 15)')
      .call(legendAxis);

    // Create gradient for legend
    const gradientId = 'radial-legend-gradient';
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    for (let i = 0; i <= 100; i += 10) {
      gradient.append('stop')
        .attr('offset', `${i}%`)
        .attr('stop-color', colorScale(i));
    }

    legend.append('rect')
      .attr('width', 200)
      .attr('height', 15)
      .style('fill', `url(#${gradientId})`);

    legend.append('text')
      .attr('x', 100)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'currentColor')
      .text('Win Rate (%)');

  }, [radialData]);

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
          Winner's Circle
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Radial chart showing wrestler performance and win rates
        </p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          • Arc length = total matches • Color = win rate
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

export default RadialChart;
