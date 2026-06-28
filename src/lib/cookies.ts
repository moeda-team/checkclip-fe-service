/**
 * lib/cookies.ts
 *
 * Centralized token management — keeps localStorage and cookies in sync.
 *
 * WHY TWO STORAGE MECHANISMS:
 *  - localStorage  → source of truth for apiFetch (fast, no server round-trip)
 *  - Cookie        → readable by Next.js Edge middleware for route protection
 *
 * Both are always written/cleared together via persistTokens() / clearTokens().
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Cookie lifetime mirrors a typical access token TTL (24h)
// Middleware only needs to know "is a token present", not validate it
const COOKIE_MAX_AGE = 60 * 60 * 24;

function buildCookie(name: string, value: string, maxAge: number): string {
  return `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function expireCookie(name: string): string {
  return `${name}=; path=/; max-age=0; SameSite=Lax`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Persist access + refresh tokens after login or register.
 * Writes to both localStorage (for API calls) and cookie (for middleware).
 */
export function persistTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  document.cookie = buildCookie(ACCESS_TOKEN_KEY, accessToken, COOKIE_MAX_AGE);
}

/**
 * Clear all auth state — call on logout or when refresh token is expired.
 * Removes localStorage entries and expires the cookie.
 */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = expireCookie(ACCESS_TOKEN_KEY);
}

/**
 * Read the access token from localStorage.
 * Returns null if absent, empty, or contains a stringified null/undefined.
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token || token === "undefined" || token === "null") return null;
  return token;
}

/**
 * Read the refresh token from localStorage.
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!token || token === "undefined" || token === "null") return null;
  return token;
}
