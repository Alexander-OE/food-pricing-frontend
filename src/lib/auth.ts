// Keeps the admin login token in the browser so it survives a page refresh.

const TOKEN_KEY = "admin_token";

/** Returns the saved admin token, or null when nobody is logged in. */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

/** Saves the token after a successful login. */
export function saveToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

/** Removes the token (logout, or the server said it is no longer valid). */
export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}
