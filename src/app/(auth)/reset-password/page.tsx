"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";
import { useResetPassword } from "./hooks/useResetPassword";

// ─── Shared left panel ────────────────────────────────────────────────────────

function LeftPanel({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="hidden md:flex w-[40%] min-h-screen bg-linear-to-br from-[#2D2478] to-[#6C63FF] flex-col p-12 relative">
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
            {heading}
          </h2>
          <p className="text-base text-white/80 m-0 leading-relaxed">{body}</p>
        </div>
        <div className="mt-[60px]">
          <p className="text-[13px] text-white/50 m-0">Workforce Platform · Built for People Teams</p>
        </div>
      </div>
    </div>
  );
}

// ─── Inner content (needs useSearchParams) ────────────────────────────────────

function ResetPasswordContent() {
  const {
    formData,
    errors,
    isLoading,
    isSuccess,
    isTokenValid,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleFieldChange,
    handleSubmit,
  } = useResetPassword();

  if (!isTokenValid) {
    return (
      <>
        <div className="min-h-screen flex">
          <LeftPanel
            heading="Invalid Reset Link"
            body="The password reset link you clicked is invalid or has expired. Please request a new one to continue."
          />
          <div className="w-full md:w-[60%] min-h-screen bg-surface flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-[500px]">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={40} />
                </div>
              </div>
              <h1 className="text-[36px] font-bold text-foreground m-0 mb-4 text-center leading-tight">
                Invalid Reset Link
              </h1>
              <p className="text-body text-muted-foreground m-0 leading-relaxed text-center mb-8">
                The password reset link is invalid or has expired.
              </p>
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
          <LeftPanel
            heading="Password Reset Successful"
            body="Your password has been reset successfully. You can now log in using your new password."
          />
          <div className="w-full md:w-[60%] min-h-screen bg-surface flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-[500px]">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={40} />
                </div>
              </div>
              <h1 className="text-[36px] font-bold text-foreground m-0 mb-4 text-center leading-tight">
                Password Reset Successful
              </h1>
              <p className="text-body text-muted-foreground m-0 leading-relaxed text-center mb-8">
                Your password has been reset. You can now log in using your new password.
              </p>
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
      <LeftPanel
        heading="Set New Password"
        body="Create a strong password to secure your account. Make sure it's at least 8 characters long."
      />
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
            {/* New Password */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">New Password</Label>
              <div className={cn(
                "relative flex items-center border-2 rounded-[16px] bg-surface transition-all",
                errors.new_password
                  ? "border-destructive"
                  : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
              )}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.new_password}
                  onChange={(e) => handleFieldChange("new_password")(e.target.value)}
                  className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[16px] bg-transparent font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bg-none border-none cursor-pointer p-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.new_password && <span className="text-[13px] text-destructive font-medium">{errors.new_password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">Confirm Password</Label>
              <div className={cn(
                "relative flex items-center border-2 rounded-[16px] bg-surface transition-all",
                errors.confirm_password
                  ? "border-destructive"
                  : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
              )}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirm_password}
                  onChange={(e) => handleFieldChange("confirm_password")(e.target.value)}
                  className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[16px] bg-transparent font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 bg-none border-none cursor-pointer p-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm_password && <span className="text-[13px] text-destructive font-medium">{errors.confirm_password}</span>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full py-[14px] text-[15px] font-semibold rounded-[16px] mt-2">
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

// ─── Page export ──────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
