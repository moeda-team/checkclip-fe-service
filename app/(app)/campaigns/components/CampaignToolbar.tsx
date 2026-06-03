// app/(app)/campaigns/components/CampaignToolbar.tsx
// Tabs, controls and summary sub-bar for the campaigns page.

"use client";

import { Filter, ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BriefFilter } from "./campaign-types";

interface TabCount {
  label: string;
  filter: BriefFilter;
  count: number;
}

export function CampaignToolbar({
  tabCounts,
  activeTab,
  onTabChange,
  shownCount,
  totalCount
}: {
  tabCounts: TabCount[];
  activeTab: BriefFilter;
  onTabChange: (tab: BriefFilter) => void;
  shownCount: number;
  totalCount: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-gray-200">
          {tabCounts.map((t) => (
            <button
              key={t.filter}
              onClick={() => onTabChange(t.filter)}
              className={cn(
                "relative px-1 pb-2 text-xs font-medium transition-colors whitespace-nowrap -mb-px",
                activeTab === t.filter
                  ? "text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "ml-0.5 text-[10px]",
                  activeTab === t.filter ? "text-purple-600" : "text-gray-400"
                )}
              >
                ({t.count})
              </span>
              {activeTab === t.filter && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-3.5 h-3.5 mr-1" />
            Filter
          </Button>
          <Select defaultValue="newest">
            <SelectTrigger className="h-8 text-xs w-36 bg-white border-gray-200">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-gray-500" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="budget-high">Budget: High to Low</SelectItem>
              <SelectItem value="budget-low">Budget: Low to High</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Brief
          </Button>
        </div>
      </div>

      {/* Sub-bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">{shownCount}</span> of{" "}
          <span className="font-semibold text-gray-700">{totalCount}</span>{" "}
          briefs
        </p>
      </div>
    </div>
  );
}
