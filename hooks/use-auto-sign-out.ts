// hooks/use-auto-sign-out.ts
// Watches the NextAuth session for a RefreshTokenExpired error and
// automatically signs the user out, redirecting to the login page.
// Mount once in AppLayout — already wired in AppLayout.tsx.

"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function useAutoSignOut() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenExpired") {
      signOut({ callbackUrl: "/auth/login?error=session_expired" });
    }
  }, [session?.error]);
}
