// middleware.ts
// Next.js middleware for route protection at the edge.
//
// WHY MIDDLEWARE OVER COMPONENT-LEVEL CHECKS:
// - Runs BEFORE the page renders — no flash of protected content
// - Works at the edge, before any client JS executes
// - Centralized route config — easy to audit and modify
//
// HOW IT WORKS WITHOUT NEXTAUTH:
// - AuthContext writes `access_token` cookie on login/register (via lib/cookies.ts)
// - Middleware reads that cookie — the only mechanism available in Edge Runtime
// - localStorage is NOT accessible here (client-side only)
//
// COOKIE vs LOCALSTORAGE:
// - localStorage  → source of truth for API calls (apiFetch reads from here)
// - Cookie        → signal for middleware route protection only
// - Both are kept in sync by persistTokens() and clearTokens() in lib/cookies.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/attendance",
  "/shift",
  "/leave",
  "/overtime",
  "/correction",
  "/approval",
  "/reports",
  "/settings",
  "/users",
];

// Routes that should redirect to /dashboard if already authenticated
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;
  const isAuthenticated = !!token && token !== "undefined" && token !== "null";

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // ── Unauthenticated user trying to access a protected route ──────────────
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Authenticated user trying to access auth pages ───────────────────────
  // Allow access to reset-password even when authenticated (edge case: user
  // opens a reset link while still logged in on another tab)
  if (isAuthRoute && isAuthenticated && !pathname.startsWith("/reset-password")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.svg|favicon\\.ico|icons\\.svg|logo\\.png).*)"],
};
