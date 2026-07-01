// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import { GlobalBreadcrumb } from "@/components/layout/GlobalBreadcrumb";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "./DashboardFooter";

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
      <DashboardFooter. />
    </div>
  );
}
