import { readFileSync } from 'fs';
import { join } from 'path';
import { NormalizedTrade, PoliticianTradeSource } from "./base";
import { InstrumentType, TransactionType } from "../types";

// Parse trade size strings like "1K–15K", "50K–100K", "$1M–$5M" to min/max values
function parseTradeSize(tradeSize: string | null | undefined): { min: number | null; max: number | null } {
  if (!tradeSize) return { min: null, max: null };
  
  // Remove $ and spaces
  const cleaned = tradeSize.replace(/\$/g, '').replace(/\s/g, '');
  
  // Match patterns like "1K–15K", "50K–100K", "1M–5M"
  const match = cleaned.match(/([\d.]+)([KM]?)–([\d.]+)([KM]?)/);
  if (!match) return { min: null, max: null };
  
  const [, minVal, minUnit, maxVal, maxUnit] = match;
  
  const multiplier: Record<string, number> = {
    '': 1,
    'K': 1000,
    'M': 1000000
  };
  
  const min = parseFloat(minVal) * (multiplier[minUnit] || 1);
  const max = parseFloat(maxVal) * (multiplier[maxUnit] || 1);
  
  return { min, max };
}

// Map chamber from Capitol Trades format to our format
function mapChamber(chamber: string | null | undefined): string {
  if (!chamber) return 'OTHER';
  const upper = chamber.toUpperCase();
  if (upper === 'HOUSE') return 'HOUSE';
  if (upper === 'SENATE') return 'SENATE';
  return 'OTHER';
}

// Map party from Capitol Trades format to our format
function mapParty(party: string | null | undefined): string {
  if (!party) return 'OTHER';
  const upper = party.toUpperCase();
  if (upper.includes('DEMOCRAT')) return 'DEMOCRAT';
  if (upper.includes('REPUBLICAN')) return 'REPUBLICAN';
  if (upper.includes('INDEPENDENT')) return 'INDEPENDENT';
  return 'OTHER';
}

// Extract ticker from issuer.ticker (remove :US suffix)
function extractTicker(issuer: any): string | null {
  if (!issuer?.ticker) return null;
  return issuer.ticker.replace(/:US$/, '').trim();
}

// Parse date from tradeDate object
function parseTradeDate(tradeDate: any): Date | null {
  if (!tradeDate) return null;
  
  // Try to parse from display format like "10 Oct 2025"
  if (tradeDate.display) {
    const parsed = new Date(tradeDate.display);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  
  // Try year field
  if (tradeDate.year) {
    const parsed = new Date(tradeDate.year);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  
  return null;
}

// Map transaction type
function mapTransactionType(type: string | null | undefined): TransactionType {
  if (!type) return 'UNKNOWN';
  const upper = type.toUpperCase();
  if (upper === 'BUY' || upper === 'PURCHASE') return 'BUY';
  if (upper === 'SELL' || upper === 'SALE') return 'SELL';
  return 'UNKNOWN';
}

// Map instrument type (default to STOCK)
function mapInstrumentType(): InstrumentType {
  return 'STOCK';
}

interface CapitolTradesData {
  politician: {
    name: string;
    slug: string;
    url: string;
    party: string;
    chamber: string;
    state: string;
  };
  issuer: {
    name: string;
    slug: string;
    url: string;
    ticker: string;
  };
  tradeDate: {
    display: string;
    day: string;
    year: string;
  };
  tradeSize: string;
  transactionType: string;
  reportingGapDays?: number;
  detailUrl?: string;
  owner?: string;
}

async function loadCapitolTradesData(jsonlPath?: string): Promise<CapitolTradesData[]> {
  const path = jsonlPath || join(process.cwd(), '..', 'data', 'capitol-trades', 'trades.jsonl');
  
  try {
    const content = readFileSync(path, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    return lines.map(line => JSON.parse(line));
  } catch (error) {
    console.error(`Failed to load Capitol Trades data from ${path}:`, error);
    return [];
  }
}

async function fetchFromCapitolTrades(since: Date, jsonlPath?: string): Promise<NormalizedTrade[]> {
  const trades = await loadCapitolTradesData(jsonlPath);
  
  return trades
    .filter(trade => {
      const tradeDate = parseTradeDate(trade.tradeDate);
      return tradeDate && tradeDate >= since;
    })
    .flatMap(trade => {
      const politician = trade.politician;
      const issuer = trade.issuer;
      const ticker = extractTicker(issuer);
      
      if (!ticker || !politician?.name) {
        return [];
      }
      
      const { min: amountMin, max: amountMax } = parseTradeSize(trade.tradeSize);
      const reportedTransactionDate = parseTradeDate(trade.tradeDate);
      
      if (!reportedTransactionDate) {
        return [];
      }
      
      // Calculate filed date from reporting gap
      let filedDate: Date | null = null;
      if (trade.reportingGapDays && reportedTransactionDate) {
        filedDate = new Date(reportedTransactionDate);
        filedDate.setDate(filedDate.getDate() + (trade.reportingGapDays || 0));
      }
      
      return [{
        politician: {
          fullName: politician.name,
          chamber: mapChamber(politician.chamber) as any,
          party: mapParty(politician.party) as any,
          state: politician.state || null,
          committees: [], // Capitol Trades doesn't provide committees in trade data
          externalIds: {
            capitolTrades: {
              slug: politician.slug,
              url: politician.url
            }
          }
        },
        trade: {
          ticker,
          assetName: issuer.name || null,
          instrumentType: mapInstrumentType(),
          transactionType: mapTransactionType(trade.transactionType),
          reportedTransactionDate,
          filedDate,
          amountMin,
          amountMax,
          sourceName: 'capitol-trades',
          sourceRef: trade.detailUrl || undefined,
          notes: trade.owner ? `Owner: ${trade.owner}` : undefined
        }
      }];
    });
}

export const capitolTradesSource: PoliticianTradeSource = {
  name: "capitol-trades",
  async fetchRecentTrades(since: Date) {
    return fetchFromCapitolTrades(since);
  }
};

