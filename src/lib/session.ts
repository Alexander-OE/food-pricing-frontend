// Gives each visitor an anonymous id, which the backend needs for chat and analytics.

const SESSION_KEY = "session_id";

/** Returns this browser's session id, creating and saving one the first time. */
export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
