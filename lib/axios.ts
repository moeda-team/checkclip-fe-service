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
// - 401 responses trigger sign-out (the JWT callback should have refreshed already)
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
        // NextAuth's JWT callback handles token refresh server-side.
        // If we still get a 401, the session is invalid → sign out.
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
