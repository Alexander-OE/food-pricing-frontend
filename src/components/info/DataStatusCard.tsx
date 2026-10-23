// Shows how fresh the data is, when it refreshes next, and which model made the forecasts.
import Card from "@/components/ui/Card";
import { formatDateTime, formatMonth } from "@/lib/format";
import type { DataStatus } from "@/types/market";

/** One label and value line. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-line py-3 first:border-t-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-semibold">{children}</dd>
    </div>
  );
}

export default function DataStatusCard({ status }: { status: DataStatus }) {
  return (
    <Card>
      <h3 className="mb-2 font-display text-xl font-bold">Data and forecasts</h3>
      <dl className="text-sm">
        <Row label="Latest month of price data">{status.latestDataPeriod ? formatMonth(status.latestDataPeriod) : "None yet"}</Row>
        <Row label="Month being forecast">{status.forecastPeriod ? formatMonth(status.forecastPeriod) : "None yet"}</Row>
        <Row label="Last successful refresh">{formatDateTime(status.lastSuccessfulRefresh)}</Row>
        <Row label="Next scheduled refresh">{formatDateTime(status.nextScheduledRefresh)}</Row>
        <Row label="Forecast model">{status.modelVersion ?? "Unknown"}</Row>
        <Row label="Data source">
          {status.dataSourceLabel}
          {status.dataSource === "mock" && (
            <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent">Simulated</span>
          )}
        </Row>
      </dl>
    </Card>
  );
}
