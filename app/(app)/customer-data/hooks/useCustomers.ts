// app/(app)/customer-data/hooks/use-customers.ts
// Customer domain hooks — query, infinite query, and mutation hooks.
//
// PATTERN:
// - Module-level axios instance with gateway URL + service path suffix
// - meta: { errorMessage, successMessage? } for centralized cache handling
// - Query keys follow convention: ["getCustomer", filter], ["getOneCustomer", id]
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
import type { CustomerDto, CustomerFormDto } from "@/types/type-customer";

// ─── Module-level axios instance ──────────────────────────────────────────────

const CUSTOMER_URL = `${env.apiBaseUrl}/crm/customer`;
const axios = axiosConfig(env.apiBaseUrl);
// ─── Query: GET list (paginated) ──────────────────────────────────────────────

export const useGetCustomers = (filter: PaginationFilter) =>
  useQuery<ApiResponsePagination<CustomerDto[]>, AxiosError<ApiResponseError>>({
    queryKey: queryKeys.customer.list(filter),
    queryFn: async () => {
      const response = await axios.get<ApiResponsePagination<CustomerDto[]>>(
        CUSTOMER_URL,
        { params: filter }
      );
      return response.data;
    },
    meta: { errorMessage: "Failed to fetch customers" },
  });

// ─── Query: GET infinite scroll ───────────────────────────────────────────────

export const useGetCustomersInfinite = (search: string) =>
  useInfiniteQuery<
    ApiResponsePagination<CustomerDto[]>,
    AxiosError<ApiResponseError>
  >({
    queryKey: queryKeys.customer.infinite(search),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axios.get<ApiResponsePagination<CustomerDto[]>>(
        CUSTOMER_URL,
        { params: { offset: pageParam, limit: 10, search } }
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + 1;
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return nextOffset < totalPages ? nextOffset : undefined;
    },
    initialPageParam: 0,
    meta: { errorMessage: "Failed to fetch customers" },
  });

// ─── Query: GET one by ID ─────────────────────────────────────────────────────

export const useGetCustomerDetail = (id: string) =>
  useQuery<ApiResponse<CustomerDto>, AxiosError<ApiResponseError>>({
    queryKey: queryKeys.customer.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const response = await axios.get<ApiResponse<CustomerDto>>(
        `${CUSTOMER_URL}/${id}`
      );
      return response.data;
    },
    meta: { errorMessage: "Failed to fetch customer detail" },
  });

// ─── Mutation: POST create ────────────────────────────────────────────────────

export const usePostCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: CustomerFormDto) =>
      // Trailing slash avoids the backend's 307 redirect (and the dropped
      // Authorization header / body that comes with it on cross-origin POSTs).
      axios.post<ApiResponse<CustomerDto>>(`${CUSTOMER_URL}/`, form),
    meta: {
      errorMessage: "Failed to create customer",
      successMessage: "Customer created successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCustomer"] });
    },
  });
};

// ─── Mutation: PUT update ─────────────────────────────────────────────────────

export const usePutCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      form,
    }: {
      id: string;
      form: Partial<CustomerFormDto>;
    }) => axios.put<ApiResponse<CustomerDto>>(`${CUSTOMER_URL}/${id}`, form),
    meta: {
      errorMessage: "Failed to update customer",
      successMessage: "Customer updated successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCustomer"] });
      queryClient.invalidateQueries({ queryKey: ["getOneCustomer"] });
    },
  });
};

// ─── Mutation: DELETE single ────────────────────────────────────────────────────

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      axios.delete<ApiResponse<CustomerDto>>(`${CUSTOMER_URL}/${id}`),
    meta: {
      errorMessage: "Failed to delete customer",
      successMessage: "Customer deleted successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCustomer"] });
    },
  });
};

// ─── Mutation: DELETE bulk ─────────────────────────────────────────────────────

export const useDeleteCustomersBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: DeleteBulkDto) =>
      axios.post<ApiResponse<CustomerDto>>(`${CUSTOMER_URL}/bulk-delete`, dto),
    meta: {
      errorMessage: "Failed to delete customers",
      successMessage: "Customers deleted successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCustomer"] });
    },
  });
};
