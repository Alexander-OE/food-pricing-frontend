// Types for the public feedback form and the analytics tracking endpoint.

export type FeedbackCategory = "GENERAL" | "BUG" | "PREDICTION_ACCURACY" | "FEATURE_REQUEST";
export type FeedbackStatus = "NEW" | "REVIEWED" | "RESOLVED";

/** Body of POST /feedback. */
export interface NewFeedback {
  name?: string;
  email?: string;
  category: FeedbackCategory;
  message: string;
  commoditySlug?: string;
}

/** Response of POST /feedback. */
export interface FeedbackReceipt {
  id: number;
  status: FeedbackStatus;
}

export type TrackEventType = "PAGE_VIEW" | "COMMODITY_VIEW" | "SEARCH";

/** Body of POST /analytics/events. */
export interface TrackEvent {
  type: TrackEventType;
  path: string;
  commoditySlug?: string;
  metadata?: Record<string, unknown>;
}
