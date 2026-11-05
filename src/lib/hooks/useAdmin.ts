"use client";
// Hooks for the admin pages (one per data need).
import {
  getAccuracyReport,
  getAdminCommodities,
  getCommodityRanking,
  getFeedbackList,
  getMe,
  getOverview,
  getUsage,
} from "@/lib/api/admin";
import type { AdminFeedbackParams, UsageRange } from "@/types/admin";
import { useFetch } from "./useFetch";

/** The logged-in admin. */
export function useAdminMe() {
  return useFetch(getMe, []);
}

/** Headline numbers for the admin dashboard. */
export function useOverview() {
  return useFetch(getOverview, []);
}

/** Daily usage numbers for the chart. */
export function useUsage(range: UsageRange) {
  return useFetch(() => getUsage(range), [range]);
}

/** Commodities ranked by views and chats. */
export function useCommodityRanking(range: UsageRange) {
  return useFetch(() => getCommodityRanking(range), [range]);
}

/** Forecast accuracy report. */
export function useAccuracyReport(months: number) {
  return useFetch(() => getAccuracyReport(months), [months]);
}

/** The feedback inbox. */
export function useFeedbackList(params: AdminFeedbackParams) {
  return useFetch(() => getFeedbackList(params), [params]);
}

/** Plain list of every commodity. */
export function useAdminCommodities() {
  return useFetch(getAdminCommodities, []);
}
