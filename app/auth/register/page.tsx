"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  Database,
  Zap,
  User,
  ChevronDown,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ReactCountryFlag from "react-country-flag";

const COUNTRY_CODES = [
  { lang: "ID", code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { lang: "US", code: "+1", flag: "🇺🇸", name: "United States" },
  { lang: "GB", code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { lang: "JP", code: "+81", flag: "🇯🇵", name: "Japan" },
  // { code: "+65", flag: "🇸🇬", name: "Singapore" },
  // { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  // { code: "+61", flag: "🇦🇺", name: "Australia" },
  // { code: "+82", flag: "🇰🇷", name: "South Korea" },
  // { code: "+86", flag: "🇨🇳", name: "China" },
  // { code: "+91", flag: "🇮🇳", name: "India" },
  // { code: "+49", flag: "🇩🇪", name: "Germany" },
  // { code: "+33", flag: "🇫🇷", name: "France" },
  // { code: "+971", flag: "🇦🇪", name: "UAE" },
  // { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  // { code: "+63", flag: "🇵🇭", name: "Philippines" },
  // { code: "+66", flag: "🇹🇭", name: "Thailand" },
  // { code: "+84", flag: "🇻🇳", name: "Vietnam" },
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
      c.code.includes(countrySearch),
  );

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

  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) setEmail(savedEmail);
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
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          data?.message ??
            data?.detail ??
            "Registrasi gagal. Silakan coba lagi.",
        );
        return;
      }

      router.push(
        `/auth/login?registered=1&callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2A0A52] overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* ── LEFT SIDE ── */}
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
              Access your organization&apos;s CRM, campaigns, analytics, and
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

        {/* ── RIGHT SIDE ── */}
        <div className="relative flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
          {/* Background card */}
          <div className="absolute inset-6 rounded-[40px] bg-linear-to-b from-[#4C1D95] to-[#6D28D9] shadow-2xl border border-white/10 opacity-15" />

          {/* Glow */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400/20 blur-3xl rounded-full" />

          {/* REGISTER CARD */}
          <div className="relative z-5 w-full max-w-md py-4">
            {/* Header */}
            <div className="mb-8 text-white">
              <h1 className="text-4xl font-normal">Sign Up</h1>
              <p className="mt-2 text-white/70 text-sm">
                Create your Atlas account now!
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
                {/* NAME */}
                <div className="space-y-1">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Input full name"
                      className="pl-10 h-12 rounded-xl border-gray-200"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

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
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* PHONE NUMBER */}
                <div className="space-y-1">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <div id="country-dropdown-wrapper" className="relative">
                    <div className="flex items-center h-12 rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-400">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCountryDropdown((prev) => !prev);
                          setCountrySearch("");
                        }}
                        className="flex items-center gap-1.5 pl-3 pr-2 h-full shrink-0 focus:outline-none"
                      >
                        <span className="text-base leading-none">
                          {" "}
                          <ReactCountryFlag
                            countryCode={selectedCountry.lang}
                            svg
                            style={{ width: "1.3em", height: "1.3em" }}
                          />
                        </span>
                        <ChevronDown size={13} className="text-gray-400" />
                      </button>

                      <span className="w-px h-5 bg-gray-200 shrink-0" />

                      <span className="pl-2.5 pr-1 text-sm text-gray-700 font-medium shrink-0 select-none">
                        {selectedCountry.code}
                      </span>

                      <input
                        id="phoneNumber"
                        type="tel"
                        placeholder="8123456789"
                        className="flex-1 h-full pl-1 pr-3 text-sm bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(e.target.value.replace(/\D/g, ""))
                        }
                        required
                      />
                    </div>

                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                        <div className="p-2 border-b border-gray-100">
                          <input
                            type="text"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 text-left transition-colors ${
                                    selectedCountry.code === country.code &&
                                    selectedCountry.name === country.name
                                      ? "bg-purple-50 text-purple-700 font-medium"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <span>
                                    {" "}
                                    <ReactCountryFlag
                                      countryCode={country.lang}
                                      svg
                                      style={{
                                        width: "1.3em",
                                        height: "1.3em",
                                      }}
                                    />
                                  </span>
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
                <div className="space-y-1">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 rounded-xl border-gray-200 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-1">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 rounded-xl border-gray-200 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* TERMS */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="termPolicy"
                    required
                    className="rounded border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label
                    htmlFor="termPolicy"
                    className="text-sm text-gray-600 cursor-pointer font-normal"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => router.push("/auth/terms")}
                      className="text-purple-600 font-semibold hover:underline"
                    >
                      Terms & Privacy
                    </button>
                  </Label>
                </div>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Proceed
                    </>
                  )}
                </Button>
              </form>

              {/* SIGN IN LINK */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/auth/login")}
                  className="text-purple-600 font-bold hover:underline"
                >
                  Sign In
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
