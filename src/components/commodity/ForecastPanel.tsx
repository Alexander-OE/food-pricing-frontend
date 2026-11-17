// The two main boxes on a commodity page: today's price, and next month's forecast with its range.
import Card from "@/components/ui/Card";
import DirectionBadge from "@/components/ui/DirectionBadge";
import { directionFromChange } from "@/lib/direction";
import { formatConfidence, formatNaira } from "@/lib/format";
import type { CommodityDetail } from "@/types/commodity";

/** A bar showing the likely price range, with a dot for today's price and one for the forecast. */
// function RangeBar({ detail }: { detail: CommodityDetail }) {
//   const low = Math.min(detail.lowerBound, detail.currentPrice);
//   const high = Math.max(detail.upperBound, detail.currentPrice);
//   const span = high - low || 1;
//   const position = (price: number) => `${((price - low) / span) * 100}%`;
//   return (
//     <div className="mt-4">
//       <div className="relative h-2 rounded-full bg-line">
//         {/* The coloured part is the range the price will probably fall in */}
//         <div
//           className="absolute h-2 rounded-full bg-accent/40"
//           style={{ left: position(detail.lowerBound), width: `${((detail.upperBound - detail.lowerBound) / span) * 100}%` }}
//         />
//         <span title="Today" className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded bg-ink" style={{ left: position(detail.currentPrice) }} />
//         <span title="Forecast" className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent" style={{ left: position(detail.predictedPrice) }} />
//       </div>
//       <div className="mt-2 flex justify-between text-xs text-muted">
//         <span>{formatNaira(detail.lowerBound)}</span>
//         <span>Likely range</span>
//         <span>{formatNaira(detail.upperBound)}</span>
//       </div>
//     </div>
//   );
// }

export default function ForecastPanel({ detail }: { detail: CommodityDetail }) {
  // const record = detail.lastMonthTrackRecord;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* Today */}
      <Card className="animate-fade-up">
        <p className="text-sm font-semibold text-muted">Price now (per {detail.unit})</p>
        <p className="mt-1 font-display text-5xl font-extrabold tracking-tight">{formatNaira(detail.currentPrice)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
          <DirectionBadge direction={directionFromChange(detail.monthOnMonthChange)} percent={detail.monthOnMonthChange} />
          <span>since last month ({formatNaira(detail.previousPrice)})</span>
        </div>
        {detail.yearOnYearChange !== null && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
            <DirectionBadge direction={directionFromChange(detail.yearOnYearChange)} percent={detail.yearOnYearChange} />
            <span>compared with a year ago</span>
          </div>
        )}
      </Card>

      {/* Forecast */}
      <Card className="animate-fade-up border-accent/40 bg-accent-soft/40" >
        <p className="text-sm font-semibold text-muted">
          Forecast for next month
        </p>
        <p className="mt-1 font-display text-5xl font-extrabold tracking-tight">{formatNaira(detail.predictedPrice)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <DirectionBadge direction={detail.direction} percent={detail.percentChange} large />
          <span className="text-sm text-muted">{formatConfidence(detail.confidence)} confident</span>
        </div>
        {/* <RangeBar detail={detail} /> */}
      </Card>

      {/* Last month's result, so people can judge how reliable forecasts have been */}
      {/* {record && (
        <Card className="md:col-span-2">
          <p className="text-sm font-semibold text-muted">How we did last time ({formatMonth(record.targetPeriod)})</p>
          <p className="mt-1 text-lg">
            We predicted <span className="font-display font-bold">{formatNaira(record.predictedPrice)}</span>, the real price was{" "}
            <span className="font-display font-bold">{formatNaira(record.actualPrice)}</span>
            <span className="text-muted"> ({record.percentError}% off)</span>.{" "}
            <span className={record.directionHit ? "font-semibold text-fall" : "font-semibold text-rise"}>
              {record.directionHit ? "✓ Direction called correctly" : "✗ Direction missed"}
            </span>
          </p>
        </Card>
      )} */}
    </div>
  );
}
