"use client";
// Price history line with the forecast point and its likely range drawn on the end.
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMonthShort, formatNaira } from "@/lib/format";
import type { PriceHistory } from "@/types/commodity";
import { axisTick, ChartTooltip, gridColor } from "./chartStyle";

interface Row {
  label: string;
  price?: number;
  forecast?: number;
  range?: [number, number];
}

/** Turns the API's history and forecast into rows the chart can draw. */
function buildRows({ history, forecast }: PriceHistory): Row[] {
  const rows: Row[] = history.map((point) => ({ label: formatMonthShort(point.period), price: point.price }));
  if (forecast && rows.length > 0) {
    // The last real price also starts the forecast line, so the two lines join up
    const last = rows[rows.length - 1];
    last.forecast = last.price;
    last.range = [last.price!, last.price!];
    rows.push({
      label: formatMonthShort(forecast.period),
      forecast: forecast.price,
      range: [forecast.lowerBound, forecast.upperBound],
    });
  }
  return rows;
}

export default function PriceHistoryChart({ data }: { data: PriceHistory }) {
  const rows = buildRows(data);
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="rangeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.35 }} />
              <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={64}
            domain={["auto", "auto"]}
            tickFormatter={formatNaira}
          />
          <Tooltip content={<ChartTooltip formatValue={formatNaira} />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 13, color: "var(--muted)" }} />
          <Area dataKey="range" name="Likely range" stroke="none" fill="url(#rangeFill)" connectNulls isAnimationActive={false} />
          <Line dataKey="price" name="Actual price" stroke="var(--primary)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} isAnimationActive={false} />
          <Line
            dataKey="forecast"
            name="Forecast"
            stroke="var(--accent)"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={{ r: 4, fill: "var(--accent)" }}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
