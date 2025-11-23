import { WatchlistEntry } from "@/lib/types";

export function WatchlistCard({ entry }: { entry: WatchlistEntry }) {
  return (
    <div className="border border-slate-200 rounded-lg bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{entry.name}</h3>
        <span className="text-xs text-slate-500">{entry.politicians.length + entry.tickers.length} items</span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-700">Politicians</h4>
        <ul className="text-sm text-slate-600 list-disc list-inside">
          {entry.politicians.length ? entry.politicians.map((p) => <li key={p.id}>{p.fullName}</li>) : <li>None</li>}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-700">Tickers</h4>
        <p className="text-sm text-slate-600">{entry.tickers.join(", ") || "None"}</p>
      </div>
    </div>
  );
}
