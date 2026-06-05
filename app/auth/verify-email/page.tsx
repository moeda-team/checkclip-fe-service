"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Mail, Shield, Database, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerifyState = "loading" | "success" | "error" | "no-token";

function VerifyEmailPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<VerifyState>(token ? "loading" : "no-token");
  const [errorMsg, setErrorMsg] = useState<string>("Verification link is invalid or has expired.");

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}`,
          { method: "GET" }
        );

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data?.message ?? "Verification failed. The link may have expired.");
          setState("error");
          return;
        }

        setState("success");
      } catch {
        setErrorMsg("A network error occurred. Please try again.");
        setState("error");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#2A0A52] overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">

        {/* ── LEFT SIDE ── */}
        <div className="relative hidden lg:flex items-center justify-center px-16">
          <div className="absolute inset-0">
            <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-purple-500/40 blur-3xl rounded-full" />
            <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-fuchsia-500/30 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10 max-w-md text-white">
            <h1 className="text-4xl font-semibold leading-tight">
              Almost there —<br />verify your email
            </h1>

            <p className="mt-6 text-white/80 text-lg font-medium leading-8">
              One last step to secure your account and unlock the full power of
              AIMOS. Your workspace is ready and waiting.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Account</h3>
                  <p className="text-white/70 text-sm mt-1">
                    Email verification ensures only you can access your account
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dedicated Workspace</h3>
                  <p className="text-white/70 text-sm mt-1">
                    Enterprise-grade single-tenant architecture awaits
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI-Powered Insights</h3>
                  <p className="text-white/70 text-sm mt-1">
                    CRM intelligence and campaign optimization, ready to go
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDE ── */}
        <div className="relative flex items-center justify-center p-6 lg:p-12">
          {/* Background card */}
          <div className="absolute inset-6 rounded-[40px] bg-linear-to-b from-[#4C1D95] to-[#6D28D9] shadow-2xl border border-white/10 opacity-15" />
          {/* Glow */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400/20 blur-3xl rounded-full" />

          <div className="relative z-5 w-full max-w-md py-4">
            {/* Header */}
            <div className="mb-8 text-white">
              <h1 className="text-4xl font-normal">Email Verification</h1>
              <p className="mt-2 text-white/70 text-sm">
                Confirming your email address
              </p>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">

              {/* ── LOADING ── */}
              {state === "loading" && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Verifying your email...
                  </h2>
                  <p className="text-sm text-gray-500">
                    Please wait while we confirm your address.
                  </p>
                </div>
              )}

              {/* ── SUCCESS ── */}
              {state === "success" && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle className="w-9 h-9 text-green-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Email verified!
                  </h2>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Your email address has been successfully verified. You can
                    now sign in to your account.
                  </p>
                  <Button
                    onClick={() => router.push("/auth/login")}
                    className="mt-2 w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    Sign In
                  </Button>
                </div>
              )}

              {/* ── ERROR ── */}
              {state === "error" && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                    <XCircle className="w-9 h-9 text-red-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Verification failed
                  </h2>
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2 w-full text-left">
                    {errorMsg}
                  </p>
                  <Button
                    onClick={() => router.push("/auth/login")}
                    variant="outline"
                    className="mt-2 w-full h-12 rounded-xl border-gray-200 text-gray-700 font-semibold"
                  >
                    Back to Sign In
                  </Button>
                </div>
              )}

              {/* ── NO TOKEN ── */}
              {state === "no-token" && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    No verification token
                  </h2>
                  <p className="text-sm text-gray-500 max-w-xs">
                    This link is missing a verification token. Please use the
                    link sent to your email inbox.
                  </p>
                  <Button
                    onClick={() => router.push("/auth/login")}
                    variant="outline"
                    className="mt-2 w-full h-12 rounded-xl border-gray-200 text-gray-700 font-semibold"
                  >
                    Back to Sign In
                  </Button>
                </div>
              )}

            </div>

            {/* FOOTER */}
            <div className="mt-8 text-center text-xs text-white/60">
              <div className="flex justify-center gap-5">
                <span className="hover:text-white cursor-pointer">Terms of Service</span>
                <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer">Support</span>
              </div>
              <p className="mt-3">© 2026 Altimeda Cipta Visitama</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPageInner />
    </Suspense>
  );
}
