// "How to read a forecast": four small cards that show the same signals people see on the commodity pages.
import Card from "@/components/ui/Card";
import DirectionBadge from "@/components/ui/DirectionBadge";
import { formatMonth } from "@/lib/format";

// A forecast change of this many percent or less counts as "steady" (the backend's STABLE_THRESHOLD_PERCENT)
const STEADY_LIMIT_PERCENT = 2;

interface GuideCardProps {
  icon: string; // one symbol, in the same style as the arrows used across the site
  title: string;
  text: string;
  children?: React.ReactNode; // a small picture of the real thing
}

/** One card: icon, short title, one sentence and an optional mini illustration. */
function GuideCard({ icon, title, text, children }: GuideCardProps) {
  return (
    <Card className="animate-fade-up flex flex-col">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft font-display text-lg font-bold text-primary" aria-hidden="true">
        {icon}
      </span>
      <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted">{text}</p>
      {children && <div className="mt-auto pt-4">{children}</div>}
    </Card>
  );
}

/** A thin bar like the one on the commodity page; `wide` stretches the likely range. */
function RangeSample({ label, wide }: { label: string; wide?: boolean }) {
  return (
    <div>
      <div className="relative h-2 rounded-full bg-line">
        <div className="absolute h-2 rounded-full bg-accent/40" style={{ left: wide ? "10%" : "38%", width: wide ? "80%" : "24%" }} />
        <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent" />
      </div>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

export default function ForecastGuide({ forecastPeriod }: { forecastPeriod: string | null }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <GuideCard
        icon="↕"
        title="Direction"
        text={`Red up means the price should rise, green down means it should fall. Grey means steady, a change of ${STEADY_LIMIT_PERCENT}% or less. It compares next month's forecast with today's price.`}
      >
        <div className="flex flex-wrap gap-1.5">
          <DirectionBadge direction="UP" />
          <DirectionBadge direction="DOWN" />
          <DirectionBadge direction="STABLE" />
        </div>
      </GuideCard>

      <GuideCard icon="₦" title="Predicted price" text="What we expect the price to be next month. It's our best single guess, based on recent prices and the drivers above.">
        {forecastPeriod && (
          <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
            Forecast for {formatMonth(forecastPeriod)}
          </span>
        )}
      </GuideCard>

      <GuideCard icon="↔" title="Price range" text="The low-to-high range the price will most likely fall in. We expect the real price to land inside it about 8 times out of 10. A wider range means less certainty.">
        <div className="space-y-3">
          <RangeSample label="Narrow: more certain" />
          <RangeSample label="Wide: less certain" wide />
        </div>
      </GuideCard>

      <GuideCard icon="✓" title="Track record" text="How close last month's prediction was to the actual price. A tick means we got the direction right; a cross means we missed.">
        <div className="flex flex-wrap gap-1.5 text-xs font-bold">
          <span className="rounded-full bg-fall/10 px-2.5 py-1 text-fall">✓ Correct</span>
          <span className="rounded-full bg-rise/10 px-2.5 py-1 text-rise">✗ Missed</span>
        </div>
      </GuideCard>
    </div>
  );
}
