// Types for the dashboard, market indicators, data status and health endpoints.
import type { CommodityCard } from "./commodity";

export type IndicatorKey = "USD_NGN" | "DIESEL_PRICE" | "PETROL_PRICE" | "FOOD_INFLATION";

export interface Indicator {
  key: IndicatorKey;
  period: string;
  value: number;
  previousValue: number;
  changePercent: number;
}

export interface MarketPulse {
  basePeriod: string | null;
  targetPeriod: string | null;
  rising: number;
  falling: number;
  stable: number;
  averagePredictedChange: number;
  biggestRiser: CommodityCard | null;
  biggestFaller: CommodityCard | null;
}

export interface DashboardSummary {
  marketPulse: MarketPulse;
}

export interface DataStatus {
  latestDataPeriod: string | null;
  forecastPeriod: string | null;
  lastSuccessfulRefresh: string | null;
  nextScheduledRefresh: string;
  scheduleDescription: string;
  modelVersion: string | null;
  dataSource: "mock" | "nbs";
  dataSourceLabel: string;
}

export interface Health {
  status: "ok" | "degraded";
  db: "up" | "down";
  uptime: number;
  time: string;
}
