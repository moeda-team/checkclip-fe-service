"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Briefcase,
  Building2,
  Shield,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterEnums } from "@/app/auth/register/hooks/use-register-enums";
import { useRegister } from "@/app/auth/register/hooks/use-register";

// ─── Left panel features ──────────────────────────────────────────────────────
const FEATURES = [
  "PPh 21 & BPJS compliance calculators",
  "Modern interactive kanban tasks",
  "Beautiful high-fidelity printable payslips",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#2DD4BF" fillOpacity="0.15" />
      <path
        d="M6 10.5l2.5 2.5 5-5"
        stroke="#2DD4BF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Reusable select field ────────────────────────────────────────────────────
function SelectField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder = "Choose",
  required,
  disabled,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className="w-full pl-10 pr-8 h-11 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/40 focus:border-[#2DD4BF] transition-colors appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <option value="" disabled>
            {disabled ? "Loading…" : placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Left panel (shared visual, same as login page) ───────────────────────────
function LeftPanel() {
  return (
    <aside className="hidden lg:flex lg:w-[380px] xl:w-[420px] shrink-0 flex-col bg-[#0F2132] text-white p-10 justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#2DD4BF] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
            <path
              d="M9 12l2 2 4-4M7.5 4.5h9A2.5 2.5 0 0119 7v10a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 015 17V7A2.5 2.5 0 017.5 4.5z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold text-base leading-none tracking-wide">CheckClip</p>
          <p className="text-[10px] text-[#2DD4BF] tracking-widest uppercase mt-0.5">
            HR Intelligence
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#2DD4BF]/40 text-[#2DD4BF] text-xs font-medium tracking-wide uppercase">
          Indonesian HR Compliance
        </span>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold leading-snug">
            The Dynamic Space for People and Culture Teams.
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Empower your enterprise with seamless tax calculators, real-time-clock logs, local BPJS
            sync, and active KPI targets.
          </p>
        </div>
        <div className="border-t border-white/10" />
        <ul className="space-y-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-white/80">
              <CheckIcon />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-white/30">CheckClips Cloud HRIS &nbsp;·&nbsp; Bandung, ID</p>
    </aside>
  );
}

// ─── Main register form ───────────────────────────────────────────────────────
function RegisterPageInner() {
  const router = useRouter();

  // Enum options from backend
  const { departmentUnits, jobTitles, systemRoles, isLoading: enumsLoading } = useRegisterEnums();

  // Submit handler
  const { isSubmitting, errorMsg, successMsg, submit } = useRegister();

  // Form state
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [departmentUnit, setDepartmentUnit] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit({
      full_name: fullName,
      email,
      password,
      job_title: jobTitle,
      department_unit: departmentUnit,
      role,
      phone_number: phoneNumber || undefined,
      address: address || undefined,
    });
  };

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      <main className="flex-1 flex items-center justify-center bg-white px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[600px] space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#0F2132] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
                <path
                  d="M9 12l2 2 4-4M7.5 4.5h9A2.5 2.5 0 0119 7v10a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 015 17V7A2.5 2.5 0 017.5 4.5z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-[#0F2132]">CheckClip</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Employee Space</h1>
            <p className="mt-1 text-sm text-gray-500">
              Register your employment identity to gain access to portal dashboard.
            </p>
          </div>

          {successMsg && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 text-emerald-500" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" aria-disabled={!!successMsg}>
            {/* Row 1: Full Name + Job Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Legal Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Budi Santoso"
                    className="pl-10 h-11 rounded-lg border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <SelectField
                id="jobTitle"
                label="Job Title Designation"
                icon={Briefcase}
                value={jobTitle}
                onChange={setJobTitle}
                options={jobTitles}
                disabled={enumsLoading}
                required
              />
            </div>

            {/* Row 2: Department + System Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                id="departmentUnit"
                label="Department Unit"
                icon={Building2}
                value={departmentUnit}
                onChange={setDepartmentUnit}
                options={departmentUnits}
                disabled={enumsLoading}
                required
              />

              <SelectField
                id="role"
                label="System Auth Role"
                icon={Shield}
                value={role}
                onChange={setRole}
                options={systemRoles}
                disabled={enumsLoading}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone Contact
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+6281234567890"
                  className="pl-10 h-11 rounded-lg border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Residential Address
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <textarea
                  id="address"
                  placeholder="Jl. Andir No. 1, Bandung"
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/40 focus:border-[#2DD4BF] transition-colors resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Corporate Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@mail.com"
                  className="pl-10 h-11 rounded-lg border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  className="pl-10 pr-10 h-11 rounded-lg border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || enumsLoading || !!successMsg}
              className="w-full h-11 rounded-lg bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#0F2132] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Creating account…" : successMsg ? "Redirecting…" : "Create Employee Record →"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already registered?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="text-[#2DD4BF] font-semibold hover:underline"
            >
              Sign in instead
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  );
}
