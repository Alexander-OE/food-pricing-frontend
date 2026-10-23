// API call for the public feedback form.
import type { FeedbackReceipt, NewFeedback } from "@/types/feedback";
import { postData } from "./client";

/** POST /feedback: send a message to the team. */
export function sendFeedback(feedback: NewFeedback): Promise<FeedbackReceipt> {
  return postData<FeedbackReceipt>("/feedback", feedback);
}
