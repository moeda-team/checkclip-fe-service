"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
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
  User
} from "lucide-react";
import { useSession } from "next-auth/react";

const navigationItems = [
  {
    title: "OVERVIEW",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
      },
    ],
  },
  {
    title: "CRM",
    items: [
      {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
      },
      {
        title: "Leads",
        href: "/dashboard/leads",
        icon: Target,
      },
      {
        title: "Deals",
        href: "/dashboard/deals",
        icon: FileText,
      },
    ],
  },
  {
    title: "MARKETING",
    items: [
      {
        title: "Campaigns",
        href: "/dashboard/campaigns",
        icon: Megaphone,
      },
      {
        title: "Email Marketing",
        href: "/dashboard/email-marketing",
        icon: Mail,
      },
      {
        title: "Analytics",
        href: "/dashboard/marketing-analytics",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "AI / INTELLIGENCE",
    items: [
      {
        title: "AI Assistant",
        href: "/dashboard/ai-assistant",
        icon: Brain,
      },
    ],
  },
  {
    title: "REPORTS",
    items: [
      {
        title: "Sales Reports",
        href: "/dashboard/sales-reports",
        icon: BarChart3,
      },
      {
        title: "Financial Reports",
        href: "/dashboard/financial-reports",
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Security",
        href: "/dashboard/security",
        icon: Shield,
      },
      {
        title: "Database",
        href: "/dashboard/database",
        icon: Database,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session} = useSession()
  return (
    <div className="fixed lg:relative lg:translate-x-0 -translate-x-full transition-transform duration-300 ease-in-out z-50 w-64 top-0 left-0 bg-white border-r border-gray-200 text-gray-900 h-full flex flex-col" data-sidebar="sidebar">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">S</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Sakura Technologies</h1>
            <p className="text-xs text-gray-500">Enterprise</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
        {navigationItems.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={session?.user?.profilePictureUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name ?? "User")}&color=FFFFFF&background=09308D&size=400`}
              alt="Profile picture"
              width={32}
              height={32}
              className="rounded-full w-8 h-8 object-cover"
            />

          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{ session?.user?.name}</p>
            <p className="text-xs text-gray-500">{session?.user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
