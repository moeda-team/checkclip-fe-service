// components/layout/AppLayout.tsx
// Global app layout with sidebar and unified header with breadcrumbs

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  Settings,
  User,
  ChevronRight,
  LogOut,
  Menu,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Sidebar } from "./dasbhoard/Sidebar";
import {
  SidebarProvider,
  useSidebar
} from "./dasbhoard/ResponsiveSidebarProvider";
import { cn } from "@/lib/utils";
import { useAutoSignOut } from "@/hooks/useAutoSignOut";

// Map pathname segments to readable labels
const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Customers",
  leads: "Leads",
  deals: "Deals",
  campaigns: "Campaigns",
  "campaign-brief": "Campaign Briefs",
  "strategy-planner": "Strategy Planner",
  create: "Create New",
  "create-new": "Create New",
  "email-marketing": "Email Marketing",
  "marketing-analytics": "Analytics",
  "ai-assistant": "AI Assistant",
  "sales-reports": "Sales Reports",
  "financial-reports": "Financial Reports",
  settings: "Settings",
  security: "Security",
  database: "Database",
  calendar: "Calendar",
  brief: "Campaign Briefs",
  strategy: "Strategy Planner"
};

// Check if a segment is a dynamic ID (UUID or numeric string)
function isDynamicId(segment: string): boolean {
  // UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  // Numeric ID
  const numericRegex = /^\d+$/;
  // MongoDB ObjectId (24 hex chars)
  const objectIdRegex = /^[0-9a-f]{24}$/i;
  return (
    uuidRegex.test(segment) ||
    numericRegex.test(segment) ||
    objectIdRegex.test(segment)
  );
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  // Filter out ID segments - they don't appear in breadcrumb
  const meaningfulSegments = segments.filter((seg) => !isDynamicId(seg));
  // Get last 2 meaningful segments
  const relevant = meaningfulSegments.slice(-2);

  return relevant.map((seg, index) => {
    const label =
      segmentLabels[seg] ??
      seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    // Build href from the original segments up to this point
    const originalIndex = segments.findIndex((s) => s === seg);
    const href = "/" + segments.slice(0, originalIndex + 1).join("/");

    return { label, href };
  });
}

function AppHeader() {
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

          {/* Purple app icon */}
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm ml-2">
            {breadcrumbs.length === 0 ? (
              <span className="font-semibold text-gray-900">Home</span>
            ) : (
              breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  {i === breadcrumbs.length - 1 ? (
                    // Last item - not clickable
                    <span className="font-semibold text-gray-900">
                      {crumb.label}
                    </span>
                  ) : (
                    // Parent items - clickable
                    <Link
                      href={crumb.href}
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))
            )}
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
                  <p className="text-xs text-gray-500">
                    {session?.user?.email}
                  </p>
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
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2"
                >
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

function AppLayoutContent({ children }: { children: ReactNode }) {
  const { sidebarOpen, toggleSidebar, collapsed } = useSidebar();
  useAutoSignOut();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <Sidebar />
      </div>

      {/* Main Content — margin follows collapsed state on desktop */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          collapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <AppHeader />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
