// API calls for the home page: the market overview and the market-driver indicators.
import type { Indicator, DashboardSummary } from "@/types/market";
import { getData } from "./client";

/** GET /dashboard/summary: how many commodities are rising, falling or steady. */
export function getDashboardSummary(): Promise<DashboardSummary> {
  return getData<DashboardSummary>("/dashboard/summary");
}

/** GET /indicators/latest: dollar rate, diesel, petrol and food inflation with monthly change. */
export function getLatestIndicators(): Promise<Indicator[]> {
  return getData<Indicator[]>("/indicators/latest");
}
