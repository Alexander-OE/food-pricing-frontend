"use client";
// Commodity page: price now, forecast, reasons, price history chart, accuracy, related items and chat.
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatBox from "@/components/chat/ChatBox";
import LineTrendChart from "@/components/charts/LineTrendChart";
import PriceHistoryChart from "@/components/charts/PriceHistoryChart";
import CommodityImage from "@/components/commodity/CommodityImage";
import CommodityTile from "@/components/commodity/CommodityTile";
import FactorList from "@/components/commodity/FactorList";
import ForecastPanel from "@/components/commodity/ForecastPanel";
import TileGridSkeleton from "@/components/commodity/TileGridSkeleton";
import TrackRecordTable from "@/components/commodity/TrackRecordTable";
import AsyncView from "@/components/ui/AsyncView";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { trackEvent } from "@/lib/api/analytics";
import { formatLabel, formatMonthShort, formatNaira } from "@/lib/format";
import { useCommodity, useCommodityAccuracy, usePriceHistory, useRelated } from "@/lib/hooks/useCommodities";

// How far back the price chart can look (the backend allows 1 to 120 months)
const HISTORY_OPTIONS = [
  { months: 12, label: "1 year" },
  { months: 24, label: "2 years" },
  { months: 60, label: "5 years" },
  { months: 120, label: "All" }, // the backend's maximum, which covers everything back to 2018
];
const ACCURACY_MONTHS = 12;

export default function CommodityPage() {
  const { slug } = useParams<{ slug: string }>();
  const [months, setMonths] = useState(24);

  const commodity = useCommodity(slug);
  const history = usePriceHistory(slug, months);
  const accuracy = useCommodityAccuracy(slug, ACCURACY_MONTHS);
  const related = useRelated(slug);

  // Tell the backend this commodity was viewed
  useEffect(() => {
    trackEvent({ type: "COMMODITY_VIEW", path: `/commodities/${slug}`, commoditySlug: slug });
  }, [slug]);

  return (
    <div className="space-y-10">
      <Link href="/commodities" className="text-sm font-semibold text-primary hover:underline">
        ← All commodities
      </Link>

      <AsyncView
        state={commodity}
        skeleton={
          <div className="space-y-5">
            <Skeleton className="h-40" />
            <div className="grid gap-5 md:grid-cols-2">
              <Skeleton className="h-52" />
              <Skeleton className="h-52" />
            </div>
          </div>
        }
      >
        {(detail) => (
          <div className="space-y-8">
            {/* Title and photo */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center animate-fade-up">
              <CommodityImage src={detail.imageUrl} name={detail.name} className="h-40 w-full rounded-2xl sm:w-60" />
              <div>
                <p className="text-sm font-semibold text-accent">{formatLabel(detail.category)}</p>
                <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{detail.name}</h1>
                <p className="mt-2 max-w-2xl text-muted">{detail.description}</p>
              </div>
            </div>

            <ForecastPanel detail={detail} />

            {/* Why the forecast says what it says */}
            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <h2 className="font-display text-xl font-bold">Why this forecast?</h2>
                <p className="mt-2 text-muted">{detail.explanation || "No explanation is available yet."}</p>
                {detail.modelVersion && <p className="mt-4 text-xs text-muted">Model: {detail.modelVersion}</p>}
              </Card>
              <Card>
                <h2 className="mb-4 font-display text-xl font-bold">What is pushing the price</h2>
                {detail.factors.length > 0 ? (
                  <FactorList factors={detail.factors} />
                ) : (
                  <p className="text-muted">No factors are available yet.</p>
                )}
              </Card>
            </div>
          </div>
        )}
      </AsyncView>

      {/* Price history chart */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight">Price history</h2>
          <div className="flex gap-1 rounded-full border border-line bg-surface p-1">
            {HISTORY_OPTIONS.map((option) => (
              <button
                key={option.months}
                onClick={() => setMonths(option.months)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  months === option.months ? "bg-primary text-on-primary" : "text-muted hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <Card>
          <AsyncView
            state={history}
            isEmpty={(data) => data.history.length === 0}
            emptyTitle="No price history yet"
            skeleton={<Skeleton className="h-80" />}
          >
            {(data) => <PriceHistoryChart data={data} />}
          </AsyncView>
        </Card>
      </section>

      {/* How accurate past forecasts were */}
      <section>
        <h2 className="mb-1 font-display text-2xl font-bold tracking-tight">How accurate have we been?</h2>
        <p className="mb-4 text-sm text-muted">Our forecast for each month, compared with the price that really happened.</p>
        <Card>
          <AsyncView
            state={accuracy}
            isEmpty={(data) => data.length === 0}
            emptyTitle="No track record yet"
            emptyText="Forecasts are scored once the real price for the month is known."
            skeleton={<Skeleton className="h-80" />}
          >
            {(records) => (
              <div className="space-y-6">
                <LineTrendChart
                  data={records.map((record) => ({
                    month: formatMonthShort(record.targetPeriod),
                    predicted: record.predictedPrice,
                    actual: record.actualPrice,
                  }))}
                  xKey="month"
                  lines={[
                    { key: "actual", label: "Real price", color: "var(--primary)" },
                    { key: "predicted", label: "Our forecast", color: "var(--accent)", dashed: true },
                  ]}
                  formatValue={formatNaira}
                />
                <TrackRecordTable records={records} />
              </div>
            )}
          </AsyncView>
        </Card>
      </section>

      {/* Chat */}
      {commodity.data && (
        <section>
          <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">Ask a question</h2>
          <div className="max-w-2xl">
            {/* key makes the chat start fresh if you move to another commodity */}
            <ChatBox key={slug} slug={slug} name={commodity.data.name} />
          </div>
        </section>
      )}

      {/* Related commodities */}
      <section>
        <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">You might also check</h2>
        <AsyncView
          state={related}
          isEmpty={(data) => data.length === 0}
          emptyTitle="No related commodities"
          skeleton={<TileGridSkeleton count={4} />}
        >
          {(data) => (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.map((item, index) => (
                <CommodityTile key={item.id} commodity={item} index={index} />
              ))}
            </div>
          )}
        </AsyncView>
      </section>
    </div>
  );
}
