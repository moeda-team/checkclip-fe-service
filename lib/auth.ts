// lib/auth.ts
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AdapterUser } from "next-auth/adapters";
import type { UserRole } from "@/types/next-auth";
import { API_BASE_URL } from "./api";

type LoginApiResponse = {
  status: boolean;
  code: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
};

type MeApiResponse = {
  status: boolean;
  code: number;
  message: string;
  data: {
    id: string;
    full_name: string;
    email: string;
    phone_number: string | null;
    profile_picture_url: string | null;
    role: string;
    tenant: string | null;
  };
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
          return null;
        }

        try {
          const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!loginRes.ok) return null;

          const loginJson: LoginApiResponse = await loginRes.json();
          if (!loginJson.status || !loginJson.data?.access_token) return null;

          const { access_token, refresh_token } = loginJson.data;

          const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: access_token,
            },
          });

          if (!meRes.ok) return null;

          const meJson: MeApiResponse = await meRes.json();
          if (!meJson.status || !meJson.data) return null;

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
        } catch {
          return null;
        }
      },
    }),

    CredentialsProvider({
      id: "google-oauth",
      name: "Google",
      credentials: {
        code:     { label: "Code",     type: "text" },
        scope:    { label: "Scope",    type: "text" },
        authuser: { label: "AuthUser", type: "text" },
        prompt:   { label: "Prompt",   type: "text" },
        iss:      { label: "Iss",      type: "text" },
      },
      async authorize(credentials): Promise<AppUser | null> {
        if (!credentials?.code) return null;

        try {
          const params = new URLSearchParams({
            code:     credentials.code,
            scope:    credentials.scope    ?? "",
            authuser: credentials.authuser ?? "",
            prompt:   credentials.prompt   ?? "",
            iss:      credentials.iss      ?? "",
          });

          const callbackRes = await fetch(
            `${API_BASE_URL}/auth/google/callback?${params.toString()}`,
            { method: "GET" }
          );

          if (!callbackRes.ok) return null;

          const callbackJson: LoginApiResponse = await callbackRes.json();
          if (!callbackJson.status || !callbackJson.data?.access_token) return null;

          const { access_token, refresh_token } = callbackJson.data;

          // Ambil user profile
          const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: { Authorization: access_token },
          });

          if (!meRes.ok) return null;

          const meJson: MeApiResponse = await meRes.json();
          if (!meJson.status || !meJson.data) return null;

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
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && isAppUser(user)) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.phoneNumber = user.phoneNumber;
        token.profilePictureUrl = user.profilePictureUrl;
      }
      return token;
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
      return session;
    },
  },
};
