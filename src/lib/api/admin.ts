// API calls for the admin site. Every call except login needs the admin token (the client adds it).
import type { Paged } from "@/types/api";
import type {
  AccuracyReport,
  Admin,
  AdminCommodity,
  AdminFeedback,
  AdminFeedbackParams,
  CommodityRanking,
  LoginResponse,
  Overview,
  Usage,
  UsageRange,
} from "@/types/admin";
import type { FeedbackReceipt, FeedbackStatus } from "@/types/feedback";
import { getData, getPaged, patchData, postData } from "./client";

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
