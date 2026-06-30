"use client";

// app/auth/register/hooks/use-register.ts
// Handles POST /auth/register form submission.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { env } from "@/lib/env";
import type { AuthResponseDto } from "@/types/type-auth";

export type RegisterFormDto = {
  full_name: string;
  email: string;
  password: string;
  job_title: string;
  department_unit: string;
  role: string;
  phone_number?: string;
  address?: string;
};

export type UseRegisterReturn = {
  isSubmitting: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  submit: (payload: RegisterFormDto) => Promise<void>;
};

const REDIRECT_DELAY_MS = 2500;

export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const submit = async (payload: RegisterFormDto) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${env.apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: AuthResponseDto = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message ?? "Registrasi gagal. Silakan coba lagi.");
        return;
      }

      // Show success banner, then redirect to login after a short delay
      setSuccessMsg("Account registered successfully! Switching to Login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, REDIRECT_DELAY_MS);
    } catch {
      setErrorMsg("Network error. Periksa koneksi internet kamu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, errorMsg, successMsg, submit };
}
