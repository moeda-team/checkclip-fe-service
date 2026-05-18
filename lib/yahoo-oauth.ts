// lib/yahoo-oauth.ts
// FE construct Yahoo OAuth URL dengan redirect_uri ke FE itu sendiri.
// Setelah dapat code, FE yang hit BE /auth/yahoo/callback untuk exchange token.

const YAHOO_AUTH_URL = "https://api.login.yahoo.com/oauth2/request_auth";

const REDIRECT_URI =
  process.env.NEXT_PUBLIC_YAHOO_REDIRECT_URI ??
  "http://localhost:3000/auth/yahoo/callback";

export function getYahooOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_YAHOO_CLIENT_ID;

  if (!clientId) {
    throw new Error("NEXT_PUBLIC_YAHOO_CLIENT_ID is not set");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
  });

  return `${YAHOO_AUTH_URL}?${params.toString()}`;
}
