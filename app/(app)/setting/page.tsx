"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  useGetAdAccounts,
  useGetGoogleAdsAuthUrl,
  useDisconnectAdAccount,
  type AdsPlatform,
} from "@/app/(app)/setting/hooks/use-ad-accounts";
import { ConnectedAccountsCard } from "./components/ConnectedAccountsCard";
import { AdAccountsTable } from "./components/AdAccountsTable";

export default function SettingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: adAccountsData, isLoading: isLoadingAccounts } =
    useGetAdAccounts();

  const { refetch: fetchGoogleAdsUrl, isFetching: isFetchingGoogleUrl } =
    useGetGoogleAdsAuthUrl();

  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectAdAccount();

  const accounts = adAccountsData?.data ?? [];

  // Clean up any stale query params left from OAuth callbacks
  useEffect(() => {
    const connected = searchParams.get("connected");
    if (connected === "google_ads") {
      const url = new URL(window.location.href);
      url.searchParams.delete("connected");
      router.replace(url.pathname);
    }
  }, [searchParams, router]);

  // ── Connect handler ──────────────────────────────────────────────────────
  const handleConnect = async (platform: AdsPlatform) => {
    if (platform === "google_ads") {
      const result = await fetchGoogleAdsUrl();
      const url = result.data?.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to get Google Ads authorization URL");
      }
    }
  };

  // ── Disconnect handler ───────────────────────────────────────────────────
  const handleDisconnect = (platform: AdsPlatform) => {
    disconnect(platform);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Page title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Manage Connected Accounts
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Connect your advertising platforms to manage campaigns and sync
          performance data from one place.
        </p>
      </div>

      {/* Platform connection cards */}
      <ConnectedAccountsCard
        accounts={accounts}
        isLoading={isLoadingAccounts}
        isFetchingGoogleUrl={isFetchingGoogleUrl}
        isDisconnecting={isDisconnecting}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {/* Ad accounts table */}
      <AdAccountsTable
        onSyncGoogle={() => toast.info("Sync Google Ads — coming soon")}
        onSyncMeta={() => toast.info("Sync Meta Ads — coming soon")}
      />
    </div>
  );
}
