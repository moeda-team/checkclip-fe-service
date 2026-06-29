"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  Database,
  Zap,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { getGoogleOAuthUrl, getYahooOAuthUrl } from "@/lib/oauth";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAgreementDialog, setShowAgreementDialog] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/auth/redirect";

  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const runWithAgreement = (action: () => void) => {
    if (agreedToTerms) {
      action();
      return;
    }
    pendingActionRef.current = action;
    setShowAgreementDialog(true);
  };

  const handleAgree = () => {
    setAgreedToTerms(true);
    setShowAgreementDialog(false);
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  };

  const handleCancelAgreement = () => {
    pendingActionRef.current = null;
    setShowAgreementDialog(false);
  };

  const loginWithCredentials = async () => {
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
      // NextAuth encodes the thrown Error message into result.error
      // Strip the "CredentialsSignin" fallback and show the actual BE message
      const raw = result?.error ?? "";
      const msg =
        raw === "CredentialsSignin" || raw === ""
          ? "Invalid email or password."
          : raw;
      setErrorMsg(msg);
      return;
    }

    router.push(result.url ?? callbackUrl);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    runWithAgreement(loginWithCredentials);
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

  return (
    <div className="min-h-screen bg-[#2A0A52] overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* LEFT SIDE */}
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
              Access your organization's CRM, campaigns, analytics, and
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

        {/* RIGHT SIDE */}
        <div className="relative flex items-center justify-center p-6 lg:p-12">
          {/* Background card */}
          <div className="absolute inset-6 rounded-[40px] bg-linear-to-b from-[#4C1D95] to-[#6D28D9] shadow-2xl border border-white/10 opacity-15" />

          {/* Glow */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400/20 blur-3xl rounded-full" />

          {/* LOGIN CARD */}
          <div className="relative z-5 w-full max-w-[510px]">
            {/* Header */}
            <div className="mb-8 text-white">
              <h1 className="text-4xl font-normal">
                Sign in to your workspace
              </h1>
              <p className="mt-2 text-white/70 text-sm">
                Altimeda Cipta Visitama
              </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              {errorMsg && (
                <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* EMAIL */}
                <div className="space-y-1">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="altimeda@example.com"
                      className="pl-10 h-12 rounded-xl border-gray-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
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
                      className="text-xs text-purple-600 hover:underline"
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
                      className="pl-10 pr-10 h-12 rounded-xl border-gray-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  {" "}
                  {/* REMEMBER */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={handleRememberChange}
                    />

                    <Label
                      htmlFor="remember"
                      className="text-sm text-gray-600 font-normal"
                    >
                      Keep me signed in
                    </Label>
                  </div>
                  {/* AGREEMENT */}
                  <div className="flex items-start gap-2 pt-1">
                    <Checkbox
                      id="agree"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) =>
                        setAgreedToTerms(checked === true)
                      }
                      className="mt-0.5"
                    />

                    <Label
                      htmlFor="agree"
                      className="text-sm text-gray-600 font-normal block"
                    >
                      <span>
                        I have read and agree to the{" "}
                        <span
                          role="link"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push("/privacy-policy");
                          }}
                          className="text-purple-600 font-semibold hover:underline cursor-pointer"
                        >
                          Privacy Policy and Terms of Service.
                        </span>
                      </span>
                    </Label>
                  </div>
                </div>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Signing in..."
                  ) : (
                    <>
                      <LogIn />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>

                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-400">
                    or continue with
                  </span>
                </div>
              </div>

              {/* GOOGLE */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 rounded-xl border-gray-200 text-sm font-medium text-gray-700 hover:text-white hover:bg-purple-500 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  onClick={() =>
                    runWithAgreement(() => {
                      window.location.href = getGoogleOAuthUrl(true);
                    })
                  }
                >
                  Sign In with Google
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    {" "}
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />{" "}
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />{" "}
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />{" "}
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />{" "}
                  </svg>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 rounded-xl border-gray-200 text-sm font-medium text-gray-700 hover:text-white hover:bg-purple-500 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  onClick={() =>
                    runWithAgreement(() => {
                      window.location.href = getYahooOAuthUrl();
                    })
                  }
                >
                  Sign In with Yahoo
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    {" "}
                    <path
                      fill="#6001D2"
                      d="M0 0h24v24H0z"
                      fillOpacity="0"
                    />{" "}
                    <path
                      fill="#6001D2"
                      d="M3 3l5.5 9.5L3 21h3l3.75-6.5L13.5 21h3l-5.5-8.5L16.5 3h-3L10 9 6.5 3H3zm13.5 0l-3 5.5 1.5 2.5L19.5 3h-3z"
                    />{" "}
                  </svg>
                </Button>
              </div>

              {/* REGISTER */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/auth/register")}
                  className="text-purple-600 font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>

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

      <AlertDialog
        open={showAgreementDialog}
        onOpenChange={setShowAgreementDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Privacy Policy and Terms of Service
            </AlertDialogTitle>
            <AlertDialogDescription>
              To continue, please confirm that you have read and agree to the
              Privacy Policy and Terms of Service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAgreement}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAgree}>Agree</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
