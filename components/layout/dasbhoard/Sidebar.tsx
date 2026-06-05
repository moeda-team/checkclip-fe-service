"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useSidebar } from "./ResponsiveSidebarProvider";

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
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "CRM",
    items: [
      {
        title: "Customer Data",
        href: "/crm/customer-data",
        icon: Users
      }
    ]
  },
  {
    title: "Campaigns",
    items: [
      {
        title: "Campaign",
        href: "/campaigns",
        icon: Megaphone,
      },
      {
        title: "Campaign Briefs",
        href: "/campaign-brief",
        icon: FileText,
      },
      {
        title: "Strategy Planner",
        href: "/strategy-planner",
        icon: Sparkles,
      },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { collapsed, toggleCollapsed } = useSidebar();

  // Track which items are expanded (by href)
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
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
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 text-gray-900 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
      data-sidebar="sidebar"
    >
      {/* ── Logo + Collapse button ── */}
      <div className="px-3 h-14 flex items-center justify-between border-b border-gray-200 shrink-0">
        {/* Logo — hidden when collapsed */}
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden transition-all duration-300",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}
        >
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
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
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-gray-900 whitespace-nowrap">ATLAS</h1>
            <p className="text-xs text-gray-500 whitespace-nowrap">Enterprise</p>
          </div>
        </div>

        {/* Collapsed: show logo icon only */}
        {collapsed && (
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
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
        )}

        {/* Collapse toggle button — desktop only */}
        {!collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto overflow-x-hidden space-y-4">
        {navigationItems.map((section) => (
          <div key={section.title}>
            {/* Section label — hidden when collapsed */}
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1 whitespace-nowrap">
                {section.title}
              </h3>
            )}
            {/* Divider when collapsed */}
            {collapsed && (
              <div className="border-t border-gray-100 mx-1 mb-2" />
            )}

            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isOpen = expanded[item.href] ?? false;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/") ||
                  item.children?.some((c) => pathname.startsWith(c.href));

                return (
                  <li key={item.href}>
                    {hasChildren ? (
                      // Parent with children — button
                      <button
                        type="button"
                        onClick={() => !collapsed && toggleExpand(item.href)}
                        title={collapsed ? item.title : undefined}
                        className={cn(
                          "w-full flex items-center px-2 py-2 rounded-lg text-sm transition-colors",
                          collapsed ? "justify-center" : "justify-between",
                          isActive
                            ? "bg-primary-50 text-primary-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <span className={cn("flex items-center", collapsed ? "" : "gap-3")}>
                          <item.icon
                            className={cn("w-4 h-4 shrink-0", isActive && "text-primary-600")}
                          />
                          {!collapsed && item.title}
                        </span>
                        {!collapsed && (
                          <ChevronRight
                            className={cn(
                              "w-4 h-4 transition-transform duration-200 shrink-0",
                              isActive ? "text-primary-600" : "text-gray-400",
                              isOpen && "rotate-90"
                            )}
                          />
                        )}
                      </button>
                    ) : (
                      // Leaf item — link
                      <Link
                        href={item.href}
                        title={collapsed ? item.title : undefined}
                        className={cn(
                          "flex items-center px-2 py-2 rounded-lg text-sm transition-colors",
                          collapsed ? "justify-center" : "gap-3",
                          isActive
                            ? "bg-primary-50 text-primary-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <item.icon
                          className={cn("w-4 h-4 shrink-0", isActive && "text-primary-600")}
                        />
                        {!collapsed && item.title}
                      </Link>
                    )}

                    {/* Children submenu — only when expanded and not collapsed */}
                    {hasChildren && isOpen && !collapsed && (
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

      {/* ── Expand button (collapsed state) — desktop only ── */}
      {collapsed && (
        <div className="hidden lg:flex justify-center px-2 py-2 border-t border-gray-100">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── User Profile ── */}
      <div
        className={cn(
          "border-t border-gray-200 shrink-0",
          collapsed ? "px-2 py-3" : "px-4 py-3"
        )}
      >
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              session?.user?.profilePictureUrl ??
              `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name ?? "User")}&color=FFFFFF&background=09308D&size=400`
            }
            alt="Profile picture"
            width={32}
            height={32}
            title={collapsed ? (session?.user?.name ?? "User") : undefined}
            className="rounded-full w-8 h-8 object-cover shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
