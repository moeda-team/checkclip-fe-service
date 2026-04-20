"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { Computer, Eye, EyeOff, Server, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Lightning } from "@phosphor-icons/react";

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // so we can control it ourselves
      callbackUrl,
    });

    setIsSubmitting(false);

    // ❌ Login failed
    if (!result || result.error) {
      console.log(result);
      setErrorMsg(result?.error ?? "Incorrect email or password.");
      return;
    }

    // ✅ Login successful → redirect user to callbackUrl
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

  const handleNavigateToForgotPassword = () => router.push("/auth/forgot-password");

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/3 bg-linear-to-br from-purple-600 to-indigo-600 text-white p-12 flex-col justify-end">
        <div className="h-full flex flex-col justify-center gap-6">
          <h1 className="text-4xl font-semibold leading-tight">
            Your dedicated <br /> workspace awaits
          </h1>
          <p className="text-white/80 max-w-md text-base font-semibold">
            Access your organization`s CRM, campaigns, analytics, and AI-powered insights — all within a secure, isolated environment.
          </p>

          <div className="flex gap-4">
            <div className="rounded-full bg-black/10 border border-white/20 w-10 h-10 flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold">Isolated Data Environment</p>
              <p className="text-sm text-white/70">
                Your data is fully separated and encrypted
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="rounded-full bg-black/10 border border-white/20 w-10 h-10 flex items-center justify-center">
              <Server className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold">Real-time Intelligence</p>
              <p className="text-sm text-white/70">
                AI-powered CRM insights and campaign optimization
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="rounded-full bg-black/10 border border-white/20 w-10 h-10 flex items-center justify-center">
              <Lightning className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold">Dedicated Infrastructure</p>
              <p className="text-sm text-white/70">
                Enterprise-grade single-tenant architecture
              </p>
            </div>
          </div>

        </div>

        <p className="text-xs text-white/60">
          TLS 1.3 encrypted • SOC 2 compliant • AES-256 at rest
        </p>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] p-6">
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] p-6">
          {/* HEADER */}
          <div className="mb-6 text-left w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800">
              Sign in to your workspace
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sakura Technologies — Dedicated Environment
            </p>
          </div>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8 border border-gray-100">

            {errorMsg && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* EMAIL */}
              <div>
                <Label className="text-sm text-gray-600">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="mt-1 relative">
                  <Input
                    type="email"
                    placeholder="name@sakura-tech.co.jp"
                    className="pl-10 h-11 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ✉️
                  </span>
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex justify-between items-center text-sm">
                  <Label className="text-gray-600">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={handleNavigateToForgotPassword}
                    className="text-purple-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-11 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {/* LEFT ICON */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </span>

                  {/* TOGGLE */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={handleRememberChange}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <span className="text-gray-600">Keep me signed in</span>
                </div>
                <span className="text-gray-400 text-xs">SSO available</span>
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white font-medium hover:opacity-90 flex items-center justify-center gap-2"
              >
                → {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>

              {/* DIVIDER */}
              <div className="border-t border-gray-100" />

              {/* SECONDARY */}
              <Button
                type="button"
                variant="ghost"
                className="w-full h-11 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={() => {
                  setEmail("tanaka@sakura-tech.co.jp");
                  setPassword("sakura2026");
                }}
              >
                🔑 Use Saved Credentials
              </Button>

              <p className="text-center text-xs text-gray-400">
                Demo utility — auto-fills test account credentials
              </p>
            </form>

          </div>
          <div className="mt-6 text-center text-xs text-gray-400 space-y-1 w-full max-w-md">
            <div className="flex justify-center items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span>System operational</span>
              <span>•</span>
              <span>v3.2.1</span>
              <span>•</span>
              <span>AP-Northeast-1</span>
            </div>

            <div className="flex justify-center gap-4 text-base my-2">
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span className="hover:underline cursor-pointer">Support</span>
            </div>

            <p>© 2026 Sakura Technologies Inc. All rights reserved.</p>
          </div>
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
