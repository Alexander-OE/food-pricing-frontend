"use client";
// A simple multi-line chart used for usage trends and accuracy over time.
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisTick, ChartTooltip, gridColor } from "./chartStyle";

export interface ChartLine {
  key: string; // name of the number in each data row
  label: string; // name shown in the legend and tooltip
  color: string; // a CSS colour, usually var(--primary)
  dashed?: boolean;
}

interface LineTrendChartProps {
  data: Record<string, string | number>[];
  xKey: string; // name of the label in each data row
  lines: ChartLine[];
  formatValue: (value: number) => string;
  height?: number;
}

export default function LineTrendChart({ data, xKey, lines, formatValue, height = 300 }: LineTrendChartProps) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} width={56} tickFormatter={formatValue} />
          <Tooltip content={<ChartTooltip formatValue={formatValue} />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 13, color: "var(--muted)" }} />
          {lines.map((line) => (
            <Line
              key={line.key}
              dataKey={line.key}
              name={line.label}
              stroke={line.color}
              strokeWidth={2.5}
              strokeDasharray={line.dashed ? "6 4" : undefined}
              dot={false}
              activeDot={{ r: 5 }}
              isAnimationActive={false} // the draw-in animation can leave lines half drawn
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
