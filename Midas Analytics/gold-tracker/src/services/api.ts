import axios from 'axios';
import { GoldPrice, GoldPriceHistory, CPIData, MarketIndicator, ApiResponse } from '../types';
import { mockGoldPrice, mockGoldHistory, mockCPIData, mockMarketIndicators } from './mockData';

// API Configuration
const FRED_API_KEY = process.env.REACT_APP_FRED_API_KEY || 'demo';
const ALPHA_VANTAGE_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY || 'demo';

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const GOLD_PRICE_API_URL = 'https://api.ninjas.com/v1/goldprice';

// Create axios instances
const fredApi = axios.create({
  baseURL: FRED_BASE_URL,
  timeout: 10000,
});

const alphaVantageApi = axios.create({
  baseURL: ALPHA_VANTAGE_BASE_URL,
  timeout: 10000,
});

const goldPriceApi = axios.create({
  baseURL: GOLD_PRICE_API_URL,
  timeout: 10000,
});

// Gold Price API - Using Alpha Vantage for real gold futures data
export const getCurrentGoldPrice = async (): Promise<ApiResponse<GoldPrice>> => {
  try {
    // Use Alpha Vantage to get current gold futures price (daily data)
    const response = await alphaVantageApi.get(`?function=TIME_SERIES_DAILY&symbol=GC=F&apikey=${ALPHA_VANTAGE_KEY}&outputsize=compact`);
    
    if (response.data && response.data['Time Series (Daily)']) {
      const timeSeries = response.data['Time Series (Daily)'];
      const latestDate = Object.keys(timeSeries).sort().reverse()[0];
      const latestData = timeSeries[latestDate];
      
      const goldPrice: GoldPrice = {
        price: parseFloat(latestData['4. close']), // Use closing price
        currency: 'USD',
        unit: 'per ounce',
        timestamp: new Date().toISOString(),
      };
      return { data: goldPrice, success: true };
    } else {
      throw new Error('Invalid response from Alpha Vantage');
    }
  } catch (error) {
    console.error('Error fetching gold price:', error);
    // Fallback to mock data
    return { 
      data: mockGoldPrice, 
      success: true, 
      error: 'Using mock data - Alpha Vantage API error' 
    };
  }
};

// Historical Gold Price API - Using Alpha Vantage for gold futures
export const getGoldPriceHistory = async (days: number = 30): Promise<ApiResponse<GoldPriceHistory[]>> => {
  try {
    // Use Alpha Vantage to get gold futures data
    const response = await alphaVantageApi.get(`?function=TIME_SERIES_DAILY&symbol=GC=F&apikey=${ALPHA_VANTAGE_KEY}&outputsize=compact`);
    
    if (response.data && response.data['Time Series (Daily)']) {
      const timeSeries = response.data['Time Series (Daily)'];
      const history: GoldPriceHistory[] = Object.entries(timeSeries)
        .slice(0, days) // Get last 30 days
        .map(([date, data]: [string, any]) => ({
          date,
          price: parseFloat(data['4. close']), // Use closing price
          currency: 'USD',
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return { data: history, success: true };
    } else {
      throw new Error('Invalid response from Alpha Vantage');
    }
  } catch (error) {
    console.error('Error fetching gold price history:', error);
    // Fallback to mock data
    return { data: mockGoldHistory, success: true, error: 'Using mock data - Alpha Vantage API error' };
  }
};

// CPI Data API
export const getCPIData = async (months: number = 12): Promise<ApiResponse<CPIData[]>> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);
    
    const response = await fredApi.get(`/series/observations?series_id=CPIAUCSL&api_key=${FRED_API_KEY}&file_type=json&observation_start=${startDate.toISOString().split('T')[0]}&observation_end=${endDate.toISOString().split('T')[0]}&sort_order=asc`);
    
    if (response.data.observations) {
      const cpiData: CPIData[] = response.data.observations
        .filter((obs: any) => obs.value !== '.')
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
          series_id: 'CPIAUCSL',
        }));
      
      return { data: cpiData, success: true };
    } else {
      throw new Error('Failed to fetch CPI data');
    }
  } catch (error) {
    console.error('Error fetching CPI data:', error);
    return { data: mockCPIData, success: true, error: 'Using mock data - FRED API error' };
  }
};

// Market Indicators API - Using Alpha Vantage
export const getMarketIndicators = async (): Promise<ApiResponse<MarketIndicator[]>> => {
  try {
    const indicators: MarketIndicator[] = [];
    
    // Get VIX (Volatility Index)
    try {
      const vixResponse = await alphaVantageApi.get(`?function=TIME_SERIES_DAILY&symbol=VIX&apikey=${ALPHA_VANTAGE_KEY}&outputsize=compact`);
      if (vixResponse.data && vixResponse.data['Time Series (Daily)']) {
        const timeSeries = vixResponse.data['Time Series (Daily)'];
        const dates = Object.keys(timeSeries).sort();
        const latest = timeSeries[dates[0]];
        const previous = timeSeries[dates[1]];
        
        const currentValue = parseFloat(latest['4. close']);
        const previousValue = parseFloat(previous['4. close']);
        const change = currentValue - previousValue;
        const changePercent = (change / previousValue) * 100;
        
        indicators.push({
          name: 'VIX',
          value: currentValue,
          change: change,
          changePercent: changePercent,
          timestamp: dates[0],
        });
      }
    } catch (error) {
      console.warn('Failed to fetch VIX:', error);
    }
    
    // Get 10-Year Treasury Yield
    try {
      const treasuryResponse = await alphaVantageApi.get(`?function=TREASURY_YIELD&interval=monthly&maturity=10year&apikey=${ALPHA_VANTAGE_KEY}`);
      if (treasuryResponse.data.data && treasuryResponse.data.data.length > 0) {
        const latest = treasuryResponse.data.data[0];
        const previous = treasuryResponse.data.data[1];
        
        const currentValue = parseFloat(latest.value);
        const previousValue = parseFloat(previous.value);
        const change = currentValue - previousValue;
        const changePercent = (change / previousValue) * 100;
        
        indicators.push({
          name: '10-Year Treasury Yield',
          value: currentValue,
          change: change,
          changePercent: changePercent,
          timestamp: latest.date,
        });
      }
    } catch (error) {
      console.warn('Failed to fetch Treasury yield:', error);
    }
    
    // Get Dollar Index (DXY)
    try {
      const dxyResponse = await alphaVantageApi.get(`?function=TIME_SERIES_DAILY&symbol=DX-Y.NYB&apikey=${ALPHA_VANTAGE_KEY}&outputsize=compact`);
      if (dxyResponse.data && dxyResponse.data['Time Series (Daily)']) {
        const timeSeries = dxyResponse.data['Time Series (Daily)'];
        const dates = Object.keys(timeSeries).sort();
        const latest = timeSeries[dates[0]];
        const previous = timeSeries[dates[1]];
        
        const currentValue = parseFloat(latest['4. close']);
        const previousValue = parseFloat(previous['4. close']);
        const change = currentValue - previousValue;
        const changePercent = (change / previousValue) * 100;
        
        indicators.push({
          name: 'Dollar Index',
          value: currentValue,
          change: change,
          changePercent: changePercent,
          timestamp: dates[0],
        });
      }
    } catch (error) {
      console.warn('Failed to fetch Dollar Index:', error);
    }
    
    // If no real data was fetched, use mock data
    if (indicators.length === 0) {
      return { data: mockMarketIndicators, success: true, error: 'Using mock data - Alpha Vantage key needed for real data' };
    }
    
    return { data: indicators, success: true };
  } catch (error) {
    console.error('Error fetching market indicators:', error);
    return { data: mockMarketIndicators, success: true, error: 'Using mock data due to API error' };
  }
};

// Calculate correlation between gold and CPI
export const calculateCorrelation = (goldData: GoldPriceHistory[], cpiData: CPIData[]): number => {
  if (goldData.length === 0 || cpiData.length === 0) return 0;
  
  // Align data by date and calculate correlation
  const alignedData: { gold: number; cpi: number }[] = [];
  
  goldData.forEach(gold => {
    const cpi = cpiData.find(c => c.date === gold.date);
    if (cpi) {
      alignedData.push({ gold: gold.price, cpi: cpi.value });
    }
  });
  
  if (alignedData.length < 2) return 0;
  
  const n = alignedData.length;
  const sumGold = alignedData.reduce((sum, d) => sum + d.gold, 0);
  const sumCpi = alignedData.reduce((sum, d) => sum + d.cpi, 0);
  const sumGoldSquared = alignedData.reduce((sum, d) => sum + d.gold * d.gold, 0);
  const sumCpiSquared = alignedData.reduce((sum, d) => sum + d.cpi * d.cpi, 0);
  const sumGoldCpi = alignedData.reduce((sum, d) => sum + d.gold * d.cpi, 0);
  
  const numerator = n * sumGoldCpi - sumGold * sumCpi;
  const denominator = Math.sqrt((n * sumGoldSquared - sumGold * sumGold) * (n * sumCpiSquared - sumCpi * sumCpi));
  
  return denominator === 0 ? 0 : numerator / denominator;
};
