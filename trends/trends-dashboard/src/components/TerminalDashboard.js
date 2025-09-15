import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Search,
  BarChart3,
  Command,
  Hash,
  Zap,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from './Icons';
import { COLORS, FONTS } from '../constants/terminal-theme';
import { generateTickerData } from '../mocks/trends-data';
import trendsService from '../services/trendsService';

// Animations
const scroll = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-200%);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${COLORS.background};
  color: ${COLORS.text};
  font-family: ${FONTS.mono};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid ${COLORS.border};
  background-color: ${COLORS.panel};
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SystemText = styled.span`
  font-size: 12px;
  color: ${COLORS.primary};
  font-weight: bold;
`;

const LiveIndicator = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${COLORS.success};
  animation: ${pulse} 1s infinite;
`;

const LiveText = styled.span`
  font-size: 10px;
  color: ${COLORS.success};
`;

const TimeText = styled.span`
  font-size: 14px;
  color: ${COLORS.primary};
  font-weight: bold;
`;

const DateText = styled.span`
  font-size: 10px;
  color: ${COLORS.textSecondary};
`;

const HelpButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: ${COLORS.primary};
  font-family: ${FONTS.mono};
  font-size: 10px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Ticker = styled.div`
  height: 24px;
  background-color: ${COLORS.tickerBg};
  border-bottom: 1px solid ${COLORS.border};
  overflow: hidden;
  position: relative;
`;

const TickerContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  animation: ${scroll} 20s linear infinite;
  white-space: nowrap;
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;
  gap: 6px;
`;

const TickerSymbol = styled.span`
  font-size: 10px;
  color: ${COLORS.textSecondary};
`;

const TickerValue = styled.span`
  font-size: 10px;
  color: ${props => props.$isPositive ? COLORS.success : COLORS.error};
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

const TrendsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const TrendItem = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-bottom: 1px solid ${COLORS.border};
  cursor: pointer;
  background-color: ${props => props.$isSelected ? COLORS.selected : 'transparent'};
  
  &:hover {
    background-color: ${props => props.$isSelected ? COLORS.selected : 'rgba(0, 255, 0, 0.05)'};
  }
`;

const TrendRank = styled.div`
  width: 30px;
  font-size: 10px;
  color: ${COLORS.textSecondary};
`;

const TrendContent = styled.div`
  flex: 1;
  margin-right: 8px;
`;

const TrendTitle = styled.div`
  font-size: 11px;
  color: ${COLORS.text};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrendStats = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const VolumeText = styled.span`
  font-size: 9px;
  color: ${COLORS.textSecondary};
`;

const ChangeText = styled.span`
  font-size: 9px;
  color: ${props => props.$isPositive ? COLORS.success : COLORS.error};
`;

const TrendIndicator = styled.div`
  width: 20px;
  display: flex;
  justify-content: center;
`;

const AnalysisContent = styled.div`
  padding: 8px;
`;

const AnalysisTitle = styled.div`
  font-size: 12px;
  color: ${COLORS.primary};
  margin-bottom: 8px;
  font-weight: bold;
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
`;

const AnalysisItem = styled.div``;

const AnalysisLabel = styled.div`
  font-size: 9px;
  color: ${COLORS.textSecondary};
  margin-bottom: 2px;
`;

const AnalysisValue = styled.div`
  font-size: 11px;
  color: ${props => 
    props.sentiment === 'POSITIVE' ? COLORS.success :
    props.sentiment === 'NEGATIVE' ? COLORS.error :
    props.sentiment === 'NEUTRAL' ? COLORS.warning :
    COLORS.text
  };
`;

const MiniChart = styled.div`
  margin-top: 8px;
`;

const ChartLabel = styled.div`
  font-size: 9px;
  color: ${COLORS.textSecondary};
  margin-bottom: 4px;
`;

const ChartBars = styled.div`
  display: flex;
  height: 40px;
  align-items: flex-end;
  gap: 2px;
`;

const ChartBar = styled.div`
  flex: 1;
  background-color: ${COLORS.primary};
  min-height: 2px;
  height: ${props => props.height}%;
`;

const RegionalList = styled.div`
  padding: 8px;
`;

const RegionalItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

const RegionCode = styled.div`
  width: 30px;
  font-size: 10px;
  color: ${COLORS.text};
`;

const RegionBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: ${COLORS.background};
  margin: 0 8px;
  border: 1px solid ${COLORS.border};
  position: relative;
`;

const RegionBarFill = styled.div`
  height: 100%;
  background-color: ${COLORS.warning};
  width: ${props => props.width}%;
`;

const RegionPercent = styled.div`
  width: 35px;
  font-size: 10px;
  color: ${COLORS.textSecondary};
  text-align: right;
`;

const QueriesContent = styled.div`
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const QueryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${COLORS.background};
  padding: 3px 6px;
  border-radius: 2px;
  border: 1px solid ${COLORS.border};
`;

const QueryText = styled.span`
  font-size: 9px;
  color: ${COLORS.text};
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 6px 0;
  border-top: 1px solid ${COLORS.border};
  background-color: ${COLORS.panel};
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  &:hover {
    opacity: ${props => props.$clickable ? '0.8' : '1'};
  }
`;

const StatusText = styled.span`
  font-size: 9px;
  color: ${COLORS.textSecondary};
`;

// Search and Help Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${COLORS.panel};
  border: 1px solid ${COLORS.border};
  border-radius: 2px;
  padding: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${COLORS.border};
`;

const ModalTitle = styled.h2`
  font-size: 14px;
  color: ${COLORS.primary};
  font-family: ${FONTS.mono};
  margin: 0;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${COLORS.textSecondary};
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: ${COLORS.text};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${COLORS.background};
  border: 1px solid ${COLORS.border};
  border-radius: 2px;
  padding: 8px 12px;
  color: ${COLORS.text};
  font-family: ${FONTS.mono};
  font-size: 12px;
  margin-bottom: 15px;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
  }
  
  &::placeholder {
    color: ${COLORS.textSecondary};
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const CategoryTab = styled.button`
  background: ${props => props.$active ? COLORS.primary : COLORS.background};
  color: ${props => props.$active ? COLORS.background : COLORS.text};
  border: 1px solid ${COLORS.border};
  border-radius: 2px;
  padding: 6px 12px;
  font-family: ${FONTS.mono};
  font-size: 10px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.$active ? COLORS.primary : COLORS.selected};
  }
`;

const ShortcutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
  margin-bottom: 15px;
`;

const ShortcutKey = styled.div`
  background: ${COLORS.background};
  border: 1px solid ${COLORS.border};
  border-radius: 2px;
  padding: 6px 10px;
  font-family: ${FONTS.mono};
  font-size: 10px;
  color: ${COLORS.warning};
  text-align: center;
`;

const ShortcutDesc = styled.div`
  font-family: ${FONTS.mono};
  font-size: 10px;
  color: ${COLORS.textSecondary};
  display: flex;
  align-items: center;
`;

export default function TerminalDashboard() {
  const [trends, setTrends] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [regional, setRegional] = useState([]);
  const [selectedTrend, setSelectedTrend] = useState(0);
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showSearch, setShowSearch] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, search, help

  useEffect(() => {
    // Load initial data
    loadTrendsData();
    setTicker(generateTickerData());

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const dataRefresh = setInterval(() => {
      loadTrendsData();
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(dataRefresh);
    };
  }, []);

  const loadTrendsData = async () => {
    try {
      const [trendsData, regionalData] = await Promise.all([
        trendsService.getTrendingTopics(),
        trendsService.getRegionalInterest(trends[selectedTrend]?.title || 'technology')
      ]);
      
      setTrends(trendsData);
      setRegional(regionalData);
    } catch (error) {
      console.error('Failed to load trends data:', error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    }).toUpperCase();
  };

  const selectedTrendData = trends[selectedTrend];

  // Keyboard shortcuts and interactions
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (currentView === 'help') {
        if (event.key === 'Escape') {
          setCurrentView('dashboard');
        }
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
          if (selectedTrendData) {
            openTrendDetails(selectedTrendData);
          }
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            refreshData();
          }
          break;
        case '/':
          event.preventDefault();
          toggleSearch();
          break;
        case 'Escape':
          setShowSearch(false);
          setSearchQuery('');
          setSelectedCategory('ALL');
          break;
        case 'h':
        case 'H':
          if (!showSearch) {
            setCurrentView('help');
          }
          break;
        default:
          if (event.key >= '1' && event.key <= '9') {
            const index = parseInt(event.key) - 1;
            if (index < trends.length) {
              setSelectedTrend(index);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [trends, selectedTrendData, currentView, showSearch]);

  const refreshData = async () => {
    console.log('🔄 Refreshing data...');
    await loadTrendsData();
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setCurrentView('search');
    } else {
      setCurrentView('dashboard');
    }
  };

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

  const handleShortcuts = () => {
    setCurrentView('help');
  };

  const filteredTrends = trends.filter(trend => {
    const matchesSearch = !searchQuery || 
      trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trend.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || trend.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'TECH', 'FINANCE', 'POLITICS', 'SCIENCE', 'BUSINESS', 'ENVIRONMENT'];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedTrend(0); // Reset selection when changing category
  };

  const handleTrendClick = (index) => {
    setSelectedTrend(index);
  };

  const handleTickerClick = (symbol) => {
    const query = `${symbol} stock price`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <Container>
      {/* Header Bar */}
      <Header>
        <HeaderSection>
          <SystemText>GTRENDS</SystemText>
          <LiveIndicator />
          <LiveText>LIVE</LiveText>
        </HeaderSection>
        <HeaderSection style={{ flexDirection: 'column', alignItems: 'center' }}>
          <TimeText>{formatTime(time)}</TimeText>
          <DateText>{formatDate(time)}</DateText>
        </HeaderSection>
        <HelpButton onClick={handleShortcuts}>
          <Command size={16} color={COLORS.primary} />
          HELP
        </HelpButton>
      </Header>

      {/* Ticker */}
      <Ticker>
        <TickerContent>
          {ticker.concat(ticker).map((item, index) => (
            <TickerItem key={index} onClick={() => handleTickerClick(item.symbol)} style={{ cursor: 'pointer' }}>
              <TickerSymbol>{item.symbol}</TickerSymbol>
              <TickerValue $isPositive={item.change > 0}>
                {item.value} ({item.change > 0 ? '+' : ''}{item.change}%)
              </TickerValue>
            </TickerItem>
          ))}
        </TickerContent>
      </Ticker>

      <MainContent>
        <Grid>
          {/* Trending Topics Panel */}
          <Panel>
            <PanelHeader>
              <TrendingUp size={14} color={COLORS.primary} />
              <PanelTitle>TRENDING NOW</PanelTitle>
              <PanelSubtitle>GLOBAL</PanelSubtitle>
            </PanelHeader>
            <TrendsList>
              {filteredTrends.map((item, index) => (
                <TrendItem
                  key={item.id}
                  $isSelected={index === selectedTrend}
                  onClick={() => handleTrendClick(index)}
                  onDoubleClick={() => openTrendDetails(item)}
                >
                  <TrendRank>#{index + 1}</TrendRank>
                  <TrendContent>
                    <TrendTitle>{item.title}</TrendTitle>
                    <TrendStats>
                      <VolumeText>VOL: {item.volume}</VolumeText>
                      {item.change > 0 ? (
                        <ChevronUp size={12} color={COLORS.success} />
                      ) : (
                        <ChevronDown size={12} color={COLORS.error} />
                      )}
                      <ChangeText $isPositive={item.change > 0}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </ChangeText>
                    </TrendStats>
                  </TrendContent>
                  <TrendIndicator>
                    {item.change > 0 ? (
                      <TrendingUp size={16} color={COLORS.success} />
                    ) : (
                      <TrendingDown size={16} color={COLORS.error} />
                    )}
                  </TrendIndicator>
                </TrendItem>
              ))}
            </TrendsList>
          </Panel>

          {/* Selected Trend Details */}
          {selectedTrendData && (
            <Panel>
              <PanelHeader>
                <Activity size={14} color={COLORS.info} />
                <PanelTitle>ANALYSIS</PanelTitle>
                <PanelSubtitle>#{selectedTrend + 1}</PanelSubtitle>
              </PanelHeader>
              <AnalysisContent>
                <AnalysisTitle>{selectedTrendData.title}</AnalysisTitle>
                <AnalysisGrid>
                  <AnalysisItem>
                    <AnalysisLabel>CATEGORY</AnalysisLabel>
                    <AnalysisValue>{selectedTrendData.category}</AnalysisValue>
                  </AnalysisItem>
                  <AnalysisItem>
                    <AnalysisLabel>PEAK TIME</AnalysisLabel>
                    <AnalysisValue>{selectedTrendData.peakTime}</AnalysisValue>
                  </AnalysisItem>
                  <AnalysisItem>
                    <AnalysisLabel>SENTIMENT</AnalysisLabel>
                    <AnalysisValue sentiment={selectedTrendData.sentiment}>
                      {selectedTrendData.sentiment}
                    </AnalysisValue>
                  </AnalysisItem>
                  <AnalysisItem>
                    <AnalysisLabel>VELOCITY</AnalysisLabel>
                    <AnalysisValue>{selectedTrendData.velocity}</AnalysisValue>
                  </AnalysisItem>
                </AnalysisGrid>
                
                {/* Mini Chart */}
                <MiniChart>
                  <ChartLabel>24H TREND</ChartLabel>
                  <ChartBars>
                    {selectedTrendData.sparkline.map((value, index) => (
                      <ChartBar key={index} height={value} />
                    ))}
                  </ChartBars>
                </MiniChart>
              </AnalysisContent>
            </Panel>
          )}

          {/* Regional Interest */}
          <Panel>
            <PanelHeader>
              <Globe size={14} color={COLORS.warning} />
              <PanelTitle>REGIONAL INTEREST</PanelTitle>
              <PanelSubtitle>TOP 10</PanelSubtitle>
            </PanelHeader>
            <RegionalList>
              {regional.map((item) => (
                <RegionalItem key={item.code}>
                  <RegionCode>{item.code}</RegionCode>
                  <RegionBar>
                    <RegionBarFill width={item.interest} />
                  </RegionBar>
                  <RegionPercent>{item.interest}%</RegionPercent>
                </RegionalItem>
              ))}
            </RegionalList>
          </Panel>

          {/* Related Queries */}
          <Panel>
            <PanelHeader>
              <Search size={14} color={COLORS.secondary} />
              <PanelTitle>RELATED QUERIES</PanelTitle>
              <PanelSubtitle>RISING</PanelSubtitle>
            </PanelHeader>
            <QueriesContent>
          {selectedTrendData?.relatedQueries.map((query, index) => (
            <QueryItem 
              key={index} 
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank')}
              style={{ cursor: 'pointer' }}
            >
              <Hash size={10} color={COLORS.primary} />
              <QueryText>{query}</QueryText>
            </QueryItem>
          ))}
            </QueriesContent>
          </Panel>
        </Grid>
      </MainContent>

      {/* Status Bar */}
      <StatusBar>
        <StatusItem>
          <Zap size={12} color={COLORS.success} />
          <StatusText>CONNECTED</StatusText>
        </StatusItem>
        <StatusItem>
          <BarChart3 size={12} color={COLORS.primary} />
          <StatusText>{trends.length} TRENDS</StatusText>
        </StatusItem>
        <StatusItem>
          <AlertCircle size={12} color={COLORS.warning} />
          <StatusText>3 ALERTS</StatusText>
        </StatusItem>
        <StatusItem $clickable onClick={handleShortcuts}>
          <Command size={12} color={COLORS.info} />
          <StatusText>SHORTCUTS</StatusText>
        </StatusItem>
      </StatusBar>

      {/* Search Modal */}
      {showSearch && (
        <ModalOverlay onClick={() => setShowSearch(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <Search size={16} color={COLORS.primary} />
              <ModalTitle>SEARCH & FILTER</ModalTitle>
              <CloseButton onClick={() => setShowSearch(false)}>×</CloseButton>
            </ModalHeader>
            
            <SearchInput
              type="text"
              placeholder="Search trends... (title, category)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            
            <CategoryTabs>
              {categories.map(category => (
                <CategoryTab
                  key={category}
                  $active={selectedCategory === category}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </CategoryTab>
              ))}
            </CategoryTabs>
            
            <div style={{ fontSize: '11px', color: COLORS.textSecondary, fontFamily: FONTS.mono }}>
              Found {filteredTrends.length} trends matching your criteria
            </div>
          </Modal>
        </ModalOverlay>
      )}

      {/* Help Modal */}
      {currentView === 'help' && (
        <ModalOverlay onClick={() => setCurrentView('dashboard')}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <Command size={16} color={COLORS.primary} />
              <ModalTitle>KEYBOARD SHORTCUTS & HELP</ModalTitle>
              <CloseButton onClick={() => setCurrentView('dashboard')}>×</CloseButton>
            </ModalHeader>
            
            <ShortcutGrid>
              <ShortcutKey>↑ / ↓</ShortcutKey>
              <ShortcutDesc>Navigate trends list</ShortcutDesc>
              
              <ShortcutKey>1-9</ShortcutKey>
              <ShortcutDesc>Quick select trend by number</ShortcutDesc>
              
              <ShortcutKey>ENTER</ShortcutKey>
              <ShortcutDesc>Open trend details</ShortcutDesc>
              
              <ShortcutKey>/</ShortcutKey>
              <ShortcutDesc>Open search & filter</ShortcutDesc>
              
              <ShortcutKey>H</ShortcutKey>
              <ShortcutDesc>Show this help dialog</ShortcutDesc>
              
              <ShortcutKey>CTRL+R</ShortcutKey>
              <ShortcutDesc>Refresh data</ShortcutDesc>
              
              <ShortcutKey>ESC</ShortcutKey>
              <ShortcutDesc>Close dialogs / Clear search</ShortcutDesc>
            </ShortcutGrid>
            
            <div style={{ marginTop: '20px', padding: '10px', background: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '2px' }}>
              <div style={{ fontSize: '11px', color: COLORS.primary, fontFamily: FONTS.mono, marginBottom: '8px' }}>
                INTERACTIVE FEATURES:
              </div>
              <div style={{ fontSize: '10px', color: COLORS.textSecondary, fontFamily: FONTS.mono, lineHeight: '1.4' }}>
                • Click trends to select them<br/>
                • Double-click trends for detailed view<br/>
                • Click ticker symbols to search prices<br/>
                • Click related queries to search Google<br/>
                • Use category filters to narrow results
              </div>
            </div>
            
            <div style={{ marginTop: '15px', fontSize: '10px', color: COLORS.textSecondary, fontFamily: FONTS.mono }}>
              Data Source: {trendsService.getStatus().mode.toUpperCase()} | 
              {trendsService.getStatus().source || 'Backend API'}
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
}
