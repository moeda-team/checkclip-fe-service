"use client";

import { useDashboard } from "./hooks/useDashboard";

export default function DashboardPage() {
  const { user, loading } = useDashboard();

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground">
        {user ? `Welcome, ${user.full_name}` : "Dashboard"}
      </h1>
      <p className="text-muted-foreground mt-2">Konten dashboard akan hadir segera.</p>
    </div>
  );
}
