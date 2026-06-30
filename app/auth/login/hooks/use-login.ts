"use client";

// app/auth/login/hooks/use-login.ts
// Encapsulates the credential login flow via NextAuth signIn.
// WHY: Keeps the login page thin — all side-effects (error mapping,
// redirect, loading state) live here, not scattered in the component.

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export type LoginError = string | null;

export type UseLoginReturn = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isSubmitting: boolean;
  errorMsg: LoginError;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export function useLogin(callbackUrl: string): UseLoginReturn {
  const router = useRouter();

  const [email, setEmail] = useState<string>(() => {
    // Restore remembered email on mount (client-only)
    if (typeof window !== "undefined") {
      return localStorage.getItem("remember_email") ?? "";
    }
    return "";
  });

  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<LoginError>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      // NextAuth surfaces the thrown Error message via result.error.
      // "CredentialsSignin" is the generic fallback — show a friendlier msg.
      const raw = result?.error ?? "";

      // Filter out internal success/technical messages that shouldn't show as errors
      const isGeneric =
        raw === "CredentialsSignin" ||
        raw === "" ||
        raw.toLowerCase().includes("success") ||
        raw.toLowerCase().includes("fetch") ||
        raw.toLowerCase().includes("profile");

      setErrorMsg(isGeneric ? "Email atau password salah." : raw);
      return;
    }

    router.push("/dashboard");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    errorMsg,
    handleSubmit,
  };
}
