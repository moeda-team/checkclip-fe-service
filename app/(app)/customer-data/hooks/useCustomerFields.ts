// app/(app)/customer-data/hooks/use-customer-fields.ts
// Customer Field (custom column) domain hooks — query and mutation hooks.
//
// PATTERN:
// - Module-level axios instance with gateway URL + service path suffix
// - meta: { errorMessage, successMessage? } for centralized cache handling
// - Query keys follow convention: ["getCustomerField", filter], ["getOneCustomerField", id]
// - After mutations, invalidate relevant query keys

"use client";

import {
  useQuery,
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
} from "@/types/api";
import type { CustomerFieldDto, CustomerFieldFormDto } from "@/types/type-customer";

// ─── Module-level axios instance ──────────────────────────────────────────────
const CUSTOMER_FIELD_URL = `${env.apiBaseUrl}/crm/customer-field/`;
const axios = axiosConfig(env.apiBaseUrl);
// ─── Query: GET list ──────────────────────────────────────────────────────────

export const useGetCustomerFields = () =>
  useQuery<ApiResponsePagination<CustomerFieldDto[]>, AxiosError<ApiResponseError>>({
    queryKey: queryKeys.customerField.all(),
    queryFn: async () => {
      const response = await axios.get<ApiResponsePagination<CustomerFieldDto[]>>(
        CUSTOMER_FIELD_URL
      );
      return response.data;
    },
    meta: { errorMessage: "Failed to fetch customer fields" },
  });

// ─── Query: GET one by ID ─────────────────────────────────────────────────────

export const useGetCustomerFieldDetail = (id: string) =>
  useQuery<ApiResponse<CustomerFieldDto>, AxiosError<ApiResponseError>>({
    queryKey: queryKeys.customerField.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const response = await axios.get<ApiResponse<CustomerFieldDto>>(
        `${CUSTOMER_FIELD_URL}/${id}`
      );
      return response.data;
    },
    meta: { errorMessage: "Failed to fetch customer field detail" },
  });

// ─── Mutation: POST create ────────────────────────────────────────────────────

export const usePostCustomerField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: CustomerFieldFormDto) =>
      axios.post<ApiResponse<CustomerFieldDto>>(CUSTOMER_FIELD_URL, form),
    meta: {
      errorMessage: "Failed to create customer field",
      successMessage: "Customer field created successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCustomerField"] });
    },
  });
};

// ─── Mutation: PUT update ─────────────────────────────────────────────────────

export const usePutCustomerField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      form,
    }: {
      id: string;
      form: Partial<CustomerFieldFormDto>;
    }) => axios.put<ApiResponse<CustomerFieldDto>>(`${CUSTOMER_FIELD_URL}/${id}`, form),
    meta: {
      errorMessage: "Failed to update customer field",
      successMessage: "Customer field updated successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCustomerField"] });
      queryClient.invalidateQueries({ queryKey: ["getOneCustomerField"] });
    },
  });
};

// ─── Mutation: DELETE ─────────────────────────────────────────────────────────

export const useDeleteCustomerField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      axios.delete<ApiResponse<CustomerFieldDto>>(`${CUSTOMER_FIELD_URL}/${id}`),
    meta: {
      errorMessage: "Failed to delete customer field",
      successMessage: "Customer field deleted successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCustomerField"] });
    },
  });
};
