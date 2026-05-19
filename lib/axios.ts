// lib/axios.ts
// Axios factory function that returns a pre-configured axios instance.
//
// WHY axiosConfig() FACTORY OVER SINGLETON:
// - Each hook file calls axiosConfig() at module level to get its own instance
// - This allows per-domain customization (different base URLs, timeouts, etc.)
// - The factory still shares the same interceptor logic (auth, refresh, retry)
// - Avoids circular dependency issues that singletons can cause
//
// ARCHITECTURE DECISIONS:
// - Token refresh uses a singleton promise to prevent concurrent refresh requests
// - Retry is limited to 401 responses only (idempotent auto-retry)
// - AbortController helper exposed for React Query signal-based cancellation

import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { env } from "@/lib/env";

// ─── Refresh token singleton ──────────────────────────────────────────────────
// WHY: When multiple requests fail with 401 simultaneously, we must NOT
// send multiple refresh requests. This singleton ensures only one refresh
// happens, and all waiting requests reuse the same promise.

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const session = await getSession();
      if (!session?.accessToken) return null;

      // Use a plain axios call (not the configured instance) to avoid interceptor loops
      const res = await axios.post(`${env.apiBaseUrl}/auth/refresh-token`, {
        refresh_token: session.accessToken,
      });

      if (res.data?.data?.access_token) {
        return res.data.data.access_token as string;
      }
      return null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Factory function ──────────────────────────────────────────────────────────

export function axiosConfig(baseURL?: string): AxiosInstance {
  const instance = axios.create({
    baseURL: baseURL ?? env.apiBaseUrl,
    timeout: 30_000,
    headers: { "Content-Type": "application/json" },
  });

  // ── Request interceptor: attach access token ──────────────────────────────
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ── Response interceptor: handle 401 + retry ──────────────────────────────
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newToken = await refreshAccessToken();

        if (newToken) {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return instance(originalRequest);
        }

        // Refresh failed → force sign out
        await signOut({ callbackUrl: "/auth/login" });
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

// ─── Request cancellation helper ─────────────────────────────────────────────
// WHY: React Query's signal-based cancellation requires AbortController.
// This helper makes it ergonomic to pass signal into any API call.

export function createAbortController() {
  return new AbortController();
}
