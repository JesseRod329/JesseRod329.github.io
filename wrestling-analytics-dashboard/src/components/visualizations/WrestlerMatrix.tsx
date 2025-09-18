import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { useDashboard } from '../../contexts/DashboardContext';
import { filterMatches, calculateWrestlerStats } from '../../utils/dataProcessor';

const WrestlerMatrix: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state } = useDashboard();

  const filteredData = useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);

  const matrixData = useMemo(() => {
    const wrestlerStats = calculateWrestlerStats(filteredData);
    const topWrestlers = wrestlerStats.slice(0, 15); // Top 15 wrestlers for readability
    
    // Create head-to-head matrix
    const matrix: Array<Array<number>> = [];
    const wrestlerNames = topWrestlers.map(w => w.name);
    
    // Initialize matrix
    for (let i = 0; i < wrestlerNames.length; i++) {
      matrix[i] = new Array(wrestlerNames.length).fill(0);
    }
    
    // Fill matrix with match counts
    filteredData.forEach(match => {
      match.winners.forEach(winner => {
        match.losers.forEach(loser => {
          const winnerIndex = wrestlerNames.indexOf(winner);
          const loserIndex = wrestlerNames.indexOf(loser);
          
          if (winnerIndex !== -1 && loserIndex !== -1) {
            matrix[winnerIndex][loserIndex]++;
          }
        });
      });
    });
    
    return {
      matrix,
      wrestlers: wrestlerNames,
      stats: topWrestlers
    };
  }, [filteredData]);

  useEffect(() => {
    if (!svgRef.current || matrixData.wrestlers.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.node()?.getBoundingClientRect();
    if (!container) return;

    const margin = { top: 80, right: 20, bottom: 20, left: 120 };
    const cellSize = Math.min(
      (container.width - margin.left - margin.right) / matrixData.wrestlers.length,
      (container.height - margin.top - margin.bottom) / matrixData.wrestlers.length,
      30
    );
    
    const width = cellSize * matrixData.wrestlers.length;
    const height = cellSize * matrixData.wrestlers.length;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Color scale
    const maxValue = d3.max(matrixData.matrix.flat()) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxValue]);

    // Create cells
    const rows = g.selectAll('.row')
      .data(matrixData.matrix)
      .join('g')
      .attr('class', 'row')
      .attr('transform', (d, i) => `translate(0, ${i * cellSize})`);

    const cells = rows.selectAll('.cell')
      .data((d, i) => d.map((value, j) => ({ value, row: i, col: j })))
      .join('rect')
      .attr('class', 'cell')
      .attr('x', d => d.col * cellSize)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', d => d.value > 0 ? colorScale(d.value) : '#f9fafb')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        if (d.value === 0) return;
        
        d3.select(this).attr('stroke-width', 2).attr('stroke', '#000');
        
        // Highlight row and column
        rows.selectAll('.cell')
          .filter((cell: any) => cell.row === d.row || cell.col === d.col)
          .attr('opacity', 0.7);
        
        // Show tooltip
        const tooltip = d3.select('body').selectAll('.matrix-tooltip')
          .data([d]);
        
        const tooltipEnter = tooltip.enter().append('div')
          .attr('class', 'matrix-tooltip tooltip');
        
        tooltipEnter.merge(tooltip)
          .style('opacity', 1)
          .html(`
            <strong>${matrixData.wrestlers[d.row]}</strong><br/>
            defeated<br/>
            <strong>${matrixData.wrestlers[d.col]}</strong><br/>
            ${d.value} time${d.value !== 1 ? 's' : ''}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 1).attr('stroke', '#fff');
        rows.selectAll('.cell').attr('opacity', 1);
        d3.select('.matrix-tooltip').style('opacity', 0);
      });

    // Add cell values for non-zero cells
    rows.selectAll('.cell-text')
      .data((d, i) => d.map((value, j) => ({ value, row: i, col: j })))
      .join('text')
      .attr('class', 'cell-text')
      .attr('x', d => d.col * cellSize + cellSize / 2)
      .attr('y', d => cellSize / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', Math.min(cellSize / 3, 12) + 'px')
      .style('font-weight', '600')
      .style('fill', d => d.value > maxValue / 2 ? '#fff' : '#1f2937')
      .style('pointer-events', 'none')
      .text(d => d.value > 0 ? d.value : '');

    // Add row labels (winners)
    g.selectAll('.row-label')
      .data(matrixData.wrestlers)
      .join('text')
      .attr('class', 'row-label')
      .attr('x', -10)
      .attr('y', (d, i) => i * cellSize + cellSize / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .style('font-size', Math.min(cellSize / 2.5, 11) + 'px')
      .style('font-weight', '500')
      .style('fill', 'currentColor')
      .text(d => d.length > 12 ? d.substring(0, 12) + '...' : d);

    // Add column labels (losers)
    g.selectAll('.col-label')
      .data(matrixData.wrestlers)
      .join('text')
      .attr('class', 'col-label')
      .attr('x', (d, i) => i * cellSize + cellSize / 2)
      .attr('y', -10)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .attr('transform', (d, i) => `rotate(-45, ${i * cellSize + cellSize / 2}, -10)`)
      .style('font-size', Math.min(cellSize / 2.5, 11) + 'px')
      .style('font-weight', '500')
      .style('fill', 'currentColor')
      .text(d => d.length > 12 ? d.substring(0, 12) + '...' : d);

    // Add axis labels
    svg.append('text')
      .attr('x', margin.left / 2)
      .attr('y', margin.top + height / 2)
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90, ${margin.left / 2}, ${margin.top + height / 2})`)
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', 'currentColor')
      .text('Winners');

    svg.append('text')
      .attr('x', margin.left + width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', 'currentColor')
      .text('Defeated');

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${margin.left + width + 20}, ${margin.top})`);

    const legendHeight = 150;
    const legendWidth = 20;

    const legendScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .tickSize(legendWidth)
      .tickValues(d3.range(0, maxValue + 1).filter(d => d % Math.ceil(maxValue / 5) === 0));

    legend.append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis);

    // Create gradient for legend
    const gradientId = 'matrix-legend-gradient';
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    for (let i = 0; i <= 100; i += 10) {
      gradient.append('stop')
        .attr('offset', `${i}%`)
        .attr('stop-color', colorScale(maxValue * i / 100));
    }

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', `url(#${gradientId})`);

    legend.append('text')
      .attr('x', legendWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'currentColor')
      .text('Victories');

  }, [matrixData]);

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
          Head-to-Head Matrix
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Direct competition results between top wrestlers
        </p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          • Rows = winners • Columns = defeated • Color intensity = frequency
        </div>
      </div>
      
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="w-full h-full"
        style={{ minHeight: '600px' }}
      />
    </motion.div>
  );
};

export default WrestlerMatrix;
