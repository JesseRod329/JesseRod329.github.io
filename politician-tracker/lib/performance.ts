import { Trade, PriceSnapshot } from "@prisma/client";
import { mockMarketData } from "./marketData/mockProvider";
import { prisma } from "./prisma";

export async function computePerformance(trade: Trade) {
  const latest = await mockMarketData.getLatestPrice(trade.ticker);
  if (!latest) return null;
  const entryPrice = await prisma.priceSnapshot.findFirst({
    where: { ticker: trade.ticker, asOfDate: { gte: trade.reportedTransactionDate } },
    orderBy: { asOfDate: "asc" }
  });
  if (!entryPrice) return null;

  const change = ((latest.close - entryPrice.closePrice) / entryPrice.closePrice) * 100;
  return Number.isFinite(change) ? change : null;
}

export function summarizeSnapshots(snapshots: PriceSnapshot[]) {
  if (!snapshots.length) return null;
  const [first, ...rest] = snapshots.sort((a, b) => a.asOfDate.getTime() - b.asOfDate.getTime());
  const last = rest[rest.length - 1] ?? first;
  return ((last.closePrice - first.closePrice) / first.closePrice) * 100;
}
