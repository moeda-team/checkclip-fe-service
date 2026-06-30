// hooks/use-logout.ts
// Logout mutation hook — clears session, invalidates queries, redirects.
//
// WHY queryClient.clear() ON LOGOUT:
// Wipes ALL React Query cache — prevents data leakage between sessions
// (security concern on shared devices). Even if backend logout fails,
// client-side cleanup must still happen.

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { fetchConfig } from "@/lib/fetch";
import { env } from "@/lib/env";

const client = fetchConfig(env.apiBaseUrl);

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Notify backend (best-effort)
      try {
        await client.post("/auth/logout");
      } catch {
        // Backend logout failure should not block client cleanup
      }
      // Clear NextAuth session
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      // Wipe ALL React Query cache — prevents data leakage between sessions
      queryClient.clear();
      // Redirect to login
      window.location.href = "/auth/login";
    },
    onError: () => {
      // Even if everything fails, still sign out locally
      signOut({ callbackUrl: "/auth/login" });
    },
    meta: { errorMessage: "Failed to sign out" },
  });
};
