"use client";

import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Bell, Settings, User, ChevronRight, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSidebar } from "./ResponsiveSidebarProvider";

// Map pathname segments to readable labels
const segmentLabels: Record<string, string> = {
  campaign: "Campaigns",
  brief: "Campaign Briefs",
  "create-new": "Create New",
  dashboard: "Dashboard",
  customers: "Customers",
  leads: "Leads",
  deals: "Deals",
  campaigns: "Campaigns",
  "email-marketing": "Email Marketing",
  "marketing-analytics": "Analytics",
  "ai-assistant": "AI Assistant",
  "sales-reports": "Sales Reports",
  "financial-reports": "Financial Reports",
  settings: "Settings",
  security: "Security",
  database: "Database",
  calendar: "Calendar",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const relevant = segments.slice(-2);
  return relevant.map(
    (seg) =>
      segmentLabels[seg] ??
      seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function CampaignHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { toggleSidebar } = useSidebar();

  const breadcrumbs = getBreadcrumbs(pathname);

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 md:px-6 h-14 flex items-center justify-between">

        {/* Left — hamburger (mobile) + icon + breadcrumb */}
        <div className="flex items-center gap-2">
          {/* Hamburger — only on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden -ml-1 shrink-0"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </Button>

          {/* Purple square icon */}
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                <span
                  className={
                    i === breadcrumbs.length - 1
                      ? "font-semibold text-gray-900"
                      : "text-gray-500 hidden sm:inline"
                  }
                >
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        </div>

        {/* Right — user, settings, bell */}
        <div className="flex items-center gap-1">
          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    session?.user?.profilePictureUrl ??
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name ?? "User")}&color=FFFFFF&background=09308D&size=400`
                  }
                  alt="Profile"
                  width={28}
                  height={28}
                  className="rounded-full w-7 h-7 object-cover"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white border border-gray-200 shadow-lg"
            >
              <DropdownMenuLabel className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    session?.user?.profilePictureUrl ??
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name ?? "User")}&color=FFFFFF&background=09308D&size=400`
                  }
                  alt="Profile"
                  width={28}
                  height={28}
                  className="rounded-full w-7 h-7 object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings icon */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>

          {/* Bell */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
}
