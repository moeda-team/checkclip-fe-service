"use client";

import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/layout/dasbhoard/DashboardHeader";
import { DashboardFooter } from "@/components/layout/dasbhoard/DashboardFooter";
import { GlobalBreadcrumb } from "@/components/layout/GlobalBreadcrumb";
import { Sidebar } from "@/components/layout/dasbhoard/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/dasbhoard/ResponsiveSidebarProvider";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoSignOut } from "@/hooks/useAutoSignOut";

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  useAutoSignOut();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile Menu Toggle */}
      <Button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-md"
        variant="outline"
        size="icon"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed transition-transform duration-300 ease-in-out z-30`}>
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <DashboardHeader />

        <GlobalBreadcrumb />

        <main className="flex-1">
          <div className="">
            {children}
          </div>
        </main>
        {/* <DashboardFooter /> */}
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
