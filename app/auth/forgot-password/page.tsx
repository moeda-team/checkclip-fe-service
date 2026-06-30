"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/app/auth/forgot-password/hooks/use-forgot-password";

// ─── Left panel — identical to login page ─────────────────────────────────────
const FEATURES = [
  "PPh 21 & BPJS compliance calculators",
  "Modern interactive kanban tasks",
  "Beautiful high-fidelity printable payslips",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#2DD4BF" fillOpacity="0.15" />
      <path
        d="M6 10.5l2.5 2.5 5-5"
        stroke="#2DD4BF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeftPanel() {
  return (
    <aside className="hidden lg:flex lg:w-[380px] xl:w-[420px] shrink-0 flex-col bg-[#0F2132] text-white p-10 justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#2DD4BF] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
            <path
              d="M9 12l2 2 4-4M7.5 4.5h9A2.5 2.5 0 0119 7v10a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 015 17V7A2.5 2.5 0 017.5 4.5z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold text-base leading-none tracking-wide">CheckClip</p>
          <p className="text-[10px] text-[#2DD4BF] tracking-widest uppercase mt-0.5">
            HR Intelligence
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#2DD4BF]/40 text-[#2DD4BF] text-xs font-medium tracking-wide uppercase">
          Indonesian HR Compliance
        </span>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold leading-snug">
            The Dynamic Space for People and Culture Teams.
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Empower your enterprise with seamless tax calculators, real-time-clock logs, local BPJS
            sync, and active KPI targets.
          </p>
        </div>
        <div className="border-t border-white/10" />
        <ul className="space-y-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-white/80">
              <CheckIcon />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-white/30">CheckClips Cloud HRIS &nbsp;·&nbsp; Bandung, ID</p>
    </aside>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function ForgotPasswordInner() {
  const router = useRouter();
  const { email, setEmail, isSubmitting, errorMsg, isSuccess, handleSubmit, reset } =
    useForgotPassword();

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      <main className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-[440px] space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#0F2132] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
                <path
                  d="M9 12l2 2 4-4M7.5 4.5h9A2.5 2.5 0 0119 7v10a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 015 17V7A2.5 2.5 0 017.5 4.5z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-[#0F2132]">CheckClip</span>
          </div>

          {/* ── SUCCESS STATE ── */}
          {isSuccess ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
                <p className="mt-1 text-sm text-gray-500">
                  We&apos;ve sent password reset instructions to your inbox.
                </p>
              </div>

              {/* Success alert */}
              <div className="flex gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-emerald-800">
                    Reset link sent successfully!
                  </p>
                  <p className="text-sm text-emerald-700">
                    A password reset link has been sent to{" "}
                    <span className="font-semibold">{email}</span>. Please check
                    your inbox and follow the instructions.
                  </p>
                </div>
              </div>

              {/* Hint */}
              <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-500">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={reset}
                  className="text-[#2DD4BF] font-semibold hover:underline"
                >
                  try a different email address
                </button>
                .
              </div>

              <Button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="w-full h-11 rounded-lg bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#0F2132] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Button>
            </div>
          ) : (
            /* ── FORM STATE ── */
            <div className="space-y-8">
              <div>
                <button
                  type="button"
                  onClick={() => router.push("/auth/login")}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Enter your corporate email and we&apos;ll send you a reset link.
                </p>
              </div>

              {/* Error */}
              {errorMsg && (
                <div
                  role="alert"
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
                >
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Corporate Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@mail.com"
                      className="pl-10 h-11 rounded-lg border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-lg bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#0F2132] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Sending…" : "Send Reset Link →"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordInner />
    </Suspense>
  );
}
