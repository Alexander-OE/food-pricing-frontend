"use client";
// Hooks for everything about commodities.
import {
  getCategories,
  getCommodities,
  getCommodity,
  getCommodityAccuracy,
  getPriceHistory,
  getRelated,
} from "@/lib/api/commodities";
import type { CommodityListParams } from "@/types/commodity";
import { useFetch } from "./useFetch";

/** A filtered, sorted page of commodities. */
export function useCommodities(params: CommodityListParams) {
  return useFetch(() => getCommodities(params), [params]);
}

/** Categories with how many commodities each has. */
export function useCategories() {
  return useFetch(getCategories, []);
}

/** Full detail for one commodity. */
export function useCommodity(slug: string) {
  return useFetch(() => getCommodity(slug), [slug]);
}

/** Price history (plus forecast point) for the chart. */
export function usePriceHistory(slug: string, months: number) {
  return useFetch(() => getPriceHistory(slug, months), [slug, months]);
}

/** Predicted vs actual price for past months. */
export function useCommodityAccuracy(slug: string, months: number) {
  return useFetch(() => getCommodityAccuracy(slug, months), [slug, months]);
}

/** Similar commodities. */
export function useRelated(slug: string) {
  return useFetch(() => getRelated(slug), [slug]);
}
