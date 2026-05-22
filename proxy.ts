// proxy.ts
// Next.js proxy (formerly middleware) for route protection at the edge.
//
// WHY PROXY OVER COMPONENT-LEVEL CHECKS:
// - Runs BEFORE the page renders — no flash of protected content
// - Works at the edge (CDN level) for performance
// - Centralized route config — easy to audit and modify
// - Redirects happen before any client JS executes
//
// HOW IT WORKS WITH NEXTAUTH v4:
// - getToken() reads the JWT from the cookie without needing the full session
// - This is the recommended approach per NextAuth docs for proxy/middleware

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/campaign", "/settings"];

// Routes that should redirect away if already authenticated
const authRoutes = ["/auth/login", "/auth/forgot-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get JWT token (lightweight — doesn't call the database)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // ── Unauthenticated user trying to access protected route ───────────────
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Authenticated user trying to access auth pages (login, etc.) ────────
  // Skip redirect if token has expired — they need to re-authenticate
  if (isAuthRoute && isAuthenticated && token?.error !== "RefreshTokenExpired") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── Check for expired refresh token in JWT ──────────────────────────────
  // If the JWT has an error flag, force re-authentication
  if (isProtectedRoute && token?.error === "RefreshTokenExpired") {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("error", "session_expired");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except static files, api, and _next
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
