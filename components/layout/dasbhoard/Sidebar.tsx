"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSidebar } from "./ResponsiveSidebarProvider";
import {
  navigationItems,
  nodeContainsActive,
  type NavNode
} from "./navigation";

// ─── Component ───────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { collapsed, toggleCollapsed } = useSidebar();

  // Track which placeholder items are expanded (keyed by a unique node path).
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const walk = (nodes: NavNode[], parentKey: string) => {
      for (const node of nodes) {
        const key = `${parentKey}/${node.title}`;
        if (node.children?.length) {
          // Auto-expand ancestors of the active route.
          if (nodeContainsActive(node, pathname)) {
            initial[key] = true;
          }
          walk(node.children, key);
        }
      }
    };
    for (const section of navigationItems) {
      walk(section.items, section.title);
    }
    return initial;
  });

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Recursively render a navigation node and its descendants.
  const renderNode = (node: NavNode, parentKey: string, depth: number) => {
    const key = `${parentKey}/${node.title}`;
    const hasChildren = !!node.children?.length;
    const isOpen = expanded[key] ?? false;
    const isActive = nodeContainsActive(node, pathname);
    const Icon = node.icon;

    return (
      <li key={key}>
        {hasChildren ? (
          // Placeholder parent — toggles its children, never navigates.
          <button
            type="button"
            onClick={() => !collapsed && toggleExpand(key)}
            title={collapsed ? node.title : undefined}
            className={cn(
              "w-full flex items-center px-2 py-2 rounded-lg transition-colors",
              depth === 0 ? "text-sm" : "text-xs",
              collapsed ? "justify-center" : "justify-between",
              isActive
                ? "bg-primary-50 text-primary-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <span className={cn("flex items-center", collapsed ? "" : "gap-3")}>
              {Icon && (
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive && "text-primary-600"
                  )}
                />
              )}
              {!collapsed && node.title}
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
          // Leaf item — navigates to its href.
          <Link
            href={node.href ?? "#"}
            title={collapsed ? node.title : undefined}
            className={cn(
              "flex items-center px-2 py-2 rounded-lg transition-colors",
              depth === 0 ? "text-sm" : "text-xs",
              collapsed ? "justify-center" : "gap-3",
              isActive
                ? "bg-primary-50 text-primary-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive && "text-primary-600"
                )}
              />
            )}
            {!collapsed && node.title}
          </Link>
        )}

        {/* Children submenu — only when expanded and not collapsed */}
        {hasChildren && isOpen && !collapsed && (
          <ul
            className={cn(
              "mt-0.5 space-y-0.5 border-l border-gray-100 pl-3",
              depth === 0 ? "ml-4" : "ml-3"
            )}
          >
            {node.children!.map((child) => renderNode(child, key, depth + 1))}
          </ul>
        )}
      </li>
    );
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
            <h1 className="text-sm font-bold text-gray-900 whitespace-nowrap">
              ATLAS
            </h1>
            <p className="text-xs text-gray-500 whitespace-nowrap">
              Enterprise
            </p>
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
              {section.items.map((item) => renderNode(item, section.title, 0))}
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
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
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
