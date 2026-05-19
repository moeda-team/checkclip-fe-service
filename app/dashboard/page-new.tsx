// app/dashboard/page-new.tsx
// Example protected dashboard page demonstrating the full architecture:
// - Server Component as page shell (better SEO + faster FCP)
// - Client components only where interactivity is needed
// - React Query for data fetching
// - Loading/error states handled in client components

import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Marketing Technology",
  description: "Real-time business overview and analytics",
};

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader />
      <DashboardContent />
    </div>
  );
}
