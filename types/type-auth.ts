// types/type-auth.ts
// Auth domain DTOs — mirrors backend response shapes from checklip.
//
// Backend ApiResponse shape (util/response.rs):
// { message: string, status_code: number, data: T | null }

import type { UserRole } from "@/types/next-auth";

// ─── Token responses ──────────────────────────────────────────────────────────

/** Raw tokens returned from POST /auth/login or POST /auth/refresh-token */
export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

/** Wrapped login/refresh-token response */
export type AuthResponseDto = {
  message: string;
  status_code: number;
  data: AuthTokens | null;
};

// ─── User profile ─────────────────────────────────────────────────────────────

/**
 * GET /user/profile response data.
 * Mirrors ProfileResponse from backend (module/user/dto/profile_response.rs).
 */
export type UserProfileDto = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  job_title: string;
  department_unit: string;
  phone_number: string | null;
  address: string | null;
  profile_picture_url: string | null;
};

/** Wrapped /user/profile response */
export type ProfileResponseDto = {
  message: string;
  status_code: number;
  data: UserProfileDto | null;
};

// ─── Form payloads ────────────────────────────────────────────────────────────

/** Login form payload — POST /auth/login */
export type LoginFormDto = {
  email: string;
  password: string;
};

/** Refresh token payload — POST /auth/refresh-token */
export type RefreshTokenDto = {
  refresh_token: string;
};
