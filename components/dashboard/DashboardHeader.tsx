// components/dashboard/DashboardHeader.tsx
// Client component that displays user info from session + React Query.

"use client";

import { useSession } from "next-auth/react";
import { useGetCurrentUser } from "@/hooks/use-current-user";
import { useLogout } from "@/hooks/use-logout";
import { LogOut, Loader2 } from "lucide-react";

export function DashboardHeader() {
  const { data: session } = useSession();
  const { data: profile, isLoading } = useGetCurrentUser();
  const logout = useLogout();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back,{" "}
          {profile?.data?.full_name ?? session?.user?.name ?? "User"}
        </h1>
        <p className="text-sm text-gray-500">
          {isLoading
            ? "Loading profile..."
            : `Role: ${profile?.data?.role ?? session?.user?.role ?? "—"}`}
        </p>
      </div>
      <button
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        {logout.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        Sign Out
      </button>
    </div>
  );
}
