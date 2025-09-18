import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { useDashboard } from '../../contexts/DashboardContext';
import { filterMatches } from '../../utils/dataProcessor';
import { NetworkNode, NetworkLink } from '../../types';

const NetworkGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state } = useDashboard();

  const filteredData = useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);

  const { nodes, links } = useMemo(() => {
    const wrestlerStats = new Map<string, { wins: number; losses: number; opponents: Set<string> }>();
    const connections = new Map<string, number>();

    // Process matches to build network data
    filteredData.forEach(match => {
      const allWrestlers = [...match.winners, ...match.losers];
      
      // Update wrestler stats
      [...match.winners, ...match.losers].forEach(wrestler => {
        if (!wrestlerStats.has(wrestler)) {
          wrestlerStats.set(wrestler, { wins: 0, losses: 0, opponents: new Set() });
        }
        
        const stats = wrestlerStats.get(wrestler)!;
        if (match.winners.includes(wrestler)) {
          stats.wins++;
          match.losers.forEach(opponent => stats.opponents.add(opponent));
        } else {
          stats.losses++;
          match.winners.forEach(opponent => stats.opponents.add(opponent));
        }
      });

      // Create connections between wrestlers in the same match
      for (let i = 0; i < allWrestlers.length; i++) {
        for (let j = i + 1; j < allWrestlers.length; j++) {
          const key = [allWrestlers[i], allWrestlers[j]].sort().join('-');
          connections.set(key, (connections.get(key) || 0) + 1);
        }
      }
    });

    // Build nodes
    const nodes: NetworkNode[] = Array.from(wrestlerStats.entries())
      .filter(([_, stats]) => stats.wins + stats.losses >= 2) // Filter wrestlers with at least 2 matches
      .slice(0, 50) // Limit to top 50 wrestlers for performance
      .map(([name, stats]) => ({
        id: name,
        name,
        group: getWrestlerGroup(name),
        totalMatches: stats.wins + stats.losses,
        wins: stats.wins,
        radius: Math.max(5, Math.min(25, (stats.wins + stats.losses) * 2))
      }));

    // Build links
    const nodeIds = new Set(nodes.map(n => n.id));
    const links: NetworkLink[] = Array.from(connections.entries())
      .filter(([key, count]) => {
        const [wrestler1, wrestler2] = key.split('-');
        return nodeIds.has(wrestler1) && nodeIds.has(wrestler2) && count >= 1;
      })
      .map(([key, count]) => {
        const [source, target] = key.split('-');
        return {
          source,
          target,
          value: Math.min(10, count * 2),
          matchCount: count
        };
      });

    return { nodes, links };
  }, [filteredData]);

  const getWrestlerGroup = (name: string): string => {
    // Simple grouping logic based on common characteristics
    if (name.includes('Elite') || name.includes('Young Bucks') || name.includes('Kenny Omega')) return 'elite';
    if (name.includes('FTR') || name.includes('Dax') || name.includes('Cash')) return 'ftr';
    if (name.includes('Matriarchy') || name.includes('Killswitch') || name.includes('Kip')) return 'matriarchy';
    if (name.includes('Thunder Rosa') || name.includes('Hikaru') || name.includes('Jade')) return 'women';
    if (name.includes('Reigns') || name.includes('Rollins') || name.includes('Drew')) return 'wwe';
    if (name.includes('Okada') || name.includes('Tanahashi') || name.includes('Ospreay')) return 'njpw';
    return 'independent';
  };

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.node()?.getBoundingClientRect();
    if (!container) return;

    const width = container.width;
    const height = Math.max(400, container.height);

    // Set up zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Create color scale for groups
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Set up force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links as any).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.radius + 2));

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value));

    // Create nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => colorScale(d.group))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Add labels
    const labels = g.append('g')
      .selectAll('text')
      .data(nodes.filter(d => d.totalMatches > 5)) // Only show labels for active wrestlers
      .join('text')
      .text(d => d.name)
      .attr('font-size', '12px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .style('pointer-events', 'none');

    // Add tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '10px')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Mouse events
    node
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke-width', 4);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        
        tooltip.html(`
          <strong>${d.name}</strong><br/>
          Matches: ${d.totalMatches}<br/>
          Wins: ${d.wins}<br/>
          Win Rate: ${((d.wins / d.totalMatches) * 100).toFixed(1)}%
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 2);
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Drag behavior
    const drag = d3.drag()
      .on('start', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d: any) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y + d.radius + 15);
    });

    // Cleanup
    return () => {
      tooltip.remove();
      simulation.stop();
    };
  }, [nodes, links]);

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
          Wrestler Network Graph
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Interactive network showing wrestler relationships and match connections
        </p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          • Circle size = total matches • Drag to move • Zoom to explore
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

export default NetworkGraph;
