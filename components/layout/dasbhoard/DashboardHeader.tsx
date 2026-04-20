// components/layout/DashboardHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Bell,
  ChevronDown,
  Grid3x3,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Search,
  HelpCircle,
} from "lucide-react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const pathname = usePathname();
  const [openMobileNav, setOpenMobileNav] = useState(false);

  const isOverview = pathname === "/dashboard/student";
  const isClassrooms = pathname.startsWith("/dashboard/student/classrooms");

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b sticky top-0 z-50 border-gray-200">
        <div className="mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Dashboard Title */}
            <div className="flex items-center gap-3">
              {/* MOBILE MENU BUTTON */}
              <button
                className="lg:hidden p-2 rounded-md border border-gray-200"
                onClick={() => setOpenMobileNav(true)}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Dashboard Title */}
              <div className="flex gap-2 items-end" >
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Real-time business overview</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Middle - Search Bar */}
              <div className="hidden md:flex flex-1 min-w-[400px] mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search contacts, deals, campaigns..."
                    className="pl-10 pr-4 bg-gray-50 border-gray-200 focus:border-gray-300"
                  />
                </div>
              </div>
              {/* Help Icon */}
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </Button>

              {/* Bell with Notification */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">TY</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 hidden md:block text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-white text-gray-900 border border-gray-200 shadow-lg"
                >
                  <DropdownMenuLabel className="flex flex-col gap-1 text-gray-900">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">TY</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Tanaka Yuki</p>
                        <p className="text-xs text-gray-500">tanaka@sakura-tech.co.jp</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Administrator</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Sakura Technologies</span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-gray-200" />

                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50">
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-700" />
                      <span>Profile & Account</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50">
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-gray-700" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-gray-200" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-gray-200" />
                  
                  <div className="px-2 py-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Session active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Secure connection</span>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE SIDEBAR NAV ================= */}
      {openMobileNav && (
        <div className="fixed inset-0 z-[60] flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpenMobileNav(false)}
          />

          {/* Drawer */}
          <div className="w-72 bg-white h-full shadow-xl p-6 flex flex-col gap-6 animate-slide-in-right">
            {/* Close Button */}
            <button
              className="self-end mb-4"
              onClick={() => setOpenMobileNav(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* NAV ITEMS */}
            <nav className="flex flex-col gap-4 text-gray-700">
              <Link
                href="/dashboard/student"
                className={`text-sm ${
                  isOverview ? "text-blue-600 font-semibold" : ""
                }`}
                onClick={() => setOpenMobileNav(false)}
              >
                Overview
              </Link>

              <Link
                href="/dashboard/student/classrooms"
                className={`text-sm ${
                  isClassrooms ? "text-blue-600 font-semibold" : ""
                }`}
                onClick={() => setOpenMobileNav(false)}
              >
                Kelas
              </Link>

              <button className="text-sm text-left">File Storage</button>
              <button className="text-sm text-left">Message</button>

              <Link
                href="/dashboard/student/courses"
                className="text-sm"
                onClick={() => setOpenMobileNav(false)}
              >
                Courses
              </Link>

              {/* Logout */}
              <button
                onClick={() => {
                  setOpenMobileNav(false);
                  handleLogout();
                }}
                className="text-sm text-red-600 text-left mt-4"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* MOBILE SIDEBAR ANIMATION */}
      <style jsx>{`
        @keyframes slide-in-right {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
