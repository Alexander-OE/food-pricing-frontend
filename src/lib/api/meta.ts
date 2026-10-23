// API calls for service health, data freshness and photo credits.
import axios from "axios";
import type { ImageCredit } from "@/types/commodity";
import type { DataStatus, Health } from "@/types/market";
import { getData } from "./client";

/** The address of the backend itself (without /api/v1), where the photos are served. */
export const API_ORIGIN = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1")
  .origin;

/** GET /health: is the backend and its database up? */
export function getHealth(): Promise<Health> {
  return getData<Health>("/health");
}

/** GET /meta/data-status: latest data month, forecast month, refresh times, model version. */
export function getDataStatus(): Promise<DataStatus> {
  return getData<DataStatus>("/meta/data-status");
}

/** GET /images/commodities/credits.json: who took each photo and under which licence (keyed by slug). */
export async function getImageCredits(): Promise<Record<string, ImageCredit>> {
  const response = await axios.get<Record<string, ImageCredit>>(
    `${API_ORIGIN}/images/commodities/credits.json`,
  );
  return response.data;
}
