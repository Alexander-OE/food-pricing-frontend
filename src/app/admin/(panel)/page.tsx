"use client";
// Admin overview: headline numbers (visitors, views, chats, feedback, accuracy) and the latest data refreshes.
import Link from "next/link";
import ChangeBadge from "@/components/admin/ChangeBadge";
import StatusBadge from "@/components/admin/StatusBadge";
import AsyncView from "@/components/ui/AsyncView";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import StatCard from "@/components/ui/StatCard";
import { formatDateTime, formatNumber } from "@/lib/format";
import { useOverview } from "@/lib/hooks/useAdmin";
import { REFRESH_LABELS } from "@/lib/labels";
import type { VisitorStat } from "@/types/admin";

/** Visitors for one period, with the change versus the period before. */
function visitorCard(label: string, stat: VisitorStat) {
  return <StatCard label={label} value={formatNumber(stat.value)} hint={<ChangeBadge percent={stat.changePercent} suffix={`vs ${formatNumber(stat.previous)} before`} />} />;
}

export default function AdminOverviewPage() {
  const overview = useOverview();

  return (
    <>
      <PageHeader title="Overview" subtitle="How the site is doing right now." />
      <AsyncView
        state={overview}
        skeleton={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }, (_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        }
      >
        {(data) => (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visitorCard("Visitors today", data.visitors.today)}
              {visitorCard("Visitors, last 7 days", data.visitors.last7Days)}
              {visitorCard("Visitors, last 30 days", data.visitors.last30Days)}
              <StatCard
                label="Page views, 30 days"
                value={formatNumber(data.pageViews30d.value)}
                hint={<ChangeBadge percent={data.pageViews30d.changePercent} suffix="vs the 30 days before" />}
              />
              <StatCard label="Commodity views, 30 days" value={formatNumber(data.commodityViews30d)} />
              <StatCard label="Chats started, 30 days" value={formatNumber(data.chats30d)} hint={`${data.averageMessagesPerChat} messages per chat on average`} />
              <StatCard
                label="New feedback"
                value={formatNumber(data.newFeedbackCount)}
                hint={
                  <Link href="/admin/feedback" className="font-semibold text-primary hover:underline">
                    Open the inbox →
                  </Link>
                }
              />
              <StatCard
                label="Forecast error (MAPE)"
                value={`${data.accuracy.mape}%`}
                hint={`Average over the last ${data.accuracy.months} months. Lower is better.`}
              />
              <StatCard
                label="Direction hit rate"
                value={`${data.accuracy.directionHitRate}%`}
                hint={`Rise, fall or steady called correctly, last ${data.accuracy.months} months`}
              />
            </div>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">Latest data refreshes</h2>
                <Link href="/admin/data" className="text-sm font-semibold text-primary hover:underline">
                  Data health →
                </Link>
              </div>
              <Card className="divide-y divide-line p-0">
                {data.lastRefreshes.length === 0 && <p className="p-5 text-muted">No refreshes have run yet.</p>}
                {data.lastRefreshes.map((refresh) => (
                  <div key={refresh.type} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div>
                      <p className="font-semibold">{REFRESH_LABELS[refresh.type]}</p>
                      <p className="text-sm text-muted">{formatDateTime(refresh.at)}</p>
                      {refresh.errorMessage && <p className="mt-1 text-sm text-rise">{refresh.errorMessage}</p>}
                    </div>
                    <StatusBadge status={refresh.status} />
                  </div>
                ))}
              </Card>
            </section>
          </div>
        )}
      </AsyncView>
    </>
  );
}
