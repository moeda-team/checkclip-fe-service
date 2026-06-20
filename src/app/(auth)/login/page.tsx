"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      router.push("/");
    } catch (error: unknown) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";
      const err = error as { response?: { status?: number } };
      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          errorMessage = "Invalid email or password";
        } else if (status === 404) {
          errorMessage = "User not found";
        } else if (status === 400) {
          errorMessage = "Invalid login provider";
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden md:flex w-[40%] min-h-screen bg-gradient-to-br from-[#1a2a4a] to-[#0f766e] flex-col p-12 relative">
        <div className="flex flex-col flex-1 justify-between">
          <div className="mb-[60px]">
            <div className="mb-6">
              <h1 className="text-[32px] font-bold text-white m-0 tracking-tight">CheckClip</h1>
              <p className="text-sm text-white/70 mt-1 font-medium">HR Intelligence</p>
            </div>
            <div className="inline-block bg-white/15 text-white px-4 py-2 rounded-[20px] text-xs font-semibold tracking-wide backdrop-blur-[10px]">
              INDONESIAN HR COMPLIANCE
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-[42px] font-bold text-white m-0 mb-6 leading-tight tracking-tight lg:text-[36px]">
              Welcome Back to Your HR Dashboard
            </h2>
            <p className="text-base text-white/80 m-0 mb-8 leading-relaxed">
              Access your employee portal, manage your profile, view payslips,
              and stay connected with your workplace community.
            </p>
            <ul className="list-none p-0 m-0">
              <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                <span className="text-[#10b981] font-bold text-lg">&#10003;</span>
                Secure employee authentication
              </li>
              <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                <span className="text-[#10b981] font-bold text-lg">&#10003;</span>
                Real-time attendance tracking
              </li>
              <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                <span className="text-[#10b981] font-bold text-lg">&#10003;</span>
                Comprehensive HR management
              </li>
            </ul>
          </div>

          <div className="mt-[60px]">
            <p className="text-[13px] text-white/50 m-0">CheckClips Cloud HRIS · Bandung, ID</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-[60%] min-h-screen bg-white flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-[500px]">
          <div className="mb-12">
            <h1 className="text-[42px] font-bold text-midnight m-0 mb-4 leading-tight tracking-tight md:text-[36px]">
              Sign In
            </h1>
            <p className="text-base text-muted-foreground m-0 leading-relaxed">
              Enter your credentials to access your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-2">
                <span className="text-sm text-red-600 font-medium">{errors.general}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-slate-700">Corporate Email</Label>
              <div className={cn(
                "relative flex items-center border-2 rounded-[14px] bg-white transition-all",
                errors.email ? "border-red-500" : "border-slate-200 focus-within:border-lavender focus-within:ring-4 focus-within:ring-lavender/10"
              )}>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                <input
                  type="email"
                  placeholder="Enter your corporate email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email")(e.target.value)}
                  className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[14px] bg-transparent font-sans text-[15px] text-midnight outline-none placeholder:text-slate-400"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
              {errors.email && <span className="text-[13px] text-red-500 font-medium">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-slate-700">Password</Label>
              <div className={cn(
                "relative flex items-center border-2 rounded-[14px] bg-white transition-all",
                errors.password ? "border-red-500" : "border-slate-200 focus-within:border-lavender focus-within:ring-4 focus-within:ring-lavender/10"
              )}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password")(e.target.value)}
                  className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[14px] bg-transparent font-sans text-[15px] text-midnight outline-none placeholder:text-slate-400"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bg-none border-none cursor-pointer p-1 flex items-center justify-center text-slate-400 hover:text-lavender transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="text-[13px] text-red-500 font-medium">{errors.password}</span>}
            </div>

            <div className="flex justify-between items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-[18px] h-[18px] rounded border-slate-300 accent-lavender cursor-pointer" />
                <span className="text-sm text-slate-500">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-lavender no-underline font-medium hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] rounded-[14px] bg-gradient-to-br from-lavender to-periwinkle text-white font-sans text-base font-semibold shadow-[0_4px_14px_rgba(141,158,255,0.3)] mt-4 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(141,158,255,0.4)] active:translate-y-0 disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign In →"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-500 m-0">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-lavender no-underline font-semibold ml-1 hover:underline">
                  Create Employee Space
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
