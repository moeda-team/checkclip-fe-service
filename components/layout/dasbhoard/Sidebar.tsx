"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Target,
  Megaphone,
  Mail,
  TrendingUp,
  Brain,
  BarChart3,
  FileSpreadsheet,
  Settings,
  Shield,
  Database,
  ChevronRight,
  Handshake,
  Radio,
  Sparkles,
  ClipboardList
} from "lucide-react";
import { useSession } from "next-auth/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavChild = {
  title: string;
  href: string;
};

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  children?: NavChild[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

// ─── Navigation data ──────────────────────────────────────────────────────────

const navigationItems: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
      }
    ]
  },
  {
    title: "CRM",
    items: [
      {
        title: "Contacts",
        href: "/dashboard/customers",
        icon: Users
      },
      {
        title: "Deals",
        href: "/dashboard/leads",
        icon: Handshake
      },
      {
        title: "CRM",
        href: "/dashboard/deals",
        icon: Database
      }
    ]
  },
  {
    title: "Campaigns",
    items: [
      {
        title: "Campaign",
        href: "/campaigns",
        icon: Megaphone
      },
      {
        title: "Campaign Planner",
        href: "/campaign-planner",
        icon: ClipboardList
      },
      {
        title: "Campaign Briefs",
        href: "/campaign-brief",
        icon: FileText
      },
      {
        title: "Campaign Monitor",
        href: "/campaign-monitor",
        icon: Radio
      },
      {
        title: "Strategy Planner",
        href: "/strategy-planner",
        icon: Sparkles
      }
    ]
  }
];

// ─── Component ───────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Track which items are expanded (by href)
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    // Auto-expand the section that contains the current path
    const initial: Record<string, boolean> = {};
    for (const section of navigationItems) {
      for (const item of section.items) {
        if (item.children?.some((c) => pathname.startsWith(c.href))) {
          initial[item.href] = true;
        }
      }
    }
    return initial;
  });

  const toggleExpand = (href: string) => {
    setExpanded((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  return (
    <div
      className="fixed lg:translate-x-0 -translate-x-full transition-transform duration-300 ease-in-out z-50 w-64 top-0 left-0 bg-white border-r border-gray-200 text-gray-900 h-screen flex flex-col"
      data-sidebar="sidebar"
    >
      {/* Logo */}
      <div className="px-4 h-14 flex items-center border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
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
            <div>
              <h1 className="text-sm font-bold text-gray-900">ATLAS</h1>
              <p className="text-xs text-gray-500">Enterprise</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navigationItems.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isOpen = expanded[item.href] ?? false;
                const isActive =
                  pathname === item.href ||
                  item.children?.some((c) => pathname.startsWith(c.href));

                return (
                  <li key={item.href}>
                    {/* Parent row */}
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.href)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-primary-50 text-primary-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              isActive && "text-primary-600"
                            )}
                          />
                          {item.title}
                        </span>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            isActive ? "text-primary-600" : "text-gray-400",
                            isOpen && "rotate-90"
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-primary-50 text-primary-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              isActive && "text-primary-600"
                            )}
                          />
                          {item.title}
                        </span>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4",
                            isActive ? "text-primary-600" : "text-gray-400"
                          )}
                        />
                      </Link>
                    )}

                    {/* Children submenu */}
                    {hasChildren && isOpen && (
                      <ul className="mt-0.5 ml-7 space-y-0.5 border-l border-gray-100 pl-3">
                        {item.children!.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "block px-2 py-1.5 rounded-md text-xs transition-colors",
                                  isChildActive
                                    ? "text-primary-700 font-semibold bg-primary-50"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                )}
                              >
                                {child.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              session?.user?.profilePictureUrl ??
              `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name ?? "User")}&color=FFFFFF&background=09308D&size=400`
            }
            alt="Profile picture"
            width={32}
            height={32}
            className="rounded-full w-8 h-8 object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
