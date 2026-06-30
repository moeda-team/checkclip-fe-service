// lib/env.ts
// Centralized environment variable access with runtime validation.
// WHY: Scattered process.env calls are error-prone and impossible to audit.
// This module provides a single source of truth with runtime validation
// so the app fails fast on missing required variables.

// Client env vars MUST be present at build time (inlined into bundle)
const clientRequired = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
} as const;

const googleRequired = {
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URL: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
}
// Server env vars are injected at container runtime; validate lazily
const serverRequired = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
} as const;

const optional = {
  NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
} as const;

// Lazy validator for server-only env vars
function getServerVar<K extends keyof typeof serverRequired>(key: K): string {
  const value = serverRequired[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  apiBaseUrl: clientRequired.NEXT_PUBLIC_API_BASE_URL,
  googleClientId: googleRequired.GOOGLE_CLIENT_ID,
  googleRedirectUri: googleRequired.GOOGLE_REDIRECT_URL,
  get nextAuthSecret() {
    return getServerVar("NEXTAUTH_SECRET");
  },
  get nextAuthUrl() {
    return serverRequired.NEXTAUTH_URL ?? "http://localhost:3000";
  },
} as const;
