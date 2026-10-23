// Types for every admin endpoint.
import type { CommodityCategory } from "./commodity";
import type { FeedbackCategory, FeedbackStatus } from "./feedback";

export interface Admin {
  id: number;
  email: string;
  name: string;
  lastLoginAt: string | null;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export type RefreshType = "NBS_PRICES" | "MACRO_FEATURES" | "PREDICTIONS" | "ACCURACY";
export type RefreshStatus = "RUNNING" | "SUCCESS" | "FAILED";

// ----- Overview -----
export interface VisitorStat {
  value: number;
  previous: number;
  changePercent: number;
}

export interface Overview {
  visitors: { today: VisitorStat; last7Days: VisitorStat; last30Days: VisitorStat };
  pageViews30d: { value: number; changePercent: number };
  commodityViews30d: number;
  chats30d: number;
  averageMessagesPerChat: number;
  newFeedbackCount: number;
  accuracy: { mape: number; directionHitRate: number; months: number };
  lastRefreshes: {
    type: RefreshType;
    status: RefreshStatus;
    at: string;
    errorMessage: string | null;
  }[];
}

// ----- Usage analytics -----
export type UsageRange = "7d" | "30d" | "90d";

export interface UsageDay {
  date: string;
  visitors: number;
  pageViews: number;
  commodityViews: number;
  chats: number;
}

export interface Usage {
  range: UsageRange;
  series: UsageDay[];
}

export interface CommodityRanking {
  slug: string;
  name: string;
  views: number;
  chats: number;
}

// ----- Data health -----
export interface DataStepStatus {
  type: RefreshType;
  lastSuccessAt: string | null;
  lastAttemptAt: string | null;
  status: RefreshStatus | null;
  latestDataPeriod: string | null;
  isFresh: boolean;
  lastError: string | null;
}

export interface RefreshLog {
  id: number;
  type: RefreshType;
  status: RefreshStatus;
  trigger: string;
  startedAt: string;
  finishedAt: string | null;
  recordsProcessed: number;
  dataPeriod: string | null;
  errorMessage: string | null;
}

export interface RefreshLogParams {
  type?: RefreshType;
  status?: RefreshStatus;
  page?: number;
  limit?: number;
}

// ----- Forecast accuracy -----
export interface AccuracySummary {
  mape: number;
  directionHitRate: number;
  count: number;
}

export interface AccuracyReport {
  monthly: ({ period: string } & AccuracySummary)[];
  perCommodity: ({ slug: string; name: string } & AccuracySummary)[];
  best: ({ slug: string; name: string } & AccuracySummary)[];
  worst: ({ slug: string; name: string } & AccuracySummary)[];
  latestMonth: {
    slug: string;
    name: string;
    predictedPrice: number;
    actualPrice: number;
    percentError: number;
    directionHit: boolean;
  }[];
}

// ----- Feedback inbox -----
export interface AdminFeedback {
  id: number;
  name: string | null;
  email: string | null;
  category: FeedbackCategory;
  message: string;
  status: FeedbackStatus;
  commodityName: string | null;
  createdAt: string;
}

export interface AdminFeedbackParams {
  status?: FeedbackStatus;
  category?: FeedbackCategory;
  page?: number;
  limit?: number;
}

// ----- Commodity list -----
export interface AdminCommodity {
  id: number;
  name: string;
  slug: string;
  category: CommodityCategory;
  unit: string;
}
