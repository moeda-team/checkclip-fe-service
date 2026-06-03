"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  FileText,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BriefListSkeleton } from "@/components/ui/skeletons";
import type { CampaignBrief, CampaignBriefStatus } from "@/app/(app)/campaign-brief/types";

const statusConfig: Record<CampaignBriefStatus, { label: string; color: string }> = {
  pending:   { label: "Pending",   color: "text-yellow-500" },
  in_review: { label: "In Review", color: "text-orange-500" },
  approved:  { label: "Approved",  color: "text-green-600"  },
  rejected:  { label: "Rejected",  color: "text-red-500"    },
  draft:     { label: "Draft",     color: "text-gray-400"   },
};

interface BriefListProps {
  briefs: CampaignBrief[];
  total: number;
  loading: boolean;
  isError: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  searchInput: string;
  debouncedSearch: string;
  selectedBriefId: string | null;
  onSelectBrief: (id: string) => void;
  onSearchChange: (val: string) => void;
  onLoadMore: () => void;
  onRetry: () => void;
}

export function BriefList({
  briefs,
  total,
  loading,
  isError,
  isFetchingMore,
  hasMore,
  searchInput,
  debouncedSearch,
  selectedBriefId,
  onSelectBrief,
  onSearchChange,
  onLoadMore,
  onRetry,
}: BriefListProps) {
  const router = useRouter();

  // Sentinel element — ketika masuk viewport, trigger load more
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, onLoadMore]);

  return (
    <div className="w-56 shrink-0 border-r border-gray-200 flex flex-col bg-white">
      {/* Create button */}
      <div className="p-3 border-b border-gray-100">
        <Button
          onClick={() => router.push("/campaign-brief/create")}
          className="w-full h-9 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create New
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            placeholder="Type here"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 pl-8 text-xs border-gray-200"
          />
        </div>
      </div>

      {/* Count label */}
      {/* {!loading && !isError && briefs.length > 0 && (
        <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            {briefs.length} of {total}
          </span>
        </div>
      )} */}

      {/* Scrollable list — overflow-y-auto + custom thin scrollbar */}
      <div
        className={cn(
          "flex-1 overflow-y-auto",
          // Custom scrollbar (Webkit)
          "[&::-webkit-scrollbar]:w-1",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-gray-300",
          "hover:[&::-webkit-scrollbar-thumb]:bg-gray-400",
          // Firefox
          "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        )}
      >
        {loading ? (
          <BriefListSkeleton />
        ) : isError ? (
          <div className="p-4 text-xs text-red-500 text-center space-y-2">
            <p>Failed to load briefs</p>
            <button onClick={onRetry} className="text-purple-600 underline">
              Retry
            </button>
          </div>
        ) : briefs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                {debouncedSearch ? "No results found" : "No briefs yet"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {debouncedSearch
                  ? `No briefs match "${debouncedSearch}"`
                  : "Create your first campaign brief"}
              </p>
            </div>
            {!debouncedSearch && (
              <button
                onClick={() => router.push("/campaign-brief/create")}
                className="text-xs text-purple-600 font-medium hover:underline"
              >
                + Create New
              </button>
            )}
          </div>
        ) : (
          <>
            {briefs.map((brief) => {
              const isSelected = selectedBriefId === brief.id;
              const status = statusConfig[brief.status] ?? {
                label: brief.status,
                color: "text-gray-400",
              };
              return (
                <button
                  key={brief.id}
                  type="button"
                  onClick={() => onSelectBrief(brief.id)}
                  className={cn(
                    "w-full text-left px-3 py-3 border-b border-gray-100 flex items-start gap-2.5 transition-colors",
                    isSelected
                      ? "bg-purple-100 border-l-2 border-l-purple-600"
                      : "hover:bg-gray-50 border-l-2 border-l-transparent"
                  )}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-purple-600">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-xs font-semibold leading-snug line-clamp-2",
                        isSelected ? "text-purple-700" : "text-gray-900"
                      )}
                    >
                      {brief.title}
                    </p>
                    <p className={cn("text-xs mt-0.5 flex items-center gap-1", status.color)}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      {status.label}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-3.5 h-3.5 shrink-0 mt-1",
                      isSelected ? "text-purple-600" : "text-gray-400"
                    )}
                  />
                </button>
              );
            })}

            {/* Sentinel untuk IntersectionObserver */}
            <div ref={sentinelRef} className="h-1" />

            {/* Loading more indicator */}
            {isFetchingMore && (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && briefs.length > 0 && (
              <p className="text-center text-[10px] text-gray-300 py-3">
                All {total} briefs loaded
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
