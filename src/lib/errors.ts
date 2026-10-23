// Turns any error into a short message that is safe to show to a person.
import axios from "axios";
import type { ApiErrorBody } from "@/types/api";

/** Uses the backend's own message when there is one, otherwise a friendly fallback. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    // The server answered with an error message
    const message = error.response?.data?.error?.message;
    if (message) return message;
    // No answer at all means the backend is off or unreachable
    if (!error.response) return "Cannot reach the server. Please check that the backend is running.";
  }
  return "Something went wrong. Please try again.";
}
