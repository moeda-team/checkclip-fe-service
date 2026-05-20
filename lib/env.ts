// lib/env.ts
// Centralized environment variable access with runtime validation.
// WHY: Scattered process.env calls are error-prone and impossible to audit.
// This module provides a single source of truth with runtime validation
// so the app fails fast on missing required variables.

// Client env vars MUST be present at build time (inlined into bundle)
const clientRequired = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
} as const;

// Server env vars are injected at container runtime; validate lazily
const serverRequired = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
} as const;

const optional = {
  NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_YAHOO_CLIENT_ID: process.env.NEXT_PUBLIC_YAHOO_CLIENT_ID,
  AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
  AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET,
  AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,
} as const;

// Validate client env vars at module load time (server-side only)
function validateClientRequired() {
  if (typeof window !== "undefined") return;

  const missing = Object.entries(clientRequired)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

validateClientRequired();

// Lazy validator for server-only env vars
function getServerVar<K extends keyof typeof serverRequired>(key: K): string {
  const value = serverRequired[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  // API
  apiBaseUrl: clientRequired.NEXT_PUBLIC_API_BASE_URL,
  apiGatewayUrl:
    optional.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://localhost:3000",

  // NextAuth
  get nextAuthSecret() {
    return getServerVar("NEXTAUTH_SECRET");
  },
  get nextAuthUrl() {
    return serverRequired.NEXTAUTH_URL ?? "http://localhost:3000";
  },

  // Google OAuth
  googleClientId: optional.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
  googleRedirectUri: `${clientRequired.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"}/auth/google/callback`,

  // Yahoo OAuth
  yahooClientId: optional.NEXT_PUBLIC_YAHOO_CLIENT_ID ?? "",
  yahooRedirectUri: `${clientRequired.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"}/auth/yahoo/callback`,

  // Azure AD
  azureAdClientId: optional.AZURE_AD_CLIENT_ID ?? "",
  azureAdClientSecret: optional.AZURE_AD_CLIENT_SECRET ?? "",
  azureAdTenantId: optional.AZURE_AD_TENANT_ID ?? "",
} as const;
