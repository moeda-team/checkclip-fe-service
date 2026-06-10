"use client";

import { CheckCircle, Circle, Loader2, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdAccountDto, AdsPlatform } from "@/app/(app)/setting/hooks/use-ad-accounts";

// ─── Logos ────────────────────────────────────────────────────────────────────

const GOOGLE_LOGO = (
  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-label="Google">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const META_LOGO = (
  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-label="Meta">
    <path
      fill="#0081FB"
      d="M6.44 24c0-3.76 1.1-6.9 2.74-8.95C10.8 13 12.84 12 15 12c2.28 0 3.9.9 6.1 3.6.38.47.77.98 1.18 1.52l1.26 1.66C25.72 21.3 28 24.6 30 27.08c1.66 2.12 3.08 3.42 4.44 4.1 1.27.63 2.6.82 4.06.82 1.26 0 2.6-.28 3.7-.88l.02 3.16c-1.3.74-2.8 1.12-4.44 1.12-2.22 0-4.2-.6-6.04-1.98C29.7 31.66 28 29.44 26 26.92l-1.28-1.64c-.42-.54-.82-1.06-1.2-1.54C21.64 21.58 20.28 21 19 21c-1.4 0-2.8.74-3.84 2.14-1 1.38-1.72 3.54-1.72 5.86v.52H6.44V24zM41.22 15.7c-1.44-1.66-3.26-2.7-5.22-2.7-1.52 0-2.82.54-4 1.56-.52.44-1.02.98-1.5 1.6l-2.68-3.44C29.1 11.08 31 10 33.56 10c2.84 0 5.28 1.32 7.1 3.42.6.7 1.16 1.48 1.64 2.32l-1.08 1.2v-1.24z"
    />
    <path
      fill="#0081FB"
      d="M6.44 29.48V24c0 3.76-1.1 6.9-2.74 8.95C1.98 35 .5 35.5 0 35.5V32c.5 0 1.5-.44 2.5-1.7 1-1.24 1.74-3.26 1.82-5.56l.06-.82h2.06v5.56z"
    />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlatformConfig {
  platform: AdsPlatform;
  name: string;
  description: string;
  features: string[];
  disclaimer: string;
  logo: React.ReactNode;
  connectAction: "google_oauth" | "coming_soon";
}

export const PLATFORMS: PlatformConfig[] = [
  {
    platform: "google_ads",
    name: "Google Ads",
    description:
      "Connect your Google Account to sync and manage your Google Ads accounts, campaigns, and performance data.",
    features: [
      "View campaigns and performance data",
      "Manage budgets and bids",
      "Edit campaigns and settings",
    ],
    disclaimer: "We'll never post without your permission.",
    logo: GOOGLE_LOGO,
    connectAction: "google_oauth",
  },
  {
    platform: "meta_ads",
    name: "Meta Ads",
    description:
      "Connect your Meta Account to sync and manage your Facebook and Instagram advertising accounts, campaigns, and performance data.",
    features: [
      "View campaigns and performance data",
      "Manage budgets and bids",
      "Edit campaigns and settings",
    ],
    disclaimer: "We'll never post without your permission.",
    logo: META_LOGO,
    connectAction: "coming_soon",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureList({
  features,
  isConnected,
}: {
  features: string[];
  isConnected: boolean;
}) {
  return (
    <ul className="mt-4 space-y-2">
      {features.map((f) => (
        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
          {isConnected ? (
            <CheckCircle className="w-4 h-4 text-violet-600 shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-gray-300 shrink-0" />
          )}
          {f}
        </li>
      ))}
    </ul>
  );
}

function ConnectedBadge({ account }: { account: AdAccountDto }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-xs font-medium">
        Connected
      </Badge>
      {account.external_email && (
        <p className="text-xs text-gray-400 max-w-[160px] truncate text-right">
          {account.external_email}
        </p>
      )}
    </div>
  );
}

// ─── PlatformCard ─────────────────────────────────────────────────────────────

interface PlatformCardProps {
  config: PlatformConfig;
  account: AdAccountDto | undefined;
  onConnect: (platform: AdsPlatform) => void;
  onDisconnect: (platform: AdsPlatform) => void;
  isConnecting: boolean;
  isDisconnecting: boolean;
}

export function PlatformCard({
  config,
  account,
  onConnect,
  onDisconnect,
  isConnecting,
  isDisconnecting,
}: PlatformCardProps) {
  const isConnected = account != null;
  const isComingSoon = config.connectAction === "coming_soon";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-3 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {config.logo}
          <h3 className="text-base font-semibold text-gray-900">
            {config.name}
          </h3>
        </div>

        {isConnected ? (
          <ConnectedBadge account={account!} />
        ) : isComingSoon ? (
          <Badge
            variant="outline"
            className="text-gray-400 border-gray-200 text-xs font-medium"
          >
            Coming soon
          </Badge>
        ) : (
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium px-5"
            onClick={() => onConnect(config.platform)}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Connect"
            )}
          </Button>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed">
        {config.description}
      </p>

      {/* Feature list */}
      <FeatureList features={config.features} isConnected={isConnected} />

      {/* Disclaimer + Disconnect */}
      <div className="flex items-end justify-between mt-1">
        <p className="text-xs text-gray-400">{config.disclaimer}</p>
        {isConnected && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2 text-xs gap-1"
            onClick={() => onDisconnect(config.platform)}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Unlink className="w-3 h-3" />
            )}
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── ConnectedAccountsCard ────────────────────────────────────────────────────

interface ConnectedAccountsCardProps {
  accounts: AdAccountDto[];
  isLoading: boolean;
  isFetchingGoogleUrl: boolean;
  isDisconnecting: boolean;
  onConnect: (platform: AdsPlatform) => void;
  onDisconnect: (platform: AdsPlatform) => void;
}

export function ConnectedAccountsCard({
  accounts,
  isLoading,
  isFetchingGoogleUrl,
  isDisconnecting,
  onConnect,
  onDisconnect,
}: ConnectedAccountsCardProps) {
  const getAccount = (platform: AdsPlatform) =>
    accounts.find((a) => a.platform === platform);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-200 p-6 h-52 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {PLATFORMS.map((config) => (
        <PlatformCard
          key={config.platform}
          config={config}
          account={getAccount(config.platform)}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          isConnecting={
            config.platform === "google_ads" && isFetchingGoogleUrl
          }
          isDisconnecting={isDisconnecting}
        />
      ))}
    </div>
  );
}
