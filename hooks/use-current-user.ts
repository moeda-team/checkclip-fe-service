// hooks/use-current-user.ts
// React Query hook for fetching the current authenticated user profile.
//
// PATTERN: Module-level axios instance + meta.errorMessage for centralized error handling.
// The AppQueryProvider's QueryCache.onError reads meta.errorMessage as fallback.

"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { axiosConfig } from "@/lib/axios";
import { env } from "@/lib/env";
import { queryKeys } from "@/types/api";
import type { ApiResponse, ApiResponseError } from "@/types/api";
import type { UserProfileDto } from "@/types/type-auth";
import type { AxiosError } from "axios";

const axios = axiosConfig(env.apiBaseUrl);

export const useGetCurrentUser = () => {
  const { status } = useSession();

  return useQuery<ApiResponse<UserProfileDto>, AxiosError<ApiResponseError>>({
    queryKey: queryKeys.user.me(),
    queryFn: async () => {
      const response = await axios.get<ApiResponse<UserProfileDto>>(
        "/auth/me"
      );
      return response.data;
    },
    enabled: status === "authenticated",
    staleTime: 2 * 60 * 1000, // 2 min — user profile rarely changes
    meta: { errorMessage: "Failed to fetch user profile" },
  });
};

/** Lightweight hook that returns just the user's role — avoids rerenders
 *  when other profile fields change. */
export const useCurrentUserRole = () => useGetCurrentUser().data?.data.role;
