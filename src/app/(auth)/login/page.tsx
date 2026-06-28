"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogin } from "./hooks/useLogin";

// useLogin uses useSearchParams — requires Suspense boundary in App Router
function LoginContent() {
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    setShowPassword,
    handleFieldChange,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
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
              Welcome Back to Your Growth Journey
            </h2>
            <p className="text-base text-white/80 m-0 mb-8 leading-relaxed">
              Track your progress, celebrate achievements, and grow with your team every single day.
            </p>
            <ul className="list-none p-0 m-0">
              {[
                "Progress-driven attendance tracking",
                "AI-powered wellness insights",
                "Friendly, human-centered experience",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                  <span className="text-[#4ADE80] font-bold text-lg">&#10003;</span>
                  {item}
                </li>
              ))}
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
              Welcome Back
            </h1>
            <p className="text-body text-muted-foreground m-0 leading-relaxed">
              Let&apos;s continue your progress today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {errors.general && (
              <div className="bg-destructive-soft border border-destructive/20 rounded-[16px] p-4 mb-2">
                <span className="text-sm text-destructive font-medium">{errors.general}</span>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">Email</Label>
              <div className={cn(
                "relative flex items-center border-2 rounded-[16px] bg-surface transition-all",
                errors.email
                  ? "border-destructive"
                  : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
              )}>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email")(e.target.value)}
                  className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[16px] bg-transparent font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
              {errors.email && <span className="text-[13px] text-destructive font-medium">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">Password</Label>
              <div className={cn(
                "relative flex items-center border-2 rounded-[16px] bg-surface transition-all",
                errors.password
                  ? "border-destructive"
                  : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
              )}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleFieldChange("password")(e.target.value)}
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
              {errors.password && <span className="text-[13px] text-destructive font-medium">{errors.password}</span>}
            </div>

            <div className="flex justify-between items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-[18px] h-[18px] rounded border-border accent-primary cursor-pointer" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary no-underline font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-[52px] rounded-[16px] mt-4">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground m-0">
                New to Workforce?{" "}
                <Link href="/register" className="text-primary no-underline font-semibold ml-1 hover:underline">
                  Join Your Team
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <LoginContent />
    </Suspense>
  );
}
