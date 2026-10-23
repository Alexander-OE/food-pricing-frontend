"use client";
// Hooks for the market overview, indicators, data status, health and photo credits.
import { getLatestIndicators, getDashboardSummary } from "@/lib/api/dashboard";
import { getDataStatus, getHealth, getImageCredits } from "@/lib/api/meta";
import { useFetch } from "./useFetch";

/** Market pulse: counts of rising, falling and steady commodities. */
export function useDashboardSummary() {
  return useFetch(getDashboardSummary, []);
}

/** Dollar rate, diesel, petrol and food inflation. */
export function useIndicators() {
  return useFetch(getLatestIndicators, []);
}

/** Latest data month, forecast month, refresh times and model version. */
export function useDataStatus() {
  return useFetch(getDataStatus, []);
}

/** Whether the backend and its database are up. */
export function useHealth() {
  return useFetch(getHealth, []);
}

/** Photo credits keyed by commodity slug. */
export function useImageCredits() {
  return useFetch(getImageCredits, []);
}
