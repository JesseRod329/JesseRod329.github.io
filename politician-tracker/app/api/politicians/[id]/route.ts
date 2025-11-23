import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { summarizeSnapshots } from "@/lib/performance";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const politician = await prisma.politician.findUnique({
    where: { id: params.id },
    include: {
      trades: {
        orderBy: { reportedTransactionDate: "desc" },
        include: { priceSnapshots: true }
      }
    }
  });

  if (!politician) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const instrumentCounts = politician.trades.reduce<Record<string, number>>((acc, trade) => {
    acc[trade.instrumentType] = (acc[trade.instrumentType] ?? 0) + 1;
    return acc;
  }, {});

  const tickerCounts = politician.trades.reduce<Record<string, number>>((acc, trade) => {
    acc[trade.ticker] = (acc[trade.ticker] ?? 0) + 1;
    return acc;
  }, {});

  const performance = politician.trades.map((trade) => ({
    tradeId: trade.id,
    ticker: trade.ticker,
    change: summarizeSnapshots(trade.priceSnapshots)
  }));

  return NextResponse.json({
    ...politician,
    stats: {
      instrumentCounts,
      tickerCounts,
      performance
    }
  });
}
