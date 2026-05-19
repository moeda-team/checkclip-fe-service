// lib/query-provider.tsx
// AppQueryProvider with centralized error/success handling via QueryCache and MutationCache.
//
// WHY QueryCache/MutationCache OVER per-hook onError/onSuccess:
// - Every query/mutation automatically gets error toast — no forgotten handlers
// - meta: { errorMessage, successMessage } pattern = declarative, not imperative
// - One place to add analytics, logging, or error tracking (Sentry, etc.)
// - Hooks stay thin — they declare intent via meta, provider handles the rest
//
// ERROR PARSING STRATEGY:
// 1. Try AxiosError<ApiResponseError>.response.data.message (backend message)
// 2. If message is string[], join with ", " (backend sometimes returns array)
// 3. Fall back to query.meta.errorMessage or mutation.meta.errorMessage
// 4. Fall back to axiosError.message
// 5. Fall back to "Something went wrong"

"use client";

import { useMemo, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { useNotification } from "@/hooks/useNotification";
import type { ApiResponseError, ErrorMeta, MutationMeta } from "@/types/api";

export const AppQueryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { showNotification } = useNotification();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            const axiosError = error as AxiosError<ApiResponseError>;
            const apiMessage = axiosError.response?.data?.message;
            const parsedMessage = Array.isArray(apiMessage)
              ? apiMessage.join(", ")
              : apiMessage;
            const message =
              parsedMessage ??
              (query.meta as ErrorMeta)?.errorMessage ??
              axiosError.message ??
              "Something went wrong";
            showNotification("error", "Error", message);
          },
        }),
        mutationCache: new MutationCache({
          onSuccess: (_data, _vars, _ctx, mutation) => {
            const msg = (mutation.options.meta as MutationMeta)
              ?.successMessage;
            if (msg) showNotification("success", "Success", msg);
          },
          onError: (error, _variables, _context, mutation) => {
            const axiosError = error as AxiosError<ApiResponseError>;
            const apiMessage = axiosError.response?.data?.message;
            const parsedMessage = Array.isArray(apiMessage)
              ? apiMessage.join(", ")
              : apiMessage;
            const message =
              parsedMessage ??
              (mutation.options.meta as ErrorMeta)?.errorMessage ??
              axiosError.message ??
              "Something went wrong";
            showNotification("error", "Error", message);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 2,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 0, // mutations should NOT auto-retry
          },
        },
      }),
    [showNotification]
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};
