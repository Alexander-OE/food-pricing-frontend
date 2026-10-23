// Home page overview: how many commodities are rising, falling or steady, and the two outliers.
import CommodityTile from "@/components/commodity/CommodityTile";
import Card from "@/components/ui/Card";
import { formatPercent } from "@/lib/format";
import type { MarketPulse as MarketPulseData } from "@/types/market";

/** A count with an arrow and a word, coloured by what it means for shoppers. */
function CountCard({ arrow, word, count, color }: { arrow: string; word: string; count: number; color: string }) {
  return (
    <Card className="animate-fade-up">
      <p className={`flex items-center gap-1.5 text-sm font-bold ${color}`}>
        <span aria-hidden="true">{arrow}</span>
        {word}
      </p>
      <p className="mt-1 font-display text-4xl font-extrabold">{count}</p>
      <p className="text-sm text-muted">commodities</p>
    </Card>
  );
}

export default function MarketPulse({ pulse }: { pulse: MarketPulseData }) {
  const { biggestRiser, biggestFaller } = pulse;
  // "Biggest faller" is just the lowest forecast change, so it can still be a rise
  const fallerIsDrop = biggestFaller !== null && biggestFaller.percentChange < 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <CountCard arrow="↑" word="Rising" count={pulse.rising} color="text-rise" />
        <CountCard arrow="↓" word="Falling" count={pulse.falling} color="text-fall" />
        <CountCard arrow="→" word="Steady" count={pulse.stable} color="text-flat" />
        <Card className="animate-fade-up">
          <p className="text-sm font-bold text-accent">Average forecast change</p>
          <p className="mt-1 font-display text-4xl font-extrabold">{formatPercent(pulse.averagePredictedChange)}</p>
          <p className="text-sm text-muted">across all commodities</p>
        </Card>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {biggestRiser && (
          <div>
            <p className="mb-2 text-sm font-bold text-rise">↑ Biggest expected rise</p>
            <CommodityTile commodity={biggestRiser} />
          </div>
        )}
        {biggestFaller && (
          <div>
            <p className={`mb-2 text-sm font-bold ${fallerIsDrop ? "text-fall" : "text-flat"}`}>
              {fallerIsDrop ? "↓ Biggest expected drop" : "→ Smallest expected rise"}
            </p>
            <CommodityTile commodity={biggestFaller} index={1} />
          </div>
        )}
      </div>
    </div>
  );
}
