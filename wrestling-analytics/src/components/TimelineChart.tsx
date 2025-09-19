import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useDashboard } from '../contexts/DashboardContext';

export const TimelineChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { filteredData } = useDashboard();

  const chartData = useMemo(() => {
    const yearlyData = filteredData.reduce((acc, match) => {
      if (match.year) {
        acc[match.year] = (acc[match.year] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(yearlyData)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);
  }, [filteredData]);

  useEffect(() => {
    if (!svgRef.current || chartData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain(d3.extent(chartData, d => d.year) as [number, number])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.count) || 0])
      .nice()
      .range([innerHeight, 0]);

    const line = d3.line<{ year: number; count: number }>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.count))
      .curve(d3.curveMonotoneX);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add line
    g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add area
    const area = d3.area<{ year: number; count: number }>()
      .x(d => xScale(d.year))
      .y0(innerHeight)
      .y1(d => yScale(d.count))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(chartData)
      .attr('fill', 'rgba(59, 130, 246, 0.1)')
      .attr('d', area);

    // Add dots
    g.selectAll('.dot')
      .data(chartData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.count))
      .attr('r', 4)
      .attr('fill', '#3b82f6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Add axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    g.append('g')
      .call(yAxis);

    // Add labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Matches');

    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom})`)
      .style('text-anchor', 'middle')
      .text('Year');

  }, [chartData]);

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Match Activity Over Time</h3>
      <div className="flex justify-center">
        <svg ref={svgRef} width={800} height={400}></svg>
      </div>
    </div>
  );
};
