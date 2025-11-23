import { NormalizedTrade, PoliticianTradeSource } from "./base";
import { InstrumentType, TransactionType } from "../types";

const MOCK_TRADES: NormalizedTrade[] = [
  {
    politician: {
      fullName: "Casey Sample",
      chamber: "HOUSE",
      party: "DEMOCRAT",
      state: "CA",
      committees: ["Finance"],
      externalIds: { quiver: "p-123" }
    },
    trade: {
      ticker: "AAPL",
      instrumentType: "STOCK",
      transactionType: "BUY",
      reportedTransactionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      filedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      amountMin: 10000,
      amountMax: 50000,
      sourceName: "mock",
      sourceRef: "mock-1",
      notes: "Example mocked trade"
    }
  },
  {
    politician: {
      fullName: "Jordan Example",
      chamber: "SENATE",
      party: "REPUBLICAN",
      state: "TX",
      externalIds: { quiver: "p-456" }
    },
    trade: {
      ticker: "MSFT",
      instrumentType: "STOCK",
      transactionType: "SELL",
      reportedTransactionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      amountMin: 15000,
      amountMax: 30000,
      sourceName: "mock",
      sourceRef: "mock-2"
    }
  }
];

async function fetchFromApi(since: Date): Promise<NormalizedTrade[]> {
  if (!process.env.POLITICIAN_TRADES_API_URL) {
    return MOCK_TRADES.filter((trade) => trade.trade.reportedTransactionDate >= since);
  }

  const url = new URL("/trades", process.env.POLITICIAN_TRADES_API_URL);
  url.searchParams.set("since", since.toISOString());
  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.POLITICIAN_TRADES_API_KEY ?? ""
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch trades: ${res.status}`);
  }

  const data = (await res.json()) as any[];
  return data.map((item) => ({
    politician: {
      fullName: item.politician?.fullName ?? "Unknown",
      chamber: item.politician?.chamber ?? "OTHER",
      party: item.politician?.party ?? "OTHER",
      state: item.politician?.state ?? null,
      committees: item.politician?.committees ?? [],
      externalIds: item.politician?.externalIds ?? {}
    },
    trade: {
      ticker: item.trade?.ticker,
      assetName: item.trade?.assetName ?? null,
      instrumentType: (item.trade?.instrumentType as InstrumentType) ?? "OTHER",
      transactionType: (item.trade?.transactionType as TransactionType) ?? "UNKNOWN",
      reportedTransactionDate: new Date(item.trade?.reportedTransactionDate),
      filedDate: item.trade?.filedDate ? new Date(item.trade?.filedDate) : null,
      amountMin: item.trade?.amountMin ?? null,
      amountMax: item.trade?.amountMax ?? null,
      sourceName: item.trade?.sourceName ?? "external",
      sourceRef: item.trade?.sourceRef ?? undefined,
      notes: item.trade?.notes ?? undefined
    }
  }));
}

export const mockTradeSource: PoliticianTradeSource = {
  name: "mock",
  async fetchRecentTrades(since: Date) {
    return fetchFromApi(since);
  }
};
