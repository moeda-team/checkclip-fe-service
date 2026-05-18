// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

export type UserRole = "super_admin" | "admin" | "teacher" | "student";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      phoneNumber: string | null;
      profilePictureUrl: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken: string;
  }

  interface User extends DefaultUser {
    role: UserRole;
    accessToken: string;
    refreshToken: string;
    phoneNumber: string | null;
    profilePictureUrl: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    accessToken?: string;
    refreshToken?: string;
    phoneNumber?: string | null;
    profilePictureUrl?: string | null;
  }
}
