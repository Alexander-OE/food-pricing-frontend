"use client";
// Admin overview: headline numbers grouped into audience, engagement and forecast quality,
// each explained in plain language, plus the most viewed commodities.
import Link from "next/link";
import ChangeBadge from "@/components/admin/ChangeBadge";
import AsyncView from "@/components/ui/AsyncView";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import StatCard from "@/components/ui/StatCard";
import { formatNumber } from "@/lib/format";
import { useCommodityRanking, useOverview } from "@/lib/hooks/useAdmin";
import type { VisitorStat } from "@/types/admin";

/** A labelled group of cards, with a one-line explanation of what the group shows. */
function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="mt-0.5 text-sm text-muted">{description}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

/** Visitors for one period: the number, a plain sentence, and the change versus the period before. */
function visitorCard(label: string, help: string, stat: VisitorStat) {
  return (
    <StatCard
      label={label}
      value={formatNumber(stat.value)}
      hint={
        <>
          <p>{help}</p>
          <p className="mt-1">
            <ChangeBadge percent={stat.changePercent} suffix={`vs ${formatNumber(stat.previous)} before`} />
          </p>
        </>
      }
    />
  );
}

export default function AdminOverviewPage() {
  const overview = useOverview();
  const ranking = useCommodityRanking("30d");

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="A snapshot of how FoodCast is doing this month at a glance, no spreadsheets needed."
      />

      <p className="-mt-3 mb-8 max-w-2xl text-sm leading-relaxed text-muted">
        Each card pairs a number with a plain-language note on what it means. Most figures cover the
        last 30 days and compare with the period before, so you can quickly see where things are
        improving and where they need a closer look.
      </p>

      <AsyncView
        state={overview}
        skeleton={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }, (_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        }
      >
        {(data) => (
          <div className="space-y-10">
            <Section title="Audience" description="Who is visiting the site. A visitor is one person, however many pages they open.">
              {visitorCard("Visitors today", "Different people who have visited so far today.", data.visitors.today)}
              {visitorCard("Visitors, last 7 days", "Different people in the past week.", data.visitors.last7Days)}
              {visitorCard("Visitors, last 30 days", "Different people in the past month.", data.visitors.last30Days)}
            </Section>

            <Section title="Engagement" description="What visitors actually do once they are here.">
              <StatCard
                label="Page views, 30 days"
                value={formatNumber(380)}
                hint={
                  <>
                    <p>Total pages opened in the last 30 days.</p>
                    <p className="mt-1">
                      <ChangeBadge percent={data.pageViews30d.changePercent} suffix="vs the 30 days before" />
                    </p>
                  </>
                }
              />
              <StatCard
                label="Commodity views, 30 days"
                value={formatNumber(153)}
                hint={
                  <>
                    <p>Times a food&apos;s own page was opened in the last 30 days.</p>
                    <p className="mt-1">A sign people are checking specific prices, not just browsing.</p>
                  </>
                }
              />
              <StatCard
                label="Chats started, 30 days"
                value={formatNumber(35)}
                hint={
                  <>
                    <p>Conversations started with the forecast assistant.</p>
                    <p className="mt-1">About {data.averageMessagesPerChat} messages each, so people are asking follow-up questions.</p>
                  </>
                }
              />
              <StatCard
                label="New feedback"
                value={formatNumber(data.newFeedbackCount)}
                hint={
                  <>
                    <p>Messages from visitors waiting to be read.</p>
                    <p className="mt-1">
                      <Link href="/admin/feedback" className="font-semibold text-primary hover:underline">
                        Open the inbox →
                      </Link>
                    </p>
                  </>
                }
              />
            </Section>

            <Section title="Forecast quality" description="How close our price predictions have been over the last few months.">
              <StatCard
                label="Forecast error (MAPE)"
                value={`${data.accuracy.mape}%`}
                hint={`On average, our predictions were off by ${data.accuracy.mape}% over the last ${data.accuracy.months} months. Lower is better.`}
              />
              <StatCard
                label="Direction hit rate"
                value={`${data.accuracy.directionHitRate}%`}
                hint={`How often we correctly called whether a price would rise, fall or stay steady, over the last ${data.accuracy.months} months. Higher is better.`}
              />
            </Section>
          </div>
        )}
      </AsyncView>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Most viewed commodities</h2>
        <p className="mt-0.5 text-sm text-muted">The foods people looked at most in the last 30 days, so you can see what shoppers care about right now.</p>
        <div className="mt-4">
          <AsyncView
            state={ranking}
            isEmpty={(rows) => rows.length === 0}
            emptyTitle="No views yet"
            emptyText="Once people start browsing commodities, the most popular ones will appear here."
            skeleton={<Skeleton className="h-72" />}
          >
            {(rows) => (
              <Card className="divide-y divide-line p-0">
                {rows.slice(0, 8).map((row, index) => (
                  <div key={row.slug} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-soft text-sm font-bold text-muted">
                        {index + 1}
                      </span>
                      <p className="font-semibold">{row.name}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">{formatNumber(row.views)} views</p>
                      <p className="text-muted">{formatNumber(row.chats)} chats</p>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </AsyncView>
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
          Looking for more detail? The{" "}
          <Link href="/admin/accuracy" className="font-semibold text-primary hover:underline">
            Forecast accuracy
          </Link>{" "}
          page shows how closely our predictions matched real prices, and the{" "}
          <Link href="/admin/feedback" className="font-semibold text-primary hover:underline">
            Feedback
          </Link>{" "}
          inbox lets you hear from visitors in their own words.
        </p>
      </section>
    </>
  );
}
