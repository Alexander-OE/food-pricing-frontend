// API call that tells the backend which pages and commodities people look at.
import type { TrackEvent } from "@/types/feedback";
import { postData } from "./client";

/** POST /analytics/events: fire and forget. A tracking failure must never bother the visitor. */
export async function trackEvent(event: TrackEvent): Promise<void> {
  try {
    await postData("/analytics/events", event);
  } catch {
    // ignore: tracking is optional
  }
}
