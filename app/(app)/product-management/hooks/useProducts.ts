"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosConfig } from "@/lib/axios";
import { env } from "@/lib/env";
import {
  ApiResponse,
  queryKeys,
  type ApiResponseError,
  type ApiResponsePagination,
  type PaginationFilter,
} from "@/types/api";
import {
  ProductCategoryDto,
  ProductCatIndForm,
  ProductDto,
  ProductForm,
  ProductIndustryDto,
} from "@/types/type-product";
import { Key } from "react";

const PRODUCT_URL = `${env.apiBaseUrl}/campaign`;
const axios = axiosConfig(env.apiBaseUrl);

export const useGetProducts = (filter: PaginationFilter) =>
  useQuery<ApiResponsePagination<ProductDto[]>, AxiosError<ApiResponseError>>({
    queryKey: queryKeys.product.list(filter),
    queryFn: async () => {
      const response = await axios.get<ApiResponsePagination<ProductDto[]>>(
        `${PRODUCT_URL}/product`,
        { params: filter },
      );
      return response.data;
    },
    meta: { errorMessage: "Failed to fetch products" },
  });

export const useGetProductsCategory = (search: string) =>
  useQuery<
    ApiResponsePagination<ProductCategoryDto[]>,
    AxiosError<ApiResponseError>
  >({
    queryKey: queryKeys.product.categoryList(search),
    queryFn: async () => {
      const response = await axios.get<
        ApiResponsePagination<ProductCategoryDto[]>
      >(`${PRODUCT_URL}/product-category`, { params: { search, limit: 1000 } });
      return response.data;
    },
    meta: { errorMessage: "Failed to fetch products category" },
  });

export const useGetProductsIndustry = (search: string) =>
  useQuery<
    ApiResponsePagination<ProductIndustryDto[]>,
    AxiosError<ApiResponseError>
  >({
    queryKey: queryKeys.product.industryList(search),
    queryFn: async () => {
      const response = await axios.get<
        ApiResponsePagination<ProductIndustryDto[]>
      >(`${PRODUCT_URL}/product-industry`, { params: { search, limit: 1000 } });
      return response.data;
    },
    meta: { errorMessage: "Failed to fetch products industry" },
  });

export const usePostProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: ProductForm) =>
      axios.post<ApiResponse<ProductDto>>(`${PRODUCT_URL}/product/`, form),
    meta: {
      errorMessage: "Failed to add product",
      successMessage: "Product added successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
    },
  });
};

export const usePostProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: ProductCatIndForm) =>
      axios.post<ApiResponse<ProductCategoryDto>>(
        `${PRODUCT_URL}/product-category/`,
        form,
      ),
    meta: {
      errorMessage: "Failed to add product category",
      successMessage: "Product category added successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProductsCategory"] });
    },
  });
};

export const usePostProductIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: ProductCatIndForm) =>
      axios.post<ApiResponse<ProductCategoryDto>>(
        `${PRODUCT_URL}/product-industry/`,
        form,
      ),
    meta: {
      errorMessage: "Failed to add product industry",
      successMessage: "Product industry added successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProductsIndustry"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      axios.delete<ApiResponse<ProductCategoryDto>>(
        `${PRODUCT_URL}/product/${id}`,
      ),
    meta: {
      errorMessage: "Failed to delete product",
      successMessage: "Product deleted successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
    },
  });
};

export const useDeleteBulkProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { product_ids: Key[] }) =>
      axios.post<ApiResponse<ProductCategoryDto>>(
        `${PRODUCT_URL}/product/bulk-delete`,
        payload,
      ),
    meta: {
      errorMessage: "Failed to bulk delete product",
      successMessage: "Products deleted successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProducts"] });
    },
  });
};
