import { Trade } from "@prisma/client";
import { TradeSummary } from "@/lib/types";

interface Props {
  trades: (TradeSummary | (Trade & { politician?: { fullName: string; party: string; chamber: string } | null }))[];
}

export function TradeTable({ trades }: Props) {
  if (!trades.length) {
    return <p className="text-sm text-slate-600">No trades available.</p>;
  }

  return (
    <div className="table-container">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-left text-slate-700">
          <tr>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Politician</th>
            <th className="px-3 py-2">Ticker</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Performance</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-3 py-2">{new Date(trade.reportedTransactionDate).toLocaleDateString()}</td>
              <td className="px-3 py-2 whitespace-nowrap">{trade.politician?.fullName ?? "Unknown"}</td>
              <td className="px-3 py-2 font-semibold">{trade.ticker}</td>
              <td className="px-3 py-2 uppercase text-xs text-slate-600">{trade.transactionType}</td>
              <td className="px-3 py-2">
                {trade.amountMin ? `$${trade.amountMin.toLocaleString()} - $${trade.amountMax?.toLocaleString() ?? "?"}` : "n/a"}
              </td>
              <td className="px-3 py-2">
                {trade.performanceSinceReport !== undefined && trade.performanceSinceReport !== null
                  ? `${trade.performanceSinceReport.toFixed(2)}%`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
