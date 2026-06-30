// types/api.ts
// Shared API types used across the entire application.
// Mirrors response shapes from backend: src/util/response.rs
//
// Backend structs:
//   ApiResponse<T>          → { message, status_code, data: T | null }
//   ApiResponseError<T>     → { message, status_code, error: T | null }
//   ApiResponsePaginate<T>  → { message, status_code, data: T | null, total, limit, offset }

// ─── Success response ─────────────────────────────────────────────────────────

/** Standard success envelope — maps to ApiResponse<T> in response.rs */
export interface ApiResponse<T> {
  message: string;
  status_code: number;
  data: T | null;
}

// ─── Error response ───────────────────────────────────────────────────────────

/** Error envelope — maps to ApiResponseError<T> in response.rs */
export interface ApiResponseError<T = unknown> {
  message: string;
  status_code: number;
  error: T | null;
}

// ─── Paginated response ───────────────────────────────────────────────────────

/** Paginated success envelope — maps to ApiResponsePaginate<T> in response.rs */
export interface ApiResponsePagination<T> {
  message: string;
  status_code: number;
  data: T | null;
  total: number;
  limit: number;
  offset: number;
}

// ─── Pagination helpers ───────────────────────────────────────────────────────

/** Pagination metadata for UI components */
export interface PaginationDto {
  total: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}

/** Standard filter params for paginated list endpoints */
export interface PaginationFilter {
  limit?: number;
  offset?: number;
  search?: string;
  sortOrder?: "desc" | "asc";
  sortBy?: string;
}

// ─── Common payloads ──────────────────────────────────────────────────────────

/** Bulk delete payload */
export interface DeleteBulkDto {
  ids: string[];
}

// ─── Query key factory ────────────────────────────────────────────────────────

export const queryKeys = {
  user: {
    all: () => ["getUser"] as const,
    me: () => ["getUserMe"] as const,
  },
} as const;

// ─── TanStack Query meta types ────────────────────────────────────────────────

export type ErrorMeta = { errorMessage?: string };
export type SuccessMeta = { successMessage?: string };
export type QueryMeta = ErrorMeta;
export type MutationMeta = ErrorMeta & SuccessMeta;
