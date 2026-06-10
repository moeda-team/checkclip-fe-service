// hooks/use-ad-accounts.ts
// Ad account connection hooks — list, connect Google Ads, disconnect.
//
// PATTERN: Module-level axios instance (auth service base URL)
// Meta errorMessage for centralized error handling via AppQueryProvider.

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosConfig } from "@/lib/axios";
import { env } from "@/lib/env";
import type { ApiResponse, ApiResponseError } from "@/types/api";

// ─── Module-level axios instance ──────────────────────────────────────────────
const axios = axiosConfig(env.apiBaseUrl);
const AD_ACCOUNT_URL = "/auth/user/ad-accounts";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdsPlatform = "google_ads" | "meta_ads" | "line_ads";

export interface AdAccountDto {
  id: string;
  platform: AdsPlatform;
  external_account_id: string;
  external_account_name: string;
  external_email?: string;
  scopes: string;
}

export interface ConnectGoogleAdsDto {
  code: string;
  redirect_uri: string;
}

// ─── Query: GET list of connected ad accounts ─────────────────────────────────

export const useGetAdAccounts = () =>
  useQuery<ApiResponse<AdAccountDto[]>, AxiosError<ApiResponseError>>({
    queryKey: ["getAdAccounts"],
    queryFn: async () => {
      const res = await axios.get<ApiResponse<AdAccountDto[]>>(AD_ACCOUNT_URL);
      return res.data;
    },
    // enabled: false, // disabled — enable when backend is ready
    meta: { errorMessage: "Failed to fetch connected ad accounts" },
  });

// ─── Query: GET Google Ads OAuth auth URL ────────────────────────────────────

export const useGetGoogleAdsAuthUrl = () =>
  useQuery<ApiResponse<{ url: string }>, AxiosError<ApiResponseError>>({
    queryKey: ["getGoogleAdsAuthUrl"],
    queryFn: async () => {
      const res = await axios.get<ApiResponse<{ url: string }>>(
        `${AD_ACCOUNT_URL}/connect/google/url`
      );
      return res.data;
    },
    enabled: false, // only fetch on demand via refetch()
    meta: { errorMessage: "Failed to get Google Ads authorization URL" },
  });

// ─── Mutation: POST connect Google Ads ───────────────────────────────────────

export const useConnectGoogleAds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ConnectGoogleAdsDto) => {
      const res = await axios.post<ApiResponse<AdAccountDto>>(
        `${AD_ACCOUNT_URL}/connect/google`,
        payload
      );
      return res.data;
    },
    meta: {
      errorMessage: "Failed to connect Google Ads account",
      successMessage: "Google Ads connected successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAdAccounts"] });
    },
  });
};

// ─── Mutation: DELETE disconnect ad account ───────────────────────────────────

export const useDisconnectAdAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (platform: AdsPlatform) => {
      const res = await axios.delete<ApiResponse<null>>(
        `${AD_ACCOUNT_URL}/${platform}`
      );
      return res.data;
    },
    meta: {
      errorMessage: "Failed to disconnect ad account",
      successMessage: "Ad account disconnected",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAdAccounts"] });
    },
  });
};
