"use client";
// Forecast accuracy: how close forecasts were over time, which commodities are best and worst, and last month in detail.
import { useState } from "react";
import LineTrendChart from "@/components/charts/LineTrendChart";
import { rowClass, tableClass, tdClass, thClass } from "@/components/admin/tableStyles";
import AsyncView from "@/components/ui/AsyncView";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import SegmentedControl from "@/components/ui/SegmentedControl";
import Skeleton from "@/components/ui/Skeleton";
import { formatMonthShort, formatNaira } from "@/lib/format";
import { useAccuracyReport } from "@/lib/hooks/useAdmin";
import type { AccuracyReport } from "@/types/admin";

const MONTH_OPTIONS = [
  { value: 3, label: "3 months" },
  { value: 6, label: "6 months" },
  { value: 12, label: "12 months" },
  { value: 24, label: "24 months" },
];

type RankedRow = AccuracyReport["perCommodity"][number];

/** A short ranked list of commodities with their average error. */
function RankList({ title, rows }: { title: string; rows: RankedRow[] }) {
  return (
    <Card>
      <h3 className="mb-3 font-display text-lg font-bold">{title}</h3>
      <ol className="space-y-2 text-sm">
        {rows.map((row, index) => (
          <li key={row.slug} className="flex items-center justify-between gap-3">
            <span>
              <span className="mr-2 text-muted">{index + 1}.</span>
              <span className="font-semibold">{row.name}</span>
            </span>
            <span className="text-muted">
              {row.mape}% error · {row.directionHitRate}% direction
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export default function AdminAccuracyPage() {
  const [months, setMonths] = useState(12);
  const report = useAccuracyReport(months);

  return (
    <>
      <PageHeader
        title="Forecast accuracy"
        subtitle="How close our forecasts were to the real prices. MAPE is the average percent error, so lower is better."
        action={<SegmentedControl label="Period" options={MONTH_OPTIONS} value={months} onChange={setMonths} />}
      />
      <AsyncView
        state={report}
        isEmpty={(data) => data.monthly.length === 0}
        emptyTitle="No scored forecasts yet"
        emptyText="Forecasts are scored once the real price for their month is known."
        skeleton={<Skeleton className="h-96" />}
      >
        {(data) => (
          <div className="space-y-8">
            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <h2 className="mb-3 font-display text-lg font-bold">Average error by month (MAPE %)</h2>
                <LineTrendChart
                  data={data.monthly.map((m) => ({ month: formatMonthShort(m.period), mape: m.mape }))}
                  xKey="month"
                  lines={[{ key: "mape", label: "Average error", color: "var(--accent)" }]}
                  formatValue={(value) => `${value}%`}
                  height={240}
                />
              </Card>
              <Card>
                <h2 className="mb-3 font-display text-lg font-bold">Direction hit rate by month (%)</h2>
                <LineTrendChart
                  data={data.monthly.map((m) => ({ month: formatMonthShort(m.period), hit: m.directionHitRate }))}
                  xKey="month"
                  lines={[{ key: "hit", label: "Direction called correctly", color: "var(--primary)" }]}
                  formatValue={(value) => `${value}%`}
                  height={240}
                />
              </Card>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <RankList title="Most accurate commodities" rows={data.best} />
              <RankList title="Least accurate commodities" rows={data.worst} />
            </div>

            <section>
              <h2 className="mb-3 font-display text-xl font-bold">Latest scored month, commodity by commodity</h2>
              <Card className="max-h-[32rem] overflow-auto p-2">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th className={thClass}>Commodity</th>
                      <th className={`${thClass} text-right`}>Predicted</th>
                      <th className={`${thClass} text-right`}>Actual</th>
                      <th className={`${thClass} text-right`}>Error</th>
                      <th className={thClass}>Direction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.latestMonth.map((row) => (
                      <tr key={row.slug} className={rowClass}>
                        <td className={`${tdClass} font-semibold`}>{row.name}</td>
                        <td className={`${tdClass} text-right`}>{formatNaira(row.predictedPrice)}</td>
                        <td className={`${tdClass} text-right`}>{formatNaira(row.actualPrice)}</td>
                        <td className={`${tdClass} text-right`}>{row.percentError}%</td>
                        <td className={`${tdClass} font-semibold ${row.directionHit ? "text-fall" : "text-rise"}`}>
                          {row.directionHit ? "✓ Correct" : "✗ Missed"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </section>

            <section>
              <h2 className="mb-3 font-display text-xl font-bold">All commodities, most accurate first</h2>
              <Card className="max-h-[32rem] overflow-auto p-2">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th className={thClass}>Commodity</th>
                      <th className={`${thClass} text-right`}>Average error</th>
                      <th className={`${thClass} text-right`}>Direction hit rate</th>
                      <th className={`${thClass} text-right`}>Forecasts scored</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.perCommodity.map((row) => (
                      <tr key={row.slug} className={rowClass}>
                        <td className={`${tdClass} font-semibold`}>{row.name}</td>
                        <td className={`${tdClass} text-right`}>{row.mape}%</td>
                        <td className={`${tdClass} text-right`}>{row.directionHitRate}%</td>
                        <td className={`${tdClass} text-right`}>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </section>
          </div>
        )}
      </AsyncView>
    </>
  );
}
