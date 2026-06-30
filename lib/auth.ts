// lib/auth.ts
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import type { UserRole } from "@/types/next-auth";
import { env } from "./env";

// Access token lifetime: 1 hour (in ms), with 60s buffer to refresh early
const ACCESS_TOKEN_TTL_MS = 60 * 60 * 1000;
const REFRESH_BUFFER_MS = 60 * 1000;

type LoginApiResponse = {
  message: string;
  status_code: number;
  data: {
    access_token: string;
    refresh_token: string;
  } | null;
};

type MeApiResponse = {
  message: string;
  status_code: number;
  data: {
    id: string;
    full_name: string;
    email: string;
    phone_number: string | null;
    profile_picture_url: string | null;
    role: string;
    job_title: string;
    department_unit: string;
    address: string | null;
  } | null;
};

type AppUser = User & {
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
};

function isAppUser(user: User | AdapterUser): user is AppUser {
  return "role" in user && "accessToken" in user;
}

// ─── Refresh access token ─────────────────────────────────────────────────────

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);

    const json: LoginApiResponse = await res.json();
    if (!res.ok || !json.data?.access_token) throw new Error("Invalid refresh response");

    return {
      ...token,
      accessToken: json.data.access_token,
      refreshToken: json.data.refresh_token ?? token.refreshToken,
      accessTokenExpiry: Date.now() + ACCESS_TOKEN_TTL_MS,
      error: undefined,
    };
  } catch {
    // Refresh token is expired or invalid — force re-login
    return { ...token, error: "RefreshTokenExpired" };
  }
}

// ─── Auth options ─────────────────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AppUser | null> {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        try {
          // console.log("[AUTH] apiBaseUrl:", env.apiBaseUrl);
          // console.log("[AUTH] Attempting login fetch to:", `${env.apiBaseUrl}/auth/login`);

          const loginRes = await fetch(`${env.apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          // console.log("[AUTH] login response status:", loginRes.status, loginRes.statusText);

          const loginJson: LoginApiResponse = await loginRes.json();

          if (!loginRes.ok || loginJson.status_code !== 200 || !loginJson.data) {
            throw new Error(loginJson.message ?? "Login failed");
          }

          const { access_token, refresh_token } = loginJson.data;

          const meRes = await fetch(`${env.apiBaseUrl}/user/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          });

          // console.log("[AUTH] /auth/me response status:", meRes.status, meRes.statusText);

          if (!meRes.ok) throw new Error("Failed to fetch user profile");

          const meJson: MeApiResponse = await meRes.json();
          if (!meRes.ok || !meJson.data) throw new Error("Invalid user data");

          const user = meJson.data;

          return {
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.role as UserRole,
            accessToken: access_token,
            refreshToken: refresh_token,
            phoneNumber: user.phone_number,
            profilePictureUrl: user.profile_picture_url,
          };
        } catch (error) {
          // console.error("[AUTH] authorize error:", error);
          throw error;
        }
      },
    }),

  ],

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
    // Session max age = refresh token lifetime (1 day)
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in: populate token from user object
      if (user && isAppUser(user)) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiry: Date.now() + ACCESS_TOKEN_TTL_MS,
          phoneNumber: user.phoneNumber,
          profilePictureUrl: user.profilePictureUrl,
        };
      }

      // Subsequent calls: check if access token is still valid
      const expiry = token.accessTokenExpiry ?? 0;
      const isExpired = Date.now() > expiry - REFRESH_BUFFER_MS;

      if (!isExpired) return token;

      // Access token expired — try to refresh
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = (token.role as UserRole) ?? "student";
        session.user.phoneNumber = token.phoneNumber as string | null;
        session.user.profilePictureUrl = token.profilePictureUrl as string | null;
      }
      session.accessToken = token.accessToken as string;
      session.error = token.error;
      return session;
    },
  },
};
