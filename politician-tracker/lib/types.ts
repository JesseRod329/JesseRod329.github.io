export type Chamber = "HOUSE" | "SENATE" | "OTHER";
export type Party = "DEMOCRAT" | "REPUBLICAN" | "INDEPENDENT" | "OTHER";
export type InstrumentType = "STOCK" | "ETF" | "OPTION" | "OTHER";
export type TransactionType = "BUY" | "SELL" | "UNKNOWN";

export interface PoliticianSummary {
  id: string;
  fullName: string;
  chamber: Chamber;
  party: Party;
  state: string | null;
  committees?: string[];
}

export interface TradeSummary {
  id: string;
  ticker: string;
  assetName?: string | null;
  instrumentType: InstrumentType;
  transactionType: TransactionType;
  reportedTransactionDate: string;
  filedDate?: string | null;
  amountMin?: number | null;
  amountMax?: number | null;
  sourceName?: string | null;
  performanceSinceReport?: number | null;
  politician?: PoliticianSummary;
}

export interface WatchlistEntry {
  id: string;
  name: string;
  politicians: PoliticianSummary[];
  tickers: string[];
}
