// lib/fetch.ts
// Native fetch wrapper replacing the axios factory pattern.
//
// WHY FETCH OVER AXIOS:
// - Zero extra dependency — fetch is built into Node 18+ and all modern browsers
// - Next.js 13+ extends fetch with caching/revalidation support
// - Smaller bundle size
//
// DESIGN DECISIONS:
// - fetchConfig(baseURL) mirrors the old axiosConfig() signature so hook files
//   need minimal changes (module-level instance pattern preserved)
// - fetchClient.get / .post / .put / .patch / .delete mirror the axios API surface
//   used in this codebase, so call-sites stay almost identical
// - Non-2xx responses throw ApiError with the parsed body — query-provider.tsx
//   reads error.message and error.data to match the old AxiosError parsing
// - AbortSignal.timeout(30_000) replaces axios timeout option
// - Bearer token is injected from NextAuth session on every request

import { getSession } from "next-auth/react";
import { env } from "@/lib/env";

// ─── Custom error class ───────────────────────────────────────────────────────

export class ApiError extends Error {
  /** HTTP status code */
  status: number;
  /** Parsed response body (matches ApiResponseError shape) */
  data: { statusCode?: string; message?: string | string[] };

  constructor(
    status: number,
    data: { statusCode?: string; message?: string | string[] },
  ) {
    const raw = data?.message;
    const msg = Array.isArray(raw) ? raw.join(", ") : (raw ?? `HTTP ${status}`);
    super(msg);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestOptions = Omit<RequestInit, "body"> & {
  /** Request body — will be JSON.stringify'd automatically */
  body?: unknown;
  /** Override timeout in ms (default: 30 000) */
  timeout?: number;
};

type FetchClient = {
  get<T>(path: string, options?: Omit<RequestOptions, "body">): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
};

// ─── Core request helper ──────────────────────────────────────────────────────

async function request<T>(
  baseURL: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, timeout = 30_000, ...rest } = options;

  // Attach Bearer token from NextAuth session
  const session = await getSession();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string> | undefined),
  };
  if (session?.accessToken) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${session.accessToken}`;
  }

  const url = `${baseURL.replace(/\/$/, "")}${path}`;

  const res = await fetch(url, {
    ...rest,
    headers,
    signal: AbortSignal.timeout(timeout),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  // Parse body regardless of status (backend always returns JSON)
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, json);
  }

  return json as T;
}

// ─── Factory function (mirrors old axiosConfig signature) ─────────────────────

export function fetchConfig(baseURL?: string): FetchClient {
  const base = (baseURL ?? env.apiBaseUrl)!;

  return {
    get: (path, options) => request(base, path, { method: "GET", ...options }),
    post: (path, body, options) =>
      request(base, path, { method: "POST", body, ...options }),
    put: (path, body, options) =>
      request(base, path, { method: "PUT", body, ...options }),
    patch: (path, body, options) =>
      request(base, path, { method: "PATCH", body, ...options }),
    delete: (path, options) =>
      request(base, path, { method: "DELETE", ...options }),
  };
}
