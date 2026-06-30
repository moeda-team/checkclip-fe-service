"use client";

// app/auth/forgot-password/hooks/use-forgot-password.ts
// Handles POST /auth/forgot-password.
// On success, surfaces a success message — the actual reset link is sent via email.

import { useState } from "react";
import { env } from "@/lib/env";

type ApiResult = {
  message: string;
  status_code: number;
};

export type UseForgotPasswordReturn = {
  email: string;
  setEmail: (v: string) => void;
  isSubmitting: boolean;
  errorMsg: string | null;
  isSuccess: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  reset: () => void;
};

export function useForgotPassword(): UseForgotPasswordReturn {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${env.apiBaseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: ApiResult = await res.json();

      if (!res.ok || data.status_code !== 200) {
        setErrorMsg(
          data.message === "email not registered"
            ? "Email tidak terdaftar. Periksa kembali alamat email kamu."
            : (data.message ?? "Gagal mengirim email. Silakan coba lagi.")
        );
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMsg("Network error. Periksa koneksi internet kamu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setEmail("");
    setErrorMsg(null);
  };

  return { email, setEmail, isSubmitting, errorMsg, isSuccess, handleSubmit, reset };
}
