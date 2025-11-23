import { notFound } from "next/navigation";
import { TradeTable } from "@/components/TradeTable";
import { prisma } from "@/lib/prisma";

export default async function PoliticianDetail({ params }: { params: { id: string } }) {
  const politician = await prisma.politician.findUnique({
    where: { id: params.id },
    include: { trades: { orderBy: { reportedTransactionDate: "desc" }, include: { politician: true } } }
  });
  if (!politician) return notFound();

  const instrumentStats = politician.trades.reduce<Record<string, number>>((acc, trade) => {
    acc[trade.instrumentType] = (acc[trade.instrumentType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{politician.fullName}</h2>
        <p className="text-sm text-slate-600">
          {politician.chamber} · {politician.party} {politician.state ? `· ${politician.state}` : ""}
        </p>
        {politician.committees && <p className="text-sm text-slate-600 mt-1">Committees: {politician.committees}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(instrumentStats).map(([type, count]) => (
          <div key={type} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
            <div className="text-xs uppercase text-slate-500">{type}</div>
            <div className="text-xl font-semibold">{count}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">Trades</h3>
        <TradeTable trades={politician.trades} />
      </div>
    </main>
  );
}
