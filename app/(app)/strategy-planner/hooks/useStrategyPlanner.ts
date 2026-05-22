
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosConfig } from "@/lib/axios";
import { env } from "@/lib/env";
import type {
  StrategyPlannerDto,
  StrategyPlannerTableRow,
  StrategyPlannerFilter,
  CreateStrategyPlannerPayload,
  UpdateStrategyPlannerPayload
} from "@/app/(app)/strategy-planner/types";
import type {
  ApiResponse,
  ApiResponseError,
  ApiResponsePagination
} from "@/types/api";

const STRATEGY_PLANNER_URL = `${env.apiBaseUrl}/campaign/strategy-planner/`;
const axios = axiosConfig(env.apiBaseUrl);

/*
   POST - Create Strategy Planner
*/
export const usePostStrategyPlanner = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<StrategyPlannerDto>,
    AxiosError<ApiResponseError>,
    CreateStrategyPlannerPayload
  >({
    mutationFn: async (payload) => {
      const response = await axios.post<ApiResponse<StrategyPlannerDto>>(
        STRATEGY_PLANNER_URL,
        payload
      );
      return response.data;
    },

    meta: {
      errorMessage: "Failed to create strategy planner",
      successMessage: "Strategy planner created successfully"
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getStrategyPlanners"]
      });
    }
  });
};

/*
   GET - Find All Strategy Planners (Table/Pagination)
*/
export const useGetStrategyPlanners = (filter: StrategyPlannerFilter) =>
  useQuery<
    ApiResponsePagination<StrategyPlannerTableRow[]>,
    AxiosError<ApiResponseError>
  >({
    queryKey: ["getStrategyPlanners", filter],

    queryFn: async () => {
      const response = await axios.get<
        ApiResponsePagination<StrategyPlannerTableRow[]>
      >(`${STRATEGY_PLANNER_URL}`, { params: filter });

      return response.data;
    },

    meta: {
      errorMessage: "Failed to fetch strategy planners"
    }
  });

/*
   GET - Find One Strategy Planner by ID
*/
export const useGetStrategyPlanner = (strategyPlannerId: string) =>
  useQuery<
    ApiResponse<StrategyPlannerDto>,
    AxiosError<ApiResponseError>
  >({
    queryKey: ["getStrategyPlanner", strategyPlannerId],

    queryFn: async () => {
      const response = await axios.get<ApiResponse<StrategyPlannerDto>>(
        `${STRATEGY_PLANNER_URL}${strategyPlannerId}`
      );

      return response.data;
    },

    meta: {
      errorMessage: "Failed to fetch strategy planner"
    },

    enabled: !!strategyPlannerId,
    refetchOnMount: "always"
  });

/*
   PUT - Update Strategy Planner
*/
export const usePutStrategyPlanner = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<StrategyPlannerDto>,
    AxiosError<ApiResponseError>,
    { strategyPlannerId: string; payload: UpdateStrategyPlannerPayload }
  >({
    mutationFn: async ({ strategyPlannerId, payload }) => {
      const response = await axios.put<ApiResponse<StrategyPlannerDto>>(
        `${STRATEGY_PLANNER_URL}${strategyPlannerId}`,
        payload
      );

      return response.data;
    },

    meta: {
      errorMessage: "Failed to update strategy planner",
      successMessage: "Strategy planner updated successfully"
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getStrategyPlanners"]
      });
      queryClient.invalidateQueries({
        queryKey: ["getStrategyPlanner", variables.strategyPlannerId]
      });
    }
  });
};

/*
   DELETE - Delete Strategy Planner
*/
export const useDeleteStrategyPlanner = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    AxiosError<ApiResponseError>,
    string
  >({
    mutationFn: async (strategyPlannerId: string) => {
      const response = await axios.delete<ApiResponse<null>>(
        `${STRATEGY_PLANNER_URL}${strategyPlannerId}`
      );

      return response.data;
    },

    meta: {
      errorMessage: "Failed to delete strategy planner",
      successMessage: "Strategy planner deleted successfully"
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getStrategyPlanners"]
      });
    }
  });
};
