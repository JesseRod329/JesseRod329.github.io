import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { useDashboard } from '../../contexts/DashboardContext';
import { filterMatches } from '../../utils/dataProcessor';

const TimelineChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state } = useDashboard();

  const filteredData = useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);

  const timelineData = useMemo(() => {
    const monthlyStats = new Map<string, { wins: number; losses: number; totalMatches: number }>();
    
    filteredData.forEach(match => {
      const date = new Date(match.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyStats.has(monthKey)) {
        monthlyStats.set(monthKey, { wins: 0, losses: 0, totalMatches: 0 });
      }
      
      const stats = monthlyStats.get(monthKey)!;
      stats.totalMatches++;
      
      if (match.isPPV) {
        stats.wins += 2; // Weight PPV matches higher
      } else {
        stats.wins += 1;
      }
    });

    return Array.from(monthlyStats.entries())
      .map(([month, stats]) => ({
        date: new Date(month + '-01'),
        totalMatches: stats.totalMatches,
        value: stats.totalMatches
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredData]);

  useEffect(() => {
    if (!svgRef.current || timelineData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.node()?.getBoundingClientRect();
    if (!container) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = container.width - margin.left - margin.right;
    const height = Math.max(300, container.height - margin.top - margin.bottom);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(timelineData, d => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(timelineData, d => d.value) || 0])
      .nice()
      .range([height, 0]);

    // Line generator
    const line = d3.line<typeof timelineData[0]>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Area generator
    const area = d3.area<typeof timelineData[0]>()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'timelineGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', height)
      .attr('x2', 0).attr('y2', 0);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.6);

    // Add area
    g.append('path')
      .datum(timelineData)
      .attr('fill', 'url(#timelineGradient)')
      .attr('d', area);

    // Add line
    g.append('path')
      .datum(timelineData)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(timelineData)
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 4)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat('%b %Y')));

    g.append('g')
      .call(d3.axisLeft(yScale));

    // Add labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'currentColor')
      .text('Number of Matches');

    g.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'currentColor')
      .text('Time Period');

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '10px')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Add interactivity
    g.selectAll('.dot')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        
        tooltip.html(`
          <strong>${d3.timeFormat('%B %Y')((d as any).date)}</strong><br/>
          Matches: ${(d as any).totalMatches}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4);
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [timelineData]);

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
          Match Timeline
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Wrestling match frequency over time
        </p>
      </div>
      
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </motion.div>
  );
};

export default TimelineChart;
