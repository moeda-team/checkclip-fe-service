// lib/axios.ts
// Axios factory function that returns a pre-configured axios instance.
//
// WHY axiosConfig() FACTORY OVER SINGLETON:
// - Each hook file calls axiosConfig() at module level to get its own instance
// - This allows per-domain customization (different base URLs, timeouts, etc.)
// - The factory still shares the same interceptor logic (auth, 401 sign-out)
// - Avoids circular dependency issues that singletons can cause
//
// ARCHITECTURE DECISIONS:
// - Token refresh is handled by NextAuth's JWT callback (server-side)
// - Sign-out only happens via the logout button, not automatically on API errors
// - AbortController helper exposed for React Query signal-based cancellation

import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession } from "next-auth/react";
import { env } from "@/lib/env";

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

  // ── Response interceptor ─────────────────────────────────────────────────
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(error)
  );

  return instance;
}

// ─── Request cancellation helper ─────────────────────────────────────────────
// WHY: React Query's signal-based cancellation requires AbortController.
// This helper makes it ergonomic to pass signal into any API call.

export function createAbortController() {
  return new AbortController();
}
