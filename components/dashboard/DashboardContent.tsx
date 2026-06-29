// components/dashboard/DashboardContent.tsx
// Client component demonstrating React Query data fetching with
// loading, error, and empty states using the new hook pattern.

"use client";

import { useGetCampaigns } from "@/hooks/use-campaigns";
import { Loader2, AlertCircle, FolderOpen } from "lucide-react";
import type { PaginationFilter } from "@/types/api";

const defaultFilter: PaginationFilter = { limit: 10, offset: 0 };

export function DashboardContent() {
  const { data, isLoading, isError, error, refetch } =
    useGetCampaigns(defaultFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-3 text-gray-600">Loading campaigns...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">
          Failed to load campaigns
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 10;
  const offset = data?.offset ?? 0;
  const current_page = offset + 1;
  const total_pages = Math.ceil(total / limit);

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">
          No campaigns yet
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Create your first campaign to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing {items.length} of {total ?? items.length} campaigns (Page{" "}
          {current_page}/{total_pages || 1})
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-lg shadow border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900">
                {campaign.name}
              </h4>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  campaign.status === "active"
                    ? "bg-green-100 text-green-700"
                    : campaign.status === "draft"
                      ? "bg-gray-100 text-gray-700"
                      : campaign.status === "paused"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                }`}
              >
                {campaign.status}
              </span>
            </div>
            <p className="text-xs text-gray-500">{campaign.objective}</p>
            <p className="text-sm font-medium text-gray-900 mt-2">
              Budget: ¥{campaign.budget.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
