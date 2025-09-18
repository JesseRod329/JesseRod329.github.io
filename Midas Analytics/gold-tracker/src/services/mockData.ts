import { GoldPrice, GoldPriceHistory, CPIData, MarketIndicator } from '../types';

// Mock data for demonstration when APIs are not available
export const mockGoldPrice: GoldPrice = {
  price: 2650.75, // More realistic current gold price
  currency: 'USD',
  unit: 'per ounce',
  timestamp: new Date().toISOString(),
};

export const mockGoldHistory: GoldPriceHistory[] = [
  { date: '2024-01-01', price: 2020.30, currency: 'USD' },
  { date: '2024-01-02', price: 2025.80, currency: 'USD' },
  { date: '2024-01-03', price: 2018.90, currency: 'USD' },
  { date: '2024-01-04', price: 2032.15, currency: 'USD' },
  { date: '2024-01-05', price: 2041.75, currency: 'USD' },
  { date: '2024-01-08', price: 2038.20, currency: 'USD' },
  { date: '2024-01-09', price: 2045.50, currency: 'USD' },
  { date: '2024-01-10', price: 2052.30, currency: 'USD' },
  { date: '2024-01-11', price: 2048.90, currency: 'USD' },
  { date: '2024-01-12', price: 2055.60, currency: 'USD' },
  { date: '2024-01-15', price: 2042.80, currency: 'USD' },
  { date: '2024-01-16', price: 2048.15, currency: 'USD' },
  { date: '2024-01-17', price: 2051.40, currency: 'USD' },
  { date: '2024-01-18', price: 2047.25, currency: 'USD' },
  { date: '2024-01-19', price: 2053.70, currency: 'USD' },
  { date: '2024-01-22', price: 2049.85, currency: 'USD' },
  { date: '2024-01-23', price: 2056.20, currency: 'USD' },
  { date: '2024-01-24', price: 2052.45, currency: 'USD' },
  { date: '2024-01-25', price: 2048.90, currency: 'USD' },
  { date: '2024-01-26', price: 2054.35, currency: 'USD' },
  { date: '2024-01-29', price: 2050.60, currency: 'USD' },
  { date: '2024-01-30', price: 2047.15, currency: 'USD' },
  { date: '2024-01-31', price: 2053.80, currency: 'USD' },
  { date: '2024-02-01', price: 2049.25, currency: 'USD' },
  { date: '2024-02-02', price: 2055.90, currency: 'USD' },
  { date: '2024-02-05', price: 2052.40, currency: 'USD' },
  { date: '2024-02-06', price: 2048.75, currency: 'USD' },
  { date: '2024-02-07', price: 2054.20, currency: 'USD' },
  { date: '2024-02-08', price: 2050.85, currency: 'USD' },
  { date: '2024-02-09', price: 2045.50, currency: 'USD' },
];

export const mockCPIData: CPIData[] = [
  { date: '2024-01-01', value: 308.417, series_id: 'CPIAUCSL' },
  { date: '2024-02-01', value: 310.326, series_id: 'CPIAUCSL' },
  { date: '2024-03-01', value: 312.332, series_id: 'CPIAUCSL' },
  { date: '2024-04-01', value: 313.548, series_id: 'CPIAUCSL' },
  { date: '2024-05-01', value: 314.069, series_id: 'CPIAUCSL' },
  { date: '2024-06-01', value: 314.175, series_id: 'CPIAUCSL' },
  { date: '2024-07-01', value: 314.175, series_id: 'CPIAUCSL' },
  { date: '2024-08-01', value: 314.175, series_id: 'CPIAUCSL' },
  { date: '2024-09-01', value: 314.175, series_id: 'CPIAUCSL' },
  { date: '2024-10-01', value: 314.175, series_id: 'CPIAUCSL' },
  { date: '2024-11-01', value: 314.175, series_id: 'CPIAUCSL' },
  { date: '2024-12-01', value: 314.175, series_id: 'CPIAUCSL' },
];

export const mockMarketIndicators: MarketIndicator[] = [
  {
    name: 'VIX',
    value: 18.5,
    change: -1.2,
    changePercent: -6.1,
    timestamp: new Date().toISOString(),
  },
  {
    name: 'Dollar Index',
    value: 103.2,
    change: 0.3,
    changePercent: 0.3,
    timestamp: new Date().toISOString(),
  },
  {
    name: '10-Year Treasury Yield',
    value: 4.25,
    change: -0.05,
    changePercent: -1.2,
    timestamp: new Date().toISOString(),
  },
];
