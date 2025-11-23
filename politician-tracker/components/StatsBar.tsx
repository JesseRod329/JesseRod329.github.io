interface StatItem {
  label: string;
  value: string | number;
}

export function StatsBar({ stats }: { stats: StatItem[] }) {
  if (!stats.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</div>
          <div className="text-xl font-semibold text-slate-900">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
