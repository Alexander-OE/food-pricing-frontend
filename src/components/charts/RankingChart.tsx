"use client";
// Horizontal bars comparing views and chats for the most viewed commodities (admin).
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/lib/format";
import type { CommodityRanking } from "@/types/admin";
import { axisTick, ChartTooltip, gridColor } from "./chartStyle";

export default function RankingChart({ ranking }: { ranking: CommodityRanking[] }) {
  return (
    <div className="w-full" style={{ height: Math.max(220, ranking.length * 42) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ranking} layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 8 }}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={axisTick} tickLine={false} axisLine={false} width={110} />
          <Tooltip content={<ChartTooltip formatValue={formatNumber} />} cursor={{ fill: "var(--surface-soft)" }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 13, color: "var(--muted)" }} />
          <Bar dataKey="views" name="Views" fill="var(--primary)" radius={[0, 6, 6, 0]} isAnimationActive={false} />
          <Bar dataKey="chats" name="Chats" fill="var(--accent)" radius={[0, 6, 6, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
