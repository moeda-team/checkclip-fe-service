"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  Server,
  Zap,
  User,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const COUNTRY_CODES = [
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
];

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/auth/redirect";

  const filteredCountries = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#country-dropdown-wrapper")) {
        setShowCountryDropdown(false);
        setCountrySearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Restore remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            full_name: name,
            password,
            phone_number: `${selectedCountry.code}${phoneNumber}`,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          data?.message ?? data?.detail ?? "Registrasi gagal. Silakan coba lagi."
        );
        return;
      }

      // Registration success — redirect to login
      router.push(`/auth/login?registered=1&callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Isolated Data Environment",
      desc: "Your data is fully separated and encrypted",
    },
    {
      icon: Server,
      title: "Dedicated Infrastructure",
      desc: "Enterprise-grade single-tenant architecture",
    },
    {
      icon: Zap,
      title: "Real-time Intelligence",
      desc: "AI-powered CRM insights and campaign optimization",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT SIDE ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-12 flex-col justify-between">
        <div />

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Your dedicated
              <br />
              workspace awaits
            </h1>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Access your organization&apos;s CRM, campaigns, analytics, and
              AI-powered insights — all within a secure, isolated environment
              built for your team.
            </p>
          </div>

          <div className="space-y-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-white/60 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div />
      </div>

      {/* ── RIGHT SIDE ── */}
      <div className="flex-1 flex flex-col items-center justify-between bg-[#f3f0ff] px-6 py-10">
        <div />

        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
            <p className="text-sm text-gray-500">
              Create your Atlas account now
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 space-y-5">
            {errorMsg && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Input full name"
                    className="pl-9 h-10 rounded-lg border-gray-200 bg-white text-sm placeholder:text-gray-400 focus-visible:ring-primary-500"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Input email address"
                    className="pl-9 h-10 rounded-lg border-gray-200 bg-white text-sm placeholder:text-gray-400 focus-visible:ring-primary-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* PHONE NUMBER */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number
                </Label>
                <div
                  id="country-dropdown-wrapper"
                  className="relative"
                >
                  {/* Unified input box */}
                  <div className="flex items-center h-10 rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 overflow-visible">
                    {/* Country trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowCountryDropdown((prev) => !prev);
                        setCountrySearch("");
                      }}
                      className="flex items-center gap-1.5 pl-3 pr-2 h-full shrink-0 focus:outline-none"
                    >
                      <span className="text-base leading-none">{selectedCountry.flag}</span>
                      <ChevronDown size={13} className="text-gray-400" />
                    </button>

                    {/* Divider */}
                    <span className="w-px h-5 bg-gray-200 shrink-0" />

                    {/* Dial code */}
                    <span className="pl-2.5 pr-1 text-sm text-gray-700 font-medium shrink-0 select-none">
                      {selectedCountry.code}
                    </span>

                    {/* Number input */}
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="8123456789"
                      className="flex-1 h-full pl-1 pr-3 text-sm bg-transparent placeholder:text-gray-400 focus:outline-none"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/\D/g, ""))
                      }
                      required
                    />
                  </div>

                  {/* Dropdown */}
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                          autoFocus
                        />
                      </div>
                      <ul className="max-h-48 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <li key={country.code + country.name}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowCountryDropdown(false);
                                  setCountrySearch("");
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 text-left ${
                                  selectedCountry.code === country.code &&
                                  selectedCountry.name === country.name
                                    ? "bg-primary-50 text-primary-700 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                <span>{country.flag}</span>
                                <span className="flex-1">{country.name}</span>
                                <span className="text-gray-400 text-xs">
                                  {country.code}
                                </span>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-4 text-sm text-gray-400 text-center">
                            No country found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Input password"
                    className="pl-9 pr-10 h-10 rounded-lg border-gray-200 bg-white text-sm placeholder:text-gray-400 focus-visible:ring-primary-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pl-9 pr-10 h-10 rounded-lg border-gray-200 bg-white text-sm placeholder:text-gray-400 focus-visible:ring-primary-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* TERMS */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="termPolicy"
                  required
                  className="rounded data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                />
                <Label
                  htmlFor="termPolicy"
                  className="text-sm text-gray-600 cursor-pointer font-normal"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth/terms")}
                    className="font-semibold hover:underline"
                  >
                    Terms and policy
                  </button>
                </Label>
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Processing..." : "Proceed"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="text-primary-600 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 space-y-1">
          <div className="flex justify-center gap-4">
            <span className="hover:underline cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:underline cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:underline cursor-pointer">Support</span>
          </div>
          <p>© 2026 Altimeda Cipta Visitama</p>
        </div>
      </div>
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
