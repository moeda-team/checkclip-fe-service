"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User, Briefcase, Building2, Layers, Phone, MapPin, Mail, Lock, Eye, EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegister } from "./hooks/useRegister";
import { useRegisterEnums } from "./hooks/useRegisterEnums";

// ─── Reusable icon input ──────────────────────────────────────────────────────

function IconInput({
  icon: Icon,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  showToggle,
  showPasswordVal,
  onTogglePassword,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showToggle?: boolean;
  showPasswordVal?: boolean;
  onTogglePassword?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      <div className={cn(
        "relative flex items-center border-2 rounded-[16px] bg-surface transition-all",
        error
          ? "border-destructive"
          : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
      )}>
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
        <input
          type={showToggle ? (showPasswordVal ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[16px] bg-transparent font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
          autoCapitalize="off"
          autoCorrect="off"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 bg-none border-none cursor-pointer p-1 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            {showPasswordVal ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span className="text-[13px] text-destructive font-medium">{error}</span>}
    </div>
  );
}

// ─── Enum select field ────────────────────────────────────────────────────────

function EnumSelect({
  icon: Icon,
  label,
  value,
  onValueChange,
  options,
  placeholder,
  error,
  loading,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  error?: string;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" size={20} />
        <Select value={value} onValueChange={onValueChange} disabled={loading}>
          <SelectTrigger className={cn(
            "w-full border-2 rounded-[16px] h-[52px] pl-[52px]",
            error ? "border-destructive" : "border-border",
            loading && "opacity-60 cursor-not-allowed"
          )}>
            <SelectValue placeholder={loading ? "Loading..." : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <span className="text-[13px] text-destructive font-medium">{error}</span>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    setShowPassword,
    handleFieldChange,
    handlePhoneChange,
    handleSubmit,
    setDefaultEnumValues,
  } = useRegister();

  const { enums, loading: enumsLoading, error: enumsError } = useRegisterEnums();

  // Pre-select first option of each enum once data is loaded
  useEffect(() => {
    if (!enumsLoading && enums.jobTitles.length && enums.departments.length && enums.roles.length) {
      setDefaultEnumValues({
        job_title: enums.jobTitles[0].value,
        department_unit: enums.departments[0].value,
        role: enums.roles[0].value,
      });
    }
  }, [enumsLoading]);

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
              Your Growth Journey Starts Here.
            </h2>
            <p className="text-base text-white/80 m-0 mb-8 leading-relaxed">
              Track progress, build streaks, earn achievements, and grow with AI-powered insights.
            </p>
            <ul className="list-none p-0 m-0">
              {[
                "Attendance streaks & wellness tracking",
                "AI-powered personal insights",
                "Friendly challenges & achievements",
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
        <div className="w-full max-w-[700px]">
          <div className="mb-12">
            <h1 className="text-[36px] font-bold text-foreground m-0 mb-4 leading-tight tracking-tight md:text-[32px]">
              Join Your Team
            </h1>
            <p className="text-body text-muted-foreground m-0 leading-relaxed">
              Start tracking your progress and growing with your team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* General error */}
            {errors.general && (
              <div className="bg-destructive-soft border border-destructive/20 rounded-[16px] p-4">
                <span className="text-sm text-destructive font-medium">{errors.general}</span>
              </div>
            )}

            {/* Enum fetch error */}
            {enumsError && (
              <div className="bg-warning-soft border border-warning/20 rounded-[16px] p-4">
                <span className="text-sm text-warning font-medium">{enumsError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IconInput
                icon={User}
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleFieldChange("full_name")}
                error={errors.full_name}
              />

              <EnumSelect
                icon={Briefcase}
                label="Job Title"
                value={formData.job_title}
                onValueChange={handleFieldChange("job_title")}
                options={enums.jobTitles}
                placeholder="Select job title"
                error={errors.job_title}
                loading={enumsLoading}
              />

              <EnumSelect
                icon={Building2}
                label="Department"
                value={formData.department_unit}
                onValueChange={handleFieldChange("department_unit")}
                options={enums.departments}
                placeholder="Select department"
                error={errors.department_unit}
                loading={enumsLoading}
              />

              <EnumSelect
                icon={Layers}
                label="Role"
                value={formData.role}
                onValueChange={handleFieldChange("role")}
                options={enums.roles}
                placeholder="Select role"
                error={errors.role}
                loading={enumsLoading}
              />

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">Phone Number</Label>
                <div className={cn(
                  "relative flex items-center border-2 rounded-[16px] bg-surface transition-all",
                  errors.phone_number
                    ? "border-destructive"
                    : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
                )}>
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                  <span className="flex items-center pl-[44px] pr-1 text-[15px] font-semibold text-foreground select-none border-r-2 border-border h-full py-[14px]">+62</span>
                  <input
                    type="tel"
                    placeholder="81234567890"
                    value={formData.phone_number}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full py-[14px] px-4 border-none rounded-r-[16px] bg-transparent font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                </div>
                {errors.phone_number && <span className="text-[13px] text-destructive font-medium">{errors.phone_number}</span>}
              </div>

              <div />
            </div>

            <div className="flex flex-col gap-6">
              {/* Address */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">Address</Label>
                <div className={cn(
                  "relative flex items-start border-2 rounded-[16px] bg-surface transition-all",
                  errors.address
                    ? "border-destructive"
                    : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
                )}>
                  <MapPin className="absolute left-4 top-[14px] text-muted-foreground pointer-events-none" size={20} />
                  <textarea
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => handleFieldChange("address")(e.target.value)}
                    className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[16px] bg-transparent font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground resize-y min-h-[80px] leading-relaxed"
                    rows={3}
                  />
                </div>
                {errors.address && <span className="text-[13px] text-destructive font-medium">{errors.address}</span>}
              </div>

              <IconInput
                icon={Mail}
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleFieldChange("email")}
                error={errors.email}
              />

              <IconInput
                icon={Lock}
                label="Password"
                type="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleFieldChange("password")}
                error={errors.password}
                showToggle
                showPasswordVal={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || enumsLoading}
              className="w-full h-[52px] rounded-[16px] mt-4"
            >
              {isLoading ? "Creating Account..." : "Join Workforce"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground m-0">
                Already part of the team?{" "}
                <Link href="/login" className="text-primary no-underline font-semibold ml-1 hover:underline">
                  Welcome back
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
