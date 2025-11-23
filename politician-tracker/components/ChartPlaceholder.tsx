export function ChartPlaceholder({ label }: { label: string }) {
  return (
    <div className="h-48 border border-dashed border-brand-100 rounded-lg bg-white flex items-center justify-center text-sm text-slate-500">
      {label} chart placeholder
    </div>
  );
}
