import { StatsBar } from "@/components/StatsBar";
import { TradeTable } from "@/components/TradeTable";
import { prisma } from "@/lib/prisma";
import { computePerformance } from "@/lib/performance";
import InteractiveMapSection from "@/components/InteractiveMapSection";

async function getRecentTrades() {
  // Prioritize Capitol Trades data, exclude mock data
  const trades = await prisma.trade.findMany({
    where: {
      sourceName: { not: 'mock' } // Exclude mock data
    },
    include: { politician: true },
    orderBy: { reportedTransactionDate: "desc" },
    take: 10
  });
  const enriched = await Promise.all(
    trades.map(async (trade) => ({
      ...trade,
      performanceSinceReport: await computePerformance(trade)
    }))
  );
  return enriched;
}

export default async function Home() {
  const [trades, counts] = await Promise.all([
    getRecentTrades(),
    prisma.trade.groupBy({ by: ["ticker"], _count: { ticker: true }, orderBy: { _count: { ticker: "desc" } }, take: 5 })
  ]);

  const stats = [
    { label: "Recent trades", value: trades.length },
    { label: "Unique tickers", value: counts.length },
    { label: "Top ticker", value: counts[0]?.ticker ?? "n/a" }
  ];

  return (
    <main className="space-y-8">
      {/* Interactive Globe Section */}
      <InteractiveMapSection />

      <StatsBar stats={stats} />
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Recent trades</h2>
          <a className="text-sm text-brand-700" href="/politicians">
            Browse politicians
          </a>
        </div>
        <TradeTable trades={trades} />
      </section>
    </main>
  );
}
