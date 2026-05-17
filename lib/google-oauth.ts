// lib/google-oauth.ts
// FE construct Google OAuth URL dengan redirect_uri ke FE itu sendiri.
// Setelah dapat code, FE yang hit BE /auth/google/callback untuk exchange token.

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// redirect_uri harus didaftarkan di Google Cloud Console
// tambahkan: http://localhost:3000/auth/google/callback
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "http://localhost:3000/auth/google/callback";

export function getGoogleOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/adwords",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}
