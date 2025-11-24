import { NormalizedTrade, PoliticianTradeSource } from "./base";
import { InstrumentType, TransactionType } from "../types";

// Expanded Mock Data to cover all major states
const MOCK_TRADES: NormalizedTrade[] = [
  // California
  {
    politician: { fullName: "Nancy Pelosi", chamber: "HOUSE", party: "DEMOCRAT", state: "CA", committees: ["Finance"], externalIds: { quiver: "p-1" } },
    trade: { ticker: "NVDA", instrumentType: "OPTION", transactionType: "BUY", reportedTransactionDate: new Date(), amountMin: 1000000, amountMax: 5000000, sourceName: "mock", sourceRef: "m-1" }
  },
  {
    politician: { fullName: "Ro Khanna", chamber: "HOUSE", party: "DEMOCRAT", state: "CA", committees: ["Armed Services"], externalIds: { quiver: "p-2" } },
    trade: { ticker: "TSLA", instrumentType: "STOCK", transactionType: "SELL", reportedTransactionDate: new Date(), amountMin: 50000, amountMax: 100000, sourceName: "mock", sourceRef: "m-2" }
  },
  // Texas
  {
    politician: { fullName: "Dan Crenshaw", chamber: "HOUSE", party: "REPUBLICAN", state: "TX", committees: ["Energy"], externalIds: { quiver: "p-3" } },
    trade: { ticker: "XOM", instrumentType: "STOCK", transactionType: "BUY", reportedTransactionDate: new Date(), amountMin: 15000, amountMax: 50000, sourceName: "mock", sourceRef: "m-3" }
  },
  {
    politician: { fullName: "Michael McCaul", chamber: "HOUSE", party: "REPUBLICAN", state: "TX", committees: ["Foreign Affairs"], externalIds: { quiver: "p-4" } },
    trade: { ticker: "META", instrumentType: "STOCK", transactionType: "SELL", reportedTransactionDate: new Date(), amountMin: 100000, amountMax: 250000, sourceName: "mock", sourceRef: "m-4" }
  },
  // New York
  {
    politician: { fullName: "Alexandria Ocasio-Cortez", chamber: "HOUSE", party: "DEMOCRAT", state: "NY", committees: ["Oversight"], externalIds: { quiver: "p-5" } },
    trade: { ticker: "AAPL", instrumentType: "STOCK", transactionType: "BUY", reportedTransactionDate: new Date(), amountMin: 1000, amountMax: 15000, sourceName: "mock", sourceRef: "m-5" }
  },
  // Florida
  {
    politician: { fullName: "Rick Scott", chamber: "SENATE", party: "REPUBLICAN", state: "FL", committees: ["Budget"], externalIds: { quiver: "p-6" } },
    trade: { ticker: "MSFT", instrumentType: "STOCK", transactionType: "BUY", reportedTransactionDate: new Date(), amountMin: 500000, amountMax: 1000000, sourceName: "mock", sourceRef: "m-6" }
  },
  // Georgia
  {
    politician: { fullName: "Marjorie Taylor Greene", chamber: "HOUSE", party: "REPUBLICAN", state: "GA", committees: ["Homeland Security"], externalIds: { quiver: "p-7" } },
    trade: { ticker: "LMT", instrumentType: "STOCK", transactionType: "BUY", reportedTransactionDate: new Date(), amountMin: 15000, amountMax: 50000, sourceName: "mock", sourceRef: "m-7" }
  },
  // Illinois
  {
    politician: { fullName: "Dick Durbin", chamber: "SENATE", party: "DEMOCRAT", state: "IL", committees: ["Judiciary"], externalIds: { quiver: "p-8" } },
    trade: { ticker: "AMZN", instrumentType: "STOCK", transactionType: "SELL", reportedTransactionDate: new Date(), amountMin: 50000, amountMax: 100000, sourceName: "mock", sourceRef: "m-8" }
  },
  // Virginia
  {
    politician: { fullName: "Mark Warner", chamber: "SENATE", party: "DEMOCRAT", state: "VA", committees: ["Intelligence"], externalIds: { quiver: "p-9" } },
    trade: { ticker: "GOOGL", instrumentType: "STOCK", transactionType: "BUY", reportedTransactionDate: new Date(), amountMin: 100000, amountMax: 250000, sourceName: "mock", sourceRef: "m-9" }
  },
  // Pennsylvania
  {
    politician: { fullName: "Bob Casey", chamber: "SENATE", party: "DEMOCRAT", state: "PA", committees: ["Finance"], externalIds: { quiver: "p-10" } },
    trade: { ticker: "JPM", instrumentType: "STOCK", transactionType: "BUY", reportedTransactionDate: new Date(), amountMin: 15000, amountMax: 50000, sourceName: "mock", sourceRef: "m-10" }
  }
];

async function fetchFromApi(since: Date): Promise<NormalizedTrade[]> {
  if (!process.env.POLITICIAN_TRADES_API_URL) {
    return MOCK_TRADES;
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
