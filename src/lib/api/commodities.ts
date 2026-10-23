// API calls for commodities: list, categories, detail, price history, accuracy and related items.
import type {
  CategoryCount,
  CommodityCard,
  CommodityDetail,
  CommodityListParams,
  PriceHistory,
  TrackRecord,
} from "@/types/commodity";
import type { Paged } from "@/types/api";
import { getData, getPaged } from "./client";

/** GET /commodities: search, filter, sort and page through the commodities. */
export function getCommodities(params: CommodityListParams): Promise<Paged<CommodityCard>> {
  return getPaged<CommodityCard>("/commodities", params);
}

/** GET /commodities/categories: every category with how many commodities it has. */
export function getCategories(): Promise<CategoryCount[]> {
  return getData<CategoryCount[]>("/commodities/categories");
}

/** GET /commodities/{slug}: full detail with the forecast, factors and explanation. */
export function getCommodity(slug: string): Promise<CommodityDetail> {
  return getData<CommodityDetail>(`/commodities/${slug}`);
}

/** GET /commodities/{slug}/history: past prices plus the forecast point. */
export function getPriceHistory(slug: string, months: number): Promise<PriceHistory> {
  return getData<PriceHistory>(`/commodities/${slug}/history`, { months });
}

/** GET /commodities/{slug}/accuracy: predicted vs actual price for past months. */
export function getCommodityAccuracy(slug: string, months: number): Promise<TrackRecord[]> {
  return getData<TrackRecord[]>(`/commodities/${slug}/accuracy`, { months });
}

/** GET /commodities/{slug}/related: up to 4 similar commodities. */
export function getRelated(slug: string): Promise<CommodityCard[]> {
  return getData<CommodityCard[]>(`/commodities/${slug}/related`);
}
