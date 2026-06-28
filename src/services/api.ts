/**
 * Core fetch utility — thin wrapper around the native fetch API.
 * Handles: base URL, auth token injection, token refresh, and redirect on auth failure.
 */

import { getAccessToken, getRefreshToken, persistTokens, clearTokens } from '@/lib/cookies';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://checkclip-be-service.onrender.com';

// ─── Token refresh ────────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) throw new Error('Refresh failed');

    const json = await res.json();
    const tokens = json.data;

    if (!tokens?.access_token || !tokens?.refresh_token) {
      throw new Error('Invalid token response');
    }

    persistTokens(tokens.access_token, tokens.refresh_token);
    return tokens.access_token;
  } catch {
    clearTokens();
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.replace('/login?error=session_expired');
    }
    return null;
  }
}

// ─── Request options ──────────────────────────────────────────────────────────

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  /** Skip auth token injection (e.g. login, register, forgot/reset password) */
  skipAuth?: boolean;
}

// ─── Core fetch function ──────────────────────────────────────────────────────

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;

  const buildHeaders = (token?: string | null): HeadersInit => ({
    'Content-Type': 'application/json',
    ...headers,
    ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const buildInit = (token?: string | null): RequestInit => ({
    method,
    headers: buildHeaders(token),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const url = `${API_BASE_URL}${path}`;
  const accessToken = skipAuth ? null : getAccessToken();

  let response = await fetch(url, buildInit(accessToken));

  // ── Handle 401 with token refresh ──
  if (response.status === 401 && !skipAuth) {
    if (isRefreshing) {
      // Queue this request until the in-flight refresh resolves
      const newToken = await new Promise<string | null>((resolve) => {
        refreshQueue.push(resolve);
      });
      if (!newToken) throw new ApiError('Session expired', 401);
      response = await fetch(url, buildInit(newToken));
    } else {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;

      // Flush the queue
      refreshQueue.forEach((cb) => cb(newToken));
      refreshQueue = [];

      if (!newToken) throw new ApiError('Session expired', 401);
      response = await fetch(url, buildInit(newToken));
    }
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const err = await response.json();
      message = err?.message ?? err?.error ?? message;
    } catch {
      // ignore JSON parse errors on error responses
    }
    throw new ApiError(message, response.status);
  }

  // 204 No Content — nothing to parse
  if (response.status === 204) return undefined as T;

  const json = await response.json();
  return json as T;
}

// ─── Typed error ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
