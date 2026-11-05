"use client";
// How it works: how a forecast is made, how to read one, and how to use it when shopping.
import ForecastGuide from "@/components/info/ForecastGuide";
import ShopTips from "@/components/info/ShopTips";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { useDataStatus } from "@/lib/hooks/useMarket";

// The four steps behind every forecast, in two short sentences each (matches what the backend model does)
const STEPS = [
  {
    title: "Collect prices",
    text: "Every month we record the average price of each food in Lagos. We use figures from the National Bureau of Statistics (NBS) and recent market surveys.",
  },
  {
    title: "Watch the drivers",
    text: "Prices don't move on their own. The dollar rate, diesel and transport costs, the season and how much food is available all push prices up or down.",
  },
  {
    title: "Forecast",
    text: "We look at how each price has moved over the past year, then adjust for those drivers. That gives us our best estimate of next month's price.",
  },
  {
    title: "Check our work",
    text: "When the real price comes in, we compare it with what we predicted. This keeps us honest and shows how reliable each forecast is.",
  },
];

/** Section title with a one-line subtitle. */
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export default function HowItWorksPage() {
  const status = useDataStatus(); // only for the forecast month shown in the guide

  return (
    <div className="space-y-10">
      <PageHeader title="How it works" subtitle="Where our forecasts come from and how to read them." />

      <section>
        <SectionTitle title="How a forecast is made" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Card key={step.title} className="animate-fade-up">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">{index + 1}</span>
              <h3 className="mt-3 font-display text-lg font-bold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="How to read a forecast" subtitle="Forecasts are estimates, not promises. Here is what each part on a commodity page means." />
        <ForecastGuide forecastPeriod={status.data?.forecastPeriod ?? null} />
      </section>

      <section>
        <SectionTitle title="Shop smarter with FoodCast" subtitle="A forecast is only useful if it helps you decide. Here's how to use one." />
        <ShopTips />
      </section>
    </div>
  );
}
