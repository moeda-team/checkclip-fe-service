"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { Eye, EyeOff, Mail, Lock, Shield, Server, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getGoogleOAuthUrl,
  getYahooOAuthUrl,
  getGoogleAccountChooserUrl
} from "@/lib/oauth";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/auth/redirect";

  // Restore remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setErrorMsg("Email atau password salah. Silakan coba lagi.");
      return;
    }

    router.push(result.url ?? callbackUrl);
  };

  const handleRememberChange = (checked: CheckedState) => {
    const isChecked = checked === true;
    setRememberMe(isChecked);
    if (isChecked) {
      localStorage.setItem("remember_email", email);
    } else {
      localStorage.removeItem("remember_email");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleOAuthUrl(true);
  };

  const handleGoogleLoginDifferentAccount = () => {
    window.location.href = getGoogleAccountChooserUrl();
  };

  const handleYahooLogin = () => {
    window.location.href = getYahooOAuthUrl();
  };

  const features = [
    {
      icon: Shield,
      title: "Isolated Data Environment",
      desc: "Your data is fully separated and encrypted"
    },
    {
      icon: Server,
      title: "Dedicated Infrastructure",
      desc: "Enterprise-grade single-tenant architecture"
    },
    {
      icon: Zap,
      title: "Real-time Intelligence",
      desc: "AI-powered CRM insights and campaign optimization"
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT SIDE ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div />

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Your dedicated
              <br />
              workspace awaits
            </h1>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Access your organization&apos;s CRM, campaigns, analytics, and
              AI-powered insights — all within a secure, isolated environment
              built for your team.
            </p>
          </div>

          <div className="space-y-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-white/60 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div />
      </div>

      {/* ── RIGHT SIDE ── */}
      <div className="flex-1 flex flex-col items-center justify-between bg-[#f3f0ff] px-6 py-10">
        <div />

        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Sign in to your workspace
            </h2>
            <p className="text-sm text-gray-500">Altimeda Cipta Visitama</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 space-y-5">
            {errorMsg && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Input email address"
                    className="pl-9 h-10 rounded-lg border-gray-200 bg-white text-sm placeholder:text-gray-400 focus-visible:ring-primary-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => router.push("/auth/forgot-password")}
                    className="text-xs text-primary-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Input password"
                    className="pl-9 pr-10 h-10 rounded-lg border-gray-200 bg-white text-sm placeholder:text-gray-400 focus-visible:ring-primary-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={handleRememberChange}
                  className="rounded data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer font-normal"
                >
                  Keep me signed in
                </Label>
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm flex items-center justify-center gap-2"
              >
                <span>→</span>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="w-full border-t border-gray-100" />

            {/* Social buttons */}
            <div className="space-y-2.5">
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 rounded-lg border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign In with Google
              </Button>
              {/* <button
                type="button"
                onClick={handleGoogleLoginDifferentAccount}
                className="w-full text-xs text-gray-500 hover:text-primary-600 text-center"
              >
                Use a different Google account
              </button> */}

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 rounded-lg border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                onClick={handleYahooLogin}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#6001D2">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 3l5.5 9.5L3 21h3l3.75-6.5L13.5 21h3l-5.5-8.5L16.5 3h-3L10 9 6.5 3H3zm13.5 0l-3 5.5 1.5 2.5L19.5 3h-3z" />
                </svg>
                Sign In with Yahoo
              </Button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/register")}
                className="text-primary-600 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 space-y-1">
          <div className="flex justify-center gap-4">
            <span className="hover:underline cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:underline cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:underline cursor-pointer">Support</span>
          </div>
          <p>© 2026 Altimeda Cipta Visitama</p>
        </div>
      </div>
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
