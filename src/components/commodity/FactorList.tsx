// Lists the reasons behind a forecast, each with its direction, size and a plain sentence.
import DirectionBadge from "@/components/ui/DirectionBadge";
import { getDirectionLook } from "@/lib/direction";
import type { PredictionFactor } from "@/types/commodity";

export default function FactorList({ factors }: { factors: PredictionFactor[] }) {
  // The biggest factor fills its bar; the others are sized relative to it
  const biggest = Math.max(...factors.map((factor) => Math.abs(factor.impactPercent)), 0.01);
  return (
    <ul className="space-y-4">
      {factors.map((factor) => {
        const look = getDirectionLook(factor.direction);
        return (
          <li key={factor.key}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{factor.label}</p>
              <DirectionBadge direction={factor.direction} percent={factor.impactPercent} />
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-line">
              <div
                className={`h-1.5 rounded-full ${factor.direction === "UP" ? "bg-rise" : "bg-fall"}`}
                style={{ width: `${(Math.abs(factor.impactPercent) / biggest) * 100}%` }}
                title={`${look.word} pressure`}
              />
            </div>
            <p className="mt-1.5 text-sm text-muted">{factor.detail}</p>
          </li>
        );
      })}
    </ul>
  );
}
