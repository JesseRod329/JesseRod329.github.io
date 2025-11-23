import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockMarketData } from "@/lib/marketData/mockProvider";

export async function GET(_req: NextRequest, { params }: { params: { ticker: string } }) {
  const ticker = params.ticker.toUpperCase();
  const trades = await prisma.trade.findMany({
    where: { ticker },
    include: { politician: true },
    orderBy: { reportedTransactionDate: "desc" }
  });

  const history = await mockMarketData.getPriceHistory(
    ticker,
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
    new Date()
  );

  return NextResponse.json({ ticker, trades, history });
}
