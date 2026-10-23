"use client";
// How it works: a short explanation, how to read a forecast, plus live data status and service health.
import DataStatusCard from "@/components/info/DataStatusCard";
import ForecastGuide from "@/components/info/ForecastGuide";
// import HealthCard from "@/components/info/HealthCard";
import AsyncView from "@/components/ui/AsyncView";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import { useDataStatus, useHealth } from "@/lib/hooks/useMarket";

// The four steps behind every forecast, kept to one short sentence each
const STEPS = [
  { title: "Collect prices", text: "We record what each food costs every month." },
  { title: "Watch the drivers", text: "Dollar rate, fuel, inflation, seasons and supply move prices." },
  { title: "Forecast", text: "We combine the recent trend with those drivers to estimate next month." },
  { title: "Check our work", text: "When the real price arrives, we compare it with our forecast." },
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
  const status = useDataStatus();
  // const health = useHealth();

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

      <section className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <AsyncView state={status} skeleton={<Skeleton className="h-64" />}>
          {(data) => <DataStatusCard status={data} />}
        </AsyncView>
        {/* <AsyncView state={health} skeleton={<Skeleton className="h-40" />}>
          {(data) => <HealthCard health={data} />}
        </AsyncView> */}
      </section>
    </div>
  );
}
