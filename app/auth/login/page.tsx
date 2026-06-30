"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/app/auth/login/hooks/use-login";

// ─── Feature list shown on the left panel ────────────────────────────────────
const FEATURES = [
  "PPh 21 & BPJS compliance calculators",
  "Modern interactive kanban tasks",
  "Beautiful high-fidelity printable payslips",
];

// ─── Check icon for feature list ─────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="w-5 h-5 shrink-0"
      aria-hidden="true"
    >
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

// ─── Inner component (needs useSearchParams → wrapped in Suspense) ────────────
function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/auth/redirect";

  const { email, setEmail, password, setPassword, isSubmitting, errorMsg, handleSubmit } =
    useLogin(callbackUrl);

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-[380px] xl:w-[420px] shrink-0 flex-col bg-[#0F2132] text-white p-10 justify-between">
        {/* Logo */}
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

        {/* Middle content */}
        <div className="space-y-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#2DD4BF]/40 text-[#2DD4BF] text-xs font-medium tracking-wide uppercase">
            Indonesian HR Compliance
          </span>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold leading-snug">
              The Dynamic Space for People and Culture Teams.
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Empower your enterprise with seamless tax calculators, real-time-clock logs, local
              BPJS sync, and active KPI targets.
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

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
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

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sign In to CheckClip</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Enter your corporate details below.
            </p>
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div
              role="alert"
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
            >
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => router.push("/auth/forgot-password")}
                  className="text-xs text-[#2DD4BF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 rounded-lg border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-lg bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#0F2132] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Signing in…" : "Sign In to Workspace →"}
            </Button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            New recruit without account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/register")}
              className="text-[#2DD4BF] font-semibold hover:underline"
            >
              Register employee record
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
