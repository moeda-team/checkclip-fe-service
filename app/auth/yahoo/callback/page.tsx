"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

// Yahoo redirect ke sini setelah user consent:
// /auth/yahoo/callback?code=...&state=...
// FE kemudian hit BE /auth/yahoo/callback?code=... untuk exchange token.

function YahooCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state") ?? "";

    if (!code) {
      router.replace("/auth/login?error=yahoo_no_code");
      return;
    }

    signIn("yahoo-oauth", {
      code,
      state,
      redirect: false,
      callbackUrl: "/auth/redirect"
    }).then((result) => {
      if (!result || result.error) {
        router.replace("/auth/login?error=yahoo_failed");
        return;
      }
      router.replace(result.url ?? "/auth/redirect");
    });
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f0ff]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">
          Completing sign in with Yahoo...
        </p>
      </div>
    </div>
  );
}

export default function YahooCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f3f0ff]">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      }
    >
      <YahooCallbackInner />
    </Suspense>
  );
}
