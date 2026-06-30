// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/layout/dasbhoard/DashboardHeader";
import { DashboardFooter } from "@/components/layout/dasbhoard/DashboardFooter";
import { GlobalBreadcrumb } from "@/components/layout/GlobalBreadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />

      <GlobalBreadcrumb />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
      <DashboardFooter />
    </div>
  );
}
