type BarDatum = {
  label: string;
  value: number;
  colorClass?: string;
};

export function HorizontalBarChart({
  data,
  emptyLabel = "No data yet",
}: {
  data: BarDatum[];
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return <p className="text-sm text-slate-400 py-6 text-center">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs text-slate-600 truncate" title={d.label}>
            {d.label}
          </span>
          <div className="flex-1 h-3 flex items-center">
            {d.value > 0 && (
              <div
                className={`h-3 rounded-r-[4px] ${d.colorClass ?? "bg-brand-600"}`}
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            )}
          </div>
          <span className="w-6 shrink-0 text-xs font-semibold text-slate-800 tabular-nums text-right">
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}
