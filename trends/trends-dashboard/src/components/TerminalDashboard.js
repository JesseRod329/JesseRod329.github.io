import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { COLORS, FONTS } from '../constants/terminal-theme';
import { generateTickerData } from '../mocks/trends-data';
import trendsService from '../services/trendsService';

import Header from './dashboard/Header';
import Ticker from './dashboard/Ticker';
import TrendsList from './dashboard/TrendsList';
import TrendDetails from './dashboard/TrendDetails';
import RegionalInterest from './dashboard/RegionalInterest';
import RelatedQueries from './dashboard/RelatedQueries';
import StatusBar from './dashboard/StatusBar';
import SearchModal from './dashboard/SearchModal';
import HelpModal from './dashboard/HelpModal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${COLORS.background};
  color: ${COLORS.text};
  font-family: ${FONTS.mono};
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background-color: ${COLORS.panel};
  border: 1px solid ${COLORS.border};
  border-radius: 2px;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-bottom: 1px solid ${COLORS.border};
  background-color: ${COLORS.panelHeader};
`;

const PanelTitle = styled.span`
  font-size: 11px;
  color: ${COLORS.text};
  font-weight: bold;
  flex: 1;
`;

const PanelSubtitle = styled.span`
  font-size: 9px;
  color: ${COLORS.textSecondary};
`;

export default function TerminalDashboard() {
  const [trends, setTrends] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [regional, setRegional] = useState([]);
  const [selectedTrend, setSelectedTrend] = useState(0);
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, search, help

  const loadTrendsData = useCallback(async () => {
    try {
      const trendsData = await trendsService.getTrendingTopics();
      setTrends(trendsData);

      if (trendsData.length > 0) {
        const regionalData = await trendsService.getRegionalInterest(trendsData[selectedTrend]?.title || 'technology');
        setRegional(regionalData);
      }
    } catch (error) {
      console.error('Failed to load trends data:', error);
    }
  }, [selectedTrend]);

  useEffect(() => {
    loadTrendsData();
    setTicker(generateTickerData());

    const timer = setInterval(() => setTime(new Date()), 1000);
    const dataRefresh = setInterval(loadTrendsData, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(dataRefresh);
    };
  }, [loadTrendsData]);

  const selectedTrendData = trends[selectedTrend];

  const openTrendDetails = (trend) => {
    const detailsWindow = window.open('', '_blank', 'width=800,height=600');
    detailsWindow.document.write(`
      <html>
        <head>
          <title>Trend Details: ${trend.title}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              background: #0a0a0a; 
              color: #ffb000; 
              padding: 20px; 
              line-height: 1.6;
            }
            .header { border-bottom: 1px solid #2a2a2a; padding-bottom: 10px; margin-bottom: 20px; }
            .metric { margin: 10px 0; }
            .label { color: #808080; }
            .value { color: #e0e0e0; margin-left: 10px; }
            .related { margin-top: 20px; }
            .query { 
              display: inline-block; 
              background: #1a1a1a; 
              padding: 5px 10px; 
              margin: 5px; 
              border: 1px solid #2a2a2a; 
              border-radius: 2px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${trend.title}</h1>
            <p>Category: ${trend.category} | Sentiment: ${trend.sentiment}</p>
          </div>
          <div class="metric"><span class="label">Search Volume:</span><span class="value">${trend.volume}</span></div>
          <div class="metric"><span class="label">Change:</span><span class="value">${trend.change > 0 ? '+' : ''}${trend.change}%</span></div>
          <div class="metric"><span class="label">Peak Time:</span><span class="value">${trend.peakTime}</span></div>
          <div class="metric"><span class="label">Velocity:</span><span class="value">${trend.velocity}</span></div>
          <div class="related">
            <h3>Related Queries:</h3>
            ${trend.relatedQueries.map(query => `<span class="query">${query}</span>`).join('')}
          </div>
          <div style="margin-top: 30px;">
            <button onclick="window.close()" style="background: #ffb000; color: #0a0a0a; border: none; padding: 10px 20px; font-family: monospace; cursor: pointer;">Close</button>
          </div>
        </body>
      </html>
    `);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (currentView === 'help') {
        if (event.key === 'Escape') setCurrentView('dashboard');
        return;
      }

      if (currentView === 'search') {
        if (event.key === 'Escape') setCurrentView('dashboard');
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setSelectedTrend(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedTrend(prev => Math.min(trends.length - 1, prev + 1));
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedTrendData) openTrendDetails(selectedTrendData);
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            loadTrendsData();
          }
          break;
        case '/':
          event.preventDefault();
          setCurrentView('search');
          break;
        case 'h':
        case 'H':
          setCurrentView('help');
          break;
        default:
          if (event.key >= '1' && event.key <= '9') {
            const index = parseInt(event.key) - 1;
            if (index < trends.length) setSelectedTrend(index);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [trends, selectedTrendData, currentView, loadTrendsData]);

  const filteredTrends = trends.filter(trend => {
    const matchesSearch = !searchQuery || 
      trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trend.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || trend.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Container>
      <Header time={time} onHelp={() => setCurrentView('help')} />
      <Ticker items={ticker} />

      <MainContent>
        <Grid>
          <Panel>
            <PanelHeader>
              <PanelTitle>TRENDING NOW</PanelTitle>
              <PanelSubtitle>GLOBAL</PanelSubtitle>
            </PanelHeader>
            <TrendsList 
              trends={filteredTrends}
              selectedTrend={selectedTrend}
              onTrendClick={setSelectedTrend}
              onTrendDoubleClick={openTrendDetails}
            />
          </Panel>

          <TrendDetails trend={selectedTrendData} rank={selectedTrend} />

          <RegionalInterest regional={regional} />

          {selectedTrendData && <RelatedQueries queries={selectedTrendData.relatedQueries} />}
        </Grid>
      </MainContent>

      <StatusBar trendsCount={trends.length} onShortcuts={() => setCurrentView('help')} />

      {currentView === 'search' && (
        <SearchModal 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredTrendsCount={filteredTrends.length}
          onClose={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'help' && <HelpModal onClose={() => setCurrentView('dashboard')} />}
    </Container>
  );
}