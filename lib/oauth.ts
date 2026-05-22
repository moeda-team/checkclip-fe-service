// lib/oauth.ts
// OAuth URL builders for Google and Yahoo login.
// WHY: Centralizes all OAuth URL construction. Each provider has its own
// config, scope, and redirect URI. Components just call getGoogleOAuthUrl()
// or getYahooOAuthUrl() and redirect — no scattered URL building.

import { env } from "@/lib/env";

// ─── Google OAuth ─────────────────────────────────────────────────────────────

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export function getGoogleOAuthUrl(forceSelectAccount = false): string {
  if (!env.googleClientId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
  }

  const params = new URLSearchParams({
    client_id: env.googleClientId,
    redirect_uri: env.googleRedirectUri,
    response_type: "code",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/adwords",
    ].join(" "),
    access_type: "online",
    prompt: forceSelectAccount ? "select_account consent" : "consent",
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export function getGoogleAccountChooserUrl(): string {
  // Opens Google's account chooser first, then returns to our login
  const returnUrl = encodeURIComponent(getGoogleOAuthUrl(true));
  return `https://accounts.google.com/AccountChooser?continue=${returnUrl}`;
}

// ─── Yahoo OAuth ──────────────────────────────────────────────────────────────

const YAHOO_AUTH_URL = "https://api.login.yahoo.com/oauth2/request_auth";

export function getYahooOAuthUrl(): string {
  if (!env.yahooClientId) {
    throw new Error("NEXT_PUBLIC_YAHOO_CLIENT_ID is not set");
  }

  const params = new URLSearchParams({
    client_id: env.yahooClientId,
    redirect_uri: env.yahooRedirectUri,
    response_type: "code",
    scope: "openid email profile",
  });

  return `${YAHOO_AUTH_URL}?${params.toString()}`;
}
