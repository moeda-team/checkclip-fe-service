import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  BarChart2,
  CalendarClock,
  Calendar,
  Timer,
  ClipboardEdit,
  CheckSquare,
  FileBarChart2,
  Settings,
  Users,
  CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavNode = {
  title: string;
  href?: string;
  icon?: LucideIcon;
  badge?: number;
  children?: NavNode[];
};

export type NavSection = {
  title: string;
  items: NavNode[];
};

// ─── Navigation data ──────────────────────────────────────────────────────────

export const navigationItems: NavSection[] = [
  {
    title: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Attendance",
        href: "/attendance",
        icon: Clock,
      },
      {
        title: "Task",
        href: "/task",
        icon: CheckCircle2,
      },
      {
        title: "Attendance Summary",
        icon: BarChart2,
        children: [
          { title: "Monthly Summary", href: "/attendance-summary/monthly" },
          { title: "Weekly Summary", href: "/attendance-summary/weekly" },
        ],
      },
      {
        title: "Shift Management",
        href: "/shift-management",
        icon: CalendarClock,
      },
      {
        title: "Leave Management",
        href: "/leave-management",
        icon: Calendar,
      },
      {
        title: "Overtime Management",
        href: "/overtime-management",
        icon: Timer,
      },
      {
        title: "Attendance Correction",
        href: "/attendance-correction",
        icon: ClipboardEdit,
        badge: 2,
      },
      {
        title: "Approval",
        icon: CheckSquare,
        children: [
          { title: "Leave Approval", href: "/approval/leave" },
          { title: "Overtime Approval", href: "/approval/overtime" },
          { title: "Correction Approval", href: "/approval/correction" },
        ],
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        title: "Reports",
        href: "/reports",
        icon: FileBarChart2,
      },
      {
        title: "Settings",
        href: "/setting",
        icon: Settings,
      },
      {
        title: "User Management",
        href: "/user-management",
        icon: Users,
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function nodeContainsActive(node: NavNode, pathname: string): boolean {
  if (
    node.href &&
    (pathname === node.href || pathname.startsWith(node.href + "/"))
  ) {
    return true;
  }
  return node.children?.some((c) => nodeContainsActive(c, pathname)) ?? false;
}

function walkNodes(nodes: NavNode[], visit: (node: NavNode) => void): void {
  for (const node of nodes) {
    visit(node);
    if (node.children?.length) walkNodes(node.children, visit);
  }
}

export function findFirstChildHref(pathname: string): string | null {
  const prefix = pathname.endsWith("/") ? pathname : pathname + "/";
  let found: string | null = null;

  for (const section of navigationItems) {
    walkNodes(section.items, (node) => {
      if (found) return;
      if (!node.children?.length && node.href?.startsWith(prefix)) {
        found = node.href;
      }
    });
    if (found) break;
  }

  return found;
}
