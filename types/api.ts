// types/api.ts
// Shared API types used across the entire application.
// WHY: Strongly typed API responses prevent runtime errors and make
// the contract between frontend and backend explicit and auditable.

/** Standard API envelope */
export interface ApiResponse<T, U = undefined> {
  statusCode: string;
  additional?: U;
  data: T;
}

/** Error response from the backend */
export interface ApiResponseError {
  statusCode: string;
  message: string | string[];
}

/** Paginated list response */
export interface ApiResponsePagination<T, U = undefined> {
  statusCode: string;
  additional?: U;
  data: T;
  paginate: PaginationDto;
}

/** Pagination metadata returned by the backend */
export interface PaginationDto {
  total: number;
  next: number | null;
  prev: number | null;
  current_page: number;
  per_page: number;
  total_pages: number;
}

/** Standard filter params for paginated list endpoints */
export interface PaginationFilter {
  perPage: number;
  page: number;
  search?: string;
  sortOrder?: "desc" | "asc";
  sortBy?: string;
  isArchived?: string;
}

/** Bulk delete payload */
export interface DeleteBulkDto {
  ids: string[];
}

/** Query key factory.
 * WHY: String-based query keys cause duplicate requests and make
 * invalidation fragile. A factory ensures consistent, unique keys.
 * Convention: ["get{Entity}", filter], ["getOne{Entity}", id], ["get{Entity}Infinite", search]
 */
export const queryKeys = {
  user: {
    all: () => ["getUser"] as const,
    me: () => ["getUserMe"] as const,
  },
  campaign: {
    all: () => ["getCampaign"] as const,
    list: (filter: PaginationFilter) => ["getCampaign", filter] as const,
    infinite: (search: string) => ["getCampaignInfinite", search] as const,
    detail: (id: string) => ["getOneCampaign", id] as const,
  },
} as const;

/** Meta type for query/mutation error/success messages.
 * Used by AppQueryProvider's centralized cache handlers. */
export type ErrorMeta = { errorMessage?: string };
export type SuccessMeta = { successMessage?: string };
export type QueryMeta = ErrorMeta;
export type MutationMeta = ErrorMeta & SuccessMeta;
