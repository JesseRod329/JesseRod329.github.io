import { MarketDataProvider, PricePoint } from "./base";

const MOCK_PRICE: Record<string, PricePoint[]> = {
  AAPL: [
    { asOfDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), close: 185 },
    { asOfDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), close: 188 },
    { asOfDate: new Date(), close: 190 }
  ],
  MSFT: [
    { asOfDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), close: 405 },
    { asOfDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), close: 420 }
  ]
};

async function fetchFromApi(ticker: string, from: Date, to: Date): Promise<PricePoint[]> {
  if (!process.env.MARKET_DATA_API_URL) {
    const points = MOCK_PRICE[ticker.toUpperCase()] ?? [];
    return points.filter((p) => p.asOfDate >= from && p.asOfDate <= to);
  }

  const url = new URL("/prices", process.env.MARKET_DATA_API_URL);
  url.searchParams.set("ticker", ticker.toUpperCase());
  url.searchParams.set("from", from.toISOString());
  url.searchParams.set("to", to.toISOString());
  const res = await fetch(url.toString(), {
    headers: { "x-api-key": process.env.MARKET_DATA_API_KEY ?? "" }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch market data: ${res.status}`);
  }
  const data = (await res.json()) as { asOfDate: string; close: number }[];
  return data.map((item) => ({ asOfDate: new Date(item.asOfDate), close: item.close }));
}

export const mockMarketData: MarketDataProvider = {
  async getPriceHistory(ticker: string, from: Date, to: Date) {
    return fetchFromApi(ticker, from, to);
  },
  async getLatestPrice(ticker: string) {
    const series = await fetchFromApi(ticker, new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), new Date());
    return series.sort((a, b) => b.asOfDate.getTime() - a.asOfDate.getTime())[0] ?? null;
  }
};
