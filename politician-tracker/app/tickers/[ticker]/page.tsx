import { ChartPlaceholder } from "@/components/ChartPlaceholder";
import { TradeTable } from "@/components/TradeTable";
import { prisma } from "@/lib/prisma";

export default async function TickerDetail({ params }: { params: { ticker: string } }) {
  const ticker = params.ticker.toUpperCase();
  const trades = await prisma.trade.findMany({
    where: { ticker },
    include: { politician: true },
    orderBy: { reportedTransactionDate: "desc" }
  });

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{ticker}</h2>
          <p className="text-sm text-slate-600">Trades by politicians</p>
        </div>
        <a href="/" className="text-sm text-brand-700">
          Back to dashboard
        </a>
      </div>
      <ChartPlaceholder label={`${ticker} price`} />
      <TradeTable trades={trades} />
    </main>
  );
}
