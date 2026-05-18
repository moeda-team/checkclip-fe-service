"use client";

import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/layout/dasbhoard/DashboardHeader";
import { GlobalBreadcrumb } from "@/components/layout/GlobalBreadcrumb";
import { Sidebar } from "@/components/layout/dasbhoard/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/dasbhoard/ResponsiveSidebarProvider";
import { useAutoSignOut } from "@/hooks/useAutoSignOut";

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useSidebar();
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
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed transition-transform duration-300 ease-in-out z-50`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <DashboardHeader />
        <GlobalBreadcrumb />
        <main className="flex-1">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
