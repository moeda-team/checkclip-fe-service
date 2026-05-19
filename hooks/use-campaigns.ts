// hooks/use-campaigns.ts
// Campaign domain hooks — query, infinite query, and mutation hooks.
//
// PATTERN:
// - Module-level axios instance with gateway URL + service path suffix
// - meta: { errorMessage, successMessage? } for centralized cache handling
// - Query keys follow convention: ["getCampaign", filter], ["getOneCampaign", id]
// - After mutations, invalidate relevant query keys

"use client";

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosConfig } from "@/lib/axios";
import { env } from "@/lib/env";
import {
  queryKeys,
  type ApiResponse,
  type ApiResponseError,
  type ApiResponsePagination,
  type PaginationFilter,
  type DeleteBulkDto,
} from "@/types/api";
import type { CampaignDto, CampaignFormDto } from "@/types/type-campaign";

// ─── Module-level axios instance ──────────────────────────────────────────────
const axios = axiosConfig(env.apiGatewayUrl);
const CAMPAIGN_URL = "/campaign/v1/campaigns";

// ─── Query: GET list (paginated) ──────────────────────────────────────────────

export const useGetCampaigns = (filter: PaginationFilter) =>
  useQuery<ApiResponsePagination<CampaignDto[]>, AxiosError<ApiResponseError>>({
    queryKey: queryKeys.campaign.list(filter),
    queryFn: async () => {
      const response = await axios.get<ApiResponsePagination<CampaignDto[]>>(
        CAMPAIGN_URL,
        { params: filter }
      );
      return response.data;
    },
    meta: { errorMessage: "Failed to fetch campaigns" },
  });

// ─── Query: GET infinite scroll ───────────────────────────────────────────────

export const useGetCampaignsInfinite = (search: string) =>
  useInfiniteQuery<
    ApiResponsePagination<CampaignDto[]>,
    AxiosError<ApiResponseError>
  >({
    queryKey: queryKeys.campaign.infinite(search),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get<ApiResponsePagination<CampaignDto[]>>(
        CAMPAIGN_URL,
        { params: { page: pageParam, perPage: 10, search } }
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.paginate.next ?? undefined,
    initialPageParam: 1,
    meta: { errorMessage: "Failed to fetch campaigns" },
  });

// ─── Query: GET one by ID ─────────────────────────────────────────────────────

export const useGetCampaignDetail = (id: string) =>
  useQuery<ApiResponse<CampaignDto>, AxiosError<ApiResponseError>>({
    queryKey: queryKeys.campaign.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const response = await axios.get<ApiResponse<CampaignDto>>(
        `${CAMPAIGN_URL}/${id}`
      );
      return response.data;
    },
    meta: { errorMessage: "Failed to fetch campaign detail" },
  });

// ─── Mutation: POST create ────────────────────────────────────────────────────

export const usePostCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: CampaignFormDto) =>
      axios.post<ApiResponse<CampaignDto>>(CAMPAIGN_URL, form),
    meta: {
      errorMessage: "Failed to create campaign",
      successMessage: "Campaign created successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCampaign"] });
    },
  });
};

// ─── Mutation: PATCH update ───────────────────────────────────────────────────

export const usePatchCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      form,
    }: {
      id: string;
      form: Partial<CampaignFormDto>;
    }) => axios.patch<ApiResponse<CampaignDto>>(`${CAMPAIGN_URL}/${id}`, form),
    meta: {
      errorMessage: "Failed to update campaign",
      successMessage: "Campaign updated successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCampaign"] });
      queryClient.invalidateQueries({ queryKey: ["getOneCampaign"] });
    },
  });
};

// ─── Mutation: DELETE bulk ─────────────────────────────────────────────────────

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: DeleteBulkDto) =>
      axios.post<ApiResponse<CampaignDto>>(`${CAMPAIGN_URL}/bulk-delete`, dto),
    meta: {
      errorMessage: "Failed to delete campaign",
      successMessage: "Campaign deleted successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCampaign"] });
    },
  });
};
