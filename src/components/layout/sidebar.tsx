"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Clock,
  History,
  BarChart2,
  Calendar,
  Palmtree,
  TrendingUp,
  FilePen,
  CheckSquare,
  FileText,
  Settings,
  Users,
  ChevronDown,
  Plus,
  Circle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavChild {
  label: string;
  path: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: "dot" | number;
  children?: NavChild[];
}

// ─── Nav Config ──────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: <Clock size={18} />,
    path: "/attendance",
  },
  {
    id: "attendance-history",
    label: "Attendance History",
    icon: <History size={18} />,
    path: "/attendance/history",
  },
  {
    id: "attendance-summary",
    label: "Attendance Summary",
    icon: <BarChart2 size={18} />,
    path: "/attendance/summary",
    children: [
      { label: "Monthly Summary", path: "/attendance/summary/monthly" },
      { label: "Team Summary", path: "/attendance/summary/team" },
    ],
  },
  {
    id: "shift-management",
    label: "Shift Management",
    icon: <Calendar size={18} />,
    path: "/shift",
  },
  {
    id: "leave-management",
    label: "Leave Management",
    icon: <Palmtree size={18} />,
    path: "/leave",
  },
  {
    id: "overtime-management",
    label: "Overtime Management",
    icon: <TrendingUp size={18} />,
    path: "/overtime",
  },
  {
    id: "attendance-correction",
    label: "Attendance Correction",
    icon: <FilePen size={18} />,
    path: "/correction",
    badge: "dot",
  },
  {
    id: "approval",
    label: "Approval",
    icon: <CheckSquare size={18} />,
    path: "/approval",
    children: [
      { label: "Pending Approvals", path: "/approval/pending" },
      { label: "Approval History", path: "/approval/history" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FileText size={18} />,
    path: "/reports",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings size={18} />,
    path: "/settings",
  },
  {
    id: "user-management",
    label: "User Management",
    icon: <Users size={18} />,
    path: "/users",
  },
];

// ─── Subcomponents ───────────────────────────────────────────────────────────

function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-5 py-6">
      {/* Logo icon */}
      <div className="w-12 h-12 rounded-xl  flex items-center justify-center shrink-0">
        <img src="/logo.png" alt="Logo" height={100} width={100}/>

      </div>
      <div>
        <p className="text-white font-bold text-[15px] leading-tight tracking-tight">
          CheckClip
        </p>
        <p className="text-[#00CAA1] text-[10px] font-semibold tracking-widest uppercase">
          HR Intelligence
        </p>
      </div>
    </div>
  );
}

function NavItemRow({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive =
    item.path === pathname ||
    item.children?.some((c) => c.path === pathname) ||
    (item.path && item.path !== "/" && pathname.startsWith(item.path));

  const hasChildren = !!item.children?.length;

  const handleClick = () => {
    if (hasChildren) setOpen((v) => !v);
  };

  const rowContent = (
    <div
      className={cn(
        "group flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl cursor-pointer transition-all duration-150 select-none relative",
        isActive
          ? "bg-[#043E46] text-white"
          : "text-[#8892BE] hover:bg-[#033E46] hover:text-white"
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      <span
        className={cn(
          "shrink-0 transition-colors",
          isActive ? "text-[#08D1B1]" : "text-white group-hover:text-[#08D1B1]"
        )}
      >
        {item.icon}
      </span>

      {/* Label */}
      <span className="flex-1 text-[13px] font-medium leading-none">
        {item.label}
      </span>

      {/* Badge dot */}
      {item.badge === "dot" && !isActive && (
        <span className="w-2 h-2 rounded-full bg-warning shrink-0" />
      )}

      {/* Badge number */}
      {typeof item.badge === "number" && (
        <span className="text-[10px] font-bold bg-warning text-white rounded-full px-1.5 py-0.5 leading-none">
          {item.badge}
        </span>
      )}

      {/* Chevron for items with children */}
      {hasChildren && (
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 transition-transform duration-200",
            open ? "rotate-180" : ""
          )}
        />
      )}
    </div>
  );

  return (
    <div>
      {/* If no children, wrap in Link */}
      {!hasChildren && item.path ? (
        <Link href={item.path} className="block no-underline">
          {rowContent}
        </Link>
      ) : (
        rowContent
      )}

      {/* Dropdown children */}
      {hasChildren && open && (
        <div className="ml-10 mt-0.5 flex flex-col gap-0.5">
          {item.children!.map((child) => (
            <Link
              key={child.path}
              href={child.path}
              className={cn(
                "block text-[12px] py-2 px-3 rounded-lg transition-colors no-underline",
                pathname === child.path
                  ? "text-white font-semibold"
                  : "text-[#6B789E] hover:text-white"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SubmitRequestButton() {
  return (
    <div className="px-4 py-3">
      <button
        className={cn(
          "w-full flex items-center justify-center gap-2",
          "bg-[#252D52] hover:bg-[#2D3660] text-white",
          "rounded-xl py-3 px-4 text-[13px] font-semibold",
          "transition-colors duration-150 cursor-pointer",
          "border border-[#2D3660] hover:border-[#3D4870]"
        )}
      >
        <Plus size={16} />
        Submit Request
      </button>
    </div>
  );
}

function SidebarProfile() {
  return (
    <div className="flex items-center gap-3 px-4 py-4 mx-2 mb-2 rounded-xl hover:bg-[#252D52] transition-colors cursor-pointer">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#3D4870] overflow-hidden ring-2 ring-[#3D4870]">
          <div className="w-full h-full bg-linear-to-br from-[#6C63FF] to-[#9B8FFF] flex items-center justify-center text-white text-sm font-bold">
            B
          </div>
        </div>
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4ADE80] ring-2 ring-[#1E2343]" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-[13px] font-semibold leading-tight truncate">
          Budi
        </p>
        <p className="text-[#5A658A] text-[11px] leading-tight truncate mt-0.5">
          Senior Software Engineer
        </p>
        <p className="text-[#4ADE80] text-[10px] font-medium mt-0.5 flex items-center gap-1">
          <Circle size={6} fill="#4ADE80" strokeWidth={0} />
          Online
        </p>
      </div>

      {/* Chevron */}
      <ChevronDown size={14} className="text-[#5A658A] shrink-0" />
    </div>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-[220px] bg-[#001724] flex flex-col z-50 overflow-hidden">
      {/* Logo */}
      <SidebarLogo />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-1 flex flex-col gap-0.5 scrollbar-hide">
        {navItems.map((item) => (
          <NavItemRow key={item.id} item={item} />
        ))}
      </nav>

      {/* Submit Request */}
      <SubmitRequestButton />

      {/* Divider */}
      <div className="mx-4 border-t border-[#252D52]" />

      {/* Profile */}
      <SidebarProfile />
    </aside>
  );
}
