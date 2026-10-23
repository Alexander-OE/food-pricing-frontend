// Row of cards for the market drivers: dollar rate, fuel prices and food inflation.
import Card from "@/components/ui/Card";
import DirectionBadge from "@/components/ui/DirectionBadge";
import { directionFromChange } from "@/lib/direction";
import { formatMonth, formatNaira } from "@/lib/format";
import type { Indicator, IndicatorKey } from "@/types/market";

// Plain-English name and unit for each indicator key from the API
const INFO: Record<IndicatorKey, { label: string; unit: string; money: boolean }> = {
  USD_NGN: { label: "Dollar rate", unit: "naira per US$1", money: true },
  DIESEL_PRICE: { label: "Diesel", unit: "per litre", money: true },
  PETROL_PRICE: { label: "Petrol", unit: "per litre", money: true },
  FOOD_INFLATION: { label: "Food inflation", unit: "per year", money: false },
};

export default function IndicatorStrip({ indicators }: { indicators: Indicator[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {indicators.map((indicator) => {
        const info = INFO[indicator.key];
        return (
          <Card key={indicator.key} className="animate-fade-up">
            <div>
              <p className="text-sm font-semibold text-muted">{info.label}</p>
              <p className="mt-1 font-display text-3xl font-extrabold tracking-tight">
                {info.money ? formatNaira(indicator.value) : `${indicator.value}%`}
              </p>
              <p className="text-xs text-muted">{info.unit}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <DirectionBadge direction={directionFromChange(indicator.changePercent)} percent={indicator.changePercent} />
                <span className="text-xs text-muted">vs last month</span>
              </div>
              <p className="mt-2 text-xs text-muted">{formatMonth(indicator.period)}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
