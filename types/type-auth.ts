// types/type-auth.ts
// Auth domain DTOs — mirrors the backend auth response shapes.

/** Auth tokens returned from login/oauth callbacks */
export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

/** Login/OAuth callback response */
export type AuthResponseDto = {
  status: boolean;
  code: number;
  message: string;
  data: AuthTokens;
};

/** User profile from /auth/me */
export type UserProfileDto = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  profile_picture_url: string | null;
  role: string;
  tenant: string | null;
};

/** Me endpoint response */
export type MeResponseDto = {
  status: boolean;
  code: number;
  message: string;
  data: UserProfileDto;
};

/** Login form payload */
export type LoginFormDto = {
  email: string;
  password: string;
};

/** Google OAuth callback params */
export type GoogleCallbackParams = {
  code: string;
  scope?: string;
  authuser?: string;
  prompt?: string;
  iss?: string;
};

/** Yahoo OAuth callback params */
export type YahooCallbackParams = {
  code: string;
  state?: string;
};

/** Refresh token payload */
export type RefreshTokenDto = {
  refresh_token: string;
};
