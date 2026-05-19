// hooks/use-login.ts
// Login mutation hooks — handles email/password, Google, and Yahoo sign-in.
//
// PATTERN: meta.errorMessage for centralized error handling.
// The AppQueryProvider's MutationCache.onError reads meta.errorMessage as fallback.
// We do NOT set successMessage here because login redirects — toast would flash
// and disappear during navigation.

"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export type LoginVariables = {
  email: string;
  password: string;
};

// ─── Email & Password Login ───────────────────────────────────────────────────

export const useLogin = () =>
  useMutation({
    mutationFn: async ({ email, password }: LoginVariables) => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      window.location.href = "/dashboard";
    },
    meta: { errorMessage: "Login failed. Please check your credentials." },
  });

// ─── Google OAuth Login ────────────────────────────────────────────────────────

export const useGoogleLogin = () =>
  useMutation({
    mutationFn: async (code: string) => {
      const result = await signIn("google-oauth", {
        code,
        redirect: false,
      });
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      window.location.href = "/dashboard";
    },
    meta: { errorMessage: "Google login failed" },
  });

// ─── Yahoo OAuth Login ─────────────────────────────────────────────────────────

export const useYahooLogin = () =>
  useMutation({
    mutationFn: async (code: string) => {
      const result = await signIn("yahoo-oauth", {
        code,
        redirect: false,
      });
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      window.location.href = "/dashboard";
    },
    meta: { errorMessage: "Yahoo login failed" },
  });
