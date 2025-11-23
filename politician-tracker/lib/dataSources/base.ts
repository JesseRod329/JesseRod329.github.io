import { InstrumentType, TransactionType } from "../types";

export interface NormalizedTrade {
  politician: {
    fullName: string;
    chamber: string;
    party: string;
    state?: string | null;
    committees?: string[];
    externalIds?: Record<string, string>;
  };
  trade: {
    ticker: string;
    assetName?: string | null;
    instrumentType: InstrumentType;
    transactionType: TransactionType;
    reportedTransactionDate: Date;
    filedDate?: Date | null;
    amountMin?: number | null;
    amountMax?: number | null;
    sourceName?: string | null;
    sourceRef?: string | null;
    notes?: string | null;
  };
}

export interface PoliticianTradeSource {
  name: string;
  fetchRecentTrades: (since: Date) => Promise<NormalizedTrade[]>;
}
