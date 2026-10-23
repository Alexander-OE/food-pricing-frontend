// Table of past forecasts next to the real prices.
import { formatMonth, formatNaira } from "@/lib/format";
import type { TrackRecord } from "@/types/commodity";

export default function TrackRecordTable({ records }: { records: TrackRecord[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-muted">
          <tr>
            <th className="py-2 pr-4 font-semibold">Month</th>
            <th className="py-2 pr-4 font-semibold">We predicted</th>
            <th className="py-2 pr-4 font-semibold">Real price</th>
            <th className="py-2 pr-4 font-semibold">Off by</th>
            <th className="py-2 font-semibold">Direction</th>
          </tr>
        </thead>
        <tbody>
          {[...records].reverse().map((record) => (
            <tr key={record.targetPeriod} className="border-t border-line">
              <td className="py-2.5 pr-4">{formatMonth(record.targetPeriod)}</td>
              <td className="py-2.5 pr-4">{formatNaira(record.predictedPrice)}</td>
              <td className="py-2.5 pr-4 font-semibold">{formatNaira(record.actualPrice)}</td>
              <td className="py-2.5 pr-4">{record.percentError}%</td>
              <td className={`py-2.5 font-semibold ${record.directionHit ? "text-fall" : "text-rise"}`}>
                {record.directionHit ? "✓ Correct" : "✗ Missed"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
