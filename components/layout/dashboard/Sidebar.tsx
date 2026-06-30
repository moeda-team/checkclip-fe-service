"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSidebar } from "./ResponsiveSidebarProvider";
import { navigationItems, nodeContainsActive, type NavNode } from "./navigation";

// ─── CheckClip logo icon ──────────────────────────────────────────────────────

function CheckClipIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 12l2 2 4-4M7.5 4.5h9A2.5 2.5 0 0119 7v10a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 015 17V7A2.5 2.5 0 017.5 4.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Sidebar component ────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { collapsed } = useSidebar();

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const walk = (nodes: NavNode[], parentKey: string) => {
      for (const node of nodes) {
        const key = `${parentKey}/${node.title}`;
        if (node.children?.length) {
          if (nodeContainsActive(node, pathname)) initial[key] = true;
          walk(node.children, key);
        }
      }
    };
    for (const section of navigationItems) walk(section.items, section.title);
    return initial;
  });

  const toggleExpand = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderNode = (node: NavNode, parentKey: string, depth: number) => {
    const key = `${parentKey}/${node.title}`;
    const hasChildren = !!node.children?.length;
    const isOpen = expanded[key] ?? false;
    const isActive = nodeContainsActive(node, pathname);
    const Icon = node.icon;

    return (
      <li key={key}>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => !collapsed && toggleExpand(key)}
            title={collapsed ? node.title : undefined}
            className={cn(
              "w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors",
              collapsed ? "justify-center" : "justify-between",
              isActive
                ? "text-white"
                : "text-[#8FA3B1] hover:text-white hover:bg-white/5",
            )}
          >
            <span className={cn("flex items-center gap-3")}>
              {Icon && (
                <Icon
                  className={cn(
                    "w-[18px] h-[18px] shrink-0",
                    isActive ? "text-[#2DD4BF]" : "text-[#8FA3B1]",
                  )}
                />
              )}
              {!collapsed && (
                <span className={isActive ? "font-medium text-white" : ""}>
                  {node.title}
                </span>
              )}
            </span>
            {!collapsed && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform duration-200",
                  isActive ? "text-[#2DD4BF]" : "text-[#8FA3B1]",
                  isOpen && "rotate-180",
                )}
              />
            )}
          </button>
        ) : (
          <Link
            href={node.href ?? "#"}
            title={collapsed ? node.title : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative",
              collapsed ? "justify-center" : "",
              isActive
                ? "bg-[#0D4A3A] text-white font-medium"
                : "text-[#8FA3B1] hover:text-white hover:bg-white/5",
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "w-[18px] h-[18px] shrink-0",
                  isActive ? "text-[#2DD4BF]" : "text-[#8FA3B1]",
                )}
              />
            )}
            {!collapsed && <span className="flex-1">{node.title}</span>}

            {/* Badge */}
            {!collapsed && node.badge != null && node.badge > 0 && (
              <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-[#0F2132] text-[10px] font-bold shrink-0">
                {node.badge}
              </span>
            )}
          </Link>
        )}

        {/* Children submenu */}
        {hasChildren && isOpen && !collapsed && (
          <ul className="mt-0.5 ml-[30px] pl-3 border-l border-white/10 space-y-0.5">
            {node.children!.map((child) => renderNode(child, key, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-[#0F2132] text-white transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-[220px]",
      )}
      data-sidebar="sidebar"
    >
      {/* ── Logo ── */}
      <div className="px-4 pt-6 pb-4 shrink-0">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-[#2DD4BF] flex items-center justify-center">
              <CheckClipIcon className="w-5 h-5 text-[#0F2132]" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2DD4BF] flex items-center justify-center shrink-0">
              <CheckClipIcon className="w-5 h-5 text-[#0F2132]" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none tracking-wide">CheckClip</h1>
              <p className="text-[10px] text-[#2DD4BF] tracking-widest uppercase mt-0.5">
                HR Intelligence
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden space-y-1">
        {navigationItems.map((section) => (
          <div key={section.title} className="mb-2">
            {/* Section label */}
            {!collapsed && (
              <p className="text-[10px] font-semibold text-[#4A6070] uppercase tracking-widest px-3 mb-1">
                {section.title}
              </p>
            )}
            {collapsed && <div className="border-t border-white/10 my-2" />}

            <ul className="space-y-0.5">
              {section.items.map((item) => renderNode(item, section.title, 0))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Submit Request button ── */}
      {!collapsed && (
        <div className="px-3 pb-4 shrink-0">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D4A3A] text-[#2DD4BF] text-sm font-medium hover:bg-[#0D4A3A]/80 transition-colors border border-[#2DD4BF]/20"
          >
            <Plus className="w-4 h-4" />
            Submit Request
          </button>
        </div>
      )}

      {/* ── User profile ── */}
      <div className="border-t border-white/10 px-3 py-3 shrink-0">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                session?.user?.profilePictureUrl ??
                `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name ?? "User")}&color=FFFFFF&background=09308D&size=400`
              }
              alt="Profile picture"
              width={36}
              height={36}
              className="rounded-full w-9 h-9 object-cover"
              title={collapsed ? (session?.user?.name ?? "User") : undefined}
            />
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F2132]" />
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {session?.user?.name ?? "User"}
                </p>
                <p className="text-xs text-[#8FA3B1] truncate capitalize">
                  {session?.user?.role?.replace(/_/g, " ") ?? ""}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#8FA3B1] shrink-0" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
