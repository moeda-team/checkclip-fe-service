
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosConfig } from "@/lib/axios";
import { env } from "@/lib/env";
import type {
  CampaignBrief,
  CampaignBriefFilter,
} from "../types";
import type {
  ApiResponse,
  ApiResponseError,
  ApiResponsePagination
} from "@/types/api";

const STRATEGY_Brief_URL = `${env.apiBaseUrl}/campaign/strategy-brief/`;
const axios = axiosConfig(env.apiBaseUrl);

/*
   POST - Create Strategy Brief
*/
// export const usePostStrategyBrief = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     ApiResponse<CampaignBrief>,
//     AxiosError<ApiResponseError>,
//     CreateStrategyBriefPayload
//   >({
//     mutationFn: async (payload) => {
//       const response = await axios.post<ApiResponse<CampaignBrief>>(
//         STRATEGY_Brief_URL,
//         payload
//       );
//       return response.data;
//     },

//     meta: {
//       errorMessage: "Failed to create strategy Brief",
//       successMessage: "Strategy Brief created successfully"
//     },

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["getStrategyBriefs"]
//       });
//     }
//   });
// };

/*
   GET - Find All Strategy Briefs (Table/Pagination)
*/
export const useGetStrategyBriefs = (filter: CampaignBriefFilter) =>
  useQuery<
    ApiResponsePagination<CampaignBrief[]>,
    AxiosError<ApiResponseError>
  >({
    queryKey: ["getStrategyBriefs", filter],

    queryFn: async () => {
      const response = await axios.get<
        ApiResponsePagination<CampaignBrief[]>
      >(`${STRATEGY_Brief_URL}`, { params: filter });

      return response.data;
    },

    meta: {
      errorMessage: "Failed to fetch strategy Briefs"
    }
  });

/*
   GET - Find One Strategy Brief by ID
*/
export const useGetStrategyBrief = (strategyBriefId: string) =>
  useQuery<
    ApiResponse<CampaignBrief>,
    AxiosError<ApiResponseError>
  >({
    queryKey: ["getStrategyBrief", strategyBriefId],

    queryFn: async () => {
      const response = await axios.get<ApiResponse<CampaignBrief>>(
        `${STRATEGY_Brief_URL}${strategyBriefId}`
      );

      return response.data;
    },

    meta: {
      errorMessage: "Failed to fetch strategy Brief"
    },

    enabled: !!strategyBriefId,
    refetchOnMount: "always"
  });

/*
   PUT - Update Strategy Brief
*/
// export const usePutStrategyBrief = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     ApiResponse<CampaignBrief>,
//     AxiosError<ApiResponseError>,
//     { strategyBriefId: string; payload: UpdateStrategyBriefPayload }
//   >({
//     mutationFn: async ({ strategyBriefId, payload }) => {
//       const response = await axios.put<ApiResponse<CampaignBrief>>(
//         `${STRATEGY_Brief_URL}${strategyBriefId}`,
//         payload
//       );

//       return response.data;
//     },

//     meta: {
//       errorMessage: "Failed to update strategy Brief",
//       successMessage: "Strategy Brief updated successfully"
//     },

//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["getStrategyBriefs"]
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["getStrategyBrief", variables.strategyBriefId]
//       });
//     }
//   });
// };

/*
   DELETE - Delete Strategy Brief
*/
// export const useDeleteStrategyBrief = () => {
//   const queryClient = useQueryClient();

//   return useMutation<
//     ApiResponse<null>,
//     AxiosError<ApiResponseError>,
//     string
//   >({
//     mutationFn: async (strategyBriefId: string) => {
//       const response = await axios.delete<ApiResponse<null>>(
//         `${STRATEGY_Brief_URL}${strategyBriefId}`
//       );

//       return response.data;
//     },

//     meta: {
//       errorMessage: "Failed to delete strategy Brief",
//       successMessage: "Strategy Brief deleted successfully"
//     },

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["getStrategyBriefs"]
//       });
//     }
//   });
// };
