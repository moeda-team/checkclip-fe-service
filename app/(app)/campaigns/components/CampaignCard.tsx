// app/(app)/campaigns/components/CampaignCard.tsx
// Single approved-strategy-brief card shown in the campaigns grid.

import { Megaphone, Building2, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CampaignBrief } from "./campaign-types";
import {
  adsTypeLabels,
  getAdsTypeStyles,
  getStatusStyles,
  humanize,
  statusLabels
} from "./campaign-utils";

export function CampaignCard({ brief }: { brief: CampaignBrief }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <Megaphone className="w-5 h-5 text-gray-500" />
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[11px] font-normal px-2 py-0.5 rounded-md border-0 capitalize",
            getStatusStyles(brief.status)
          )}
        >
          {statusLabels[brief.status] ?? humanize(brief.status)}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug">
        {brief.title}
      </h3>

      {/* Type + objective badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-medium px-2 py-0.5 rounded-md border-0",
            getAdsTypeStyles(brief.type_ads)
          )}
        >
          {adsTypeLabels[brief.type_ads] ?? humanize(brief.type_ads)}
        </Badge>
        <Badge
          variant="outline"
          className="text-[10px] font-medium px-2 py-0.5 rounded-md border-0 bg-gray-100 text-gray-600"
        >
          {humanize(brief.objective_type)}
        </Badge>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <Target className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-400">Sub-type</span>
          <span className="font-medium ml-auto text-right">
            {humanize(brief.sub_type)}
          </span>
        </div>
        {brief.tenant && (
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-gray-400">Tenant</span>
            <span className="font-medium ml-auto text-right truncate">
              {brief.tenant.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
