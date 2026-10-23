"use client";
// Footer of the public site, with the data-source notice from the backend.
import Link from "next/link";
import { useDataStatus } from "@/lib/hooks/useMarket";

export default function Footer() {
  const { data } = useDataStatus();
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-display font-bold text-primary">FoodCast</span> · Forecasts are estimates, not guarantees.
          {data && <span> Data: {data.dataSourceLabel}.</span>}
        </p>
        <div className="flex gap-5">
          <Link href="/how-it-works" className="hover:text-ink">
            How it works
          </Link>
          <Link href="/feedback" className="hover:text-ink">
            Send feedback
          </Link>
        </div>
      </div>
    </footer>
  );
}
