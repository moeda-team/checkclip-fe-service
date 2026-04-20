// lib/auth.ts
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AdapterUser } from "next-auth/adapters";
import type { UserRole } from "@/types/next-auth";

type LoginResponseUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AppUser = LoginResponseUser & {
  accessToken: string;
};

function isAppUser(
  user: User | AdapterUser
): user is User & { role: UserRole; accessToken?: string } {
  return "role" in user;
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

        // ✅ STATIC LOGIN
        if (
          credentials.email === "tanaka@sakura-tech.co.jp" &&
          credentials.password === "sakura2026"
        ) {
          return {
            id: "1",
            name: "Tanaka",
            email: "tanaka@sakura-tech.co.jp",
            role: "admin", // sesuaikan dengan UserRole kamu
            accessToken: "static-token-123",
          };
        }

        return null;

        // ❌ API CALL (DISABLED)
        /*
        const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME || '';
        const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD || '';

        const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;

        try {
          const res = await fetch(`${API_BASE_URL}/users/sign/in`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": basicAuth,
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data: LoginResponse = await res.json();

          return {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
            accessToken: data.accessToken,
          };
        } catch {
          return null;
        }
        */
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
        token.name = user.name;
        token.email = user.email;
        token.role = user.role ?? "student";
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name;
        session.user.email =
          (token.email as string | undefined) ?? session.user.email;
        session.user.role = token.role ?? "student";
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
};