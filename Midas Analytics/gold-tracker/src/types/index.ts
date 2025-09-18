export interface GoldPrice {
  price: number;
  currency: string;
  unit: string;
  timestamp: string;
}

export interface GoldPriceHistory {
  date: string;
  price: number;
  currency: string;
}

export interface CPIData {
  date: string;
  value: number;
  series_id: string;
}

export interface CorrelationData {
  period: string;
  correlation: number;
  rSquared: number;
  dataPoints: number;
}

export interface MarketIndicator {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface DashboardData {
  currentGoldPrice: GoldPrice;
  goldHistory: GoldPriceHistory[];
  cpiData: CPIData[];
  correlation: CorrelationData;
  marketIndicators: MarketIndicator[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
