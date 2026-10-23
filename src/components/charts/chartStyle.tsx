// Shared look for all Recharts charts: axis text, grid colour and the hover tooltip.

/** Axis tick text style (uses the theme colour so it works in dark mode). */
export const axisTick = { fill: "var(--muted)", fontSize: 12 };

/** Colour of the faint grid lines. */
export const gridColor = "var(--chart-grid)";

interface TooltipEntry {
  name?: string | number;
  value?: number | string | (number | string)[];
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  formatValue: (value: number) => string; // how to write a number (₦, %, plain)
}

/** The small box that appears when you hover a chart. */
export function ChartTooltip({ active, payload, label, formatValue }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-lift">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((entry) => {
        // A range band has two numbers; show it as "low to high"
        const value = Array.isArray(entry.value)
          ? `${formatValue(Number(entry.value[0]))} to ${formatValue(Number(entry.value[1]))}`
          : formatValue(Number(entry.value));
        return (
          <p key={String(entry.name)} className="flex items-center gap-2 text-muted">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
            {entry.name}: <span className="font-semibold text-ink">{value}</span>
          </p>
        );
      })}
    </div>
  );
}
