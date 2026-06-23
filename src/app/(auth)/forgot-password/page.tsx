"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GooeyToaster, gooeyToast } from "goey-toast";
import "goey-toast/styles.css";

interface ForgotPasswordFormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
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

    try {
      await apiClient.forgotPassword(formData.email);
      setIsSuccess(true);
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      const err = error as { response?: { status?: number } };
      if (err.response) {
        const status = err.response.status;
        if (status === 404) {
          gooeyToast.error("Email tidak terdaftar. Silakan periksa kembali email Anda.");
        } else if (status === 400) {
          gooeyToast.error("Format email tidak valid. Silakan periksa kembali.");
        } else {
          gooeyToast.error("Gagal mengirim link reset. Silakan coba lagi.");
        }
      } else {
        gooeyToast.error("Gagal mengirim link reset. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ForgotPasswordFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
                  Reset Your Password
                </h2>
                <p className="text-base text-white/80 m-0 mb-8 leading-relaxed">
                  We've sent a secure link to your email to help you reset your password and get back to your account.
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
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-green-600" size={40} />
                  </div>
                </div>
                <h1 className="text-[36px] font-bold text-foreground m-0 mb-4 leading-tight tracking-tight md:text-[32px] text-center">
                  Check Your Email
                </h1>
                <p className="text-body text-muted-foreground m-0 leading-relaxed text-center">
                  If an account exists with this email address, a password reset link has been sent to your email.
                </p>
              </div>

              <div className="bg-primary-soft border border-primary/20 rounded-[16px] p-6">
                <p className="text-sm text-foreground text-center leading-relaxed">
                  The link will expire in 60 minutes. If you don't receive the email, please check your spam folder or request a new reset link.
                </p>
              </div>

              <div className="mt-8 text-center">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                  Didn't receive the email? Resend
                </Link>
              </div>
            </div>
          </div>
        </div>
        <GooeyToaster position="top-right" />
      </>
    );
  }

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
                Forgot Your Password?
              </h2>
              <p className="text-base text-white/80 m-0 mb-8 leading-relaxed">
                No worries! Enter your email address and we'll send you a secure link to reset your password.
              </p>
              <ul className="list-none p-0 m-0">
                <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                  <span className="text-[#4ADE80] font-bold text-lg">&#10003;</span>
                  Secure password reset link
                </li>
                <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                  <span className="text-[#4ADE80] font-bold text-lg">&#10003;</span>
                  Link expires in 60 minutes
                </li>
                <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                  <span className="text-[#4ADE80] font-bold text-lg">&#10003;</span>
                  One-time use for security
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
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
              <h1 className="text-[36px] font-bold text-foreground m-0 mb-4 leading-tight tracking-tight md:text-[32px]">
                Reset Password
              </h1>
              <p className="text-body text-muted-foreground m-0 leading-relaxed">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">Email</Label>
                <div className={cn(
                  "relative flex items-center border-2 rounded-[16px] bg-surface transition-all",
                  errors.email ? "border-destructive" : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
                )}>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email")(e.target.value)}
                    className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[16px] bg-transparent font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                </div>
                {errors.email && <span className="text-[13px] text-destructive font-medium">{errors.email}</span>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-[14px] text-[15px] font-semibold rounded-[16px] mt-2"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <GooeyToaster position="top-right" />
    </>
  );
}
