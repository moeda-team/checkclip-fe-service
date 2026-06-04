"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Loader2, Inbox } from "lucide-react";
import { useGetApprovedStrategyBriefs } from "@/app/(app)/campaign-brief/hooks/useCampaignBrief";
import { tabs } from "./components/campaign-data";
import type { BriefFilter } from "./components/campaign-types";
import { CampaignStatsHeader } from "./components/CampaignStatsHeader";
import { CampaignToolbar } from "./components/CampaignToolbar";
import { CampaignCard } from "./components/CampaignCard";

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<BriefFilter>("All");

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetApprovedStrategyBriefs();

  const briefs = useMemo(() => data?.data ?? [], [data]);

  const filtered =
    activeTab === "All" ? briefs : briefs.filter((b) => b.status === activeTab);

  const tabCounts = tabs.map((t) => ({
    ...t,
    count:
      t.filter === "All"
        ? briefs.length
        : briefs.filter((b) => b.status === t.filter).length
  }));

  return (
    <div className="px-6 py-6 space-y-6 min-h-full">
      <CampaignStatsHeader briefs={briefs} />

      <CampaignToolbar
        tabCounts={tabCounts}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        shownCount={filtered.length}
        totalCount={briefs.length}
      />

      {/* ── Content ── */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading briefs...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-gray-700">
            {error?.response?.data?.message?.toString() ??
              "Failed to load approved strategy briefs."}
          </p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-gray-500">
          <Inbox className="w-8 h-8 text-gray-300" />
          <p className="text-sm">No briefs found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((brief) => (
            <CampaignCard key={brief.id} brief={brief} />
          ))}
        </div>
      )}
    </div>
  );
}
