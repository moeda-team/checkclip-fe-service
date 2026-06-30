// components/layout/DashboardHeader.tsx
"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Menu,
  Search,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "./ResponsiveSidebarProvider";

export function DashboardHeader() {
  const { data: session } = useSession();
  const { toggleSidebar } = useSidebar();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50 border-gray-200">
      <div className="mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex gap-2 items-end">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 hidden sm:block">Real-time business overview</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search — desktop only */}
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

            <Button variant="ghost" size="icon" className="hidden md:flex">
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      session?.user?.profilePictureUrl ??
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name ?? "User")}&color=FFFFFF&background=09308D&size=400`
                    }
                    alt="Profile picture"
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8 object-cover"
                  />
                  <ChevronDown className="w-4 h-4 hidden md:block text-gray-600" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 bg-white text-gray-900 border border-gray-200 shadow-lg">
                <DropdownMenuLabel className="flex flex-col gap-1 text-gray-900">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        session?.user?.profilePictureUrl ??
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name ?? "User")}&color=FFFFFF&background=09308D&size=400`
                      }
                      alt="Profile picture"
                      width={32}
                      height={32}
                      className="rounded-full w-8 h-8 object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{session?.user?.name}</p>
                      <p className="text-xs text-gray-500">{session?.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {session?.user?.role ?? "User"}
                    </span>
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
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Session active</span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
