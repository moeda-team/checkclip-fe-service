"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GooeyToaster, gooeyToast } from "goey-toast";
import "goey-toast/styles.css";

interface ResetPasswordFormData {
  new_password: string;
  confirm_password: string;
}

interface FormErrors {
  new_password?: string;
  confirm_password?: string;
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      gooeyToast.error("Token reset tidak valid. Silakan minta link reset password baru.");
    }
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.new_password) {
      newErrors.new_password = "Password is required";
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please confirm your password";
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      gooeyToast.error("Token reset tidak valid. Silakan minta link reset password baru.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.resetPassword(token, formData.new_password, formData.confirm_password);
      setIsSuccess(true);
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const err = error as { response?: { status?: number } };
      if (err.response) {
        const status = err.response.status;
        if (status === 400) {
          gooeyToast.error("Token tidak valid atau sudah kadaluarsa. Silakan minta link reset password baru.");
        } else if (status === 404) {
          gooeyToast.error("Token tidak ditemukan. Silakan minta link reset password baru.");
        } else {
          gooeyToast.error("Gagal mereset password. Silakan coba lagi.");
        }
      } else {
        gooeyToast.error("Gagal mereset password. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ResetPasswordFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isTokenValid) {
    return (
      <>
        <div className="min-h-screen flex">
          {/* Left Panel */}
          <div className="hidden md:flex w-[40%] min-h-screen bg-gradient-to-br from-[#2D2478] to-[#6C63FF] flex-col p-12 relative">
            <div className="flex flex-col flex-1 justify-between">
              <div className="mb-[60px]">
                <div className="mb-6">
                  <h1 className="text-[32px] font-bold text-white m-0 tracking-tight">Workforce</h1>
                  <p className="text-sm text-white/70 mt-1 font-medium">People & Culture Platform</p>
                </div>
                <div className="inline-block bg-white/15 text-white px-4 py-2 rounded-[--radius-badge] text-xs font-semibold tracking-wide backdrop-blur-[10px]">
                  WORKFORCE MANAGEMENT
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-[42px] font-bold text-white m-0 mb-6 leading-tight tracking-tight lg:text-[36px]">
                  Invalid Reset Link
                </h2>
                <p className="text-base text-white/80 m-0 mb-8 leading-relaxed">
                  The password reset link you clicked is invalid or has expired. Please request a new one to continue.
                </p>
              </div>

              <div className="mt-[60px]">
                <p className="text-[13px] text-white/50 m-0">Workforce Platform · Built for People Teams</p>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-[60%] min-h-screen bg-surface flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-[500px]">
              <div className="mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-red-600" size={40} />
                  </div>
                </div>
                <h1 className="text-[36px] font-bold text-foreground m-0 mb-4 leading-tight tracking-tight md:text-[32px] text-center">
                  Invalid Reset Link
                </h1>
                <p className="text-body text-muted-foreground m-0 leading-relaxed text-center">
                  The password reset link is invalid or has expired. Please request a new password reset link.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link href="/forgot-password">
                  <Button className="w-full py-[14px] text-[15px] font-semibold rounded-[16px]">
                    Request New Reset Link
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full py-[14px] text-[15px] font-semibold rounded-[16px]">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <GooeyToaster position="top-right" />
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <div className="min-h-screen flex">
          {/* Left Panel */}
          <div className="hidden md:flex w-[40%] min-h-screen bg-gradient-to-br from-[#2D2478] to-[#6C63FF] flex-col p-12 relative">
            <div className="flex flex-col flex-1 justify-between">
              <div className="mb-[60px]">
                <div className="mb-6">
                  <h1 className="text-[32px] font-bold text-white m-0 tracking-tight">Workforce</h1>
                  <p className="text-sm text-white/70 mt-1 font-medium">People & Culture Platform</p>
                </div>
                <div className="inline-block bg-white/15 text-white px-4 py-2 rounded-[--radius-badge] text-xs font-semibold tracking-wide backdrop-blur-[10px]">
                  WORKFORCE MANAGEMENT
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-[42px] font-bold text-white m-0 mb-6 leading-tight tracking-tight lg:text-[36px]">
                  Password Reset Successful
                </h2>
                <p className="text-base text-white/80 m-0 mb-8 leading-relaxed">
                  Your password has been reset successfully. You can now log in using your new password.
                </p>
              </div>

              <div className="mt-[60px]">
                <p className="text-[13px] text-white/50 m-0">Workforce Platform · Built for People Teams</p>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-[60%] min-h-screen bg-surface flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-[500px]">
              <div className="mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-green-600" size={40} />
                  </div>
                </div>
                <h1 className="text-[36px] font-bold text-foreground m-0 mb-4 leading-tight tracking-tight md:text-[32px] text-center">
                  Password Reset Successful
                </h1>
                <p className="text-body text-muted-foreground m-0 leading-relaxed text-center">
                  Your password has been reset successfully. You can now log in using your new password.
                </p>
              </div>

              <Link href="/login">
                <Button className="w-full py-[14px] text-[15px] font-semibold rounded-[16px]">
                  Continue to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <GooeyToaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden md:flex w-[40%] min-h-screen bg-gradient-to-br from-[#2D2478] to-[#6C63FF] flex-col p-12 relative">
        <div className="flex flex-col flex-1 justify-between">
          <div className="mb-[60px]">
            <div className="mb-6">
              <h1 className="text-[32px] font-bold text-white m-0 tracking-tight">Workforce</h1>
              <p className="text-sm text-white/70 mt-1 font-medium">People & Culture Platform</p>
            </div>
            <div className="inline-block bg-white/15 text-white px-4 py-2 rounded-[--radius-badge] text-xs font-semibold tracking-wide backdrop-blur-[10px]">
              WORKFORCE MANAGEMENT
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-[42px] font-bold text-white m-0 mb-6 leading-tight tracking-tight lg:text-[36px]">
              Set New Password
            </h2>
            <p className="text-base text-white/80 m-0 mb-8 leading-relaxed">
              Create a strong password to secure your account. Make sure it's at least 8 characters long.
            </p>
            <ul className="list-none p-0 m-0">
              <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                <span className="text-[#4ADE80] font-bold text-lg">&#10003;</span>
                Minimum 8 characters
              </li>
              <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                <span className="text-[#4ADE80] font-bold text-lg">&#10003;</span>
                Match confirmation password
              </li>
              <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                <span className="text-[#4ADE80] font-bold text-lg">&#10003;</span>
                Secure and unique
              </li>
            </ul>
          </div>

          <div className="mt-[60px]">
            <p className="text-[13px] text-white/50 m-0">Workforce Platform · Built for People Teams</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-[60%] min-h-screen bg-surface flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-[500px]">
          <div className="mb-12">
            <h1 className="text-[36px] font-bold text-foreground m-0 mb-4 leading-tight tracking-tight md:text-[32px]">
              Set New Password
            </h1>
            <p className="text-body text-muted-foreground m-0 leading-relaxed">
              Enter your new password below to complete the reset process
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">New Password</Label>
              <div className={cn(
                "relative flex items-center border-2 rounded-[16px] bg-surface transition-all",
                errors.new_password ? "border-destructive" : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
              )}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.new_password}
                  onChange={(e) => handleInputChange("new_password")(e.target.value)}
                  className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[16px] bg-transparent font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bg-none border-none cursor-pointer p-1 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.new_password && <span className="text-[13px] text-destructive font-medium">{errors.new_password}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">Confirm Password</Label>
              <div className={cn(
                "relative flex items-center border-2 rounded-[16px] bg-surface transition-all",
                errors.confirm_password ? "border-destructive" : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
              )}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange("confirm_password")(e.target.value)}
                  className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[16px] bg-transparent font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 bg-none border-none cursor-pointer p-1 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm_password && <span className="text-[13px] text-destructive font-medium">{errors.confirm_password}</span>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-[14px] text-[15px] font-semibold rounded-[16px] mt-2"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      <GooeyToaster position="top-right" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
