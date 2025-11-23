import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computePerformance } from "@/lib/performance";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
  const chamber = searchParams.get("chamber") ?? undefined;
  const party = searchParams.get("party") ?? undefined;
  const ticker = searchParams.get("ticker") ?? undefined;
  const politicianId = searchParams.get("politicianId") ?? undefined;
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined;
  const to = searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined;

  const where: any = {};
  if (chamber) where.politician = { chamber };
  if (party) where.politician = { ...(where.politician ?? {}), party };
  if (ticker) where.ticker = ticker.toUpperCase();
  if (politicianId) where.politicianId = politicianId;
  if (from || to) {
    where.reportedTransactionDate = {};
    if (from) where.reportedTransactionDate.gte = from;
    if (to) where.reportedTransactionDate.lte = to;
  }

  const [total, trades] = await Promise.all([
    prisma.trade.count({ where }),
    prisma.trade.findMany({
      where,
      include: { politician: true },
      orderBy: { reportedTransactionDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);

  const enriched = await Promise.all(
    trades.map(async (trade) => ({
      ...trade,
      performanceSinceReport: await computePerformance(trade)
    }))
  );

  return NextResponse.json({ page, pageSize, total, data: enriched });
}
