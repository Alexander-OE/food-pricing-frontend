// API calls for the admin site. Every call except login needs the admin token (the client adds it).
import type { Paged } from "@/types/api";
import type {
  AccuracyReport,
  Admin,
  AdminCommodity,
  AdminFeedback,
  AdminFeedbackParams,
  CommodityRanking,
  DataStepStatus,
  LoginResponse,
  Overview,
  RefreshLog,
  RefreshLogParams,
  RefreshType,
  Usage,
  UsageRange,
} from "@/types/admin";
import type { FeedbackReceipt, FeedbackStatus } from "@/types/feedback";
import { getData, getPaged, patchData, postData } from "./client";

// A full refresh runs the whole data pipeline, so it can take a while
const REFRESH_TIMEOUT_MS = 180000;

/** POST /admin/auth/login: returns the token and the admin's details. */
export function login(email: string, password: string): Promise<LoginResponse> {
  return postData<LoginResponse>("/admin/auth/login", { email, password });
}

/** GET /admin/auth/me: the logged-in admin (also proves the token is still valid). */
export function getMe(): Promise<Admin> {
  return getData<Admin>("/admin/auth/me");
}

/** GET /admin/overview: the headline numbers for the dashboard. */
export function getOverview(): Promise<Overview> {
  return getData<Overview>("/admin/overview");
}

/** GET /admin/analytics/usage: one row per day with visitors, page views, commodity views and chats. */
export function getUsage(range: UsageRange): Promise<Usage> {
  return getData<Usage>("/admin/analytics/usage", { range });
}

/** GET /admin/analytics/commodities: commodities ranked by views. */
export function getCommodityRanking(range: UsageRange): Promise<CommodityRanking[]> {
  return getData<CommodityRanking[]>("/admin/analytics/commodities", { range });
}

/** GET /admin/data/status: how fresh each data step is. */
export function getDataSteps(): Promise<DataStepStatus[]> {
  return getData<DataStepStatus[]>("/admin/data/status");
}

/** GET /admin/data/refresh-logs: history of data refresh runs. */
export function getRefreshLogs(params: RefreshLogParams): Promise<Paged<RefreshLog>> {
  return getPaged<RefreshLog>("/admin/data/refresh-logs", params);
}

/** POST /admin/data/refresh: run one data step (or all of them) right now. */
export function runRefresh(type: RefreshType | "ALL"): Promise<RefreshLog[]> {
  return postData<RefreshLog[]>("/admin/data/refresh", { type }, REFRESH_TIMEOUT_MS);
}

/** GET /admin/accuracy: how close the forecasts were, over time and per commodity. */
export function getAccuracyReport(months: number): Promise<AccuracyReport> {
  return getData<AccuracyReport>("/admin/accuracy", { months });
}

/** GET /admin/feedback: the feedback inbox. */
export function getFeedbackList(params: AdminFeedbackParams): Promise<Paged<AdminFeedback>> {
  return getPaged<AdminFeedback>("/admin/feedback", params);
}

/** PATCH /admin/feedback/{id}: mark a message as new, reviewed or resolved. */
export function updateFeedbackStatus(id: number, status: FeedbackStatus): Promise<FeedbackReceipt> {
  return patchData<FeedbackReceipt>(`/admin/feedback/${id}`, { status });
}

/** GET /admin/commodities: plain list of every commodity. */
export function getAdminCommodities(): Promise<AdminCommodity[]> {
  return getData<AdminCommodity[]>("/admin/commodities");
}
