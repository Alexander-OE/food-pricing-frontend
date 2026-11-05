"use client";
import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";
import { formatMonth } from "@/lib/format";
import { useDataStatus } from "@/lib/hooks/useMarket";

export default function Hero() {
  const { data, loading } = useDataStatus();
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-on-primary sm:px-12 sm:py-16 animate-fade-up">
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />
      <div className="relative max-w-2xl">
        {loading && !data ? (
          <Skeleton className="h-7 w-72 bg-white/20" />
        ) : (
          data && (
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              {data.forecastPeriod && (
                <span className="rounded-full bg-white/15 px-3 py-1">Forecast</span>
              )}
            </div>
          )
        )}
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Know next month&apos;s food prices before you shop.
        </h1>
        <p className="mt-4 text-lg opacity-90">
          See where prices for rice, beans, tomatoes and more are heading in Lagos, and the reasons behind each move.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/commodities" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90">
            Browse all prices
          </Link>
          <Link href="/how-it-works" className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10">
            How it works
          </Link>
        </div>
        {data?.latestDataPeriod && (
          <p className="mt-6 text-sm opacity-75">
            {/* Based on price data up to {formatMonth(data.latestDataPeriod)}. {data.dataSourceLabel}. */}
          </p>
        )}
      </div>
    </section>
  );
}
