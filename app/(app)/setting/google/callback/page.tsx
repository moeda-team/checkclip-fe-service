"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useConnectGoogleAds } from "@/app/(app)/setting/hooks/use-ad-accounts";
import { env } from "@/lib/env";

// Google redirects here after the user grants consent on the Ads OAuth screen:
//   /setting/google/callback?code=...&scope=...
//
// Flow:
//   1. Extract `code` from query params
//   2. POST /auth/user/ad-accounts/connect/google  { code, redirect_uri }
//   3. Success → redirect to /setting with success toast
//   4. Error   → redirect to /setting with error toast

function GoogleAdsCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFired = useRef(false);

  const { mutate: connectGoogleAds } = useConnectGoogleAds();

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // User denied access on the consent screen
    if (error) {
      toast.error("Google Ads connection was cancelled.");
      router.replace("/setting");
      return;
    }

    if (!code) {
      toast.error("Invalid callback — authorization code missing.");
      router.replace("/setting");
      return;
    }

    connectGoogleAds(
      {
        code,
        redirect_uri: env.googleAdsRedirectUri,
      },
      {
        onSuccess: () => {
          toast.success("Google Ads connected successfully.");
          router.replace("/setting");
        },
        onError: (err: unknown) => {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to connect Google Ads account.";
          toast.error(message);
          router.replace("/setting");
        },
      }
    );
  }, [connectGoogleAds, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f0ff]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Connecting Google Ads account...</p>
      </div>
    </div>
  );
}

export default function GoogleAdsCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f3f0ff]">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      }
    >
      <GoogleAdsCallbackInner />
    </Suspense>
  );
}
