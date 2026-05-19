// hooks/use-auto-sign-out.ts
// Detects when NextAuth session has a RefreshTokenExpired error
// and automatically signs the user out with a redirect.

"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function useAutoSignOut() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenExpired") {
      signOut({ callbackUrl: "/auth/login?error=session_expired" });
    }
  }, [session]);
}
