"use client";
// Home page: welcome banner, market overview, market drivers, biggest expected rises and category links.
import Link from "next/link";
import CategoryChips from "@/components/commodity/CategoryChips";
import CommodityTile from "@/components/commodity/CommodityTile";
import TileGridSkeleton from "@/components/commodity/TileGridSkeleton";
import Hero from "@/components/home/Hero";
import IndicatorStrip from "@/components/home/IndicatorStrip";
import MarketPulse from "@/components/home/MarketPulse";
import AsyncView from "@/components/ui/AsyncView";
import Skeleton from "@/components/ui/Skeleton";
import { formatMonth } from "@/lib/format";
import { useCommodities } from "@/lib/hooks/useCommodities";
import { useDashboardSummary, useIndicators } from "@/lib/hooks/useMarket";

// Defined outside the component so the object is the same on every render
const RISERS_QUERY = { sort: "-change", limit: 8 } as const;

/** Section title with an optional subtitle. */
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export default function HomePage() {
  const summary = useDashboardSummary();
  const indicators = useIndicators();
  const risers = useCommodities(RISERS_QUERY);

  return (
    <div className="space-y-12">
      <Hero />

      <section>
        <SectionTitle
          title="The market this month"
          subtitle={
            summary.data?.marketPulse.targetPeriod
              ? `Where prices are heading in ${formatMonth(summary.data.marketPulse.targetPeriod)}`
              : "Where prices are heading next month"
          }
        />
        <AsyncView
          state={summary}
          skeleton={
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          }
        >
          {(data) => <MarketPulse pulse={data.marketPulse} />}
        </AsyncView>
      </section>

      <section>
        <SectionTitle title="What is moving prices" subtitle="The dollar rate, fuel and inflation all feed into food prices." />
        <AsyncView
          state={indicators}
          isEmpty={(data) => data.length === 0}
          emptyTitle="No market data yet"
          skeleton={
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          }
        >
          {(data) => <IndicatorStrip indicators={data} />}
        </AsyncView>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <SectionTitle title="Biggest expected rises" subtitle="Foods likely to cost the most extra next month." />
          <Link href="/commodities" className="mb-4 text-sm font-semibold text-primary hover:underline">
            See all →
          </Link>
        </div>
        <AsyncView
          state={risers}
          isEmpty={(data) => data.items.length === 0}
          emptyTitle="No commodities yet"
          skeleton={<TileGridSkeleton count={8} />}
        >
          {(data) => (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.items.map((commodity, index) => (
                <CommodityTile key={commodity.id} commodity={commodity} index={index} />
              ))}
            </div>
          )}
        </AsyncView>
      </section>

      <section>
        <SectionTitle title="Browse by category" />
        <CategoryChips />
      </section>
    </div>
  );
}
