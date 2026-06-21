"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { DepartmentUnit, JobTitle, SystemRole } from "@/types/api";
import { Input } from "@/components/ui/input";
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
  User,
  Briefcase,
  Building2,
  Layers,
  Phone,
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
  job_title: string;
  department_unit: string;
  role: string;
  phone_number: string;
  address: string;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  password?: string;
  job_title?: string;
  department_unit?: string;
  role?: string;
  phone_number?: string;
  address?: string;
  general?: string;
}

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
        error ? "border-destructive" : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
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

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: "",
    email: "",
    password: "",
    job_title: JobTitle.SENIOR_SOFTWARE_ENGINEERING,
    department_unit: DepartmentUnit.ENGINEERING_DIVISION,
    role: SystemRole.EMPLOYEE,
    phone_number: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.full_name) {
      newErrors.full_name = "Full name is required";
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      await register(formData);
      router.push("/");
    } catch (error: unknown) {
      console.error("Register error:", error);
      let errorMessage = "Registration failed. Please try again.";
      const err = error as { response?: { status?: number } };
      if (err.response) {
        const status = err.response.status;
        if (status === 409) {
          errorMessage = "Email already registered";
        } else if (status === 422) {
          errorMessage = "Validation failed. Please check your input.";
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

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
              Track progress, build streaks, earn achievements, and grow with AI-powered insights that celebrate every milestone.
            </p>
            <ul className="list-none p-0 m-0">
              <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                <span className="text-[#4ADE80] font-bold text-lg">&#10003;</span>
                Attendance streaks &amp; wellness tracking
              </li>
              <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                <span className="text-[#4ADE80] font-bold text-lg">&#10003;</span>
                AI-powered personal insights
              </li>
              <li className="flex items-center gap-3 text-white/90 text-[15px] mb-4 leading-normal">
                <span className="text-[#4ADE80] font-bold text-lg">&#10003;</span>
                Friendly challenges &amp; achievements
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
            {errors.general && (
              <div className="bg-destructive-soft border border-destructive/20 rounded-[16px] p-4 mb-2">
                <span className="text-sm text-destructive font-medium">{errors.general}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IconInput
                icon={User}
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleInputChange("full_name")}
                error={errors.full_name}
              />

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">Job Title</Label>
                <Select
                  value={formData.job_title}
                  onValueChange={handleInputChange("job_title")}
                >
                  <SelectTrigger className="w-full border-2 border-border rounded-[16px] h-[52px] pl-[52px] relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                    <SelectValue placeholder="Select job title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={JobTitle.JUNIOR_PRODUCT_DESIGN}>Junior Product Design</SelectItem>
                    <SelectItem value={JobTitle.SENIOR_SOFTWARE_ENGINEERING}>Senior Software Engineering</SelectItem>
                    <SelectItem value={JobTitle.LEAD_UI_UX}>Lead UI/UX</SelectItem>
                  </SelectContent>
                </Select>
                {errors.job_title && <span className="text-[13px] text-destructive font-medium">{errors.job_title}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">Department</Label>
                <Select
                  value={formData.department_unit}
                  onValueChange={handleInputChange("department_unit")}
                >
                  <SelectTrigger className="w-full border-2 border-border rounded-[16px] h-[52px] pl-[52px] relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DepartmentUnit.DESIGN_DEPARTMENT}>Design Department</SelectItem>
                    <SelectItem value={DepartmentUnit.ENGINEERING_DIVISION}>Engineering Division</SelectItem>
                    <SelectItem value={DepartmentUnit.HUMAN_RESOURCE}>Human Resource</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department_unit && <span className="text-[13px] text-destructive font-medium">{errors.department_unit}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={handleInputChange("role")}
                >
                  <SelectTrigger className="w-full border-2 border-border rounded-[16px] h-[52px] pl-[52px] relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={20} />
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SystemRole.EMPLOYEE}>Employee</SelectItem>
                    <SelectItem value={SystemRole.SUPERVISOR}>Supervisor</SelectItem>
                    <SelectItem value={SystemRole.HUMAN_RESOURCE}>Human Resource</SelectItem>
                    <SelectItem value={SystemRole.PAYROLL}>Payroll</SelectItem>
                    <SelectItem value={SystemRole.FINANCE}>Finance</SelectItem>
                    <SelectItem value={SystemRole.MANAGER}>Manager</SelectItem>
                    <SelectItem value={SystemRole.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <span className="text-[13px] text-destructive font-medium">{errors.role}</span>}
              </div>

              <IconInput
                icon={Phone}
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleInputChange("phone_number")}
                error={errors.phone_number}
              />

              <div />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">Address</Label>
                <div className={cn(
                  "relative flex items-start border-2 rounded-[16px] bg-surface transition-all",
                  errors.address ? "border-destructive" : "border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
                )}>
                  <MapPin className="absolute left-4 top-[14px] text-muted-foreground pointer-events-none" size={20} />
                  <textarea
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address")(e.target.value)}
                    className="w-full py-[14px] px-4 pl-[52px] border-none rounded-[16px] bg-transparent font-sans text-[15px] text-foreground outline-none placeholder:text-muted-foreground resize-y min-h-[80px] leading-relaxed"
                    rows={3}
                    autoCapitalize="off"
                    autoCorrect="off"
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
                onChange={handleInputChange("email")}
                error={errors.email}
              />

              <IconInput
                icon={Lock}
                label="Password"
                type="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleInputChange("password")}
                error={errors.password}
                showToggle
                showPasswordVal={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] rounded-[16px] bg-gradient-to-br from-primary to-primary-light text-white font-sans text-base font-semibold shadow-[0_4px_14px_rgba(108,99,255,0.3)] mt-4 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(108,99,255,0.4)] active:translate-y-0 disabled:opacity-60"
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
