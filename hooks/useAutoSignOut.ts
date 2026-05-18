"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

/**
 * Automatically signs the user out when the refresh token has expired.
 * Mount this hook once in a layout that wraps authenticated pages.
 */
export function useAutoSignOut() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenExpired") {
      signOut({ callbackUrl: "/auth/login?error=session_expired" });
    }
  }, [session?.error]);
}
