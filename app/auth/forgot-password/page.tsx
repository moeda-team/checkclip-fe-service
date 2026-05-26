"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  CheckCircle,
  Shield,
  Database,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: call API /api/forgot-password here later
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
  };

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#2A0A52] overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* ── LEFT SIDE ── */}
        <div className="relative hidden lg:flex items-center justify-center px-16">
          {/* Glow */}
          <div className="absolute inset-0">
            <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-purple-500/40 blur-3xl rounded-full" />
            <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-fuchsia-500/30 blur-3xl rounded-full" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-md text-white">
            <h1 className="text-4xl font-semibold leading-tight">
              Your dedicated
              <br />
              workspace awaits
            </h1>

            <p className="mt-6 text-white/80 text-lg font-medium leading-8">
              Access your organization&apos;s CRM, campaigns, analytics, and
              AI-powered insights — all within a secure, isolated environment
              built for your team.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Isolated Data Environment
                  </h3>
                  <p className="text-white/70 text-sm mt-1">
                    Your data is fully separated and encrypted
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Dedicated Infrastructure
                  </h3>
                  <p className="text-white/70 text-sm mt-1">
                    Enterprise-grade single-tenant architecture
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Real-time Intelligence
                  </h3>
                  <p className="text-white/70 text-sm mt-1">
                    AI-powered CRM insights and campaign optimization
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

          {/* CARD */}
          <div className="relative z-5 w-full max-w-md">
            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="mb-8 text-white">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Go back
                  </Link>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight">
                    Forgot your password?
                  </h1>

                  <p className="mt-2 text-base text-white/80">
                    Enter your email to get OTP code.
                  </p>
                </div>

                {/* FORM CARD */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">


                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <Label
                        htmlFor="forgot-email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="altimeda@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 h-12 rounded-xl border-gray-200"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    >
                      Send Email
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="mb-8 text-white">
                  <h1 className="text-4xl font-normal">Check Your Email</h1>
                  <p className="mt-2 text-white/70 text-sm">
                    We&apos;ve sent reset instructions to your inbox
                  </p>
                </div>

                {/* SUCCESS CARD */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6 text-center">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">
                      We&apos;ve sent a password reset link to
                    </p>
                    <p className="text-gray-900 font-semibold">{email}</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-left">
                    <p className="text-sm text-gray-600">
                      Didn&apos;t receive the email? Check your spam folder or{" "}
                      <button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="text-purple-600 font-semibold hover:underline"
                      >
                        try another email address
                      </button>
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Button>
                </div>
              </>
            )}

            {/* FOOTER */}
            <div className="mt-8 text-center text-xs text-white/60">
              <div className="flex justify-center gap-5">
                <span className="hover:text-white cursor-pointer">
                  Terms of Service
                </span>
                <span className="hover:text-white cursor-pointer">
                  Privacy Policy
                </span>
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
