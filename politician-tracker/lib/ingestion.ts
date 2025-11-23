import { prisma } from "./prisma";
import { mockTradeSource } from "./dataSources/mockSource";
import { PoliticianTradeSource } from "./dataSources/base";

function normalizeString(value: string | null | undefined) {
  return value?.trim();
}

export async function ingestRecentTrades({ since }: { since: Date; source?: PoliticianTradeSource }) {
  const tradeSource = source ?? mockTradeSource;
  const trades = await tradeSource.fetchRecentTrades(since);

  for (const item of trades) {
    const politician = await prisma.politician.upsert({
      where: { fullName: item.politician.fullName },
      create: {
        fullName: item.politician.fullName,
        chamber: (item.politician.chamber || "OTHER") as any,
        party: (item.politician.party || "OTHER") as any,
        state: normalizeString(item.politician.state ?? null),
        committees: item.politician.committees?.join(",") ?? null,
        externalIds: item.politician.externalIds ?? {}
      },
      update: {
        chamber: (item.politician.chamber || "OTHER") as any,
        party: (item.politician.party || "OTHER") as any,
        state: normalizeString(item.politician.state ?? null),
        committees: item.politician.committees?.join(",") ?? null,
        externalIds: item.politician.externalIds ?? {}
      }
    });

    await prisma.trade.upsert({
      where: {
        politicianId_ticker_reportedTransactionDate_amountMin_amountMax_sourceName_sourceRef: {
          politicianId: politician.id,
          ticker: item.trade.ticker,
          reportedTransactionDate: item.trade.reportedTransactionDate,
          amountMin: item.trade.amountMin ?? null,
          amountMax: item.trade.amountMax ?? null,
          sourceName: item.trade.sourceName ?? null,
          sourceRef: item.trade.sourceRef ?? null
        }
      },
      create: {
        politicianId: politician.id,
        ticker: item.trade.ticker,
        assetName: normalizeString(item.trade.assetName ?? null),
        instrumentType: item.trade.instrumentType as any,
        transactionType: item.trade.transactionType as any,
        reportedTransactionDate: item.trade.reportedTransactionDate,
        filedDate: item.trade.filedDate ?? null,
        amountMin: item.trade.amountMin ?? null,
        amountMax: item.trade.amountMax ?? null,
        sourceName: item.trade.sourceName ?? tradeSource.name,
        sourceRef: item.trade.sourceRef ?? tradeSource.name,
        notes: item.trade.notes ?? null
      },
      update: {
        assetName: normalizeString(item.trade.assetName ?? null),
        transactionType: item.trade.transactionType as any,
        filedDate: item.trade.filedDate ?? null,
        amountMin: item.trade.amountMin ?? null,
        amountMax: item.trade.amountMax ?? null,
        notes: item.trade.notes ?? null
      }
    });
  }

  return { count: trades.length };
}
