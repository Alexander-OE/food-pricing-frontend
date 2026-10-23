"use client";
// Usage analytics: daily visitors, views and chats as a chart, and which commodities people look at most.
import { useState } from "react";
import LineTrendChart from "@/components/charts/LineTrendChart";
import RankingChart from "@/components/charts/RankingChart";
import { rowClass, tableClass, tdClass, thClass } from "@/components/admin/tableStyles";
import AsyncView from "@/components/ui/AsyncView";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import SegmentedControl from "@/components/ui/SegmentedControl";
import Skeleton from "@/components/ui/Skeleton";
import { formatDay, formatNumber } from "@/lib/format";
import { useCommodityRanking, useUsage } from "@/lib/hooks/useAdmin";
import type { UsageRange } from "@/types/admin";

const RANGES: { value: UsageRange; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];
const TOP_COUNT = 10; // how many commodities the bar chart shows

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<UsageRange>("30d");
  const usage = useUsage(range);
  const ranking = useCommodityRanking(range);

  return (
    <>
      <PageHeader
        title="Usage analytics"
        subtitle="Who is using the site and what they look at."
        action={<SegmentedControl label="Time range" options={RANGES} value={range} onChange={setRange} />}
      />

      <section className="mb-8">
        <h2 className="mb-3 font-display text-xl font-bold">Daily activity</h2>
        <Card>
          <AsyncView
            state={usage}
            isEmpty={(data) => data.series.length === 0}
            emptyTitle="No activity yet"
            skeleton={<Skeleton className="h-72" />}
          >
            {(data) => (
              <LineTrendChart
                data={data.series.map((day) => ({
                  day: formatDay(day.date),
                  visitors: day.visitors,
                  pageViews: day.pageViews,
                  commodityViews: day.commodityViews,
                  chats: day.chats,
                }))}
                xKey="day"
                lines={[
                  { key: "visitors", label: "Visitors", color: "var(--primary)" },
                  { key: "pageViews", label: "Page views", color: "var(--accent)" },
                  { key: "commodityViews", label: "Commodity views", color: "var(--chart-3)" },
                  { key: "chats", label: "Chats started", color: "var(--chart-4)" },
                ]}
                formatValue={formatNumber}
              />
            )}
          </AsyncView>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Most viewed commodities</h2>
        <AsyncView
          state={ranking}
          isEmpty={(data) => data.length === 0}
          emptyTitle="No commodity views yet"
          skeleton={<Skeleton className="h-96" />}
        >
          {(data) => (
            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <p className="mb-2 text-sm text-muted">Top {Math.min(TOP_COUNT, data.length)} by views</p>
                <RankingChart ranking={data.slice(0, TOP_COUNT)} />
              </Card>
              <Card className="max-h-[32rem] overflow-auto p-2">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th className={thClass}>#</th>
                      <th className={thClass}>Commodity</th>
                      <th className={`${thClass} text-right`}>Views</th>
                      <th className={`${thClass} text-right`}>Chats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item.slug} className={rowClass}>
                        <td className={`${tdClass} text-muted`}>{index + 1}</td>
                        <td className={`${tdClass} font-semibold`}>{item.name}</td>
                        <td className={`${tdClass} text-right`}>{formatNumber(item.views)}</td>
                        <td className={`${tdClass} text-right`}>{formatNumber(item.chats)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}
        </AsyncView>
      </section>
    </>
  );
}
