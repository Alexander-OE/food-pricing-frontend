// Types for commodity endpoints (list, detail, history, accuracy, related, categories).

export type CommodityCategory =
  | "GRAINS"
  | "LEGUMES"
  | "TUBERS"
  | "VEGETABLES"
  | "FRUITS"
  | "PROTEIN"
  | "OILS"
  | "OTHERS";

export type Direction = "UP" | "DOWN" | "STABLE";

/** Summary used in lists, the dashboard and related items. */
export interface CommodityCard {
  id: number;
  name: string;
  slug: string;
  category: CommodityCategory;
  unit: string;
  imageUrl: string | null;
  currentPrice: number;
  previousPrice: number;
  monthOnMonthChange: number;
  predictedPrice: number;
  percentChange: number;
  direction: Direction;
  confidence: number;
}

/** One reason behind a forecast. */
export interface PredictionFactor {
  key: string;
  label: string;
  detail: string;
  direction: "UP" | "DOWN";
  impactPercent: number;
}

/** How a past forecast compared with the real price. */
export interface TrackRecord {
  targetPeriod: string;
  predictedPrice: number;
  actualPrice: number;
  percentError: number;
  directionHit: boolean;
}

/** Full detail for one commodity (a card plus the forecast breakdown). */
export interface CommodityDetail extends CommodityCard {
  description: string;
  lowerBound: number;
  upperBound: number;
  basePeriod: string | null;
  targetPeriod: string | null;
  factors: PredictionFactor[];
  explanation: string;
  modelVersion: string | null;
  yearOnYearChange: number | null;
  lastMonthTrackRecord: TrackRecord | null;
}

export interface PricePoint {
  period: string;
  price: number;
}

export interface ForecastPoint {
  period: string;
  price: number;
  lowerBound: number;
  upperBound: number;
}

/** Chart data: real prices plus one forecast point. */
export interface PriceHistory {
  slug: string;
  history: PricePoint[];
  forecast: ForecastPoint | null;
}

export interface CategoryCount {
  category: CommodityCategory;
  count: number;
}

export type CommoditySort = "name" | "price" | "change" | "-change";

/** Query parameters accepted by GET /commodities. */
export interface CommodityListParams {
  search?: string;
  category?: CommodityCategory;
  direction?: Direction;
  sort?: CommoditySort;
  page?: number;
  limit?: number;
}

/** One entry of /images/commodities/credits.json. */
export interface ImageCredit {
  title: string;
  author: string;
  license: string;
  licenseUrl: string | null;
  sourceUrl: string;
}
