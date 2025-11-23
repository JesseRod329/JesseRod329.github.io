export interface PricePoint {
  asOfDate: Date;
  close: number;
}

export interface MarketDataProvider {
  getPriceHistory: (ticker: string, from: Date, to: Date) => Promise<PricePoint[]>;
  getLatestPrice: (ticker: string) => Promise<PricePoint | null>;
}
